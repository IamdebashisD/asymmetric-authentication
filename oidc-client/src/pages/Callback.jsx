import { useEffect, useState } from "react"
import { useSearchParams, useNavigate } from 'react-router-dom'

import { exchangeCodeForToken } from "../services/auth.service"


export default function Callback() {
    const navigate = useNavigate()

    const [searchParams] = useSearchParams()


    useEffect(() => {
        async function exchangeToken() {
            const code = searchParams.get('code')
            const codeVerifier = sessionStorage.getItem('code_verifier')


            const data = {
                code,
                grant_type: 'authorization_code',
                client_id: 'my-client',
                client_secret: 'super-secret',
                redirect_uri: 'http://localhost:5174/callback',
                code_verifier: codeVerifier
            }

            try {
                const tokens = await exchangeCodeForToken(data)
                
                sessionStorage.setItem("access_token", tokens.data.accessToken)
                sessionStorage.setItem("refresh_token", tokens.data.refreshToken)
                sessionStorage.setItem("id_token", tokens.data.idToken)

                sessionStorage.removeItem("code_verifier")


                navigate('/dashboard', { replace: true })

            } catch (error) {
                console.log(error.response.data)
                return
            }
        }

        exchangeToken()

    }, [navigate, searchParams])


    return (
        <div>
            <h1>Callback page welcome back</h1>
        </div>
    )
}