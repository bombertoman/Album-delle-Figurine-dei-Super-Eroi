window.addEventListener("load", () => {
    // Recupera la modale, il bottone di apertura e lo span di chiusura
    const modal = document.getElementById("modale-acquistopack");
    const btn = document.getElementById("btn-acquistopack");
    const span = document.getElementsByClassName("close")[0];

    // Apre la modale al click sul bottone
    btn.onclick = function () {
        modal.style.display = "block";
    };

    // Chiude la modale al click sullo span "x"
    span.onclick = function () {
        modal.style.display = "none";
    };

    // Chiude la modale se si clicca al di fuori del contenuto
    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    };
});