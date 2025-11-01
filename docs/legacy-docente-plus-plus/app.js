
// --- Elementi del DOM e stato globale ---
const mainContent = document.querySelector('main');
const navContainer = document.querySelector('.nav-container');
const allNavItems = document.querySelectorAll('.nav-item');
const moreMenuToggle = document.getElementById('more-menu-toggle');
const moreMenuPanel = document.getElementById('more-menu-panel');
let currentUser = null;

// --- Overlay di Caricamento ---
const loadingOverlay = document.createElement('div');
Object.assign(loadingOverlay.style, {
    position: 'fixed', top: '0', left: '0', width: '100%', height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)', display: 'flex', justifyContent: 'center',
    alignItems: 'center', zIndex: '1000', transition: 'opacity 0.3s'
});
const showLoading = (message) => {
    loadingOverlay.innerHTML = `<p style="font-size: 1.2em; color: #333;">${message}</p>`;
    document.body.appendChild(loadingOverlay);
};
const hideLoading = () => {
    loadingOverlay.style.opacity = '0';
    setTimeout(() => {
        if (loadingOverlay.parentNode) {
            loadingOverlay.parentNode.removeChild(loadingOverlay);
        }
    }, 300);
};

// --- Gestore di Stato Autenticazione (Router Principale) ---
window.addEventListener('auth-changed', ({ detail: { user } }) => {
    currentUser = user;
    hideLoading(); // Nascondi overlay non appena lo stato auth è noto

    if (user) {
        console.log("Utente autenticato. Avvio dell'app...");
        navContainer.style.display = ''; // Mostra la navigazione
        navigateToTab('agenda'); // Carica la dashboard come default
    } else {
        console.log("Nessun utente. Visualizzo schermata di login.");
        navContainer.style.display = 'none'; // Nascondi navigazione
        mainContent.innerHTML = `
            <div style="text-align: center; padding-top: 50px;">
                <h2>Accesso Richiesto</h2>
                <p>Per favore, effettua il login per usare l'applicazione.</p>
            </div>
        `;
    }
});

// --- Logica di Navigazione --- 
window.navigateToTab = (tab) => {
    if (!tab) return;
    if (!currentUser) {
        console.warn("Tentativo di navigazione senza autenticazione. Bloccato.");
        return;
    }

    allNavItems.forEach(item => item.classList.remove('active'));
    moreMenuToggle.classList.remove('active');

    const newActiveTab = document.querySelector(`.nav-item[data-tab="${tab}"]`);
    if (newActiveTab) {
        newActiveTab.classList.add('active');
        if (moreMenuPanel.contains(newActiveTab)) {
            moreMenuToggle.classList.add('active');
        }
        loadContent(tab);
    }
    if (moreMenuPanel) moreMenuPanel.classList.remove('active');
};

const loadContent = (tab) => {
    fetch(`${tab}.html`)
        .then(response => {
            if (!response.ok) throw new Error(`Pagina non trovata: ${tab}.html`);
            return response.text();
        })
        .then(html => {
            mainContent.innerHTML = html;
            // Esegui gli script presenti nel contenuto caricato
            const scripts = mainContent.querySelectorAll("script");
            scripts.forEach(script => {
                const newScript = document.createElement("script");
                if (script.src) {
                    newScript.src = script.src;
                    newScript.onerror = () => console.error(`Errore nel caricamento dello script: ${script.src}`);
                } else {
                    newScript.textContent = script.textContent;
                }
                document.head.appendChild(newScript).parentNode.removeChild(newScript);
            });
        })
        .catch(error => {
            console.error("Errore nel caricamento dei contenuti:", error);
            mainContent.innerHTML = `<p style="color: red; text-align: center;">${error.message}</p>`;
        });
};

// Associa gli eventi di navigazione
allNavItems.forEach(item => {
    if (item.id !== 'more-menu-toggle') {
        item.addEventListener('click', () => navigateToTab(item.dataset.tab));
    }
});
moreMenuToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    moreMenuPanel.classList.toggle('active');
});
window.addEventListener('click', () => moreMenuPanel.classList.remove('active'));

// --- INIZIALIZZAZIONE DELL'APP ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM completamente caricato. Inizializzo l'app.");
    showLoading('Verifica autenticazione...');

    // Poiché auth.js è caricato da index.html prima di questo script,
    // possiamo chiamare direttamente la funzione di setup.
    try {
        if (window.setupAuth && firebase.app()) {
            console.log("SetupAuth e Firebase pronti. Configuro l'autenticazione.");
            window.setupAuth(firebase.app());
        } else {
            throw new Error("Funzione setupAuth o app Firebase non trovate!");
        }
    } catch (error) {
        console.error("Errore critico durante l'impostazione dell'autenticazione:", error);
        hideLoading();
        mainContent.innerHTML = '<p style="color: red; text-align: center;">Errore critico: modulo di autenticazione corrotto o mancante.</p>';
    }
});
