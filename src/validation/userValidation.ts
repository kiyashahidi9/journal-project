import { z } from 'zod'

export const registerSchema = z.object({
    username: z.string().trim().min(3, 'username\'s gotta be at least 3 characters bro').max(30, 'woahhh, username too long bro'),
    password: z.string().min(6, 'password must be at least 6 characters long broski').max(100, 'woahhh, password too long bro')
})

export const loginSchema = z.object({
    username: z.string().trim().min(1, 'Username required'),
    password: z.string().trim().min(1, 'Password required')
})