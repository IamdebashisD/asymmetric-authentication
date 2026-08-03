import { useEffect, useState } from "react"
import { useSearchParams, useNavigate, Link } from 'react-router-dom'

import { exchangeCodeForToken } from "../services/auth.service"


export default function Callback() {
    const navigate = useNavigate()

    const [searchParams] = useSearchParams()

    const [message, setMessage] = useState("Processing authorization...")
    const [hasError, setHasError] = useState(false)


    useEffect(() => {
        async function exchangeToken() {
            const error = searchParams.get('error')
            const errorDescription = searchParams.get('error_description') 

            // User denied consent or another OIDC error occurred
            if (error) {
                sessionStorage.removeItem('code_verifier')
                
                setHasError(true)

                if (error === "access_denied") {
                    setMessage("You denied access to this application.")
                } else {
                    setMessage(`Authorization failed: ${error}`)
                }

                if (errorDescription) {
                    console.error(errorDescription)
                }

                return
            }


            const code = searchParams.get('code')
            const codeVerifier = sessionStorage.getItem('code_verifier')


            const data = {
                code,
                grant_type: 'authorization_code',
                client_id: 'f861a315-045b-47d4-8591-cf0c7e867b37',
                client_secret: '9994ce86b3f52dff33ba724da6726a9efd3c01f4018ca19902a9e380ef0bb474',
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
        <div className="min-h-screen bg-slate-950 px-4 py-16 text-slate-100 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-md rounded-3xl border border-white/10 bg-slate-900/80 p-8 text-center shadow-2xl shadow-black/30 backdrop-blur-xl">
                <h1 className="text-2xl font-semibold text-white">OIDC Client</h1>
                <p className="mt-4 text-sm leading-6 text-slate-300">{message}</p>

                {hasError && (
                    <div className="mt-6">
                        <Link to="/" className="inline-flex w-full justify-center rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-500">
                            Try Again
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}