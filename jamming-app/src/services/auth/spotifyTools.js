export const doSearch = async (inputSearch) => {
    const urlSearch = 'https://api.spotify.com/v1/search?'
    const payload = {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${window.localStorage.getItem("access_token")}`,
        }
    };
    const params = new URLSearchParams({
        q: inputSearch,
        type: 'track',
        limit: "10",
        offset: "5"
    });
    try {
        const request = await fetch(`${urlSearch}${params}`, payload);
        if (request.ok) {
            const response = await request.json();
            return response;
        } else {
            throw new Error("doSearchError");
        };
    } catch (e) { console.log(e) };
};
export function isTokenExpired() {
    const expiresAt = localStorage.getItem("expiresAt_token");
    if (!expiresAt) { return true; };
    return Date.now() >= Number(expiresAt);
};
export function pintaTRacks(lista) {
    for (let song in listaCanciones) {
        
    };
};