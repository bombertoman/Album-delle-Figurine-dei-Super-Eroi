window.addEventListener("load", () => {
    // Recupera la modale, il bottone di apertura e lo span di chiusura
    const modal = document.getElementById("modale-acquistopack");
    const btn = document.getElementById("btn-acquistopack");
    const span = document.getElementsByClassName("close")[0];

    // Apre la modale al click sul bottone
    btn.onclick = function () {
        modal.style.display = "block";
    };

    // Chiude la modale al click sullo span "x"
    span.onclick = function () {
        modal.style.display = "none";
    };

    // Chiude la modale se si clicca al di fuori del contenuto
    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    };

    // Aggiunge event listener al bottone di acquisto
    const btnAcquista = document.getElementById('btn-acquista-figurine');
    if (btnAcquista) {
        btnAcquista.addEventListener('click', function() {
            // Disabilita il bottone durante il caricamento
            this.disabled = true;
            this.textContent = 'Caricamento...';

            // Recupera le chiavi API
            const publicKey = '9de281f5f58435133e7b0803bf2727a2';
            const privateKey = 'cf2a2657976eeb220c1a6a2a28e90100767bb137';

            // Controllo dei crediti
            const creditiDisponibili = parseInt(document.querySelector('.ncrediti').textContent);
            
            if (creditiDisponibili >= 1) {
                // Sottrazione di 1 credito
                document.querySelector('.ncrediti').textContent = creditiDisponibili - 1;
                
                // Chiamata API con autenticazione
                fetch('https://gateway.marvel.com/v1/public/characters', {
                    headers: {
                        'Authorization': `Bearer ${publicKey}`,
                        'X-Private-Key': privateKey
                    }
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Errore nella richiesta');
                    }
                    return response.json();
                })
                .then(data => {
                    // Verifica che i dati siano validi
                    if (Array.isArray(data) && data.length > 0) {
                        // Aggiornamento dell'album con le nuove figurine
                        aggiornaAlbum(data);
                        alert('Acquisto effettuato con successo!');
                    } else {
                        throw new Error('Dati non validi ricevuti dall\'API');
                    }
                })
                .catch(error => {
                    console.error('Errore nel recupero delle figurine:', error);
                    alert('Si è verificato un errore durante l\'acquisto. Riprova più tardi.');
                })
                .finally(() => {
                    // Riabilita il bottone
                    btnAcquista.disabled = false;
                    btnAcquista.textContent = 'Acquista Pacchetto';
                });
            } else {
                alert('Non hai abbastanza crediti per acquistare un pacchetto!');
            }
        });
    }

    // Funzione per aggiornare l'album con le nuove figurine
    function aggiornaAlbum(figurine) {
        const album = document.getElementById('album');
        
        figurine.forEach(figurina => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <img src="${figurina.immagine}" alt="${figurina.nome}">
                <h3>${figurina.nome}</h3>
                <p>${figurina.descrizione}</p>
            `;
            album.appendChild(card);
        });
    }
});