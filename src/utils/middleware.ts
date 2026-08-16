import { AuthorizationError, NotFoundError, ValidationError } from './errors'
import logger from './logger'
import type { Request, Response, NextFunction } from 'express'

function unknownEndpoint(req: Request, res: Response) {
    res.status(404).send({ error: 'unknown endpoint'} )
}

function errorHandler(error: Error, req: Request, res: Response, next: NextFunction) {
    logger.error(error.message)

    if (error instanceof NotFoundError) {
        res.status(404).json({error: error.message})
        return
    } else if (error instanceof ValidationError) {
        res.status(400).json({error: error.message})
        return
    } else if (error instanceof AuthorizationError) {
        res.status(403).json({error: error.message})
        return
    }

    next(error)
}

export default {
    unknownEndpoint,
    errorHandler
}