/**
 * Esempio: Gestione figurine Marvel random
 * ----------------------------------------
 * Questo script mostra come:
 *  1) Generare l'hash richiesto da Marvel con generateMarvelHash.
 *  2) Effettuare una chiamata API a Marvel per recuperare personaggi.
 *  3) Estrarre 5 personaggi a caso dall'array di risultati.
 *  4) Salvare e rendere persistenti i personaggi con localStorage.
 *  5) Aggiornare la pagina (o un contenitore) con i personaggi estratti.
 *
 * Requisiti:
 *  - La libreria CryptoJS deve essere caricata prima di questo script.
 *  - generateMarvelHash(ts, privateKey, publicKey) deve essere definita.
 *  - Un elemento con id "figurines-container" per visualizzare i personaggi.
 *  - Un oggetto utente "currentUser" salvato in localStorage.
 */

// Recupera 5 personaggi Marvel e li salva per l'utente corrente
async function eseguiAcquisto(publicKey, privateKey) {
try {
const currentUser = JSON.parse(localStorage.getItem("currentUser"));
if (!currentUser) {
alert("Utente non loggato!");
return;
}

// Esempio: verifichiamo se l'utente ha almeno 1 credito:
if (currentUser.numberCredits < 1) {
alert("Crediti insufficienti per acquistare!");
return;
}

// Scala 1 credito
currentUser.numberCredits -= 1;
localStorage.setItem("currentUser", JSON.stringify(currentUser));

// Genera parametri per la chiamata a Marvel
const ts = Date.now().toString();
const hash = generateMarvelHash(ts, privateKey, publicKey);

// Puoi regolare i parametri di limit, offset, ecc. a piacere
const url = `https://gateway.marvel.com/v1/public/characters?limit=100&ts=${ts}&apikey=${publicKey}&hash=${hash}`;

// Chiamata fetch a Marvel
const response = await fetch(url);
if (!response.ok) {
throw new Error("Errore nella chiamata a Marvel API");
}

const data = await response.json();
if (!data || !data.data || !data.data.results) {
throw new Error("Risposta Marvel non valida");
}

// Array di personaggi disponibili
const marvelCharacters = data.data.results;
// Se non ci sono abbastanza personaggi, esci
if (marvelCharacters.length < 5) {
alert("Non ci sono abbastanza personaggi per estrarne 5!");
return;
}

// Recupera eventuali figurine già possedute
const userFigurines = JSON.parse(localStorage.getItem("userFigurines")) || [];

// Seleziona 5 personaggi a caso, evitando duplicati
const newFigurines = [];
while (newFigurines.length < 5) {
const randomIndex = Math.floor(Math.random() * marvelCharacters.length);
const candidate = marvelCharacters[randomIndex];

if (!alreadyInUser && !alreadyInNew) {
    const thumbnail = candidate.thumbnail;
    const thumbnailUrl = thumbnail
    ? `${thumbnail.path}.${thumbnail.extension}`
    : "placeholder.png";

    newFigurines.push({
    id: candidate.id,
    name: candidate.name || "Senza Nome",
    image: thumbnailUrl
    });
}
}

// Aggiungi le nuove figurine all'utente e salva su localStorage
const updatedFigurines = [...userFigurines, ...newFigurines];
localStorage.setItem("userFigurines", JSON.stringify(updatedFigurines));

// Aggiorna la visualizzazione
renderFigurines(updatedFigurines);

alert("Hai acquistato 5 nuove figurine Marvel!");
} catch (error) {
console.error("Errore acquisto figurine Marvel:", error);
alert("Qualcosa è andato storto nell'acquisto delle figurine!");
}
}

/**
 * Renderizza un array di figurine (id, name, image) dentro #figurines-container
 */
function renderFigurines(figurineArray) {
const container = document.getElementById("figurines-container");
if (!container) return;

container.innerHTML = "";
figurineArray.forEach(fig => {
const cardEl = document.createElement("div");
cardEl.classList.add("figurine-card");
cardEl.innerHTML = `
<img src="${fig.image}" alt="${fig.name}" />
<h3>${fig.name}</h3>
`;
container.appendChild(cardEl);
});
}

// Esempio di utilizzo al caricamento della pagina
document.addEventListener("DOMContentLoaded", () => {
// Se esistono già figurine in localStorage, le mostriamo
const existingFigurines = JSON.parse(localStorage.getItem("userFigurines")) || [];
renderFigurines(existingFigurines);

// Esempio di bottone per acquistare figurine
const btnAcquistaFigurine = document.getElementById("btn-acquista-5-figurine");
if (btnAcquistaFigurine) {
btnAcquistaFigurine.addEventListener("click", () => {

    const publicKey = "9de281f5f58435133e7b0803bf2727a2";
const privateKey = "cf2a2657976eeb220c1a6a2a28e90100767bb137";
acquista5FigurineMarvel(publicKey, privateKey);
});
}
}
);