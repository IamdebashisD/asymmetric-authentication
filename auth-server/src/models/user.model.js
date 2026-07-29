import mongoose from "mongoose"


const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            minlength: 3,
            maxlength: 50,
            required: [true, "Name is required"],
        },
        email: {
            type: String,
            trim: true,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: 8,
            select: false
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user'
        }         
    }, 
    { timestamps: true }
)

export default mongoose.model('User', userSchema)