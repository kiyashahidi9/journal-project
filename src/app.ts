import express from 'express'
import path from 'path'
import middleware from './utils/middleware'
import journalRouter from './routes/journalRouter'
import authRouter from './routes/authRouter'
import { requireAuth } from './utils/auth'

const app = express()

app.use(express.json())


app.use('/api/auth', authRouter)
app.use('/api/journals', requireAuth, journalRouter)

const frontendDistPath = path.join(process.cwd(), 'frontend-dist')

app.use(express.static(frontendDistPath))

app.get(/^\/(?!api)(?!.*\.[a-zA-Z0-9]+$).*/, (req, res, next) => {
    if (req.path.startsWith('/api')) {
        return next()
    }

    res.sendFile(path.join(frontendDistPath, 'index.html'))
})

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

export default app