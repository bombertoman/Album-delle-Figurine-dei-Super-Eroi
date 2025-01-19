document.addEventListener('DOMContentLoaded', function () {
    // Recupero dati dell'utente loggato
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        alert('Errore: nessun utente autenticato. Reindirizzamento al login.');
        window.location.href = '../html/login.html';
        return;
    }

    const user = JSON.parse(currentUser);

    // campi precompilati (no pwd)
    const usernameField = document.getElementById('username');
    const emailField = document.getElementById('email');

    if (usernameField && emailField) {
        usernameField.value = user.username || '';
        emailField.value = user.email || '';
    } else {
        console.error('Uno o più elementi non trovati nel DOM.');
    }

    // salvataggio delle modifiche
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
            ...user, // tiene i dati esistenti
            username: updatedUsername,
            email: updatedEmail,
            password: updatedPassword || user.password, // tiene la password precedente se non è stata modifiata
        };

        // Salva i dati aggiornati nel localStorage
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));

        // Aggiorna l'elenco degli utenti
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userIndex = users.findIndex(u => u.email === user.email);
        if (userIndex !== -1) {
            users[userIndex] = updatedUser; // Aggiorna l'utente già esistente
            localStorage.setItem('users', JSON.stringify(users));
        }

        alert('Profilo aggiornato con successo!');
        window.location.href = '../html/login.html'; 
    });
});