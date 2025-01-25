const maxCredits = 1000; //limite massimo crediti cumulabili
document.addEventListener("DOMContentLoaded", () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) {
        alert("Devi effettuare il login!");
        window.location.href = "login.html";
        return;
    }

    // Gestione click sui pacchetti predefiniti
    document.querySelectorAll("".package-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            // Imposta il valore personalizzato con il dato del pacchetto
            document.getElementById("custom-crediti").value = e.target.dataset.crediti;
        });
    });

    // Gestione acquisto
    document.getElementById("crediti-form").addEventListener("submit", (e) => {
        e.preventDefault();
        const crediti = parseInt(document.getElementById("custom-crediti").value);

    //controllo se è inserito un numero valido
        if (isNaN(crediti) || crediti <= 0) {
            alert("Inserisci un numero valido!");
            return;
        }
    //controllo limite massimo cr
        const newTotal = currentUser.numberCredits + crediti;
        if (newTotal > maxCredits) {
            alert("Superato il limite massimo di" ${maxCredits} "crediti!")
            return;
        }

        // Aggiorna i crediti dell'utente loggato
        currentUser.numberCredits += crediti;
        localStorage.setItem("currentUser", JSON.stringify(currentUser));

        // Aggiorna la lista globale degli utenti 
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const userIndex = users.findIndex(u => u.email === currentUser.email);
        if (userIndex !== -1) {
            users[userIndex].numberCredits = currentUser.numberCredits;
            localStorage.setItem("users", JSON.stringify(users));
        }

        alert(${crediti} "crediti acquistati con successo!");
        window.location.href = "album.html"; // Torna all'album
    });
});