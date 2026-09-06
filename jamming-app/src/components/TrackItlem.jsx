import ButtonJamming from "../components/ButtonJamming";
export default function TrackItem({cover, name, artist,id}) {
    return (
        <li className="trackItem" key={id}>
            <img src={cover} alt="trackImg" />
            <p>{name}
            </p>
            <span>{artist}</span>
            <ButtonJamming />
        </li>
    );
};