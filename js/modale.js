document.addEventListener("DOMContentLoaded", () => {
    const btnApriModale = document.getElementById("btn-acquistopack"); // Bottone per aprire la modale
    const btnConfermaAcquisto = document.getElementById("btn-acquista-figurine"); // Bottone per confermare acquisto
    const modaleAcquistopack = document.getElementById("modale-acquistopack"); // Div della modale
    const closeSpan = modaleAcquistopack
        ? modaleAcquistopack.querySelector(".close")
        : null; // X per chiudere la modale

    // Controlli di sicurezza per verificare che gli elementi esistano
    if (!btnApriModale)
        console.warn("Bottone 'btn-acquistopack' non trovato in HTML.");
    if (!btnConfermaAcquisto)
        console.warn("Bottone 'btn-acquista-figurine' non trovato in HTML.");
    if (!modaleAcquistopack)
        console.warn("Elemento 'modale-acquistopack' non trovato in HTML.");

    /**
     * Funzione per aprire la modale
     */
    function apriModale() {
        if (modaleAcquistopack) modaleAcquistopack.style.display = "block";
    }

    /**
     * Funzione per chiudere la modale
     */
    function chiudiModale() {
        if (modaleAcquistopack) modaleAcquistopack.style.display = "none";
    }

    // Quando clicco sul pulsante "Acquista Pacchetti", apro la modale
    if (btnApriModale) {
        btnApriModale.addEventListener("click", apriModale);
    }

    // Quando clicco sulla "X", chiudo la modale
    if (closeSpan) {
        closeSpan.addEventListener("click", chiudiModale);
    }

    // Quando clicco fuori dalla modale, chiudo la modale
    window.addEventListener("click", (event) => {
        if (event.target === modaleAcquistopack) {
            chiudiModale();
        }
    });

    // Quando clicco su "Conferma Acquisto" nella modale
    if (btnConfermaAcquisto) {
        btnConfermaAcquisto.addEventListener("click", async () => {
            try {
                // Verifica se la funzione eseguiAcquisto() esiste
                if (typeof eseguiAcquisto === "function") {
                    btnConfermaAcquisto.style.display = "none";
                    await eseguiAcquisto();
                    btnConfermaAcquisto.style.display = "block";
                    chiudiModale();
                } else {
                    console.warn(
                        "eseguiAcquisto() non è definita. Assicurati che gestionefigurine.js sia caricato."
                    );
                }
            } catch (error) {
                console.error("Errore durante l'acquisto:", error);
                alert("Errore durante l'acquisto del pacchetto!");
            }
        });
    }
});
