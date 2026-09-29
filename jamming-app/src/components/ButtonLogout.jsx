// import { useAuth } from "../services/auth/AuthContext"
import { logout } from "../services/auth/spotifyAuth"
export function ButtonLogout() {
    return <button className="buttonLogs" onClick={logout}>Logout</button>

};