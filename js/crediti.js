document.getElementById("crediti-form").addEventListener("submit", (event) => {
event.preventDefault();

const crediti = parseInt(document.getElementById("custom-crediti").value);
const currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (isNaN(crediti) || crediti <= 0) {
alert("Inserisci un numero valido!");
return;
}

const newTotal = currentUser.numberCredits + crediti;

if (newTotal > maxCredits) {
alert(`Superato il limite massimo di ${maxCredits} crediti!`);
return;
}

// Aggiorna i crediti dell'utente
currentUser.numberCredits += crediti;
localStorage.setItem("currentUser", JSON.stringify(currentUser));

// Aggiorna i crediti nella lista utenti
const users = JSON.parse(localStorage.getItem("users")) || [];
const userIndex = users.findIndex(u => u.email === currentUser.email);
if (userIndex !== -1) {
users[userIndex].numberCredits = currentUser.numberCredits;
localStorage.setItem("users", JSON.stringify(users));
}

alert(`${crediti} crediti acquistati con successo!`);

// Reindirizzamento con refresh della UI
window.location.href = "album.html";
});