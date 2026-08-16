import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import config from './config'
import { AuthorizationError } from './errors'

export interface AuthenticationRequest extends Request {
    user?: { id: number, username: string }
}

function getTokenFromHeader(req: Request): string | null {
    const authHeader = req.get('Authorization')
    if (!authHeader?.toLowerCase().startsWith('bearer ')) {
        return null
    }
    return authHeader.substring(7)
}

export function requireAuth(
    req: AuthenticationRequest,
    res: Response,
    next: NextFunction
): void {
    const token = getTokenFromHeader(req)
    if (!token) {
        throw new AuthorizationError('Authentication required')
    }

    if (!config.JWT_SECRET) {
        throw new Error('JWT_SECRET is not configured')
    }

    try {
        const decoded = jwt.verify(token, config.JWT_SECRET) as {
            id: number,
            username: string,
        }

        req.user = { id: decoded.id, username: decoded.username }
        next()
    } catch {
        throw new AuthorizationError('Invalid or expired token')
    }
}