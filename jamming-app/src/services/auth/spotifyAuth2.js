// const client_id = "ff44bb5ef8ac4f69b64e6cb686bda807";
// const redirect_uri = "http://[::1]:5173";
const client_id = "";
const redirect_uri = "";
const urlToken = "https://accounts.spotify.com/api/token";

const generateRandomString = length => {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const values = crypto.getRandomValues(new Uint8Array(length));
    return values.reduce((acc, x) => acc + possible[x % possible.length], "");
};
const sha256 = async plain => {
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    return window.crypto.subtle.digest("SHA-256", data);
};
const base64encode = input => {
    return btoa(String.fromCharCode(...new Uint8Array(input)))
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
};
const generateCodeChallenge = async () => {
    //1.genera llave privada
    const codeVerifier = generateRandomString(64);
    //2.guarda la llave
    window.localStorage.setItem("code_verifier", codeVerifier);
    // 3.genera llave publica
    const hashed = await sha256(codeVerifier);
    // 4.da formato y regresa llave ppublica
    return base64encode(hashed);
};
const isTokenExpired = () => {
    const expiresAt = window.localStorage.getItem("expiresAt_token");
    if (!expiresAt) { return };
    return Date.now() >= Number(expiresAt);
};
const login = token => {
    window.localStorage.setItem("access_token", token.access_token);
    if (token.refresh_token) {
        window.localStorage.setItem("refresh_token", token.refresh_token);
    };
    const expiresAt = Date.now() + (token.expires_in * 1000); //una fecha y hora en el futuro
    window.localStorage.setItem("expiresAt_token", `${expiresAt}`);
    window.localStorage.removeItem("code_verifier");

    console.log(window.localStorage.getItem("access_token"));
    console.log(window.localStorage.getItem("refresh_token"));
    console.log(window.localStorage.getItem("expiresAt_token"));
    console.log(window.localStorage.getItem("code_verifier"));

    return true;
};
const logout = () => {
    window.localStorage.removeItem("access-token");
    window.localStorage.removeItem("refresh_token");
    window.localStorage.removeItem("expiresAt_token");
    window.localStorage.removeItem("code_verifier");


    console.log(window.localStorage.getItem("access_token"));
    console.log(window.localStorage.getItem("refresh_token"));
    console.log(window.localStorage.getItem("expiresAt_token"));
    console.log(window.localStorage.getItem("code_verifier"));
};

// regresa true/false 
export async function getRefreshToken(){
    const refresh_token = window.localStorage.getItem("refresh_token");
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
    const token = await result.json();

    if (!response.ok) {
        if (token.error === "invalid_grant") {
            logout();
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

// solo redirecciona
export async function getSpotifyCode() {
    const urlAuth = new URL("https://accounts.spotify.com/authorize");
    const scope = 'user-read-private user-read-email';

    const code_challenge = generateCodeChallenge(128);
    const params = {
        response_type: "code",
        client_id,
        redirect_uri,
        scope,
        code_challenge_method: "S256",
        code_challenge,
    };
    try {
        urlAuth.search = new URLSearchParams(params).toString();
        window.location.href = urlAuth.toString();
    } catch (error) {
        throw new Error(`getSpotifyCodeError: ${error.message}`, { cause: error });
    };
};

// regresa true/false 
export async function getToken() {
    const code_verifier = window.localStorage.getItem("code_verifier");
    const payload = {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
            client_id,
            redirect_uri,
            code_verifier,
            code,
            grant_type: "authorization_code"
        })
    };
    // peticion 
    try {
        const response = await fetch(urlToken, payload);
        if (!response.ok) {
            return false;
        };
        const token = await response.json();
        login(token);
        return true;
    } catch (error) {
        console.error(
            new Error(`getTokenError: ${error.message}`, {
                cause: error
            })
        );
        return false;
    };
};

export async function initAuth() {
    logout();
    await getSpotifyCode();
    return await getToken();
};
