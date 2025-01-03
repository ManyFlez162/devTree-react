import { Request, Response } from "express"
import { validationResult } from "express-validator"
import slug from "slug"
import formidable from "formidable"
import { v4 as uuid } from "uuid"
import cloudinary from "../config/cloudinary"
import User from "../models/User"
import { checkPassword, hashPassword } from "../utils/auth"
import { generateJWT } from "../utils/jwt"


export const createAccount = async (req: Request, res: Response): Promise<any> => {

    const { email, password } = req.body

    const userExists = await User.findOne({ email })
    if (userExists) {
        const error = new Error('Correo electrónico ya registrado')
        return res.status(409).json({ error: error.message })
    }

    const handle = slug(req.body.handle, "_")
    const handleExists = await User.findOne({ handle })
    if (handleExists) {
        const error = new Error('Nombre de usuario no disponible')
        return res.status(409).json({ error: error.message })
    }

    const user = new User(req.body)
    user.password = await hashPassword(password)
    user.handle = handle

    await user.save()
    res.status(201).send("Registro creado correctamente")
}

export const login = async (req: Request, res: Response): Promise<any> => {

    // Manejo de errores
    let errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { email, password } = req.body

    // Usuario registrado
    const user = await User.findOne({ email })

    if (!user) {
        const error = new Error('El usuario no existe')
        return res.status(404).json({ error: error.message })
    }

    // Comprobar contraseña
    const isPasswordCorrect = await checkPassword(password, user.password)

    if (!isPasswordCorrect) {
        const error = new Error('Contraseña incorrecta')
        return res.status(401).json({ error: error.message })
    }

    const token = generateJWT({ id: user._id })

    res.send(token)
}

export const getUser = async (req: Request, res: Response): Promise<any> => {
    res.json(req.user)
}

export const updateProfile = async (req: Request, res: Response): Promise<any> => {
    try {
        const { description, links } = req.body

        const handle = slug(req.body.handle, "_")
        const handleExists = await User.findOne({ handle })
        if (handleExists && handleExists.email !== req.user.email) { // la 2da condicion valida que no pueda cambiar la info de otra persona 
            const error = new Error('Nombre de usuario no disponible')
            return res.status(409).json({ error: error.message })
        }

        // Actualizar usuario
        req.user.description = description
        req.user.handle = handle
        req.user.links = links
        await req.user.save()
        res.send("Perfil actualizado correctamente")

    } catch (e) {
        const error = new Error("Hubo un error")
        return res.status(500).json({ error: error.message })
    }
}

export const uploadImage = async (req: Request, res: Response): Promise<any> => {
    const form = formidable({ multiples: false })

    try {
        form.parse(req, (error, fields, files) => {
            cloudinary.uploader.upload(files.file[0].filepath, { public_id: uuid()}, async function (error, result) {
                if (error) {
                    const error = new Error("Hubo un error al subir la imagen")
                    return res.status(500).json({ error: error.message })
                }

                if (result) {
                    req.user.image = result.secure_url
                    await req.user.save()
                    res.json({image: result.secure_url})
                }
            })
        })
    } catch (e) {
        const error = new Error("Hubo un error")
        return res.status(500).json({ error: error.message })
    }
}
