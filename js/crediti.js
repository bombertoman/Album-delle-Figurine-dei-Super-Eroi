// crediti.js (aggiornato per evitare loop di reload)

const maxCredits = 1000;
const figurines = [
{ id: 1, name: "Figurina 1", image: "figurina1.png" },
{ id: 2, name: "Figurina 2", image: "figurina2.png" },
{ id: 3, name: "Figurina 3", image: "figurina3.png" },
// Aggiungi altre figurine qui se vuoi
];

document.addEventListener("DOMContentLoaded", () => {
const currentUser = JSON.parse(localStorage.getItem("currentUser"));
if (!currentUser) {
alert("Devi effettuare il login!");
// Se occorre, reindirizza alla pagina di login
window.location.href = "login.html";
return;
}

// Mostra i crediti attuali
updateCreditsDisplay(currentUser.numberCredits);

// Carica e renderizza eventuali figurine salvate
loadFigurines();

// Seleziona i bottoni per l'acquisto di crediti (package-btn)
// e imposta il valore nel campo input "custom-crediti"
document.querySelectorAll(".package-btn").forEach((btn) => {
btn.addEventListener("click", (event) => {
const customInput = document.getElementById("custom-crediti");
if (customInput) {
customInput.value = event.target.dataset.crediti;
}
});
});

// Gestisce il form di acquisto crediti
const creditiForm = document.getElementById("crediti-form");
if (creditiForm) {
creditiForm.addEventListener("submit", (event) => {
event.preventDefault();
acquistaCrediti();
});
}
});

/**
 * Funzione che gestisce l'acquisto di crediti.
 */
function acquistaCrediti() {
const creditiInput = document.getElementById("custom-crediti");
if (!creditiInput) {
alert("Campo 'custom-crediti' non trovato. Controlla l'HTML.");
return;
}

let crediti = parseInt(creditiInput.value);
const currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (isNaN(crediti) || crediti <= 0) {
alert("Inserisci un numero valido!");
return;
}

const newTotal = currentUser.numberCredits + crediti;

if (newTotal > maxCredits) {
alert(`Superato il limite massimo di ${maxCredits} crediti!`);
return;
}

// Aggiorna i crediti dell'utente
currentUser.numberCredits = newTotal;
localStorage.setItem("currentUser", JSON.stringify(currentUser));

// Aggiorna la visualizzazione
updateCreditsDisplay(currentUser.numberCredits);

// Aggiunge 5 figurine casuali all'acquisto di crediti
// Se NON vuoi questa logica, commenta la riga seguente.
addRandomFigurines(currentUser, 5);

alert(`${crediti} crediti acquistati con successo!`);

// Se ti TROVI già in album.html, evitiamo di ricaricare la pagina
// per non incorrere in possibili loop.
// Controlla se la pathname è "album.html" (o se preferisci, un includes).
if (!window.location.pathname.endsWith("album.html")) {
window.location.href = "album.html";
}
}

/**
 * Aggiorna la parte visibile (DOM) dei crediti.
 */
function updateCreditsDisplay(credits) {
const creditDisplay = document.getElementById("credit-display");
if (creditDisplay) {
creditDisplay.textContent = `Crediti: ${credits}`;
}
}

/**
 * Salva l'array di figurine sul localStorage.
 */
function saveFigurines(figurinesArray) {
localStorage.setItem("userFigurines", JSON.stringify(figurinesArray));
}

/**
 * Carica e rende su schermo le figurine dal localStorage.
 */
function loadFigurines() {
const userFigurines = JSON.parse(localStorage.getItem("userFigurines")) || [];
renderFigurines(userFigurines);
}

/**
 * Mostra a schermo le figurine in figurinesArray,
 * dentro un elemento con id="figurines-container".
 */
function renderFigurines(figurinesArray) {
const figurinesContainer = document.getElementById("figurines-container");
if (!figurinesContainer) return;

figurinesContainer.innerHTML = "";

figurinesArray.forEach((figurine) => {
const figurineElement = document.createElement("div");
figurineElement.className = "figurine-card";
figurineElement.innerHTML = `
<img src="${figurine.image}" alt="${figurine.name}">
<h3>${figurine.name}</h3>
`;
figurinesContainer.appendChild(figurineElement);
});
}

/**
 * Aggiunge 5 (o N) figurine casuali se non sono già in userFigurines.
 */
function addRandomFigurines(user, quantita) {
const userFigurines = JSON.parse(localStorage.getItem("userFigurines")) || [];
const figurinesToAdd = [];

while (figurinesToAdd.length < quantita) {
const randomFigurine = figurines[Math.floor(Math.random() * figurines.length)];
// Evita duplicati sia in userFigurines che in figurinesToAdd
const giaPresenteNellUtente = userFigurines.some((f) => f.id === randomFigurine.id);
const giaPresenteNelNuovoPack = figurinesToAdd.some((f) => f.id === randomFigurine.id);

if (!giaPresenteNellUtente && !giaPresenteNelNuovoPack) {
figurinesToAdd.push(randomFigurine);
}

// Se l'utente ha già molte figurine ed è impossibile trovarne 5 nuove,
// potresti decidere di uscire da questo ciclo dopo un tot di tentativi.
}

userFigurines.push(...figurinesToAdd);
saveFigurines(userFigurines);
renderFigurines(userFigurines);
}