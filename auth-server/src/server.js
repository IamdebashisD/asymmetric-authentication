import 'dotenv/config.js'
import { createServer } from 'node:http'
import { createExpressApplication } from './app.js'
import { connectDb } from './config/database.js'

const PORT = Number(process.env.PORT || 8080)

async function main() {
    try {
        const server = createServer(createExpressApplication())
        
        await connectDb()

        server.listen(PORT, () => {
            console.log(`Express server is running on port: ${PORT}`)
        })
    } catch (error) {
        console.error(`Error starting http server: ${error.message}`)
        throw error
        process.exit(1)
    }
}

main()

