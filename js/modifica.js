// Pre-Carica i dati utente nella pagina di modifica
window.addEventListener('load', function () {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        const user = JSON.parse(currentUser);
        document.getElementById('username').value = user.username || '';
        document.getElementById('email').value = user.email || '';
    } else {
        alert('Errore: nessun utente autenticato. Reindirizzamento al login.');
        window.location.href = '../html/login.html'; // Reindirizza al login nel caso in cui non abbia fatto l'accesso alcun utente
    }
});

// Gestione del salvataggio del profilo
document.getElementById('profile-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirm-password').value.trim();

    // Controlla che le password coincidano
    if (password && password !== confirmPassword) {
        alert('Le password non coincidono!');
        return;
    }

    // Recupera l'utente attuale
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        alert('Errore: nessun utente autenticato.');
        return;
    }

    const user = JSON.parse(currentUser);

    // Aggiorna i dati utente
    const updatedUser = {
        ...user, // Mantieni i dati esistenti
        username,
        email,
        password: password || user.password, // Mantieni la vecchia password se non modificata
    };

    // Salva i dati aggiornati nel localStorage
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));

    // Aggiorna la lista degli utenti
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(u => u.email === user.email);
    if (userIndex !== -1) {
        users[userIndex] = updatedUser; // Sovrascrive i nuovi dati dell'utente
        localStorage.setItem('users', JSON.stringify(users));
    }

    alert('Profilo aggiornato con successo!');
    window.location.href = '../html/login.html'; 
});