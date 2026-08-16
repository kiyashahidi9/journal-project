import express from 'express'
import {
    createUser,
    findUserByUsername,
    verifyPassword,
    createToken
} from '../models/user'
import { ValidationError } from '../utils/errors'
import { 
    registerSchema, 
    loginSchema 
} from '../validation/userValidation'

const authRouter = express.Router()

// REGISTER

authRouter.post('/register', async (req, res) => {
    const parsedRegister = registerSchema.safeParse(req.body)

    if (!parsedRegister.success) {
        const message = parsedRegister.error.issues[0]?.message ?? 'Invalid Input'
        throw new ValidationError(message)
    }

    const { username, password } = parsedRegister.data
    const createdUser = await createUser(username, password)

    res.status(201).json({
        user: {
            id: createdUser.id,
            username: createdUser.username,
        }
    })
})

// LOGIN

authRouter.post('/login', async (req, res) => {
    const parsedLogin = loginSchema.safeParse(req.body)

    if (!parsedLogin.success) {
        const message = parsedLogin.error.issues[0]?.message ?? "Invalid Input"
        throw new ValidationError(message)
    }

    const { username, password } = parsedLogin.data
    const user = await findUserByUsername(username)
    const isValidPassword = await verifyPassword(password, user.passwordHash)

    if (!isValidPassword) {
        throw new ValidationError('Invalid username or password')
    }

    const token = createToken({
        id: user.id,
        username: user.username,
    })

    res.json({
        token,
        user: {
            id: user.id,
            username: user.username,
        },
    })
})

export default authRouter