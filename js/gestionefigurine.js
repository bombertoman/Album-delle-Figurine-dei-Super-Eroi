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
}

// Funzione per salvare le figurine nel localStorage
function salvaFigurineLocalStorage(nuoveFigurine) {
  const figurineSalvate = JSON.parse(localStorage.getItem("figurines")) || [];
  const tutteLeFigurine = figurines.nuoveFigurine;
  localStorage.setItem("figurines", JSON.stringify(tutteLeFigurine));
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
function getRandomIntInclusive(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
}
// Funzione per eseguire l'acquisto delle figurine
async function eseguiAcquisto() {
  const currentUserString = localStorage.getItem("currentUser");
  const currentUser = JSON.parse(currentUserString);
  let crediti = currentUser.numberCredits;
  if (crediti < 1) {
    alert("Crediti insufficienti!");
    return;
  }

  const ts = new Date().getTime().toString();
  const hash = generateMarvelHash(ts, PRIVATE_KEY, PUBLIC_KEY);
  const limit = 92; // Limite scelto affinchè sia divisibile per il totale delle figurine presenti nel db (1564)
  const offset = getRandomIntInclusive(0, 16);
  const marvelUrl = `https://gateway.marvel.com/v1/public/characters?limit=${limit}&ts=${ts}&apikey=${PUBLIC_KEY}&hash=${hash}&offset=${offset}&orderBy=modified`;

  try {
    const response = await fetch(marvelUrl);
    if (!response.ok) {
      throw new Error(`Errore API Marvel: ${response.statusText}`);
    }

    const responseJson = await response.json();
    if (!responseJson?.data?.results?.length) {
      throw new Error("Nessun personaggio trovato!");
    }
    //prendiamo 5 figurine casuali dalle 92 fetchate
    const figurines = [];
    for (let i = 0; i < 5; i++) {
      const figurineIndex = Math.floor(Math.random() * (limit - 1)); //numero casuale tra 0 e 91
      figurines.push(responseJson.data.results[figurineIndex]);
    }

    const nuoveFigurine = figurines.map((character) => ({
      name: character.name,
      description: character.description,
      image: `${character.thumbnail.path}.${character.thumbnail.extension}`,
    }));

    // Aggiorna i crediti solo se la chiamata API ha successo
    crediti -= 1; // crediti = crediti - 1
    aggiornaCreditiVisualizzati(crediti);
    currentUser.numberCredits = crediti; 
    localStorage.setItem("currentUser", JSON.stringify(currentUser) );
    // Aggiorna l'album e salva le figurine
    aggiornaAlbum(nuoveFigurine);
    salvaFigurineLocalStorage(nuoveFigurine);

    alert("Acquisto completato con successo!");
  } catch (error) {
    console.error("Errore durante l'acquisto del pacchetto:", error);
    alert("Errore durante l'acquisto del pacchetto. Riprova più tardi.");
  }
}
