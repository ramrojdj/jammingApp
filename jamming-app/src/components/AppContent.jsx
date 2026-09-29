// import { useAuth } from "../services/auth/AuthContext";
import { ButtonLogin } from "./ButtonLogin";
import { ButtonLogout } from "./ButtonLogout";
import FormSearch from './FormSearch';
// import TrackItem from './components/TrackItlem';


export function AppContent({isLogged,loading}) {
    
    if (loading) {
        return (<header>Comprobando sesión....</header>);
    };
    if (!isLogged) {
        return (<header>
            <h1>Jamming</h1>
            <p>Inicia sessión para comenzar</p>
            <ButtonLogin />
        </header>)
    };

    return (
        <>
            <header>
                <h1>Jamming Spotify</h1>
                <ButtonLogout />
            </header>
            <main>
                <section className="playlistJamming">
                    <h2>Jamming Playlist</h2>
                    <ul className="card-container">
                    </ul>
                </section>

                <section className="search">
                    <FormSearch />
                    <ul className="card-container">
                        {/* <TrackItem cover="https://i.scdn.co/image/ab67616d0000485105d081cbdc2f67d37a364d63" name="dd" artist="66" id="1" /> */}
                    </ul>
                </section>
            </main>
        </>
    );
};
