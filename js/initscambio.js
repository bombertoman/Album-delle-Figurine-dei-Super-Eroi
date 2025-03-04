const figurineClickHandler = card => {
    const modale = document.getElementById("modale-sceltauser"); 
    modale.dataset.name = card.dataset.name;
    modale.style.display = "block";
}
document.addEventListener ("DOMContentLoaded", function(){
    const users = JSON.parse(localStorage.getItem("users"));
    
    /*
    * --------------------------------------
    * Modale per proporre scambio
    * --------------------------------------
    */
    const modale = document.getElementById("modale-sceltauser"); 
    const closeSpan = modale ? modale.querySelector(".close") : null; 
    // X per chiudere la modale

    
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
        localStorage.setItem("users", JSON.stringify(users));
        chiudiModale();
        alert("La proposta di scambio è stata inviata all'utente inserito!");
    })

    /*
    * --------------------------------------
    * Caricamento dinamico scambi proposti
    * --------------------------------------
    */
    const divScambiProposti = document.getElementById("scambi-proposti");
    const scambiProposti = getCurrentUserItem("scambi"); //array con tutti gli scambi proposti dagli altri utenti a noi
    scambiProposti.forEach(proposta => {

        const nomeOfferenteScambio = proposta.offerenteScambio;
        const utenteOfferente = users.find(user => {
            return user.username === nomeOfferenteScambio;
        })
        const figurinaProposta = utenteOfferente.figurines.find(figurina => {
            return figurina.name === proposta.nomeFigurinaProposta;
        })
        visualizzaFigurina(figurinaProposta, divScambiProposti);
    });
})
