function acquistaFigurineRandom(count) {
if (currentUser.numberCredits < 1) {
alert("Crediti insufficienti!");
return;
}

// Deduzione crediti prima dell'acquisto
currentUser.numberCredits -= 1;

// Sincronizzazione immediata con l'interfaccia
if (creditElem) {
creditElem.textContent = currentUser.numberCredits.toString();
}

// Simuliamo l'acquisto delle figurine
const newFigs = [];
for (let i = 0; i < count; i++) {
newFigs.push({ name: `Fig_${Math.floor(Math.random() * 1000)}` });
}

currentUser.figurines.push(...newFigs);

// Salva l'utente aggiornato nel localStorage
salvaUtente(currentUser);
aggiornaAlbum(currentUser.figurines);
}