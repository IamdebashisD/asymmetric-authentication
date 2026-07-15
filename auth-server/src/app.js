import express, { urlencoded } from 'express'

import authRouter from './routes/auth.routes.js'
import jwksRouter from './routes/jwks.routes.js'
import discoveryRouter from './routes/discovery.routes.js'
import oidcRouter from './routes/oidc.routes.js'

import { errorMiddleware } from './middleware/error.middleware.js'

export function createExpressApplication() {
    const app = express()

    app.use(express.json())
    app.use(urlencoded({ extended: true }))


    app.get('', (req, res) => {
        return res.status(200).json({
            message: 'Hello World'
        })
    })

    app.get('/health', (req, res) => {
        return res.status(200).json({
            message: 'Health is OK!✅'
        })
    })

    app.use('/api/auth', authRouter)
    app.use(jwksRouter)
    app.use(discoveryRouter)
    app.use(oidcRouter)
    
    app.use(errorMiddleware)

    return app
}