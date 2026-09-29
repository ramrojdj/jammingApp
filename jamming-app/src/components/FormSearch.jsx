import { useState } from "react";
import { doSearch } from "../services/auth/spotifyTools";

export default function FormSearch() {
    const [inputSong, setInputSong] = useState("");
    function handleInputChange(event){
        setInputSong(event.target.value);
    };
    async function handleSubmit(event){
        event.preventDefault();
        const listaCanciones = await doSearch(inputSong);
        console.log(listaCanciones.tracks.items);

   
        
    }
    return (
        <form onSubmit={handleSubmit}>
            <input onChange={handleInputChange} value={inputSong} type="text" placeholder="Jamm a song" />
            <button type="submit">🔎</button>
        </form>
        );
};