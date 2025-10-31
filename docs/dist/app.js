document.addEventListener('DOMContentLoaded', () => {
    // --- Elementi del DOM e stato dell'app ---
    const mainContent = document.querySelector('main');
    const navContainer = document.querySelector('.nav-container');
    const allNavItems = document.querySelectorAll('.nav-item');
    const moreMenuToggle = document.getElementById('more-menu-toggle');
    const moreMenuPanel = document.getElementById('more-menu-panel');
    let firebaseApp;
    let currentUser = null;

    // --- Overlay di caricamento ---
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

    // Inizia mostrando il caricamento
    showLoading('Inizializzazione di Firebase...');

    // --- Gestore Principale dello Stato (Router) ---
    window.addEventListener('auth-changed', ({ detail: { user } }) => {
        currentUser = user;
        hideLoading(); // Nascondi il caricamento non appena lo stato di auth è noto

        if (user) {
            // UTENTE AUTENTICATO
            console.log("Utente autenticato. Visualizzo l'app.");
            navContainer.style.display = ''; // Mostra la navigazione
            navigateToTab('agenda'); // Carica la dashboard di default
        } else {
            // UTENTE NON AUTENTICATO
            console.log("Nessun utente. Visualizzo la schermata di login.");
            navContainer.style.display = 'none'; // Nascondi la navigazione
            mainContent.innerHTML = `
                <div style="text-align: center; padding-top: 50px;">
                    <h2>Accesso Richiesto</h2>
                    <p>Per favore, effettua il login per usare l'applicazione.</p>
                    <p>Il pulsante di login si trova in alto a destra.</p>
                </div>
            `;
        }
    });

    // --- Navigazione ---
    window.navigateToTab = (tab) => {
        if (!tab || !currentUser) return; // Sicurezza: non navigare se l'utente non è loggato

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
            .then(response => response.ok ? response.text() : Promise.reject(`Pagina non trovata.`))
            .then(html => mainContent.innerHTML = html)
            .catch(error => mainContent.innerHTML = `<p>${error}</p>`);
    };

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

    // --- Inizializzazione ---
    window.addEventListener('firebase-ready', (e) => {
        firebaseApp = e.detail.firebaseApp;
        showLoading('Verifica autenticazione...');

        // Carica il modulo di autenticazione, che attiverà l'evento 'auth-changed'
        const authScript = document.createElement('script');
        authScript.src = 'js/auth.js';
        authScript.onload = () => window.setupAuth(firebaseApp);
        document.head.appendChild(authScript);
    });
});
