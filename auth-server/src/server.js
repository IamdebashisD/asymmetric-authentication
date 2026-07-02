import 'dotenv/config.js'
import { createServer } from 'node:http'
import { createExpressApplication } from './app.js'

const PORT = process.env.PORT || 8080

async function main() {
    try {
        const server = createServer(createExpressApplication())

        server.listen(PORT, () => {
            console.log(`Express server is running on post ${PORT}`)
        })
    } catch (error) {
        console.log(`Error starting http server`)
        throw error
        process.exit(1)
    }
}

main()

