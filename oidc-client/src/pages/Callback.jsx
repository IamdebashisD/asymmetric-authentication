import { useEffect, useState } from "react"
import { useSearchParams } from 'react-router-dom'

import { exchangeCodeForToken } from "../services/auth.service"

import axios from 'axios'

export default function Callback() {

    const [searchParams] = useSearchParams()


    useEffect(() => {
        async function exchangeToken() {
            const code = searchParams.get('code')
            const codeVerifier = sessionStorage.getItem('code_verifier')

            // console.log('code: ', code)
            // console.log('codeVerifier: ', codeVerifier)

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
                console.log('token: ', tokens)

                sessionStorage.setItem("access_token", tokens.data.accessToken)
                sessionStorage.setItem("refresh_token", tokens.data.refreshToken)
                sessionStorage.setItem( "id_token", tokens.data.idToken)

                sessionStorage.removeItem("code_verifier")

                window.location.href = '/dashboard'

            } catch (error) {
                console.log(error.response.data)
            }
        }

        exchangeToken()

    }, [])


    return (
        <div>
            <h1>Callback page welcome back</h1>
        </div>
    )
}