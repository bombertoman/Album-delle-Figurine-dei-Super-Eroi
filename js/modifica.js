document.addEventListener('DOMContentLoaded', function () {
    const auth = verificaAuth();
    if (!auth) {
        alert('Errore: nessun utente autenticato. Reindirizzamento al login.');
        window.location.href = '../html/login.html';
        return;
    }

    const user = getCurrentUser();

    // Precompila i campi del modulo
    const usernameField = document.getElementById('username');
    const emailField = document.getElementById('email');

    if (usernameField && emailField) {
        usernameField.value = user.username || '';
        emailField.value = user.email || '';
    } else {
        console.error('Uno o più elementi non trovati nel DOM.');
    }

    // Gestisce il salvataggio delle modifiche
    document.getElementById('profile-form').addEventListener('submit', function (event) {
        event.preventDefault();

        const updatedUsername = usernameField.value.trim();
        const updatedEmail = emailField.value.trim();
        const updatedPassword = document.getElementById('password').value.trim();
        const confirmPassword = document.getElementById('confirm-password').value.trim();

        if (updatedPassword && updatedPassword !== confirmPassword) {
            alert('Le password non coincidono!');
            return;
        }

        // Controllo della password
        if (!isValidPassword(updatedPassword)) {
            alert("La password deve essere lunga almeno 8 caratteri.");
            return;
        }

        const updatedUser = {
            ...user,
            username: updatedUsername,
            email: updatedEmail,
            password: updatedPassword || user.password,
        };

        // Salva i dati aggiornati nel localStorage
        updateCurrentUser(updatedUser);
        alert('Profilo aggiornato con successo!');
        window.location.href = '../html/login.html';
    });

    // Gestisce l'eliminazione dell'account
    document.getElementById('delete-account-btn').addEventListener('click', function () {
        if (confirm('Sei sicuro di voler eliminare il tuo account?')) {
            // Rimuove l'utente dalla lista degli utenti
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const currentUserIndex = getCurrentUserIndex();
            users.splice(currentUserIndex, 1);
            localStorage.setItem('users', JSON.stringify(users));

            // Rimuove l'utente attualmente loggato
            localStorage.removeItem('currentUserIndex');

            alert('Account eliminato con successo!');
            window.location.href = '../html/login.html'; // Reindirizza al login
        }
    });
});