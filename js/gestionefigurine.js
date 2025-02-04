/**
 * Questa funzione genera l'hash necessario per la chiamata all'API di Marvel,
 * basandosi su ts (timestamp), chiave privata e chiave pubblica.
 * Assicurati di aver incluso la libreria CryptoJS nel tuo progetto.
 */
function generateMarvelHash(ts, privateKey, publicKey) {
return CryptoJS.MD5(ts + privateKey + publicKey).toString();
}

/**
 * Aggiorna il saldo crediti dell'utente nel localStorage
 * e, se presente, nel DOM.
 */
function updateCreditDisplay(newCreditValue) {
const currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;
if (!currentUser) return;

// Aggiorna nel JS locale
currentUser.numberCredits = newCreditValue;
localStorage.setItem("currentUser", JSON.stringify(currentUser));

// Se c'è un elemento HTML per mostrare i crediti, aggiornalo:
const creditElement = document.getElementById("credit-display");
if (creditElement) {
creditElement.textContent = `Crediti: ${newCreditValue}`;
}
}

/**
 * Salva l'array di figurine nel localStorage, così rimangono persistenti.
 */
function saveFigurines(userFigurines) {
localStorage.setItem("userFigurines", JSON.stringify(userFigurines));
}

/**
 * Carica le figurine salvate dal localStorage (o array vuoto se non esiste ancora).
 */
function loadFigurines() {
return JSON.parse(localStorage.getItem("userFigurines")) || [];
}

/**
 * Mostra a schermo le figurine contenute in figurinesArray.
 * Assicurati di avere un contenitore in HTML con id="figurines-container".
 */
function renderFigurines(figurinesArray) {
const container = document.getElementById("figurines-container");
if (!container) return;

// Pulisco prima il contenitore
container.innerHTML = "";

figurinesArray.forEach((figurina) => {
const card = document.createElement("div");
card.classList.add("figurine-card");
card.innerHTML = `
<img src="${figurina.thumbnailUrl}" alt="${figurina.name}" />
<h3>${figurina.name}</h3>
`;
container.appendChild(card);
});
}

/**
 * Funzione che prende un array di possibili figurine Marvel e ne estrae 5 casuali,
 * verificando che non vengano duplicati se l'utente le possiede già.
 */
function pickFiveRandomFigurines(allMarvelCharacters, userFigurines) {
const newFigurines = [];

// allMarvelCharacters può essere l'array di personaggi provenienti da Marvel
// Puoi anche incrociare i dati: id, nome, thumbnail, ecc.
while (newFigurines.length < 5) {
const randomIndex = Math.floor(Math.random() * allMarvelCharacters.length);
const candidate = allMarvelCharacters[randomIndex];

// Evita duplicati
const alreadyInUser = userFigurines.some((f) => f.id === candidate.id);
const alreadyInNewPack = newFigurines.some((f) => f.id === candidate.id);

if (!alreadyInUser && !alreadyInNewPack) {
newFigurines.push({
    id: candidate.id,
    name: candidate.name || "Senza nome",
    thumbnailUrl: `${candidate.thumbnail.path}.${candidate.thumbnail.extension}`,
});
}

// Se un utente ha già molte figurine e non troviamo 5 nuove,
// potresti uscire dal ciclo dopo un tot tentativi
}

return newFigurines;
}

/**
 * Funzione principale che esegue l'acquisto (costa 1 credito)
 * e aggiunge 5 figurine casuali provenienti dalla Marvel API.
 */
async function eseguiAcquisto(publicKey, privateKey) {
// Prima di tutto, otteniamo l'utente dal localStorage
const currentUser = JSON.parse(localStorage.getItem("currentUser"));
if (!currentUser) {
alert("Utente non loggato o sessione scaduta!");
return;
}

// Verifichiamo il saldo: il pacchetto costa 1 credito
if (currentUser.numberCredits < 1) {
alert("Crediti insufficienti. Non puoi acquistare un pacchetto.");
return;
}

// Scala 1 credito e aggiorna il display (e localStorage)
const newCreditValue = currentUser.numberCredits - 1;
updateCreditDisplay(newCreditValue);

try {
// Prepara i parametri per la chiamata Marvel
const ts = Date.now().toString();
const hash = generateMarvelHash(ts, privateKey, publicKey);

// Qui puoi modificare l'endpoint come preferisci,
// magari limitando i risultati per rendere la selezione più veloce
const marvelUrl = `https://gateway.marvel.com/v1/public/characters?limit=100&ts=${ts}&apikey=${publicKey}&hash=${hash}`;

// Chiamata fetch
const response = await fetch(marvelUrl);
if (!response.ok) {
throw new Error("Errore durante il fetch all'API Marvel");
}

const data = await response.json();
if (!data || !data.data || !data.data.results) {
throw new Error("La risposta della Marvel API non è valida");
}

// Otteniamo un array di personaggi Marvel
const marvelCharacters = data.data.results;
// Carica le figurine che già possiedo
const alreadyOwned = loadFigurines();
// Estrai 5 figurine esclusive
const fiveNewFigurines = pickFiveRandomFigurines(marvelCharacters, alreadyOwned);

// Aggiorna l'array principale in localStorage
const updatedFigurines = [...alreadyOwned, ...fiveNewFigurines];
saveFigurines(updatedFigurines);

// Mostra a schermo
renderFigurines(updatedFigurines);

alert("Hai acquistato un pacchetto di 5 figurine con successo!");

return "OK";
} catch (error) {
// In caso di errore, restituisci 1 credito
const rollbackCredit = currentUser.numberCredits + 1;
updateCreditDisplay(rollbackCredit);
alert("ERRORE: " + error.message);
return "FAIL";
}
}

// Esempio d'uso (puoi personalizzarlo in base al tuo HTML/form/elementi):
document.addEventListener("DOMContentLoaded", () => {
const buyPackBtn = document.getElementById("buy-pack-btn");
if (buyPackBtn) {
buyPackBtn.addEventListener("click", () => {
// Sostituisci con le tue chiavi Marvel
const publicKey = "9de281f5f58435133e7b0803bf2727a2";
const privateKey = "cf2a2657976eeb220c1a6a2a28e90100767bb137";
eseguiAcquisto(publicKey, privateKey);
});
}

// Carica e mostra subito eventuali figurine già salvate
const currentFigurines = loadFigurines();
renderFigurines(currentFigurines);

// Aggiorna anche i crediti nel display (se serve)
const currentUser = JSON.parse(localStorage.getItem("currentUser"));
if (currentUser) {
updateCreditDisplay(currentUser.numberCredits);
}
});