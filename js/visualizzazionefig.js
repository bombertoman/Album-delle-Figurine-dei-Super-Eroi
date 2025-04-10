//funzione per stampare una figurina in un div contenitore di figurine
//fig è l'oggetto della figurina, albumContainer è il div contenitore
const visualizzaFigurina = (fig, albumContainer) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.name = fig.name;
  
    const img = document.createElement("img");
    img.src = fig.image;
    img.alt = fig.name;
    img.classList.add("figurina-img");
  
    const name = document.createElement("p");
    name.textContent = fig.name;
    name.classList.add("figurina-name");
  
    // Sempre crea l'elemento per la descrizione.
    // Se la descrizione è vuota, utilizza il testo di fallback.
    const description = document.createElement("p");
    console.log(fig)
    description.textContent = fig.description.trim() !== "" ? fig.description : "Nessuna descrizione disponibile";
    description.classList.add("figurina-description");
  
    card.appendChild(img);
    card.appendChild(name);
    card.appendChild(description);
    albumContainer.appendChild(card);
    return card;
  }
