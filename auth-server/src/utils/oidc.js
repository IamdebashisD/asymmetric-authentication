import crypto from 'crypto'

export const generateAuthorizationCode = () => {
    return crypto.randomBytes(32).toString('hex')
}