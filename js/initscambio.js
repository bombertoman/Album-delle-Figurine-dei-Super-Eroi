const figurineClickHandler = (card, nomeModale) => {
    const modale = document.getElementById(nomeModale); 
    modale.dataset.name = card.dataset.name;
    modale.style.display = "block";
}
let indexScambioSelezionato = null;


document.addEventListener ("DOMContentLoaded", function(){
    const users = JSON.parse(localStorage.getItem("users"));
    const modali = document.getElementsByClassName("modale"); 
    // X per chiudere la modale

    function chiudiModale(elementoModale) {
        elementoModale.style.display = "none";    
    }
    // Quando clicco sulla "X", chiudo la modale
    
    for (let i = 0; i<modali.length; i++) {
        const elementModale = modali[i];
        const closeSpan = elementModale.getElementsByClassName("close")[0];
        closeSpan.addEventListener("click", () => chiudiModale(elementModale));
    }
    // Quando clicco fuori dalla modale, chiudo la modale
    window.addEventListener("click", (event) => {
        if (event.target.classList.contains("modale")) {
            chiudiModale(event.target);
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
        const modale = document.getElementById("modale-sceltauser")
        const nomeUtente = getCurrentUserItem("username");
        users[userIndex].scambi.push({
            nomeFigurinaProposta: modale.dataset.name, 
            offerenteScambio: nomeUtente
        });
        localStorage.setItem("users", JSON.stringify(users));
        chiudiModale(modale);
        alert("La proposta di scambio è stata inviata all'utente inserito!");
    })

    /*
    * --------------------------------------
    * Caricamento dinamico scambi proposti
    * --------------------------------------
    */
    const divScambiProposti = document.getElementById("scambi-proposti");
    const scambiProposti = getCurrentUserItem("scambi"); //array con tutti gli scambi proposti dagli altri utenti a noi
    if (scambiProposti.length === 0){
        divScambiProposti.textContent = "Non sono presenti richieste di scambi da accettare."
        return;
    }
    scambiProposti.forEach((proposta, indexScambio) => {

        const nomeOfferenteScambio = proposta.offerenteScambio;
        const utenteOfferente = users.find(user => {
            return user.username === nomeOfferenteScambio;
        })
        const figurinaProposta = utenteOfferente.figurines.find(figurina => {
            return figurina.name === proposta.nomeFigurinaProposta;
        })
        const card = visualizzaFigurina(figurinaProposta, divScambiProposti);
        card.id = indexScambio;
        card.addEventListener("click", event => {
            if (indexScambioSelezionato !== null){
                const figurinaSelezionataInPrecedenza = document.getElementById(indexScambioSelezionato);
                figurinaSelezionataInPrecedenza.classList.remove("scambio-selezionato");
            } 

            //deselezione della figurina selezionata in precedenza se è stata cliccata di nuovo 
            if (indexScambioSelezionato === indexScambio){
                indexScambioSelezionato = null;
                return;
            }

            indexScambioSelezionato = indexScambio;
            card.classList.add("scambio-selezionato");
        });
    });
})
