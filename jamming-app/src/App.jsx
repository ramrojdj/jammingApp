import { useState, useEffect } from "react";
import { AppContent } from "./components/AppContent";
import { getSpotifyCode, initAuth, getRefreshToken } from "./services/auth/spotifyAuth";
import { isTokenExpired } from "./services/auth/spotifyTools";

// import { AuthProvider, useAuth } from './services/auth/AuthContext';
function App() {
  const [isLogged, setIsLogged] = useState(false);
  const [loading, setLoading] = useState(true);

  const swithLog = () => {
    isLogged ? setIsLogged(false) : setIsLogged(true);
    loading ? setLoading(false) : setIsLogged(true);
  };

  useEffect(() => {
    async function auth() {
      if (window.localStorage.getItem("refresh_token")) {
        console.log("existe refresh token")
        if (!isTokenExpired()) {
          console.log("activo");
          swithLog();
        } else {
          console.log("expirado iniiando refresh");
          const isRefresehd = await (getRefreshToken());
          swithLog();
        }
      } else {
        console.log("no hay refresh token iniciando de 0");
        // await initAuth();
        // swithLog();
      };
    }
    auth();
  }, []);

  return (
    <AppContent isLogged={isLogged} loading={loading} />
  )

};

export default App;
