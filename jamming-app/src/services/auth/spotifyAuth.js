const CLIENTID = "";
const REDIRECTURL = "";
const AUTHENDPOINT = "https://accounts.spotify.com/authorize";
const TOKENENDPOINT = "https://accounts.spotify.com/api/token";
const scope = "user-read-private user-read-email";

const CURRENTTOKEN = {
    get accessToken() {
        return localStorage.getItem("access_token") || null;
    },
    get refreshToken() {
        return localStorage.getItem("refresh_token") || null;
    },
    get expires() {
        return localStorage.getItem("expires_token") || null;
    },
    isExpired() {
        const expires = localStorage.getItem("expires_token");
        if (!expires) { return true; };
        return Date.now() >= Number(expires);
    },
    save(data) {
        localStorage.setItem("access_token", data.access_token);

        if (data.refresh_token) {
            localStorage.setItem("refresh_token", data.refresh_token);
        };

        const expiresAt = Date.now() + (data.expires_in * 1000); //una fecha y hora en el futuro
        localStorage.setItem("expires_token", expiresAt.toString());
    },
    clear() {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("expires");
        localStorage.removeItem("verifier");
    }
};

//funciones que no se exportan
//REGRESA UNA LLAVE PRIVADA -string
function generateCodeVerifier(length) {
    let text = "";
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    };
    return text;
};
async function generateCodeChallenge(codeVerifier) {
    const data = new TextEncoder().encode(codeVerifier);
    const digest = await window.crypto.subtle.digest("SHA-256", data);
    return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)])).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};
async function getAccesToken(code){
    const verifier = localStorage.getItem("verifier");
    const params = new URLSearchParams({
        client_id:CLIENTID,
        grant_type:"authorization_code",
        code,
        code_verifier:verifier
    });
    const peticion = await fetch(TOKENENDPOINT,{
        method: "POST",
        headers:{"Content-Type":"application/x-www-form-urlencoded"},
        body: params
    });
    const data = await peticion.json();
    if(!peticion.ok){
        throw new Error(data.error||"Token request failed");
    };
    return data;
};
async function refreshAccesToken(){
    const refresh_token= CURRENTTOKEN.refreshToken;
    if(!refresh_token){
        throw new Error("No refresh token available");
    };
    const params = new URLSearchParams({
        client_id:CLIENTID,
        grant_type:"refresh_token",
        refresh_token:refresh_token
    });
    const peticion = await fetch(TOKENENDPOINT,{
        method:"POST",
        headers:{"Content-Type":"application/x-www-form-urlencoded"},
        body: params
    });
    const data = await peticion.json();
    if(!peticion.ok){
        throw new Error(data.error || "refreshing token failed");
    };
    return data;
};

export async function redirectToSpotify() {
    const verifier = generateCodeVerifier(128);
    const challenge = await generateCodeChallenge(verifier);
    localStorage.setItem("verifier",verifier);
    const params = new URLSearchParams({
        client_id: CLIENTID,
        redirect_uri: REDIRECTURL,
        response_type:"code",
        scope,
        code_challenge:challenge,
        code_challenge_method:"S256"
    }); 
    document.location = `${AUTHENDPOINT}?${params}`;
};

export async function initializeAuth(){
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    if(code){
        const tokenData = await getAccesToken(code);
        CURRENTTOKEN.save(tokenData);
        const url = new URL(window.location.href);
        url.searchParams.delete("code");

        const updatedUrl = url.search ? url.href:url.href.replace("?","");
        window.history.replaceState({},document.title,updatedUrl);
    };
    if(!CURRENTTOKEN.accessToken){
        await redirectToSpotify();
    }else{
        if(CURRENTTOKEN.isExpired()){
            console.log("token expired, refreshing....");
            try{
                const tokenData = await refreshAccesToken();
                CURRENTTOKEN.save(tokenData);
            }catch(error){
                console.log("initializeAut Error refreshing: ",error);
                CURRENTTOKEN.clear();
                await redirectToSpotify();
            };
        };
    };
    return true;
};