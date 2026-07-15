# Asymmetric Authentication Server

## Overview

This repository contains an OAuth 2.0 / OpenID Connect authentication server built with Node.js, Express, MongoDB, and RSA asymmetric signing.

The `auth-server` service provides:
- User registration and login
- JWT access token generation using RS256
- Refresh token support
- OIDC discovery endpoint
- JWKS endpoint for public key discovery
- Authorization code grant with PKCE
- UserInfo endpoint

> Note: The root repository also contains an empty `api-server` folder. The active service is inside `auth-server`.

## Prerequisites

- Git
- Node.js 18 or later
- npm (bundled with Node.js)
- MongoDB running locally or accessible from your machine

## Clone the repository

```bash
git clone https://github.com/IamdebashisD/asymmetric-authentication.git
cd asymmetric-authentication
```

## Install dependencies

```bash
cd auth-server
npm install
```

## Environment variables

Create a file at `auth-server/.env` or verify the existing file contains the following values:

```env
PORT=8080
MONGODB_URI=mongodb://127.0.0.1:27017/asymmetric_auth
JWT_ACCESS_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN_DAYS=7
JWT_ISSUER=http://localhost:8080
JWT_AUDIENCE=asymmetric-auth-api
JWT_KEY_ID=key-1
```

### Important

- `MONGODB_URI` must be a valid MongoDB connection string for your environment.
- `JWT_ISSUER` is used for access token issuance and validation.
- `JWT_AUDIENCE` must match the audience expected by the server.
- The service uses RSA keys stored in `auth-server/keys/private.pem` and `auth-server/keys/public.pem` for RS256 signing.

## Start the server

```bash
npm start
```

For development with auto-reload:

```bash
npm run dev
```

The server will listen by default on `http://localhost:8080`.

## Verify the server is running

Open your browser or use `curl`:

```bash
curl http://localhost:8080/health
```

Expected response:

```json
{
  "success": true,
  "message": "Health is OK!✅",
  "data": null
}
```

## Required MongoDB setup

The application uses MongoDB collections for users, clients, authorization codes, and refresh tokens.

### Create a client manually

The server does not expose a client registration endpoint. Add a client directly into MongoDB before using the `/token` endpoint.

Example using `mongosh`:

```js
use asymmetric_auth

db.clients.insertOne({
  clientId: 'my-client',
  clientSecret: 'super-secret',
  name: 'Local Test Client',
  redirectUris: ['http://localhost:5173/callback'],
  grantTypes: ['authorization_code', 'refresh_token'],
  responseTypes: ['code'],
  scopes: ['openid', 'profile', 'email']
})
```

## API Endpoints

Base URL: `http://localhost:8080`

### Public endpoints

#### GET /

- Returns a basic hello message.

#### GET /health

- Returns basic health information.

#### GET /.well-known/openid-configuration

- Returns OpenID Connect metadata.
- Example response fields: `issuer`, `authorization_endpoint`, `token_endpoint`, `userinfo_endpoint`, `jwks_uri`.

#### GET /.well-known/jwks.json

- Returns the JSON Web Key Set (JWKS) containing the server's public key.

### Authentication endpoints

#### POST /api/auth/register

Register a new user.

Request headers:
- `Content-Type: application/json`

Request body:

```json
{
  "name": "Alice Example",
  "email": "alice@example.com",
  "password": "Password123!"
}
```

Successful response:

```json
{
  "success": true,
  "message": "Register successfully",
  "data": {
    "_id": "...",
    "name": "Alice Example",
    "email": "alice@example.com",
    "createdAt": "...",
    "updatedAt": "...",
    "__v": 0
  }
}
```

Validation rules:
- `name` must be at least 3 characters
- `email` must be a valid email
- `password` must be at least 8 characters

#### POST /api/auth/login

Login with email and password.

Request headers:
- `Content-Type: application/json`

Request body:

```json
{
  "email": "alice@example.com",
  "password": "Password123!"
}
```

