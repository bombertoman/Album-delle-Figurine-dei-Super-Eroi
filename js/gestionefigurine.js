// Funzione per salvare i crediti in localStorage
function saveCrediti(crediti) {
localStorage.setItem("creditCount", crediti.toString());
}

// Funzione per caricare i crediti da localStorage
function loadCrediti() {
const savedCrediti = localStorage.getItem("creditCount");
return savedCrediti ? parseInt(savedCrediti, 10) : 0;
}

// Inizializza l'album con le figurine salvate
function init() {
const figurine = loadFigurine();
if (figurine.length > 0) {
aggiornaAlbum(figurine);
}

// Carica i crediti salvati
const creditiElem = document.querySelector(".ncrediti");
if (creditiElem) {
const crediti = loadCrediti();
creditiElem.textContent = crediti.toString();
}
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

// Assicuriamoci che il pulsante di acquisto sia sempre visibile
const btn = document.getElementById("btn-acquistopack");
if (btn) {
btn.style.display = "block";
btn.disabled = false;
}
}

// Avvia l'inizializzazione quando la pagina è caricata
window.addEventListener("load", init);

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
saveCrediti(crediti); // Salva i crediti aggiornati

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
saveCrediti(crediti); // Salva i crediti ripristinati
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
saveCrediti(crediti); // Salva i crediti ripristinati
throw new Error("Nessun personaggio trovato");
}
}