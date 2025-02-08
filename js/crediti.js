const maxCredits = 1000; //limite massimo crediti cumulabili

document.addEventListener("DOMContentLoaded", () => {
    const auth = verificaAuth();
    if (!auth){
        return; //terminiamo la funzione in anticipo perchè l'utente non è loggato
    }
    // Correzione sintassi selector
    document.querySelectorAll(".package-btn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
        document.getElementById("custom-crediti").value =
            e.target.dataset.crediti;
        });
    });

    document.getElementById("crediti-form").addEventListener("submit", (e) => {
        e.preventDefault();
        const crediti = parseInt(document.getElementById("custom-crediti").value);

        if (isNaN(crediti) || crediti <= 0) {
            alert("Inserisci un numero valido!");
            return;
        }

        const newTotal = currentUser.numberCredits + crediti;

        // Correzione template literal (usa backticks ``)
        if (newTotal > maxCredits) {
            alert(`Superato il limite massimo di ${maxCredits} crediti!`);
            return;
        }

        setCurrentUserItem("numberCredits", newTotal);
        
        aggiornaCreditiVisualizzati(newTotal);
        alert(`${crediti} crediti acquistati con successo!`);
    });
});
