import mongoose from "mongoose";

const refreshTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true
    },  
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    scope: [{
        type: String,
    }],
    expiresAt: {
        type: Date,
        required: true,
        index: { expires: 0 },
    },
    familyId: {
        type: String,
        required: true,
        index: true
    },
    rotatedAt: {
        type: Date,
        default: null
    },
    replacedByToken: { 
        type: String, 
        default: null 
    },
    revokedAt: {
        type: Date,
        default: null
    },
}, { timestamps: true })

export default mongoose.model('RefreshToken', refreshTokenSchema)