// import { useAuth } from "../services/auth/AuthContext"
import { initSpotify } from "../services/auth/spotifyAuth"

export function ButtonLogin({setUserState}) {
    // const { loginToSpotify } = useAuth();
    function handleLogin(){
        initSpotify();
        setUserState("logged");
    };

    return <button className="buttonLogs" onClick={handleLogin}>Login</button>
};