import express, { urlencoded } from 'express'

export function createExpressApplication() {
    const app = express()

    app.use(express.json())
    // app.use(urlencoded({ extended: true }))

    app.get('/health', (req, res) => {
        return res.status(200).json({
            message: 'Health is OK!✅'
        })
    })

    return app
}