// album.js

const maxCredits = 1000;
const figurines = [
{ id: 1, name: "Figurina 1", image: "figurina1.png" },
{ id: 2, name: "Figurina 2", image: "figurina2.png" },
{ id: 3, name: "Figurina 3", image: "figurina3.png" },
// Aggiungi altre figurine qui
];

document.addEventListener("DOMContentLoaded", () => {
const currentUser = JSON.parse(localStorage.getItem("currentUser"));
if (!currentUser) {
alert("Devi effettuare il login!");
window.location.href = "login.html";
return;
}

// Mostra i crediti attuali
updateCreditsDisplay(currentUser.numberCredits);

// Carica le figurine salvate
loadFigurines();

document.querySelectorAll(".package-btn").forEach(btn => {
btn.addEventListener("click", (event) => {
    document.getElementById("custom-crediti").value = event.target.dataset.crediti;
});
});

document.getElementById("crediti-form").addEventListener("submit", (event) => {
event.preventDefault();
const crediti = parseInt(document.getElementById("custom-crediti").value);
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

currentUser.numberCredits += crediti;
localStorage.setItem("currentUser", JSON.stringify(currentUser));

// Aggiorna la visualizzazione dei crediti
updateCreditsDisplay(currentUser.numberCredits);

// Aggiungi 5 figurine casuali
addRandomFigurines(currentUser, 5);

alert(`${crediti} crediti acquistati con successo!`);
window.location.href = "album.html";
});
});

function updateCreditsDisplay(credits) {
const creditDisplay = document.getElementById("credit-display");
if (creditDisplay) {
creditDisplay.textContent = `Crediti: ${credits}`;
}
}

function saveFigurines(figurinesArray) {
localStorage.setItem("userFigurines", JSON.stringify(figurinesArray));
}

function loadFigurines() {
const userFigurines = JSON.parse(localStorage.getItem("userFigurines")) || [];
renderFigurines(userFigurines);
}

function renderFigurines(figurinesArray) {
const figurinesContainer = document.getElementById("figurines-container");
if (!figurinesContainer) return;

figurinesContainer.innerHTML = '';

figurinesArray.forEach(figurine => {
const figurineElement = document.createElement('div');
figurineElement.className = 'figurine-card';
figurineElement.innerHTML = `
    <img src="${figurine.image}" alt="${figurine.name}">
    <h3>${figurine.name}</h3>
`;
figurinesContainer.appendChild(figurineElement);
});
}

function addRandomFigurines(user,数量) {
const userFigurines = JSON.parse(localStorage.getItem("userFigurines")) || [];
const figurinesToAdd = [];

while (figurinesToAdd.length <数量) {
const randomFigurine = figurines[Math.floor(Math.random() * figurines.length)];
if (!userFigurines.some(f => f.id === randomFigurine.id) && 
    !figurinesToAdd.some(f => f.id === randomFigurine.id)) {
    figurinesToAdd.push(randomFigurine);
}
}

userFigurines.push(...figurinesToAdd);
saveFigurines(userFigurines);
renderFigurines(userFigurines);
}