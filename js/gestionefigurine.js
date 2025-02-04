// Sostituisci con le tue chiavi pubblica e privata dell'API Marvel
const PUBLIC_KEY = "9de281f5f58435133e7b0803bf2727a2";
const PRIVATE_KEY = "cf2a2657976eeb220c1a6a2a28e90100767bb137";

// Funzione per generare l'hash richiesto dall'API Marvel
function generateMarvelHash(ts, privateKey, publicKey) {
  return CryptoJS.MD5(ts + privateKey + publicKey).toString();
}

// Funzione per aggiornare la visualizzazione dei crediti
function aggiornaCreditiVisualizzati(crediti) {
  const creditiElem = document.querySelector(".ncrediti");
  if (creditiElem) {
    creditiElem.textContent = crediti.toString();
  }

  const creditiModaleElem = document.querySelector(".ncrediti-modale");
  if (creditiModaleElem) {
    creditiModaleElem.textContent = crediti.toString();
  }
}

// Funzione per salvare le figurine nel localStorage
function salvaFigurineLocalStorage(nuoveFigurine) {
  const figurineSalvate = JSON.parse(localStorage.getItem("figurine")) || [];
  const tutteLeFigurine = [...figurineSalvate, ...nuoveFigurine];
  localStorage.setItem("figurine", JSON.stringify(tutteLeFigurine));
}

// Funzione per aggiornare l'album con le nuove figurine
function aggiornaAlbum(figurine) {
  const albumContainer = document.getElementById("album");
  if (!albumContainer) {
    console.error("Elemento 'album' non trovato!");
    return;
  }

  figurine.forEach((fig) => {
    const card = document.createElement("div");
    card.classList.add("card");

    const img = document.createElement("img");
    img.src = fig.image;
    img.alt = fig.name;
    img.classList.add("figurina-img");

    const name = document.createElement("p");
    name.textContent = fig.name;
    name.classList.add("figurina-name");

    card.appendChild(img);
    card.appendChild(name);
    albumContainer.appendChild(card);
  });
}

// Funzione per eseguire l'acquisto delle figurine
async function eseguiAcquisto() {
  const creditiElem = document.querySelector(".ncrediti");
  if (!creditiElem) {
    alert("Errore: elemento crediti non trovato!");
    return;
  }

  let crediti = parseInt(creditiElem.textContent, 10);
  if (crediti < 1) {
    alert("Crediti insufficienti!");
    return;
  }

  const ts = new Date().getTime().toString();
  const hash = generateMarvelHash(ts, PRIVATE_KEY, PUBLIC_KEY);
  const marvelUrl = `https://gateway.marvel.com/v1/public/characters?limit=5&ts=${ts}&apikey=${PUBLIC_KEY}&hash=${hash}`;

  try {
    const response = await fetch(marvelUrl);
    if (!response.ok) {
      throw new Error(`Errore API Marvel: ${response.statusText}`);
    }

    const data = await response.json();
    if (!data?.data?.results?.length) {
      throw new Error("Nessun personaggio trovato!");
    }
    console.log(data) 
    // Filtra i personaggi per ottenere solo quelli che hanno un'immagine

    const nuoveFigurine = data.data.results.map((character) => ({
      name: character.name,
      image: `${character.thumbnail.path}.${character.thumbnail.extension}`,
    }));

    // Aggiorna i crediti solo se la chiamata API ha successo
    crediti -= 1;
    aggiornaCreditiVisualizzati(crediti);

    // Aggiorna l'album e salva le figurine
    aggiornaAlbum(nuoveFigurine);
    salvaFigurineLocalStorage(nuoveFigurine);

    alert("Acquisto completato con successo!");
  } catch (error) {
    console.error("Errore durante l'acquisto del pacchetto:", error);
    alert("Errore durante l'acquisto del pacchetto. Riprova più tardi.");
  }
}
