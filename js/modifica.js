document.addEventListener('DOMContentLoaded', function () {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        alert('Errore: nessun utente autenticato. Reindirizzamento al login.');
        window.location.href = '../html/login.html';
        return;
    }

    const user = JSON.parse(currentUser);

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

        const updatedUser = {
            ...user,
            username: updatedUsername,
            email: updatedEmail,
            password: updatedPassword || user.password,
        };

        // Salva i dati aggiornati nel localStorage
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userIndex = users.findIndex(u => u.email === user.email);
        if (userIndex !== -1) {
            users[userIndex] = updatedUser;
            localStorage.setItem('users', JSON.stringify(users));
        }

        alert('Profilo aggiornato con successo!');
        window.location.href = '../html/login.html';
    });

    // Gestisce l'eliminazione dell'account
    document.getElementById('delete-account-btn').addEventListener('click', function () {
        if (confirm('Sei sicuro di voler eliminare il tuo account?')) {
            // Rimuove l'utente dalla lista degli utenti
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const updatedUsers = users.filter(u => u.email !== user.email);
            localStorage.setItem('users', JSON.stringify(updatedUsers));

            // Rimuove l'utente attualmente loggato
            localStorage.removeItem('currentUser');

            alert('Account eliminato con successo!');
            window.location.href = '../html/login.html'; // Reindirizza al login
        }
    });
});