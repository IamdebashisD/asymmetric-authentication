import "dotenv/config"
import mongoose from "mongoose"


export const connectDb = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGODB_URI, { tls: false })
        console.log(`MongoDB connected ${connection.connection.host}`)
    } catch (error) {
        console.log('MongoDB connection failed!', error)
        process.exit(1)
    }
}