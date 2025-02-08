window.onload = function() {
    const loginForm = document.getElementById("login-form");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const signupBtn = document.getElementById("signup-btn");

    // Controllo elementi esistenti
    if (!loginForm || !emailInput || !passwordInput || !signupBtn) {
        console.error("Uno o più elementi non trovati nel DOM.");
        return;
    }

    // Gestione del pulsante "Crea nuovo account"
    signupBtn.addEventListener("click", function() {
        console.log("Pulsante 'Crea nuovo account' cliccato");
        window.location.href = "signup.html"; // Cambia il percorso
    });

    // Gestione del login
    loginForm.addEventListener("submit", function(event) {
        event.preventDefault(); // Evita il ricaricamento della pagina

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        // Validazione 
        if (!email || !password) {
            alert("Per favore inserisci tutti i campi.");
            return;
        }

        try {
            // try-catch per gestire errori durante il recupero dei dati in local storage
            // Recupera la lista degli utenti dal localStorage
            const users = JSON.parse(localStorage.getItem("users")) || [];
            console.log(users);
            // Controlla se esiste un utente con email e password corrispondenti
            const userIndex = users.findIndex(user => user.email === email && user.password === password);

            if (userIndex) {
                const user = users[userIndex];
                alert(`Benvenuto, ${user.username}!`);
                // Salva l'utente attivo nel localStorage
                localStorage.setItem("currentUserIndex", userIndex);
                window.location.href = "album.html";
            } else {
                alert("Credenziali non valide.");
            }
        } catch (error) {
            console.error("Errore durante il login:", error);
            alert("Si è verificato un problema. Per favore riprova.");
        }
    });
};