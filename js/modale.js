var modal = document.getElementById("modale-acquistopack");
var btn = document.getElementById("btn-acquistopack");
var span = document.getElementsByClassName("close")[0];
// apre la modale al click
btn.onclick = function () {
    modal.style.display = "block";
};
// chiude la modale
span.onclick = function () {
    modal.style.display = "none";
};
// chiude la modale quando si clicca al di fuori del contenuto
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
};
