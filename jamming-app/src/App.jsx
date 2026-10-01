import { useState, useEffect } from "react";
import { AppContent } from "./components/AppContent";
import { getToken, isTokenExpired, getRefreshToken, getSpotifyCode } from "./services/auth/spotifyAuth";

// import { AuthProvider, useAuth } from './services/auth/AuthContext';
function App() {
  const [authStatus, setAuthStatus] = useState("loading");


  useEffect(() => {
    async function initAuth() {
      // 1. sesion previa? 
      const refresh_token = window.localStorage.getItem("refresh_token");
      if (!refresh_token) {
        // no hay refresh token revsar si vengo de code 
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");
        if (!code) {
          console.log("ni previa ni code");
          await getSpotifyCode();
          return;
        };
        const islogged = await getToken(code);
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );
        if (islogged) {
          console.log("logeo exitoso desde token");
          setAuthStatus("logged");
          return;
        } else {
          console.log("nonononon desde getToken");
        };
      };
      // 2. si hay previa 
      if (!isTokenExpired()) {
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );
        console.log("logeo exitoso desde previa");
        setAuthStatus("logged");
        return;
      };
      const isLogged = await getRefreshToken();
      if (!isLogged) {
        console.log("nonono desde refreshToken");
        return;
      };
      console.log("logeo exitoso desde expired");
      setAuthStatus("logged");
    };
    initAuth();
  }, []);




  return (
    <AppContent userState={authStatus} setUserState={setAuthStatus} />
  )

};

export default App;
