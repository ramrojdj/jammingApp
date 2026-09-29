// const CLIENTID = "ff44bb5ef8ac4f69b64e6cb686bda807";
// const REDIRECTURL = "http://[::1]:5173";
// const AUTHENDPOINT = "https://accounts.spotify.com/authorize";
// const TOKENENDPOINT = "https://accounts.spotify.com/api/token";
// const scope = "user-read-private user-read-email";

// export function isTokenExpired() {
//     const expiresAt = localStorage.getItem("expiresAt_token");
//     if (!expiresAt) { return true; };
//     return Date.now() >= Number(expiresAt);
// }
// export function logout() {
//     localStorage.removeItem("access_token");
//     localStorage.removeItem("refresh_token");
//     localStorage.removeItem("expires");
//     localStorage.removeItem("verifier");
// };
// export async function login() {
//     await redirectToSpotify();
//     await initAuth();
//     return
// };
// export async function refreshAccesToken() {
//     const refresh_token = localStorage.getItem("refresh_token");
//     if (!refresh_token) {
//         throw new Error("No refresh token available");
//     };
//     const params = new URLSearchParams({
//         client_id: CLIENTID,
//         grant_type: "refresh_token",
//         refresh_token: refresh_token
//     });
//     const peticion = await fetch(TOKENENDPOINT, {
//         method: "POST",
//         headers: { "Content-Type": "application/x-www-form-urlencoded" },
//         body: params
//     });
//     const data = await peticion.json();
//     if (!peticion.ok) {
//         throw new Error(data.error || "refreshing token failed");
//     };
//     saveTokens(data);
//     localStorage.removeItem("verifier");
//     return true;
// };
// export async function redirectToSpotify() {
//     const verifier = generateCodeVerifier(128);
//     const challenge = await generateCodeChallenge(verifier);
//     localStorage.setItem("verifier", verifier);
//     const params = new URLSearchParams({
//         client_id: CLIENTID,
//         redirect_uri: REDIRECTURL,
//         response_type: "code",
//         scope,
//         code_challenge: challenge,
//         code_challenge_method: "S256"
//     });
//     document.location = `${AUTHENDPOINT}?${params}`;
// };
// export async function initAuth() {
//     const params = new URLSearchParams(window.location.search);
//     const code = params.get("code");
//     try {
//         if (!code) {
//             return false;
//         };
//         const tokenData = await getAccesToken(code);
//         console.log(tokenData);
//         saveTokens(tokenData);

//         // Eliminamos ?code=... de la URL.
//         const url = new URL(window.location.href);
//         url.searchParams.delete("code");
//         window.history.replaceState(
//             {},
//             document.title,
//             url.toString()
//         );

//         localStorage.removeItem("verifier");
//         return true;
//     } catch (error) { throw new Error("initAuthError: ", error) };
// };
// //funciones que no se exportan
// //REGRESA UNA LLAVE PRIVADA -string
// function generateCodeVerifier(length) {
//     let text = "";
//     let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//     for (let i = 0; i < length; i++) {
//         text += possible.charAt(Math.floor(Math.random() * possible.length));
//     };
//     return text;
// };
// async function generateCodeChallenge(codeVerifier) {
//     const data = new TextEncoder().encode(codeVerifier);
//     const digest = await window.crypto.subtle.digest("SHA-256", data);
//     return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)])).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
// };
// async function getAccesToken(code) {
//     const verifier = localStorage.getItem("verifier");
//     console.log(verifier)
//     const params = new URLSearchParams({
//         client_id: CLIENTID,
//         grant_type: "authorization_code",
//         code,
//         code_verifier: verifier
//     });
//     const peticion = await fetch(TOKENENDPOINT, {
//         method: "POST",
//         headers: { "Content-Type": "application/x-www-form-urlencoded" },
//         body: params
//     });
//     const data = await peticion.json();
//     if (!peticion.ok) {
//         throw new Error("Token request failed", data.error);
//     };

//     return data;
// };
// function saveTokens(data) {
//     localStorage.setItem("access_token", data.access_token);

//     if (data.refresh_token) {
//         localStorage.setItem("refresh_token", data.refresh_token);
//     };

//     const expiresAt = Date.now() + (data.expires_in * 1000); //una fecha y hora en el futuro
//     localStorage.setItem("expiresAt_token", expiresAt.toString());
// };



//LLAVE PRIVADA
const generateRandomString = (length) => {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const values = crypto.getRandomValues(new Uint8Array(length));
    return values.reduce((acc, x) => acc + possible[x % possible.length], "");
}
// const codeVerifier  = generateRandomString(64);

const sha256 = async (plain) => {
    const encoder = new TextEncoder()
    const data = encoder.encode(plain)
    return window.crypto.subtle.digest('SHA-256', data)
};
// const hasshed= await sha256(generateRandomString(128));

