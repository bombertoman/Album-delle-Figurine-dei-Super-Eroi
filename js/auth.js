function logout() {
    localStorage.removeItem("currentUserIndex");
    location.href = "login.html";
}
function verificaAuth() {
    const currentUser = getCurrentUser(); //recupero dei dati dell'utente
    if (!currentUser) {
        alert("Devi essere registrato per accedere a questa pagina!");
        logout();
        return false;
    }
    return true;
}
verificaAuth();


//file da caricare su tutte le pagine che hanno bisogno del controllo dell'utente loggato e per fare funzionare il tasto logout con la funzione logout