import pool from '../db/pool'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import config from '../utils/config'

import { User, CreateUserInput } from '../types/types'
import { ValidationError, NotFoundError } from '../utils/errors'

const SALT_ROUNDS = 10

export async function hashPassword(
    password: string
): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS)
}

export async function verifyPassword(
    password: string,
    passwordHash: string
): Promise<boolean> {
    return bcrypt.compare(password, passwordHash)
}

export async function createUser(
    username: string,
    password: string
): Promise<User> {
    const userExistsQuery = `
        SELECT * FROM users
        WHERE username = $1
    `
    const userExists = await pool.query(
        userExistsQuery, 
        [username]
    )

    if (userExists.rows[0]) {
        throw new ValidationError('Username already exists')
    }

    const passwordHash = await hashPassword(password)
    const query = `
        INSERT INTO users (username, password_hash)
        VALUES ($1, $2)
        RETURNING *
    `
    const createdUser = await pool.query(
        query, 
        [username, passwordHash]
    )
    return createdUser.rows[0]
}

export async function findUserByUsername(
    username: string
): Promise<User> {
    const query = `
        SELECT
            id,
            username,
            password_hash AS "passwordHash",
            created_at AS "createdAt"
        FROM users
        WHERE username = $1
    `
    const user = await pool.query(
        query, 
        [username]
    )

    if (!user.rows[0]) {
        throw new ValidationError('Invalid username or password')
    }

    return user.rows[0]
}

export function createToken(
    user: Pick<User, 'id' | 'username'>
): string {
    const secret = config.JWT_SECRET

    if (!secret) {
        throw new Error('JWT_SECRET must be defined')
    }

    const payload = {
        id: user.id,
        username: user.username,
    }
    const expiresIn = config.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn']
    const signOptions = { expiresIn } as jwt.SignOptions

    return jwt.sign(payload, secret, signOptions)
}