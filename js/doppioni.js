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
        const scambiProposti = getCurrentUserItem("scambi"); //preso gli scambi proposti
        const scambioAccettato = scambiProposti[indexScambioSelezionato]; //preso lo scambio proposto selezionato
        const nomeFigurinaDaRicevere = scambioAccettato.nomeFigurinaProposta; // preso il nome della figurina dello scambio proposto selezionato, cioè la fig. da ricevere (propone l'utente)
        const nomeFigurinaDaCedere = modaleConfermaScambio.dataset.name // preso il nome del doppione con cui scambiare (scelgo lato mio)
        const users = JSON.parse(localStorage.getItem("users"));
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
        console.log({...users}, {...figurineOfferente}); 
        const figurinaDaRicevere = figurineOfferente[indexFigurinaDaRicevere];
        figurines.push(figurinaDaRicevere); 
        const indexFigurinaDaCedere = figurines.findIndex(figurina => {
            return figurina.name === nomeFigurinaDaCedere;
        })
        const figurinaDaCedere = figurines[indexFigurinaDaCedere]; // ci siamo presi la figurina da cedere  
        figurines.splice(indexFigurinaDaCedere, 1); // rimuove dall'array la figurina da cedere
        setCurrentUserItem("figurines", figurines);
        figurineOfferente.splice(indexFigurinaDaRicevere, 1); // rimuove la figurina dall'offerente dello scambio
        figurineOfferente.push(figurinaDaCedere);
        console.log(users, figurineOfferente);
        
    })


})