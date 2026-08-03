import { generatePKCE } from "../utils/pkce"
import "./Home.css"

export default function Home() {

    async function login() {
        const { codeVerifier, codeChallenge } = await generatePKCE()

        sessionStorage.setItem('code_verifier', codeVerifier)

        const params = new URLSearchParams({
            client_id: "f861a315-045b-47d4-8591-cf0c7e867b37",
            redirect_uri: "http://localhost:5174/callback",
            response_type: "code",
            scope: "openid profile email",
            state: crypto.randomUUID(),
            code_challenge: codeChallenge,
            code_challenge_method: "S256",
        })

        window.location.href = `http://localhost:8080/authorize?${params}`
    }

    return (
        <div className="home">
            <div className="card">    
                <h1>OIDC Client</h1>
                
                <p className="subtitle">Sign in to continue</p>
                
                <button 
                    onClick={login}
                    className="btn primary" 
                >
                    Login with My OIDC
                </button>
            </div>
        </div>
    )
}