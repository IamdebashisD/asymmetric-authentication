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
        grantTypes: {
            type: [{ 
                type: String,
                enum: [
                    'authorization_code',
                    'refresh_token'
                ],
            }],
            default: ['authorization_code']
        },
        
        responseTypes:{ 
            type: [{
                type: String,
                enum: ['code'],
            }], 
            default: ['code']
        },
        scopes: {
            type: [{
                type: String,
                enum: ['openid', 'profile', 'email']
            }],
            default: ['openid']
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    { timestamps: true }
)

export default mongoose.model('Client', clientSchema)