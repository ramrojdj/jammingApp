const client_id = "ff44bb5ef8ac4f69b64e6cb686bda807";
const redirect_uri = "http://[::1]:5173";
const urlToken = "https://accounts.spotify.com/api/token";
const urlAuth = "https://accounts.spotify.com/authorize";

const generateRandomString = (length) => {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const values = crypto.getRandomValues(new Uint8Array(length));
    return values.reduce((acc, x) => acc + possible[x % possible.length], "");
};
const sha256 = async (plain) => {
    const encoder = new TextEncoder()
    const data = encoder.encode(plain)
    return window.crypto.subtle.digest('SHA-256', data)
};
const base64encode = (input) => {
    return btoa(String.fromCharCode(...new Uint8Array(input)))
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
};
const getCodeChallenge = async () => {
    const codeVerifier = generateRandomString(64);
    window.localStorage.setItem("code_verifier", codeVerifier);
    const hashed = await sha256(codeVerifier)
    const codeChallenge = base64encode(hashed);
    return codeChallenge;
};

export const logout = () => {
    window.localStorage.removeItem("access-token");
    window.localStorage.removeItem("refresh_token");
    window.localStorage.removeItem("expiresAt_token");
    window.localStorage.removeItem("code_verifier");

};
const login = token => {
    window.localStorage.setItem("access_token", token.access_token);
    if (token.refresh_token) {
        window.localStorage.setItem("refresh_token", token.refresh_token);
    };
    const expiresAt = Date.now() + (token.expires_in * 1000); //una fecha y hora en el futuro
    window.localStorage.setItem("expiresAt_token", `${expiresAt}`);
    window.localStorage.removeItem("code_verifier");

    // console.log(window.localStorage.getItem("access_token"));
    // console.log(window.localStorage.getItem("refresh_token"));
    // console.log(window.localStorage.getItem("expiresAt_token"));
    // console.log(window.localStorage.getItem("code_verifier"));

    return true;
};
export const isTokenExpired = () => {
    const expiresAt = window.localStorage.getItem("expiresAt_token");
    if (!expiresAt) { return true };
    return Date.now() >= Number(expiresAt);
};
export async function getRefreshToken() {
    const refresh_token = window.localStorage.getItem("refresh_token");
    if (!refresh_token) {
        console.error("No existe refresh_token");
        return false;
    }
    const payload = {
        method: "POST",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token,
            client_id
        })
    };

    const response = await fetch(urlToken, payload);
    const token = await response.json();

    if (!response.ok) {
        if (token.error === "invalid_grant") {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            window.localStorage.href = "/login";
            return false;
        };
        console.error(
            new Error(`getRefreshTokenError: ${error.message}`, {
                cause: error
            })
        );
        return false;
    };
    login(token);
    return true;
};
export async function getSpotifyCode() {
    const scope = 'user-read-private user-read-email';
    const authUrl = new URL(urlAuth);
    const code_challenge = await getCodeChallenge();

    const params = {
        response_type: "code",
        client_id,
        scope,
        code_challenge_method: "S256",
        code_challenge,
        redirect_uri
    };
    authUrl.search = new URLSearchParams(params).toString();
    window.location.href = authUrl.toString();
};
export const getToken = async code => {
    // stored in getCodeChallenge
    const codeVerifier = localStorage.getItem('code_verifier');
    if (!codeVerifier) {
        console.error(
            "No existe code_verifier"
        );
        return false;
    };
    const payload = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            client_id,
            grant_type: 'authorization_code',
            code,
            redirect_uri,
            code_verifier: codeVerifier,
        }),
    };
    const response = await fetch(urlToken, payload);
    const token = await response.json();
    if (!response.ok) {
        console.log(new Error("getTokenError:", token));
        return false;
    };
    login(token);
    return true;
};
export async function initSpotify() {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (!code) {
        // redirecciona a la pagina spotify 
        await getSpotifyCode();
        return false;
    };
    window.history.replaceState({}, document.title, window.location.pathname);
    return await getToken(code);
};

