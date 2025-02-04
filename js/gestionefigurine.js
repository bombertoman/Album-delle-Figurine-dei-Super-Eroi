window.addEventListener("load", init);

function init() {
// Initialize figurine management
loadFigurine();
}

function saveCrediti(crediti) {
localStorage.setItem("creditCount", crediti.toString());
}

function loadFigurine() {
const savedFigurine = localStorage.getItem("figurineCollection");
if (savedFigurine) {
const figurineData = JSON.parse(savedFigurine);
return figurineData;
}
// Return default data if none saved
return {
collection: [],
creditCount: 100
};
}

function acquistapacchetti() {
const currentData = loadFigurine();

if (currentData.creditCount < 10) {
alert("Non hai abbastanza crediti per acquistare un pacchetto!");
return;
}

// Deduct credits
const newCreditCount = currentData.creditCount - 10;
saveCrediti(newCreditCount);

// Generate random figurine pack
const pack = generateRandomPack();
currentData.collection.push(...pack);

// Save updated collection
localStorage.setItem("figurineCollection", JSON.stringify(currentData));

alert("Hai acquistato un pacchetto! Le tue figurine sono state aggiunte alla collezione.");
}

function generateRandomPack() {
const availableFigurines = [
{ id: 1, name: "Superman", rarity: "Comune" },
{ id: 2, name: "Batman", rarity: "Comune" },
{ id: 3, name: "Spiderman", rarity: "Rara" },
{ id: 4, name: "Iron Man", rarity: "Epica" },
{ id: 5, name: "Wonder Woman", rarity: "Leggendaria" }
];

// Generate 5 random figurines
return Array.from({ length: 5 }, () => {
const randomIndex = Math.floor(Math.random() * availableFigurines.length);
return availableFigurines[randomIndex];
});
}