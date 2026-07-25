import mongoose from 'mongoose'

const authorizationRequestSchema = new mongoose.Schema(
    {
        requestId: {
            type: String,
            required: true,
            unique: true
        },
        clientId: {
            type: String,
            required: true
        },
        redirectUri: {
            type: String,
            required: true
        },

        responseType: {
            type: String,
            required: true
        },

        state: {
            type: String
        },

        scope: [{
            type: String
        }],

        codeChallenge: {
            type: String
        },

        codeChallengeMethod: {
            type: String
        },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        expiresAt: {
            type: Date,
            required: true
        }
    },
    {
        timestamps: true
    }
)
authorizationRequestSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

export default mongoose.model('AuthorizationRequest', authorizationRequestSchema)