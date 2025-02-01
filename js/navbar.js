/* popolazione dinamica del numero dei crediti presente nella navbar */
console.log("caricamento js")
window.addEventListener("load", () => { 
    console.log("window.onload funziona")
    const currentUser = JSON.parse(localStorage.getItem("currentUser")); //recupero dei dati dell'utente corrente
    const numberCredits = currentUser.numberCredits // quanti crediti il currentUser ha a disposizione
    const divCrediti = document.getElementsByClassName("ncrediti"); //div che contiene il numero dei cr
    divCrediti.forEach(element => {
        element.innerText = numberCredits     
    });
    
    //codice per rendere icona + interattiva con rimando all'acquisto
    const buyIcon = document.querySelector(".buy-icon");
    if (buyIcon) {
        buyIcon.addEventListener("click", () => {
            window.location.href = "crediti.html";
        })
    }
})