import axios from 'axios'


const OIDC_SERVER = "http://localhost:8080"

export const exchangeCodeForToken = async (data) => {
    
    const resposne = await axios.post(
        `${OIDC_SERVER}/token`, 
        data,
        {
            headers: {
                'Content-Type': 'application/json'
            }
        }
    )

    return resposne.data
}