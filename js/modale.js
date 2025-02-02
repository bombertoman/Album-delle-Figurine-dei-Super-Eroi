window.addEventListener("load", () => {
    const modal = document.getElementById("modale-acquistopack");
    const btn = document.getElementById("btn-acquistopack");
    const span = document.getElementsByClassName("close")[0];
    const btnAcquista = document.getElementById('btn-acquista-figurine');

    // Apertura modale
    btn.onclick = () => modal.style.display = "block";

    // Chiusura modale
    span.onclick = () => modal.style.display = "none";
    window.onclick = (event) => event.target === modal && (modal.style.display = "none");

    // Gestione acquisto
    if (btnAcquista) {
        btnAcquista.addEventListener('click', async function() {
            this.disabled = true;
            this.textContent = 'Caricamento...';

            try {
                const publicKey = '9de281f5f58435133e7b0803bf2727a2';
                const privateKey = 'cf2a2657976eeb220c1a6a2a28e90100767bb137';
                const crediti = parseInt(document.querySelector('.ncrediti').textContent);

                if (crediti < 1) {
                    throw new Error('Crediti insufficienti');
                }

                // Aggiorna crediti
                document.querySelector('.ncrediti').textContent = crediti - 1;

                // Fetch API Marvel
                const response = await fetch('https://gateway.marvel.com/v1/public/characters', {
                    headers: {
                        'Authorization': `Bearer ${publicKey}`,
                        'X-Private-Key': privateKey
                    }
                });

                if (!response.ok) throw new Error('Errore API');
                const data = await response.json();

                if (data?.data?.results?.length > 0) {
                    aggiornaAlbum(data.data.results);
                    alert('Acquisto completato!');
                }
            } catch (error) {
                console.error('Errore acquisto:', error);
                alert(error.message.includes('Crediti') ? error.message : 'Errore durante l\'acquisto');
            } finally {
                this.disabled = false;
                this.textContent = 'Acquista Pacchetto';
            }
        });
    }

    function aggiornaAlbum(figurine) {
        const album = document.getElementById('album');
        album.innerHTML = ''; // Reset album

        figurine.forEach(({ thumbnail, name, description }) => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <img src="${thumbnail.path}.${thumbnail.extension}" alt="${name}">
                <h3>${name}</h3>
                <p>${description || 'Descrizione non disponibile'}</p>
            `;
            album.appendChild(card);
        });
    }
});