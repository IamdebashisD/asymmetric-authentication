import express, { urlencoded } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import session from 'express-session'

import authRouter from './routes/auth.routes.js'
import jwksRouter from './routes/jwks.routes.js'
import discoveryRouter from './routes/discovery.routes.js'
import oidcRouter from './routes/oidc.routes.js'
import clientRouter from './routes/client.routes.js'
import consentRouter from './routes/consent.routes.js'

import { errorMiddleware } from './middleware/error.middleware.js'

export function createExpressApplication() {
    const app = express()

    app.use(
        cors({
            origin: [
                "http://localhost:5173", 
                "http://localhost:5174"
            ],
            credentials: true,
        })
    );
    
    app.use(express.json())
    app.use(urlencoded({ extended: true }))
    app.use(cookieParser())

    app.use(
        session({
            secret: process.env.SESSION_SECRET,
            resave: false,
            saveUninitialized: false,
            cookie: {
                httpOnly: true,
                secure: false,
                maxAge: 24 * 60 * 60 * 1000
            }
        })
    )

    app.use(morgan('dev'))
    app.use((req, res, next) => {
        console.log(req.body)
        next()
    })


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
    app.use('/clients', clientRouter)
    app.use(consentRouter)
    
    app.use(errorMiddleware)

    return app
}