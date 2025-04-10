const PUBLIC_KEY = "9de281f5f58435133e7b0803bf2727a2";
const PRIVATE_KEY = "cf2a2657976eeb220c1a6a2a28e90100767bb137";
function generateMarvelHash(ts, privateKey, publicKey) {
  return CryptoJS.MD5(ts + privateKey + publicKey).toString();
}
function getAuth(){
  const ts = new Date().getTime().toString();
  const hash = generateMarvelHash(ts, PRIVATE_KEY, PUBLIC_KEY);
  return `apikey=${PUBLIC_KEY}&ts=${ts}&hash=${hash}`;
}
function aggiornaAlbumInHtml(figurines) {
  const albumContainer = document.getElementById("album");
  if (!albumContainer) {
    console.error("Elemento 'album' non trovato!");
    return;
  }
  
  // Pulisce il container dell'album
  albumContainer.innerHTML = "";
  
  figurines.forEach(fig => visualizzaFigurina(fig, albumContainer));
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
  let crediti = parseInt(getCurrentUserItem("numberCredits"));
  
  if (crediti < 1) {
    alert("Crediti insufficienti!");
    return;
  }
  const limit = 92; // Limite scelto per la chiamata API
  const offset = getRandomIntInclusive(0, 16);
  const marvelUrl = `https://gateway.marvel.com/v1/public/characters?limit=${limit}&offset=${offset}&orderBy=modified&${getAuth()}`;
  
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
    const randomfigurines = [];
    for (let i = 0; i < 5; i++) {
      const figurineIndex = Math.floor(Math.random() * (limit - 1));
      randomfigurines.push(responseJson.data.results[figurineIndex]);
    }
    const figurines = getCurrentUserItem("figurines");
    const nuoveFigurine = randomfigurines.map(character => {
      const nuovaFigurina = {
        name: character.name,
        description: character.description,
        image: `${character.thumbnail.path}.${character.thumbnail.extension}`,
        comics: character.comics
      }
      figurines.push(nuovaFigurina);
      return nuovaFigurina;
    });
    for(let character of nuoveFigurine){
      const responseComics= await fetch(`${character.comics.collectionURI}?${getAuth()}`);
      if (!responseComics.ok) {
        throw new Error(`Errore API Marvel: ${responseComics.statusText}`);
      }
      const responseJsonComics = await responseComics.json();
      console.log(responseJsonComics);
    }
    // Aggiorna i crediti e salva in currentUser
    crediti -= 1; 
    aggiornaCreditiVisualizzati(crediti);
    setCurrentUserItem("numberCredits", crediti);
    // Visualizza le nuove figurine nell'album e salvale nella chiave "figurines"
    aggiornaAlbumInHtml(nuoveFigurine);
    setCurrentUserItem("figurines", figurines); 
    alert("Acquisto completato con successo!");
  } catch (error) {
    console.error("Errore durante l'acquisto del pacchetto:", error);
    alert("Errore durante l'acquisto del pacchetto. Riprova più tardi.");
  }
}
// Al caricamento della pagina, visualizza le figurine salvate (proprietà nell'oggetto alla chiave "currentUser")
document.addEventListener("DOMContentLoaded", function () {
  aggiornaAlbumInHtml(getCurrentUserItem("figurines"));
});
  
