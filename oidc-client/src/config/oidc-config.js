export const oidcConfig = {
    issuer: import.meta.env.VITE_OIDC_ISSUER,
    clientId: import.meta.env.VITE_OIDC_CLIENT_ID,
    redirectUri: import.meta.env.VITE_OIDC_REDIRECT_URI,
    clientSecret: import.meta.env.VITE_OIDC_CLIENT_SECRET,
    scopes: import.meta.env.VITE_OIDC_SCOPE
}