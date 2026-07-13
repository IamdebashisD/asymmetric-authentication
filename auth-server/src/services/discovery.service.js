export const getConfiguration = () => {
    const issuer = process.env.JWT_ISSUER

    return {
        issuer,
        authorization_endpoint: `${issuer}/authorize`,
        token_endpoint: `${issuer}/token`,
        userinfo_endpoint: `${issuer}/userinfo`,
        jwks_uri: `${issuer}/.well-known/jwks.json`,

        response_types_supported: [
            "code"
        ],

        grant_types_supported: [
            "authorization_code",
            "refresh_token"
        ],

        subject_types_supported: [
            "public"
        ],

        id_token_signing_alg_values_supported: [
            "RS256"
        ]
    }

}