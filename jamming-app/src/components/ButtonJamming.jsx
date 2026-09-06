export default function ButtonJamming(){
    function handleClick(event){

        const action = event.target.innerHTML;
        const grandParent=event.target.parentElement.parentElement.parentElement;

        return console.log(grandParent.className);
    };
    return <button onClick={handleClick} className="jamming-button">🤍</button>
};