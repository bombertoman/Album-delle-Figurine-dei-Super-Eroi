document.getElementById('signup-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirm-password').value.trim();

    // Validazione base
    if (!username || !email || !password) {
        alert('Per favore, compila tutti i campi.');
        return;
    }

    // Validazione password
    if (!isValidPassword(password)) {
        alert('La password deve essere lunga almeno 8 caratteri e contenere almeno un numero.');
        return;
    }

    // Verifica che le password coincidano
    if (password !== confirmPassword) {
        alert('Le password non coincidono!');
        return;
    }

    // Recupera la lista degli utenti dal localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Controlla se l'email è già registrata
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
        alert('Esiste già un account con questa email.');
        return;
    }

    // Crea un nuovo utente
    const newUser = { username, email, password };

    // Aggiungi il nuovo utente alla lista
    users.push(newUser);

    // Salva la lista aggiornata nel localStorage
    localStorage.setItem('users', JSON.stringify(users));

    alert('Registrazione completata con successo!');
    window.location.href = 'login.html'; // Reindirizza alla pagina di login
});

// verificare la validità della password
function isValidPassword(password) {
    const minLength = 8;
    const hasNumber = /\d/; // Verifica se contiene almeno un numero
    return password.length >= minLength && hasNumber.test(password);
}