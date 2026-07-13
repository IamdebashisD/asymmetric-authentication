import mongoose from "mongoose";


const authorizationCodeSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: true,
            unique: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        clientId: {
            type: String,
            required: true
        },
        redirectUri: {
            type: String,
            required: true
        },
        scope: [{
            type: String,
        }],
        codeChallenge: {
            type: String,
        },
        codeChallengeMethod: {
            type: String,
            enum: ['S256'],
            default: 'S256'
        },
        expiresAt: {
            type: Date,
            required: true,
            index: { expires: 0 }
        } 
    }, 
    { timestamps: true }
)

export default mongoose.model('AuthorizationCode', authorizationCodeSchema)