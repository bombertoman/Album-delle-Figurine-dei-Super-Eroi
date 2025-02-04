/**
 * gestionefigurine.js
 *
 * Questo file definisce:
 *  - generateMarvelHash(): per calcolare l'hash MD5 richiesto dalla Marvel API
 *  - aggiornaAlbum(): per popolare #album con i risultati ricevuti
 *  - eseguiAcquisto(): riduce i crediti, chiama Marvel, aggiorna l'album
 *
 * Espone l'oggetto 'acquistapacchetti' per essere richiamato in modale.js.
 * Assicurati di includere questo file PRIMA di modale.js nel tuo HTML, ad esempio:
 *
 *   <script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js"></script>
 *   <script src="js/gestionefigurine.js"></script>
 *   <script src="js/modale.js"></script>
 *
 * Così modale.js vedrà 'window.acquistapacchetti'.
 */

// Funzione: Calcolo Hash Marvel (MD5 di ts + privateKey + publicKey)
function generateMarvelHash(ts, privateKey, publicKey) {
return CryptoJS.MD5(ts + privateKey + publicKey).toString();
}

// Funzione: Aggiorna l’elemento #album con le figurine ricevute
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

// Funzione: Esegue l'acquisto di figurine dalla Marvel API
async function eseguiAcquisto(publicKey, privateKey) {
// Trova e valida i crediti
const creditiElem = document.querySelector(".ncrediti");
if (!creditiElem) {
throw new Error("Elemento '.ncrediti' non trovato!");
}
let crediti = parseInt(creditiElem.textContent, 10);
if (crediti < 1) {
throw new Error("Crediti insufficienti");
}

// Deduce 1 credito lato client (in produzione va gestito server-side)
crediti -= 1;
creditiElem.textContent = crediti.toString();

// Prepara i parametri Marvel
const ts = new Date().getTime().toString();
const hash = generateMarvelHash(ts, privateKey, publicKey);
const marvelUrl = `https://gateway.marvel.com/v1/public/characters?ts=${ts}&apikey=${publicKey}&hash=${hash}`;

// Fetch
const response = await fetch(marvelUrl);
if (!response.ok) {
// Ripristina i crediti se c'è un errore
crediti += 1;
creditiElem.textContent = crediti.toString();
throw new Error("Errore API Marvel");
}

const data = await response.json();
if (data?.data?.results?.length > 0) {
// Aggiorna l'album con i nuovi risultati
aggiornaAlbum(data.data.results);
return "Acquisto completato!";
} else {
// Ripristina i crediti se non arrivano personaggi
crediti += 1;
creditiElem.textContent = crediti.toString();
throw new Error("Nessun personaggio trovato");
}
}

// Espone la logica per l'uso da parte di modale.js:
// es: acquistapacchetti.eseguiAcquisto(publicKey, privateKey)
window.acquistapacchetti = {
eseguiAcquisto
};