import fs from 'fs/promises'
import { importSPKI, exportJWK } from 'jose'


export const getJWKS = async () => {
    const publicKeyPem = await fs.readFile('./keys/public.pem', 'utf8')

    const publicKey = await importSPKI(publicKeyPem, 'RS256')

    const jwk = await exportJWK(publicKey)

    return {
        keys: [
            {
                ...jwk,
                kid: 'key-1',
                alg: 'RS256',
                use: 'sig'
            }
        ]
    }
}