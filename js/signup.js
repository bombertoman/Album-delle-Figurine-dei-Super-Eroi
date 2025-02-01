window.onload = function() {
    const signupForm = document.getElementById("signup-form");
    const backToLoginBtn = document.getElementById("back-to-login");

    // Controllo elementi esistenti
    if (!signupForm || !backToLoginBtn) {
        console.error("Uno o più elementi non trovati nel DOM.");
        return;
    }

    // Gestione del pulsante "Torna al Login"
    backToLoginBtn.addEventListener("click", function() {
        console.log("Pulsante 'Torna al Login' cliccato");
        window.location.href = "login.html"; // rimanda alla pagina di login
    });

    // Gestione della registrazione
    signupForm.addEventListener("submit", function(event) {
        event.preventDefault(); // Evita il ricaricamento della pagina

        const username = document.getElementById("signup-username").value.trim();
        const email = document.getElementById("signup-email").value.trim();
        const password = document.getElementById("signup-password").value.trim();

        // Recupera la lista degli utenti dal localStorage
        const users = JSON.parse(localStorage.getItem("users")) || [];
        try {
            // Controlla che tutti i campi siano popolati
            if (!username || !email || !password) {
                throw "Per favore, compila tutti i campi.";
            }

            // Controlla se l'utente esiste già (email unica)
            const userExists = users.some(user => user.email === email);
            if (userExists) {
                throw "Email già registrata. Prova a fare il login.";
            }

            // Controllo della password
            if (!isValidPassword(password)) {
                throw "La password deve essere lunga almeno 8 caratteri.";
            }

        } catch (errormsg) {
            alert(errormsg);
            return;
        }

        // Crea un nuovo utente
        const newUser = {
            username,
            email,
            password,
            numberCredits: 0, //inizializzato il numero dei crediti disponibili al signup
            figurines: [] //inzializziamo l'array vuoto che conterrà le figurine
        }

        // Aggiungi il nuovo utente alla lista
        users.push(newUser);

        // Salva la lista degli utenti aggiornata nel localStorage
        localStorage.setItem("users", JSON.stringify(users));

        alert("Registrazione avvenuta con successo!");
        window.location.href = "login.html"; // Reindirizza al login
    });
};

// Funzione per verificare la validità della password
function isValidPassword(password) {
    const minLength = 8;
    return password.length >= minLength;
}