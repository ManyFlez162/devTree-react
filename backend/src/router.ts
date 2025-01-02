import { Router } from 'express'
import { body } from "express-validator"
import { createAccount, getUser, login, updateProfile } from './handlers'
import { handleInputErrors } from './middleware/validation'
import { authenticate } from './middleware/auth'

const router = Router()

/** Auth and register */
router.post('/auth/register',
    body('handle')
        .notEmpty()
        .withMessage("El handle no puede ir vacío"),
    body('name')
        .notEmpty()
        .withMessage("El nombre no puede ir vacío"),
    body('email')
        .isEmail()
        .withMessage("E-mail no válido"),
    body('password')
        .isLength({ min: 8 })
        .withMessage("El Password es muy corto, mínimo 8 caractéres"),
    handleInputErrors,
    createAccount
)

router.post('/auth/login',
    body('email')
        .isEmail()
        .withMessage("E-mail no válido"),
    body('password')
        .notEmpty()
        .withMessage("El Password es obligatorio"),
    handleInputErrors,
    login
)

router.get("/user", authenticate, getUser)
router.patch("/user",
    body('handle')
        .notEmpty()
        .withMessage("El handle no puede ir vacío"),
    authenticate,
    updateProfile)

export default router