Successful response:

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "...",
      "name": "Alice Example",
      "email": "alice@example.com",
      "createdAt": "...",
      "updatedAt": "...",
      "__v": 0
    },
    "accessToken": "...",
    "refreshToken": "..."
  }
}
```

#### GET /api/auth/profile

Retrieve the authenticated user's profile.

Request headers:
- `Authorization: Bearer <accessToken>`

Example:

```bash
curl -H "Authorization: Bearer <accessToken>" http://localhost:8080/api/auth/profile
```

Successful response:

```json
{
  "success": true,
  "message": "Profile fetched successfully",
  "data": {
    "_id": "...",
    "name": "Alice Example",
    "email": "alice@example.com",
    "createdAt": "...",
    "updatedAt": "...",
    "__v": 0
  }
}
```

#### POST /api/auth/refresh-token

Refresh the access token using a stored refresh token.

Request headers:
- `Content-Type: application/json`

Request body:

```json
{
  "refreshToken": "<refreshToken-from-login>"
}
```

Successful response:

```json
{
  "success": true,
  "message": "Access token refreshed successfully",
  "data": {
    "accessToken": "...",
    "newRefreshToken": "..."
  }
}
```

#### POST /api/auth/logout

Logout by invalidating a refresh token.

Request headers:
- `Content-Type: application/json`

Request body:

```json
{
  "refreshToken": "<refreshToken-from-login>"
}
```

Successful response:

```json
{
  "success": true,
  "message": "Logout successfully",
  "data": null
}
```

### OpenID Connect endpoints

#### GET /authorize

Start the authorization code flow. This endpoint requires a valid access token in the `Authorization` header.

Required query parameters:
- `response_type=code`
- `client_id=<clientId>`
- `redirect_uri=<registered redirect URI>`
- `scope=openid profile email` (must include `openid`)
- `state=<opaque-state-value>`
- `code_challenge=<codeChallenge>`
- `code_challenge_method=S256`

Example:

```bash
curl -i \
  -H "Authorization: Bearer <accessToken>" \

  "http://localhost:8080/authorize?response_type=code&client_id=my-client&redirect_uri=http://localhost:5173/callback&scope=openid%20profile%20email&state=xyz123&code_challenge=<codeChallenge>&code_challenge_method=S256"
```

This endpoint redirects to the registered `redirect_uri` with `code` and `state`.

Example redirect URL:

```
http://localhost:5173/callback?code=<authorization_code>&state=xyz123
```

##### Code challenge generation

The server stores a PKCE challenge in the authorization code record. Use a base64url-encoded SHA-256 hash of your code verifier as the `code_challenge`.

Example code verifier:

```text
my-super-secret-code-verifier-123456789
```

Example code challenge generation in Node.js:

```bash
node -e "const crypto = require('crypto'); const verifier = 'my-super-secret-code-verifier-123456789'; const challenge = crypto.createHash('sha256').update(verifier).digest().toString('base64').replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,''); console.log(challenge)"
```


#### POST /token

Exchange an authorization code or refresh token for new tokens.

Request headers:
- `Content-Type: application/json`

Supported grant types:
- `authorization_code`
- `refresh_token`

##### Authorization code grant

Request body:

```json
{
  "grant_type": "authorization_code",
  "code": "<authorization_code>",
  "client_id": "my-client",
  "client_secret": "super-secret",
  "redirect_uri": "http://localhost:5173/callback",
  "code_verifier": "my-super-secret-code-verifier-123456789"
}
```

Successful response:

```json
{
  "success": true,
  "message": "Tokens issued successfully",
  "data": {
    "accessToken": "...",
    "refreshToken": "...",
    "idToken": "..."
  }
}
```

##### Refresh token grant

Request body:

```json
{
  "grant_type": "refresh_token",
  "refresh_token": "<refreshToken>",
  "client_id": "my-client",
  "client_secret": "super-secret"
}
```

Successful response:

```json
{
  "success": true,
  "message": "Tokens issued successfully",
  "data": {
    "accessToken": "...",
    "refreshToken": "..."
  }
}
```

#### GET /userinfo

Return user claims for the authenticated user.

Request headers:
- `Authorization: Bearer <accessToken>`

Example:

```bash
curl -H "Authorization: Bearer <accessToken>" http://localhost:8080/userinfo
```

Successful response when requesting `openid profile email`:

```json
{
  "success": true,
  "message": "User found",
  "data": {
    "sub": "...",
    "name": "Alice Example",
    "email": "alice@example.com"
  }
}
```

When only `openid` scope is present, the response contains only `sub`.

## Common usage flow

1. Register a user at `/api/auth/register`.
2. Log in at `/api/auth/login` to get `accessToken` and `refreshToken`.
3. Call `/api/auth/profile` to verify the access token.
4. Use `/authorize` with your access token and PKCE parameters to obtain an authorization code.
5. Exchange the authorization code at `/token` to receive `accessToken`, `refreshToken`, and `idToken`.
6. Call `/userinfo` with the new access token.
7. Refresh tokens using `/api/auth/refresh-token` or `/token` with `grant_type=refresh_token`.
8. Invalidate the refresh token with `/api/auth/logout`.

## Error responses

When an error occurs, the server returns a JSON response with:

```json
{
  "success": false,
  "message": "..."
}
```

Validation failures return `400` with a `errors` array.

## Notes

- The auth server is implemented inside `auth-server`.
- The current code uses RSA keys from `auth-server/keys` to sign JSON Web Tokens with RS256.
- The `/token` endpoint requires client credentials for both grant types.
- A client must exist in the MongoDB `clients` collection before using the authorization code flow.

## Additional resources

For details on the authorization code grant request format, see `auth-server/README.md`.





