import mongoose from "mongoose";

const clientSchema = new mongoose.Schema(
    {
        clientId: {
            type: String,
            required: true,
            unique: true
        },
        clientSecret: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        redirectUris: [{
            type: String,
            required: true
        }],
        grantTypes: [{
            type: String,
            enum: [
                'authorization_code',
                'refresh_token'
            ],
            default: ['authorization_code']
        }],
        responseTypes: [{
            type: String,
            enum: ['code'],
            default: ['code']
        }],
        scopes: [{
            type: String,
            enum: ['openid', 'profile', 'email']
        }]
    },
    { timestamps: true }
)

export default mongoose.model('Client', clientSchema)