document.addEventListener("DOMContentLoaded", () => {
// Selezioniamo il pulsante che deve aprire la modale
// In album.html è il pulsante con id="btn-acquistopack"
const btnApriModale = document.getElementById("btn-acquistopack");

// Selezioniamo il pulsante che conferma l'acquisto nella modale
// In album.html è il pulsante con id="btn-acquista-figurine"
const btnConfermaAcquisto = document.getElementById("btn-acquista-figurine");

// Selezioniamo l'elemento modale
// In album.html è <div id="modale-acquistopack" class="modale">
const modaleAcquistopack = document.getElementById("modale-acquistopack");

// Selezioniamo l'elemento <span class="close"> per chiudere la modale
const closeSpan = modaleAcquistopack 
? modaleAcquistopack.querySelector(".close") 
: null;

// Se uno di questi non esiste, mostriamo un avviso
if (!btnApriModale) {
console.warn("Bottone 'btn-acquistopack' non trovato in HTML.");
}
if (!btnConfermaAcquisto) {
console.warn("Bottone 'btn-acquista-figurine' non trovato in HTML.");
}
if (!modaleAcquistopack) {
console.warn("Elemento 'modale-acquistopack' non trovato in HTML.");
}

// FUNZIONE PER APRIRE LA MODALE
function apriModale() {
if (!modaleAcquistopack) return;
modaleAcquistopack.style.display = "block"; 
}

// FUNZIONE PER CHIUDERE LA MODALE
function chiudiModale() {
if (!modaleAcquistopack) return;
modaleAcquistopack.style.display = "none"; 
}

// Quando clicco sul pulsante "Acquista pacchetti" (btnApriModale), apro la modale
if (btnApriModale) {
btnApriModale.addEventListener("click", () => {
apriModale();
});
}

// Quando clicco sullo span con class="close", chiudo la modale
if (closeSpan) {
closeSpan.addEventListener("click", () => {
chiudiModale();
});
}

// Chiude la modale se clicco fuori dal contenuto
window.addEventListener("click", (event) => {
if (event.target === modaleAcquistopack) {
chiudiModale();
}
});

// Quando clicco sul pulsante "Conferma Acquisto" dentro la modale
if (btnConfermaAcquisto) {
btnConfermaAcquisto.addEventListener("click", () => {
// Ad esempio richiamiamo la funzione "eseguiAcquisto" definita in gestionefigurine.js
// Sostituisci con le tue chiavi Marvel e la tua logica
if (typeof eseguiAcquisto === "function") {
    eseguiAcquisto("9de281f5f58435133e7b0803bf2727a2", "cf2a2657976eeb220c1a6a2a28e90100767bb137").then((result) => {
    if (result === "OK") {
        alert("Acquisto effettuato con successo!");
        chiudiModale();
    } else {
        alert("Errore durante l'acquisto del pacchetto!");
    }
    });
} else {
    console.warn("eseguiAcquisto() non è definita. Assicurati che gestionefigurine.js sia caricato.");
}
});
}
}
);