const PUBLIC_KEY = "9de281f5f58435133e7b0803bf2727a2";
const PRIVATE_KEY = "cf2a2657976eeb220c1a6a2a28e90100767bb137";

// Importa la libreria CryptoJS per generare l'hash MD5
if (typeof CryptoJS === "undefined") {
const script = document.createElement("script");
script.src = "https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js";
document.head.appendChild(script);
}

/**
 * Funzione per generare l'hash MD5 richiesto dall'API Marvel
 */
function generateMarvelHash(ts, privateKey, publicKey) {
return CryptoJS.MD5(ts + privateKey + publicKey).toString();
}

/**
 * Effettua l'acquisto di 5 figurine casuali e le memorizza nel localStorage
 */
async function eseguiAcquisto() {
const creditiElem = document.querySelector(".ncrediti");
if (!creditiElem) {
throw new Error("Elemento '.ncrediti' non trovato!");
}

let crediti = parseInt(creditiElem.textContent, 10);
if (crediti < 1) {
alert("Crediti insufficienti!");
return;
}

// Deduzione temporanea dei crediti
crediti -= 1;
creditiElem.textContent = crediti.toString();

// Generazione dell'hash per Marvel API
const ts = new Date().getTime().toString();
const hash = generateMarvelHash(ts, PRIVATE_KEY, PUBLIC_KEY);
const marvelUrl = `https://gateway.marvel.com/v1/public/characters?limit=5&ts=${ts}&apikey=${PUBLIC_KEY}&hash=${hash}`;

try {
const response = await fetch(marvelUrl);
if (!response.ok) {
    throw new Error("Errore API Marvel");
}

const data = await response.json();
if (!data?.data?.results?.length) {
    throw new Error("Nessun personaggio trovato!");
}

// Ottieni le 5 figurine casuali
const nuoveFigurine = data.data.results.map(character => ({
    name: character.name,
    image: `${character.thumbnail.path}.${character.thumbnail.extension}`
}));

// Aggiorna l'album e memorizza le figurine nel localStorage
aggiornaAlbum(nuoveFigurine);
salvaFigurineLocalStorage(nuoveFigurine);

alert("Acquisto completato con successo!");
aggiornaCrediti(crediti);

return "Acquisto completato!";
} catch (error) {
// Ripristina il credito in caso di errore API
crediti += 1;
creditiElem.textContent = crediti.toString();
console.error("Errore nell'acquisto:", error);
alert("Errore durante l'acquisto. Riprova più tardi.");
}
}

/**
 * Salva le figurine acquisite nel localStorage per non perderle al refresh
 */
function salvaFigurineLocalStorage(nuoveFigurine) {
let figurineSalvate = JSON.parse(localStorage.getItem("figurine")) || [];
figurineSalvate = [...figurineSalvate, ...nuoveFigurine];
localStorage.setItem("figurine", JSON.stringify(figurineSalvate));
}

/**
 * Carica le figurine salvate nel localStorage all'avvio della pagina
 */
function caricaFigurineSalvate() {
const figurineSalvate = JSON.parse(localStorage.getItem("figurine")) || [];
aggiornaAlbum(figurineSalvate);
}

/**
 * Aggiorna il numero di crediti nel localStorage
 */
function aggiornaCrediti(crediti) {
const currentUser = JSON.parse(localStorage.getItem("currentUser"));
if (currentUser) {
currentUser.numberCredits = crediti;
localStorage.setItem("currentUser", JSON.stringify(currentUser));
}
}

/**
 * Aggiorna l'album con le figurine all'interno delle card
 */
function aggiornaAlbum(figurine) {
const albumContainer = document.getElementById("album-container");
if (!albumContainer) return;

figurine.forEach(fig => {
const card = document.createElement("div");
card.classList.add("figurina-card");

const img = document.createElement("img");
img.src = fig.image;
img.alt = fig.name;
img.classList.add("figurina-img");

const name = document.createElement("p");
name.textContent = fig.name;
name.classList.add("figurina-name");

card.appendChild(img);
card.appendChild(name);
albumContainer.appendChild(card);
});
}

// Collega il pulsante di acquisto alla funzione `eseguiAcquisto`
document.addEventListener("DOMContentLoaded", () => {
const acquistaBtn = document.getElementById("acquista-btn");
if (acquistaBtn) {
acquistaBtn.addEventListener("click", eseguiAcquisto);
}
caricaFigurineSalvate(); // Carica le figurine salvate al caricamento della pagina
});