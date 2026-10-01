// import { useAuth } from "../services/auth/AuthContext";
import { ButtonLogin } from "./ButtonLogin";
import { ButtonLogout } from "./ButtonLogout";
import FormSearch from './FormSearch';

export function AppContent({ userState, setUserState }) {

    if (userState === "loading") {
        return (<header>Comprobando sesión....</header>);
    };
    if (userState === "error") {
        return (<header>
            <h1>Jamming</h1>
            <p>Inicia sessión para comenzar</p>
            {/* <ButtonLogin setUserState={setUserState}/> */}
        </header>)
    };
    if (userState === "logged") {
        return (
            <>
                <header>
                    <h1>Jamming Spotify</h1>
                    {/* <ButtonLogout setUserState={setUserState}/> */}
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
    }
};