const base64encode = (input) => {
    return btoa(String.fromCharCode(...new Uint8Array(input)))
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
}

const generateCodeChallenge = async () => {
    // 1. Generar el verifier ORIGINAL 
    const codeVerifier = generateRandomString(64);
    // // 2. Guardarlo para utilizarlo después del callback 
    window.localStorage.setItem("code_verifier", codeVerifier);
    // // 3. Hashear el verifier 
    const hashed = await sha256(codeVerifier);
    // // 4. Convertir el hash a Base64 URL-safe
    return base64encode(hashed);
};

// const codeChallenge = base64encode(hashed);
export async function getSpotifyCode() {
    const clientId = "ff44bb5ef8ac4f69b64e6cb686bda807";
    const redirectUri = "http://[::1]:5173";
    const scope = 'user-read-private user-read-email';
    const authUrl = new URL("https://accounts.spotify.com/authorize");

    // generated in the previous step

    const codeChallenge = await generateCodeChallenge(128);

    const params = {
        response_type: "code",
        client_id: clientId,
        scope,
        code_challenge_method: "S256",
        code_challenge: codeChallenge,
        redirect_uri: redirectUri
    };
    // //peticion
    try {
        authUrl.search = new URLSearchParams(params).toString();
        window.location.href = authUrl.toString();
    } catch (error) {
        throw new Error("getSpotifyCodeError: ", error);
    };
};
function login(token) {
    // if(token.access_token){
    //     window.
    // };
    window.localStorage.setItem("access_token", token.access_token);
    window.localStorage.setItem("refresh_token", token.refresh_token);
    const expiresAt = Date.now() + (token.expires_in * 1000); //una fecha y hora en el futuro
    window.localStorage.setItem("expiresAt_token", `${expiresAt}`);
    window.localStorage.removeItem("code_verifier");

    console.log(window.localStorage.getItem("access_token"));
    console.log(window.localStorage.getItem("refresh_token"));
    console.log(window.localStorage.getItem("expiresAt_token"));
    console.log(window.localStorage.getItem("code_verifier"));
};

export function logout() {
    window.localStorage.removeItem("access-token");
    window.localStorage.removeItem("refresh_token");
    window.localStorage.removeItem("expiresAt_token");
    window.localStorage.removeItem("code_verifier");


    console.log(window.localStorage.getItem("access_token"));
    console.log(window.localStorage.getItem("refresh_token"));
    console.log(window.localStorage.getItem("expiresAt_token"));
    console.log(window.localStorage.getItem("code_verifier"));
};

export const getRefreshToken = async () => {
    // refresh token that has been previously stored
    const refreshToken = localStorage.getItem('refresh_token');
    const url = "https://accounts.spotify.com/api/token";

    const payload = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
            client_id: "ff44bb5ef8ac4f69b64e6cb686bda807"
        }),
    }
    const result = await fetch(url, payload);
    const response = await result.json();

    if (!result.ok) {
        if (response.error === 'invalid_grant') {
            logout();
            window.location.href = '/login';
            return false;
        }
        throw new Error(`Token refresh failed: ${response.error}`);
    };

    console.log(response, "+++++++++++++++++")
    localStorage.setItem('access_token', response.access_token);
    localStorage.setItem('access_token', response.access_token);
    if (response.refresh_token) {
        localStorage.setItem('refresh_token', response.refresh_token);
        console.log(response, "....................");
    };
    console.log("token actualizados3333");
};



const getToken = async code => {
    // stored in the previous step
    const codeVerifier = localStorage.getItem('code_verifier');
    const clientId = "ff44bb5ef8ac4f69b64e6cb686bda807";
    const url = "https://accounts.spotify.com/api/token";
    const redirectUri = "http://[::1]:5173";
    const payload = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            client_id: clientId,
            grant_type: 'authorization_code',
            code,
            redirect_uri: redirectUri,
            code_verifier: codeVerifier,
        }),
    };
    //peticion
    try {
        const body = await fetch(url, payload);
        if (body.ok) {
            const response = await body.json();
            return login(response);
        } else {
            throw new Error("getTokenError");
        };

    } catch (e) { console.log(e) }
};


function urlCleaner() {
    // Eliminamos ?code=... de la URL.
    const url = new URL(window.location.href);
    url.searchParams.delete("code");
    return window.history.replaceState(
        {},
        document.title,
        "JammingApp"
    );
};

export async function initAuth() {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    try {
        if (!code) {
            getSpotifyCode();
            return false;
        };
        await getToken(code);
        // Eliminamos ?code=... de la URL.
        const url = new URL(window.location.href);
        url.searchParams.delete("code");
        window.history.replaceState(
            {},
            document.title,
            "JammingApp"
        );
        return true;
    } catch (error) { console.log("initAuthError: ", error) };
};