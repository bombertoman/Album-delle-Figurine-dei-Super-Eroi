const currentUser = JSON.parse(localStorage.getItem("currentUser")); //recupero dei dati dell'utente
if (!currentUser) {
    alert("Devi essere registrato per accedere a questa pagina!");
    location.href = "login.html";
}

function logout() {
    localStorage.removeItem("currentUser");
    location.href = "login.html";
}