const figurineClickHandler = card => {
    const modale = document.getElementById("modale-sceltauser"); 
    modale.dataset.name = card.dataset.name;
    modale.style.display = "block";
}
document.addEventListener ("DOMContentLoaded", function(){
    const modale = document.getElementById("modale-sceltauser"); 
    const closeSpan = modale ? modale.querySelector(".close") : null; 
    // X per chiudere la modale

    /**
     * Funzione per chiudere la modale
     */
    function chiudiModale() {
        if (modale) modale.style.display = "none";
    }
    // Quando clicco sulla "X", chiudo la modale
    if (closeSpan) {
        closeSpan.addEventListener("click", chiudiModale);
    }
    
    // Quando clicco fuori dalla modale, chiudo la modale
    window.addEventListener("click", (event) => {
        if (event.target === modale) {
            chiudiModale();
        }    
    });
    const button = document.getElementById("btn-proponi");
    button.addEventListener("click", event => {
        event.preventDefault();
        const users = JSON.parse(localStorage.getItem("users"));
        const usernameInput = document.getElementById("user-scambio");
        const userIndex = users.findIndex(user => {
            return user.username === usernameInput.value;
        });
        if (userIndex === -1) {
            alert ("Lo username digitato non è valido!");
            return;
        }
        if (!users[userIndex]?.scambi) {
            users[userIndex].scambi = [];
        }
        const nomeUtente = getCurrentUserItem("username");
        users[userIndex].scambi.push({
            nomeFigurinaProposta: modale.dataset.name, 
            offerenteScambio: nomeUtente
        });
        chiudiModale();
        alert("La proposta di scambio è stata inviata all'utente inserito!");
    })

})