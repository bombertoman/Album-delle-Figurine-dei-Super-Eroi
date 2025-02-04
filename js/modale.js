/**
 * Esempio di file “modale.js” che:
 * - Apre/chiude una modale per l'acquisto di pacchetti di figurine
 * - Richiama la funzionalità “eseguiAcquisto” definita in “gestionefigurine.js”
 * - Aggiorna il display di crediti e figurine di conseguenza
 */

document.addEventListener("DOMContentLoaded", () => {
// Seleziona i pulsanti/elementi necessari
const btnApriModale = document.getElementById("open-modal-btn");     // Bottone per aprire la modale
const btnChiudiModale = document.getElementById("close-modal-btn");  // Bottone/elemento per chiudere la modale
const btnConfermaAcquisto = document.getElementById("confirm-purchase-btn"); // Bottone per confermare l'acquisto
const modaleContainer = document.getElementById("modal-acquisto");   // Il contenitore della modale

// Se non trovi la modale o i pulsanti, interrompi qui (eventuali errori di ID)
if (!modaleContainer) {
console.warn("Elemento modale non trovato. Controlla l'ID in HTML.");
return;
}

// Apre la modale quando si clicca sul pulsante “Apri”
if (btnApriModale) {
btnApriModale.addEventListener("click", () => {
modaleContainer.style.display = "block";
});
}

// Chiude la modale quando si clicca su “Chiudi”
if (btnChiudiModale) {
btnChiudiModale.addEventListener("click", () => {
modaleContainer.style.display = "none";
});
}

// Se clicchiamo fuori dal contenuto della modale, chiudiamo
window.addEventListener("click", (event) => {
if (event.target === modaleContainer) {
modaleContainer.style.display = "none";
}
});

// Funzione di acquisto pacchetti: richiama la logica in “gestionefigurine.js”
async function acquistaPacchetti() {
try {
// Sostituisci con le tue chiavi Marvel
const publicKey = "LA_TUA_CHIAVE_PUBBLICA";
const privateKey = "LA_TUA_CHIAVE_PRIVATA";

// eseguiAcquisto è definita in “gestionefigurine.js”
// Assicurati che <script src="js/gestionefigurine.js"> appaia PRIMA di modale.js
// nel tuo HTML, così la funzione “eseguiAcquisto” è carica.
const result = await eseguiAcquisto(publicKey, privateKey);

if (result === "OK") {
    // Se non ci sono stati errori, puoi chiudere la modale o mostrare un messaggio
    alert("Acquisto riuscito!");
} else {
    alert("Qualcosa è andato storto nell'acquisto.");
}

// Chiudi la modale dopo l'acquisto
modaleContainer.style.display = "none";
} catch (err) {
console.error("Errore in acquistaPacchetti:", err);
alert("Errore durante l'acquisto del pacchetto di figurine.");
}
}

// Collegamento al click del pulsante “Conferma Acquisto” nella modale
if (btnConfermaAcquisto) {
btnConfermaAcquisto.addEventListener("click", () => {
acquistaPacchetti();
});
}
});