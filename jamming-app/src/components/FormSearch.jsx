import { useState } from "react";

export default function FormSearch() {
    const [inputSong, setInputSong] = useState("");
    function handleInputChange(event){
        setInputSong(event.target.value);
    };
    function handleSubmit(event){
        event.preventDefault();
        return console.log(inputSong);
    }
    return (
        <form onSubmit={handleSubmit}>
            <input onChange={handleInputChange} value={inputSong} type="text" placeholder="Jamm a song" />
            <button type="submit">🔎</button>
        </form>
        );
};