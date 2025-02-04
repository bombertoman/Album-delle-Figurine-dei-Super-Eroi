const maxCredits = 1000; //limite massimo crediti cumulabili

document.addEventListener("DOMContentLoaded", () => {
const currentUser = JSON.parse(localStorage.getItem("currentUser"));
if (!currentUser) {
alert("Devi effettuare il login!");
window.location.href = "login.html";
return;
}

document.querySelectorAll(".package-btn").forEach(btn => {
btn.addEventListener("click", (event) => {
    document.getElementById("custom-crediti").value = event.target.dataset.crediti;
});
});

document.getElementById("crediti-form").addEventListener("submit", (event) => {
event.preventDefault(); // blocca il ricaricamento
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

currentUser.numberCredits += crediti;
localStorage.setItem("currentUser", JSON.stringify(currentUser));

const users = JSON.parse(localStorage.getItem("users")) || [];
const userIndex = users.findIndex(u => u.email === currentUser.email);
if (userIndex !== -1) {
    users[userIndex].numberCredits = currentUser.numberCredits;
    localStorage.setItem("users", JSON.stringify(users));
}

alert(`${crediti} crediti acquistati con successo!`);
window.location.href = "album.html";
});
});