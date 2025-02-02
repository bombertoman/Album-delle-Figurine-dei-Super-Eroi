function generateMarvelHash(ts, privateKey, publicKey) {
return CryptoJS.MD5(ts + privateKey + publicKey).toString();
}

/**
 * Aggiorna l’elemento #album con le figurine ricevute
 */
function aggiornaAlbum(figurine) {
const album = document.getElementById("album");
if (!album) return;

// Svuota il contenuto precedente
album.innerHTML = "";

// Costruisce e aggiunge le card
figurine.forEach(({ thumbnail, name, description }) => {
const card = document.createElement("div");
card.className = "card";
card.innerHTML = `
    <img src="${thumbnail.path}.${thumbnail.extension}" alt="${name}">
    <h3>${name}</h3>
    <p>${description || "Descrizione non disponibile"}</p>
    `;
album.appendChild(card);
});
}

/**
 * Esegue l’acquisto di figurine:
 * 1) Legge e decrementa i crediti
 * 2) Genera ts, apikey, hash
 * 3) Esegue la fetch Marvel
 * 4) Chiama aggiornaAlbum() con i risultati
 */
async function eseguiAcquisto(publicKey, privateKey) {
// Trova i crediti
const creditiElem = document.querySelector(".ncrediti");
if (!creditiElem) {
throw new Error("Elemento '.ncrediti' non trovato!");
}
let crediti = parseInt(creditiElem.textContent, 10);
if (crediti < 1) {
throw new Error("Crediti insufficienti");
}

// Deduce 1 credito (in produzione andrebbe fatto server-side)
crediti -= 1;
creditiElem.textContent = crediti.toString();

// Parametri Marvel API
const ts = new Date().getTime().toString();
const hash = generateMarvelHash(ts, privateKey, publicKey);
const marvelUrl = `https://gateway.marvel.com/v1/public/characters?ts=${ts}&apikey=${publicKey}&hash=${hash}`;

// Fetch
const response = await fetch(marvelUrl);
if (!response.ok) {
// Ripristina i crediti in caso di errore
crediti += 1;
creditiElem.textContent = crediti.toString();
throw new Error("Errore API Marvel");
}

const data = await response.json();
if (data?.data?.results?.length > 0) {
aggiornaAlbum(data.data.results);
return "Acquisto completato!";
} else {
// Ripristina i crediti se vuoto
crediti += 1;
creditiElem.textContent = crediti.toString();
throw new Error("Nessun personaggio trovato");
}
}

// Esporta la logica per l’uso in altri file (es. modale.js)
window.acquistapacchetti = {
eseguiAcquisto,
};
