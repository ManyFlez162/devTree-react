import { Router } from 'express'
import { body } from "express-validator"
import { createAccount, login } from './handlers'
import { handleInputErrors } from './middleware/validation'

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
        .isLength({min: 8})
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

export default router