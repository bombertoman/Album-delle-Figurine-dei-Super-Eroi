/**********************
 * File: js/gestionefigurine.js
 * Descrizione: 
 *  - All'avvio della pagina, legge le figurine salvate nel localStorage e le visualizza.
 *  - All'acquisto del pacchetto, legge le figurine esistenti e ci "pusha" le 5 nuove figurine ottenute dall'API.
 *  - Aggiorna l'oggetto currentUser nel localStorage, mantenendo persistenti sia i dati dell'utente che le figurine.
 **********************/

// Sostituisci con le tue chiavi pubblica e privata dell'API Marvel
const PUBLIC_KEY = "9de281f5f58435133e7b0803bf2727a2";
const PRIVATE_KEY = "cf2a2657976eeb220c1a6a2a28e90100767bb137";

/**
 * Funzione per generare l'hash richiesto dall'API Marvel
 * @param {string} ts - Timestamp
 * @param {string} privateKey - Chiave privata
 * @param {string} publicKey - Chiave pubblica
 * @returns {string} - Hash MD5
 */
function generateMarvelHash(ts, privateKey, publicKey) {
  return CryptoJS.MD5(ts + privateKey + publicKey).toString();
}

/**
 * Funzione per aggiornare la visualizzazione dei crediti.
 * @param {number} crediti - Crediti rimanenti.
 */
function aggiornaCreditiVisualizzati(crediti) {
  const creditiElem = document.querySelector(".ncrediti");
  if (creditiElem) {
    creditiElem.textContent = crediti.toString();
  }
}

/**
 * Funzione per salvare le figurine nel localStorage.
 * Durante l'acquisto, si recupera currentUser dal localStorage,
 * si pushano le nuove 5 figurine nell'array esistente e si salva l'oggetto aggiornato.
 *
 * @param {Array} nuoveFigurine - Array contenente le 5 nuove figurine ottenute dall'API.
 */
function salvaFigurineLocalStorage(nuoveFigurine) {
  // Recupera la stringa JSON dell'utente dal localStorage
  const currentUserString = localStorage.getItem("currentUser");
  let currentUser;
  if (currentUserString) {
    try {
      currentUser = JSON.parse(currentUserString);
    } catch (error) {
      console.error("Errore nel parsing di currentUser:", error);
      currentUser = { figurines: [] };
    }
  } else {
    currentUser = { figurines: [] };
  }

  // Assicurati che la proprietà "figurines" sia un array
  if (!Array.isArray(currentUser.figurines)) {
    currentUser.figurines = [];
  }
  
  // Aggiungi le nuove figurine all'array già presente (pusha 5 elementi)
  currentUser.figurines.push(...nuoveFigurine);
  
  // Salva l'oggetto aggiornato nel localStorage
  localStorage.setItem("currentUser", JSON.stringify(currentUser));
}

/**
 * Funzione per aggiornare l'album nella pagina con le figurine salvate.
 * Prende spunto da come viene aggiornato il numero di crediti per scriverle in HTML.
 *
 * @param {Array} figurine - Array contenente le figurine da visualizzare.
 */
function aggiornaAlbum(figurine) {
  const albumContainer = document.getElementById("album");
  if (!albumContainer) {
    console.error("Elemento 'album' non trovato!");
    return;
  }
  
  // Prima pulisce il container
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
  
    card.appendChild(img);
    card.appendChild(name);
    albumContainer.appendChild(card);
  });
}

/**
 * Funzione per leggere le figurine salvate nel localStorage e visualizzarle.
 * Si ispira alle funzioni che leggono e scrivono il numero di crediti.
 */
function caricaFigurineDallLocalStorage() {
  const currentUserString = localStorage.getItem("currentUser");
  if (!currentUserString) return;
  
  try {
    const currentUser = JSON.parse(currentUserString);
    if (currentUser.figurines && currentUser.figurines.length > 0) {
      aggiornaAlbum(currentUser.figurines);
    }
  } catch (error) {
    console.error("Errore nel parsing di currentUser durante il caricamento delle figurine:", error);
  }
}

/**
 * Funzione per ottenere un intero casuale tra min e max (inclusi).
 * @param {number} min - Valore minimo.
 * @param {number} max - Valore massimo.
 * @returns {number} - Numero casuale.
 */
function getRandomIntInclusive(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
}

/**
 * Funzione per eseguire l'acquisto delle figurine.
 * Legge currentUser dal localStorage, controlla i crediti, ottiene 5 figurine dall'API Marvel,
 * aggiorna i crediti, push le nuove figurine nell'array preesistente e aggiorna l'album.
 */
async function eseguiAcquisto() {
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
  const limit = 92; // Limite scelto
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
    // Prende 5 figurine casuali dalle 92 ottenute
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
  
    // Aggiorna i crediti solo se la chiamata API ha successo
    crediti -= 1; 
    aggiornaCreditiVisualizzati(crediti);
    currentUser.numberCredits = crediti; 
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
  
    // Visualizza le nuove figurine nell'album e salva le 5 nuove figurine pushandole nell'array esistente nel localStorage
    aggiornaAlbum(nuoveFigurine);
    salvaFigurineLocalStorage(nuoveFigurine);
  
    alert("Acquisto completato con successo!");
  } catch (error) {
    console.error("Errore durante l'acquisto del pacchetto:", error);
    alert("Errore durante l'acquisto del pacchetto. Riprova più tardi.");
  }
}

// Al caricamento della pagina, carica e visualizza le figurine salvate in localStorage
document.addEventListener("DOMContentLoaded", function () {
  caricaFigurineDallLocalStorage();
});
  
/*******************
 * Fine file
 *******************/