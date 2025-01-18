// Gestione della logica per la modifica del profilo

document.getElementById('profile-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirm-password').value.trim();

    // Controlla che le password coincidano, se sono state inserite
    if (password && password !== confirmPassword) {
        alert('Le password non coincidono!');
        return;
    }

    // Simulazione di invio dati al server
    console.log('Dati aggiornati:', { username, email, password });

    // Messaggio di successo
    alert('Profilo aggiornato con successo!');

    // Aggiungi qui la logica per inviare i dati al server (AJAX/Fetch API)
    // fetch('/update-profile', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify({ username, email, password })
    // }).then(response => {
    //     if (response.ok) {
    //         alert('Profilo aggiornato con successo!');
    //     } else {
    //         alert('Si è verificato un errore durante l'aggiornamento.');
    //     }
    // });
});
