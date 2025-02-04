// Funzione: Calcolo Hash Marvel (MD5 di ts + privateKey + publicKey)
function generateMarvelHash(ts, privateKey, publicKey) {
return CryptoJS.MD5(ts + privateKey + publicKey).toString();
}

// Funzione: Aggiorna l’elemento #album con le figurine ricevute
function aggiornaAlbum(figurine) {
const album = document.getElementById("album");
if (!album) return;

album.innerHTML = ""; // Reset album content

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
    // Seleziona 5 figurine casuali
    const figurineSelezionate = pickRandomFigurine(data.data.results, 5);
    
    // Aggiorna l'album con i nuovi risultati
    aggiornaAlbum(figurineSelezionate);
    
    // Salva le figurine in localStorage
    saveFigurine(figurineSelezionate);
    
    return "Acquisto completato!";
} else {
    // Ripristina i crediti se non arrivano personaggi
    crediti += 1;
    creditiElem.textContent = crediti.toString();
    throw new Error("Nessun personaggio trovato");
}
}

// Funzione per selezionare figurine casuali
function pickRandomFigurine(arr, count) {
if (arr.length <= count) return arr;
const shuffled = arr.slice();
for (let i = shuffled.length - 1; i > 0; i--) {
    const r = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[r]] = [shuffled[r], shuffled[i]];
}
return shuffled.slice(0, count);
}

// Funzione per salvare le figurine in localStorage
function saveFigurine(figurine) {
localStorage.setItem("figurine", JSON.stringify(figurine));
}

// Funzione per caricare le figurine da localStorage
function loadFigurine() {
const savedFigurine = localStorage.getItem("figurine");
return savedFigurine ? JSON.parse(savedFigurine) : [];
}

// Inizializza l'album con le figurine salvate
function init() {
const figurine = loadFigurine();
if (figurine.length > 0) {
    aggiornaAlbum(figurine);
}
}

// Avvia l'inizializzazione quando la pagina è caricata
window.addEventListener("load", init);

// Espone la logica per l'uso da parte di modale.js:
// es: acquistapacchetti.eseguiAcquisto(publicKey, privateKey)
window.acquistapacchetti = {
eseguiAcquisto
};