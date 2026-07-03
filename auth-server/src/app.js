import express, { urlencoded } from 'express'
import authRouter from './routes/auth.routes.js'
import { errorMiddleware } from './middleware/error.middleware.js'

export function createExpressApplication() {
    const app = express()

    app.use(express.json())
    app.use(urlencoded({ extended: true }))



    app.get('/health', (req, res) => {
        return res.status(200).json({
            message: 'Health is OK!✅'
        })
    })

    app.use('/api/auth', authRouter)
    
    app.use(errorMiddleware)

    return app
}