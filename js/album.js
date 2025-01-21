const currentUser = JSON.parse(localStorage.getItem("currentUser")); //recupero dei dati dell'utente
if (!currentUser) {
    alert("Devi essere registrato per accedere a questa pagina!");
    location.href = "login.html";
}