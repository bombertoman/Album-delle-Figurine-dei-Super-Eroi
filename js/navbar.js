/* popolazione dinamica del numero dei crediti presente nella navbar */
window.onload = () => { 
    const currentUser = JSON.parse(localStorage.getItem("currentUser")); //recupero dei dati dell'utente corrente
    const numberCredits = currentUser.numberCredits // quanti crediti il currentUser ha a disposizione
    const divCrediti = document.getElementById("ncrediti"); //div che contiene il numero dei cr
    divCrediti.innerText = numberCredits

    //codice per rendere icona + interattiva con rimando all'acquisto
    const buyIcon = document.querySelector(".buy-icon");
    if (buyIcon) {
        buyIcon.addEventListener("click", () => {
            window.location.href = "crediti.html";
        })
    }
}