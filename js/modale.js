window.addEventListener("load", () => {
const modal = document.getElementById("modale-acquistopack");
const btn = document.getElementById("btn-acquistopack");
const span = document.getElementsByClassName("close")[0];
const btnAcquista = document.getElementById("btn-acquista-figurine");

// Apertura modale
if (btn) {
    btn.onclick = () => {
    modal.style.display = "block";
    };
}

// Chiusura modale con icona X
if (span) {
    span.onclick = () => {
    modal.style.display = "none";
    };
}

// Chiusura modale cliccando sullo sfondo
window.onclick = (event) => {
    if (event.target === modal) {
    modal.style.display = "none";
    }
};

// Pulsante "Acquista" -> Chiama la nostra funzione separata in acquistapacchetti.js
if (btnAcquista) {
    btnAcquista.addEventListener("click", async function () {
    this.disabled = true;
    this.textContent = "Caricamento...";

    try {
        // Chiavi Marvel per la funzione che acquista le figurine
        const publicKey = "9de281f5f58435133e7b0803bf2727a2";
        const privateKey = "cf2a2657976eeb220c1a6a2a28e90100767bb137";

        // Invoca la funzione definita in acquistapacchetti.js
        // Assicurati che il file acquistapacchetti.js sia incluso PRIMA di questo file
        // e che window.acquistapacchetti.eseguiAcquisto sia definito
        const message = await acquistapacchetti.eseguiAcquisto(publicKey, privateKey);

        alert(message || "Acquisto completato!");
    } catch (error) {
        console.error("Errore acquisto:", error);
        alert(
        error.message.includes("Crediti")
            ? error.message
            : "Errore durante l'acquisto"
        );
    } finally {
        this.disabled = false;
        this.textContent = "Acquista Pacchetto";
    }
    });
}
});