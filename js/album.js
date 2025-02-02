window.addEventListener('load', () => {
// Supponiamo di aver salvato l’email dell’utente loggato in localStorage con chiave "loggedInEmail"
const loggedInEmail = localStorage.getItem('loggedInEmail');
if (!loggedInEmail) {
    alert("Nessun utente loggato.");
    // Potresti rimandare alla login: window.location.href = "login.html";
    return;
}

// Carica l’elenco utenti
let users = JSON.parse(localStorage.getItem("users")) || [];
// Trova l’utente loggato
let currentUser = users.find(u => u.email === loggedInEmail);

if (!currentUser) {
    alert("Utente inesistente. Fai login o registrati.");
    return;
}

// Se hai un .ncrediti per mostrare i crediti
const creditElem = document.querySelector(".ncrediti");
if (creditElem) {
    creditElem.textContent = currentUser.numberCredits.toString();
}

// Se hai un container #album per mostrare le figurine
const albumElem = document.getElementById("album");
if (albumElem) {
    aggiornaAlbum(currentUser.figurines);
}

// Se hai un bottone per “acquista figurine”
const btnAcquista = document.getElementById("btn-acquista-figurine");
if (btnAcquista) {
    btnAcquista.addEventListener("click", () => {
    acquistaFigurineRandom(5); // per esempio un pacchetto di 5
    });
}

/**
 * Aggiorna la UI dell’album con l’array di figurine
 */
function aggiornaAlbum(figurineList) {
    if (!albumElem) return;
    albumElem.innerHTML = "";

    figurineList.forEach(fig => {
    const card = document.createElement("div");
    card.className = "figurina-card";
    card.textContent = `Figurina: ${fig.name || "Senza nome"}`;
    albumElem.appendChild(card);
    });
}

/**
 * Simula l'acquisto di "count" figurine random
 * Sostituisci con la tua logica di fetch su Marvel, ad esempio
 */
function acquistaFigurineRandom(count) {
    if (currentUser.numberCredits < 1) {
    alert("Crediti insufficienti!");
    return;
    }
    // Decrementa i crediti
    currentUser.numberCredits -= 1;
    if (creditElem) {
    creditElem.textContent = currentUser.numberCredits.toString();
    }

    // Esempio: generiamo fittiziamente "count" figurine
    const newFigs = [];
    for (let i = 0; i < count; i++) {
    newFigs.push({ name: `Fig_${Math.floor(Math.random() * 1000)}` });
    }

    // Aggiungiamo le nuove figurine all’array di currentUser
    currentUser.figurines.push(...newFigs);

    // Salviamo l’utente aggiornato in localStorage
    salvaUtente(currentUser);

    // Ricarichiamo l’album
    aggiornaAlbum(currentUser.figurines);
}

/**
 * Salva l’utente aggiornato in localStorage, mantenendo gli altri utenti
 */
function salvaUtente(utenteAggiornato) {
    // Ricarica l’array users (per sicurezza)
    users = JSON.parse(localStorage.getItem("users")) || [];

    // Trova l'index dell'utente
    const idx = users.findIndex(u => u.email === utenteAggiornato.email);
    if (idx !== -1) {
    users[idx] = utenteAggiornato;  // aggiorna
    localStorage.setItem("users", JSON.stringify(users));
    }
}
});