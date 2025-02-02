return CryptoJS.MD5(ts + privateKey + publicKey).toString();
}

// Aggiorna l’elemento #album con le figurine
function aggiornaAlbum(figurine) {
const album = document.getElementById("album");
if (!album) return;

// Svuota il contenuto precedente
album.innerHTML = "";

// Costruisce le card
figurine.forEach(({ thumbnail, name, description }) => {
const card = document.createElement("div");
card.className = "card";
card.innerHTML = `
    <img src="${thumbnail.path}.${thumbnail.extension}" alt="${name}">
    <h3>${name}</h3>
    <p>${description || "Descrizione non disponibile"}</p>
    `;
album.appendChild(card);
});
}
async function eseguiAcquisto(publicKey, privateKey) {
// Trova i crediti
const creditiElem = document.querySelector(".ncrediti");
if (!creditiElem) {
throw new Error("Elemento '.ncrediti' non trovato!");
}
let crediti = parseInt(creditiElem.textContent, 10);
if (crediti < 1) {
throw new Error("Crediti insufficienti");
}

// Riduci di 1 nel client (in un'app vera, dovresti farlo sul server)
crediti -= 1;
creditiElem.textContent = crediti.toString();

// Preparazione parametri Marvel
const ts = new Date().getTime().toString();
const hash = generateMarvelHash(ts, privateKey, publicKey);
const marvelUrl = `https://gateway.marvel.com/v1/public/characters?ts=${ts}&apikey=${publicKey}&hash=${hash}`;

// Fetch
const response = await fetch(marvelUrl);
if (!response.ok) {
// Se errore, ripristina i crediti
crediti += 1;
creditiElem.textContent = crediti.toString();
throw new Error("Errore API Marvel");
}

const data = await response.json();

if (data?.data?.results?.length > 0) {
aggiornaAlbum(data.data.results);
return "Acquisto completato!";
} else {
// ripristina i crediti
crediti += 1;
creditiElem.textContent = crediti.toString();
throw new Error("Nessun personaggio trovato");
}
}

// Esporta in modo che modale.js possa usare la logica
window.acquistapacchetti = {
eseguiAcquisto,
};
