document.addEventListener('DOMContentLoaded', function () {
    // Carica i dati utente nella pagina di modifica
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        const user = JSON.parse(currentUser);
        const usernameField = document.getElementById('username');
        const emailField = document.getElementById('email');

        // Controlla che gli elementi esistano prima di usarli
        if (!usernameField || !emailField) {
            console.error('Uno o più elementi non trovati nel DOM.');
            return;
        }

        usernameField.value = user.username || '';
        emailField.value = user.email || '';
    } else {
        alert('Errore: nessun utente autenticato. Reindirizzamento al login.');
        window.location.href = '../html/login.html'; // Reindirizza al login
    }
});

// Gestione del salvataggio del profilo
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('profile-form').addEventListener('submit', function (event) {
        event.preventDefault();

        const username = document.getElementById('username').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();
        const confirmPassword = document.getElementById('confirm-password').value.trim();

        if (password && password !== confirmPassword) {
            alert('Le password non coincidono!');
            return;
        }

        const currentUser = localStorage.getItem('currentUser');
        if (!currentUser) {
            alert('Errore: nessun utente autenticato.');
            return;
        }

        const user = JSON.parse(currentUser);

        const updatedUser = {
            ...user,
            username,
            email,
            password: password || user.password,
        };

        // Salva i dati aggiornati
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
});