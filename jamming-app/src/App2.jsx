import { useEffect, useState } from "react";
import { AppContent } from "./components/AppContent";
import { isTokenExpired } from "./services/auth/spotifyTools";
import { getRefreshToken, getToken, initAuth } from "./services/auth/spotifyAuth2";

function App() {
    const [authState, setAuthState] = useState("loading");

    useEffect(() => {
        async function auth() {
            if (window.localStorage.getItem("refresh_token")) {
                if (!isTokenExpired) {
                    //activo
                    setAuthState("logged");
                };
                const isRefreshed = await getRefreshToken();
                if (isRefreshed) {
                    //activo
                    setAuthState("logged");
                };
                // algo falló empezar de 0
                setAuthState("error");
                const isInit = await initAuth();
                isInit ? setAuthState("logged") : setAuthState("error");

            };
            // aqui no habia refresh token 
            const isToken = await getToken();
            if (!isToken) {
                // algo falló empezar de 0
                setAuthState("error");
                const isInit = await initAuth();
                isInit ? setAuthState("logged") : setAuthState("error");
            };
            // activo 
            setAuthState("logged");
        };
        // auth(); 
    }, []);
};