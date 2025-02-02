window.addEventListener("load", () => {
    const modal = document.getElementById("modale-acquistopack");
    const btn = document.getElementById("btn-acquistopack");
    const span = document.getElementsByClassName("close")[0];
    const btnAcquista = document.getElementById("btn-acquista-figurine");

    // Open modal
    btn.onclick = () => {
        modal.style.display = "block";
    };

    // Close modal
    span.onclick = () => {
        modal.style.display = "none";
    };
    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    };

    /**
     * Generates the MD5 hash required by the Marvel API:
     * MD5(ts + privateKey + publicKey).
     * We rely on CryptoJS being globally available.
     */
    function generateMarvelHash(ts, privateKey, publicKey) {
        // Ensure crypto-js is loaded in your HTML:
        // <script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js"></script>
        // For example:
        return CryptoJS.MD5(ts + privateKey + publicKey).toString();
    }

    /**
     * Updates the album section with character cards from the Marvel API results.
     */
    function aggiornaAlbum(figurine) {
        const album = document.getElementById("album");
        album.innerHTML = ""; // Reset album content

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

    // Purchase management: remove any inline onclicks and rely on addEventListener
    if (btnAcquista) {
        btnAcquista.addEventListener("click", async function () {
            this.disabled = true;
            this.textContent = "Caricamento...";

            try {
                // Replace with your own keys:
                const publicKey = "9de281f5f58435133e7b0803bf2727a2"; 
                const privateKey = "cf2a2657976eeb220c1a6a2a28e90100767bb137"; 
                const ts = new Date().getTime().toString(); 
                const hash = generateMarvelHash(ts, privateKey, publicKey);

                const creditiElem = document.querySelector(".ncrediti");
                if (!creditiElem) {
                    throw new Error("Elemento '.ncrediti' non trovato!");
                }
                const crediti = parseInt(creditiElem.textContent, 10);
                if (crediti < 1) {
                    throw new Error("Crediti insufficienti");
                }

                // Deduct credit (in a production scenario, do this server-side)
                creditiElem.textContent = (crediti - 1).toString();

                // Fetch with required query parameters: ts, apikey, hash
                // Example: https://gateway.marvel.com/v1/public/characters?ts=1&apikey=1234&hash=ffd275c5130566a2916217b101f26150
                const marvelUrl = `https://gateway.marvel.com/v1/public/characters?ts=${ts}&apikey=${publicKey}&hash=${hash}`;
                const response = await fetch(marvelUrl);

                if (!response.ok) {
                    throw new Error("Errore API Marvel");
                }
                const data = await response.json();

                if (data?.data?.results?.length > 0) {
                    aggiornaAlbum(data.data.results);
                    alert("Acquisto completato!");
                } else {
                    throw new Error("Nessun personaggio trovato");
                }
            } catch (error) {
                console.error("Errore acquisto:", error);
                alert(error.message.includes("Crediti") ? error.message : "Errore durante l'acquisto");
            } finally {
                this.disabled = false;
                this.textContent = "Acquista Pacchetto";
            }
        });
    }
});