/* popolazione dinamica del numero dei crediti presente nella navbar */
function aggiornaCreditiVisualizzati(crediti) {
    const creditiElem = document.querySelector(".ncrediti");
    if (creditiElem) {
        creditiElem.textContent = crediti.toString();
    }
}
console.log("caricamento js")
window.addEventListener("load", () => { 
    console.log("window.onload funziona")
    //prendiamo i crediti dell'utente e li scriviamo subito nella pagina
    const crediti = getCurrentUserItem("numberCredits");
    aggiornaCreditiVisualizzati(crediti);

    //codice per rendere icona + interattiva con rimando all'acquisto
    const buyIcon = document.querySelector(".buy-icon");
    if (buyIcon) {
        buyIcon.addEventListener("click", () => {
            window.location.href = "crediti.html";
        })
    }
})