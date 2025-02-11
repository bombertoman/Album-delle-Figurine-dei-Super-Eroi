document.addEventListener('DOMContentLoaded', function() {
    const divDoppioni = document.getElementById("doppioni");
    const figurines = getCurrentUserItem("figurines");
    const doppioni = [];
    const nomiFigurineUnivoche = [];
    figurines.forEach(figurina => {
        if (nomiFigurineUnivoche.includes(figurina.name)){
            const doppioneTrovato = doppioni.some(doppione => {
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
    
})