/**********************
 * File: js/gestionefigurine.js
 * Descrizione: 
 *  - All'avvio della pagina, legge le figurine salvate nella chiave "figurines" e le visualizza.
 *  - All'acquisto del pacchetto, pusha le 5 nuove figurine ottenute dall'API nell'array già presente in "figurines".
 *  - currentUser viene usato per gestire dati utente (es. crediti) e, se eliminato (es. cancellazione account),
 *    si può decidere di eliminare anche le figurine.
 *  - Se invece si effettua solo il logout, currentUser non viene cancellato in toto e le figurine (chiave "figurines")
 *    rimangono persistenti per il prossimo login, garantendo che l'album non si resetti.
 **********************/

// Sostituisci con le tue chiavi API Marvel
const PUBLIC_KEY = "9de281f5f58435133e7b0803bf2727a2";
const PRIVATE_KEY = "cf2a2657976eeb220c1a6a2a28e90100767bb137";
function generateMarvelHash(ts, privateKey, publicKey) {
  return CryptoJS.MD5(ts + privateKey + publicKey).toString();
}
function aggiornaCreditiVisualizzati(crediti) {
  const creditiElem = document.querySelector(".ncrediti");
  if (creditiElem) {
    creditiElem.textContent = crediti.toString();
  }
}
/**
 * Funzione per salvare le nuove figurine in localStorage.
 * Utilizza la chiave separata "figurines" per mantenere l'album persistente anche al logout.
 * nuoveFigurine - Array contenente le 5 nuove figurine ottenute dall'API.
 */
function salvaFigurineLocalStorage(nuoveFigurine) {
  // Recupera l'array di figurine salvate dalla chiave separata "figurines"
  const savedFigurinesString = localStorage.getItem("figurines");
  let savedFigurines;
  
  if (savedFigurinesString) {
    try {
      savedFigurines = JSON.parse(savedFigurinesString);
    } catch (error) {
      console.error("Errore nel parsing delle figurine salvate:", error);
      savedFigurines = [];
    }
  } else {
    savedFigurines = [];
  }
  
  // Aggiunge le nuove figurine all'array esistente
  savedFigurines.push(...nuoveFigurine);
  
  // Salva l'array aggiornato nella chiave "figurines"
  localStorage.setItem("figurines", JSON.stringify(savedFigurines));
}
function aggiornaAlbum(figurine) {
  const albumContainer = document.getElementById("album");
  if (!albumContainer) {
    console.error("Elemento 'album' non trovato!");
    return;
  }
  
  // Pulisce il container dell'album
  albumContainer.innerHTML = "";
  
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
  
    // Sempre crea l'elemento per la descrizione.
    // Se la descrizione è vuota, utilizza il testo di fallback.
    const description = document.createElement("p");
    description.textContent = fig.description.trim() !== "" ? fig.description : "Nessuna descrizione disponibile";
    description.classList.add("figurina-description");
  
    card.appendChild(img);
    card.appendChild(name);
    card.appendChild(description);
    albumContainer.appendChild(card);
  });
}
/**
 * Funzione per caricare le figurine salvate dalla chiave "figurines" e visualizzarle nell'album.
 */
function caricaFigurineDallLocalStorage() {
  const savedFigurinesString = localStorage.getItem("figurines");
  if (!savedFigurinesString) return;
  
  try {
    const savedFigurines = JSON.parse(savedFigurinesString);
    if (Array.isArray(savedFigurines) && savedFigurines.length > 0) {
      aggiornaAlbum(savedFigurines);
    }
  } catch (error) {
    console.error("Errore nel parsing delle figurine durante il caricamento:", error);
  }
}
function getRandomIntInclusive(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
}

/**
 * Funzione per eseguire l'acquisto delle figurine.
 * Gestisce l'aggiornamento dei crediti in currentUser e il salvataggio delle nuove figurine
 * nella chiave "figurines"; l'album viene aggiornato per mostrare le nuove aggiunte.
 */
async function eseguiAcquisto() {
  // Recupera currentUser dal localStorage (usato per gestire i crediti e altri dati utente)
  const currentUserString = localStorage.getItem("currentUser");
  if (!currentUserString) {
    alert("Utente non trovato!");
    return;
  }
  const currentUser = JSON.parse(currentUserString);
  let crediti = currentUser.numberCredits;
  
  if (crediti < 1) {
    alert("Crediti insufficienti!");
    return;
  }
  
  const ts = new Date().getTime().toString();
  const hash = generateMarvelHash(ts, PRIVATE_KEY, PUBLIC_KEY);
  const limit = 92; // Limite scelto per la chiamata API
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
  
    // Seleziona 5 figurine casuali dalle 92 ottenute
    const figurines = [];
    for (let i = 0; i < 5; i++) {
      const figurineIndex = Math.floor(Math.random() * (limit - 1));
      figurines.push(responseJson.data.results[figurineIndex]);
    }
  
    const nuoveFigurine = figurines.map((character) => ({
      name: character.name,
      description: character.description,
      image: `${character.thumbnail.path}.${character.thumbnail.extension}`,
    }));
  
    // Aggiorna i crediti e salva in currentUser
    crediti -= 1; 
    aggiornaCreditiVisualizzati(crediti);
    currentUser.numberCredits = crediti;
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
  
    // Visualizza le nuove figurine nell'album e salvale nella chiave "figurines"
    aggiornaAlbum(nuoveFigurine);
    salvaFigurineLocalStorage(nuoveFigurine);
  
    alert("Acquisto completato con successo!");
  } catch (error) {
    console.error("Errore durante l'acquisto del pacchetto:", error);
    alert("Errore durante l'acquisto del pacchetto. Riprova più tardi.");
  }
}

// Al caricamento della pagina, carica e visualizza le figurine salvate (chiave "figurines")
document.addEventListener("DOMContentLoaded", function () {
  caricaFigurineDallLocalStorage();
});
  
