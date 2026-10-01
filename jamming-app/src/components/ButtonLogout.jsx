// import { useAuth } from "../services/auth/AuthContext"
import { logout } from "../services/auth/spotifyAuth"
export function ButtonLogout({ setUserState }) {
    function handleLogout(){
        logout();
        setUserState("error");
    };
    return <button className="buttonLogs" onClick={handleLogout}>Logout</button>
    
};