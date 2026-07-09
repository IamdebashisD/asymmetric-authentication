import { generateKeyPairSync } from 'crypto'
import fs from 'fs'

const { privateKey, publicKey } = generateKeyPairSync('rsa', {
    modulusLength: 2048,
    
    publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
    },

    privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem'
    },
})

fs.mkdirSync('keys', { recursive: true })

fs.writeFileSync('keys/private.pem', privateKey)
fs.writeFileSync('keys/public.pem', publicKey)

// console.log("RSA key pair generated successfully.");



























