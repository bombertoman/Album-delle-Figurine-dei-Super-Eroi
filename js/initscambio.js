const figurineClickHandler = card => {
    const modale = document.getElementById("modale-sceltauser"); 
    modale.dataset.name = card.dataset.name;
    modale.style.display = "block";
}
document.addEventListener ("DOMContentLoaded", function(){
    const modale = document.getElementById("modale-sceltauser"); 
    const closeSpan = modale ? modale.querySelector(".close") : null; 
    // X per chiudere la modale

    /**
     * Funzione per chiudere la modale
     */
    function chiudiModale() {
        if (modale) modale.style.display = "none";
    }
    // Quando clicco sulla "X", chiudo la modale
    if (closeSpan) {
        closeSpan.addEventListener("click", chiudiModale);
    }
    
    // Quando clicco fuori dalla modale, chiudo la modale
    window.addEventListener("click", (event) => {
        if (event.target === modale) {
            chiudiModale();
        }
    });
    

})