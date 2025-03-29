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
        if (indexScambioSelezionato === null) {
            alert("Seleziona una figurina negli scambi in arrivo prima di procedere con lo scambio.");
            const modaleConfermaScambio = document.getElementById("modale-confermascambio");
            modaleConfermaScambio.style.display = "none";
            return;
        }
        const scambiProposti = getCurrentUserItem("scambi");
        console.log(scambiProposti[indexScambioSelezionato])
    })
})