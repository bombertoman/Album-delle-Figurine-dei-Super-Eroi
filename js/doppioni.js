document.addEventListener('DOMContentLoaded', function() {
    const divDoppioni = document.getElementById("doppioni");
    const figurines = getCurrentUserItem("figurines");
    const doppioni = [];
    const nomiFigurineUnivoche = [];
    figurines.forEach(figurina => {
        if (nomiFigurineUnivoche.includes(figurina.name)){
            const doppioneTrovato = doppioni.find(doppione => {
                return doppione.figurina.name === figurina.name;
            })
            if (doppioneTrovato) {
                doppioneTrovato.count = doppioneTrovato.count + 1;
                return; 
            }
            doppioni.push({count: 1, figurina: figurina});
            return;
        }
        nomiFigurineUnivoche.push(figurina.name); 
    });
    if (doppioni.length === 0){
        divDoppioni.textContent = "Non puoi effettuare gli scambi. Nessun doppione disponibile."
        return;
    }
    doppioni.forEach(doppione => {
        const card = visualizzaFigurina(doppione.figurina, divDoppioni);
        card.addEventListener("click", event => {
            if (indexScambioSelezionato === null) {
                figurineClickHandler(card, "modale-sceltauser");
                return;
            }
            figurineClickHandler(card, "modale-confermascambio");
        });
    })
    const buttonConfermaScambio = document.getElementById("btn-conferma");
    buttonConfermaScambio.addEventListener("click", event => {
        const modaleConfermaScambio = document.getElementById("modale-confermascambio");
        if (indexScambioSelezionato === null) {
            alert("Seleziona una figurina negli scambi in arrivo prima di procedere con lo scambio.");
            modaleConfermaScambio.style.display = "none";
            return;
        }
        const users = JSON.parse(localStorage.getItem("users"));
        const currentUser = users[getCurrentUserIndex()]; //prendiamo l'utente dalla variabile users che sarà usata per modificare entrambi gli utenti dello scambio
        const scambiProposti = currentUser.scambi; //preso gli scambi proposti
        const scambioAccettato = scambiProposti[indexScambioSelezionato]; //preso lo scambio proposto selezionato
        const nomeFigurinaDaRicevere = scambioAccettato.nomeFigurinaProposta; // preso il nome della figurina dello scambio proposto selezionato, cioè la fig. da ricevere (propone l'utente)
        const nomeFigurinaDaCedere = modaleConfermaScambio.dataset.name // preso il nome del doppione con cui scambiare (scelgo lato mio)
        const nomeOfferenteScambio = scambioAccettato.offerenteScambio;
        const offerenteUser = users.find(user => {
            return user.username === nomeOfferenteScambio    
        });
        if (offerenteUser === undefined) {
            alert("L'offerente dello scambio non è stato trovato");
            return;
        }
        const figurineOfferente = offerenteUser.figurines;
        const indexFigurinaDaRicevere = figurineOfferente.findIndex(figurina => {
            return figurina.name === nomeFigurinaDaRicevere;
        })
        const figurinaDaRicevere = figurineOfferente[indexFigurinaDaRicevere];
        const currentUserFigurines = currentUser.figurines
        currentUserFigurines.push(figurinaDaRicevere); 
        const indexFigurinaDaCedere = currentUserFigurines.findIndex(figurina => {
            return figurina.name === nomeFigurinaDaCedere;
        })
        const figurinaDaCedere = currentUserFigurines[indexFigurinaDaCedere]; // ci siamo presi la figurina da cedere  
        currentUserFigurines.splice(indexFigurinaDaCedere, 1); // rimuove dall'array la figurina da cedere

        figurineOfferente.splice(indexFigurinaDaRicevere, 1); // rimuove la figurina dall'offerente dello scambio
        figurineOfferente.push(figurinaDaCedere);
        scambiProposti.splice(indexScambioSelezionato, 1);
        localStorage.setItem("users", JSON.stringify(users));
        alert("Scambio avvenuto con successo");
        location.reload();

    })


})