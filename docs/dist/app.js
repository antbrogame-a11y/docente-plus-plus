
document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTI GLOBALI ---
    const mainContent = document.querySelector('main');
    const navItems = document.querySelectorAll('.nav-item');
    const loadingOverlay = document.createElement('div');

    // Stile per l'overlay di caricamento
    loadingOverlay.style.position = 'fixed';
    loadingOverlay.style.top = '0';
    loadingOverlay.style.left = '0';
    loadingOverlay.style.width = '100%';
    loadingOverlay.style.height = '100%';
    loadingOverlay.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
    loadingOverlay.style.display = 'flex';
    loadingOverlay.style.justifyContent = 'center';
    loadingOverlay.style.alignItems = 'center';
    loadingOverlay.style.zIndex = '1000';
    loadingOverlay.innerHTML = '<p style="font-size: 1.2em;">Caricamento in corso...</p>';
    document.body.appendChild(loadingOverlay);

    // --- FUNZIONI GLOBALI ---
    window.navigateToTab = (tab) => {
        document.querySelector('.nav-item.active')?.classList.remove('active');
        const newActiveTab = document.querySelector(`.nav-item[data-tab="${tab}"]`);
        if (newActiveTab) {
            newActiveTab.classList.add('active');
            loadContent(tab);
        }
    };

    // --- ROUTER PRINCIPALE ---
    const loadContent = (tab) => {
        fetch(`${tab}.html`)
            .then(response => {
                if (!response.ok) throw new Error(`Pagina ${tab}.html non trovata.`);
                return response.text();
            })
            .then(html => {
                mainContent.innerHTML = html;
                loadModule(tab);
            })
            .catch(error => {
                mainContent.innerHTML = `<h2>Pagina non trovata</h2><p>${error.message}</p>`;
            });
    };

    const loadModule = (tab) => {
        const scriptPath = `js/${tab}.js`;
        const scriptId = `module-${tab}`;

        // Rimuovi il vecchio script se esiste per forzare il ricaricamento
        const oldScript = document.getElementById(scriptId);
        if (oldScript) oldScript.remove();

        fetch(scriptPath, { method: 'HEAD' })
            .then(res => {
                if (res.ok) {
                    const script = document.createElement('script');
                    script.id = scriptId;
                    script.src = scriptPath;
                    script.onload = () => runSetupFunction(tab);
                    document.head.appendChild(script);
                } else {
                    console.warn(`Nessun modulo JS trovato per la tab: ${tab}`);
                }
            });
    };

    const runSetupFunction = (tab) => {
        const funcName = `setup${tab.charAt(0).toUpperCase() + tab.slice(1)}`;
        if (typeof window[funcName] === 'function') {
            try {
                window[funcName]();
            } catch (error) {
                console.error(`Errore durante l'esecuzione di ${funcName}():`, error);
            }
        } else {
            console.warn(`Funzione di setup ${funcName} non trovata.`);
        }
    };

    // --- GESTIONE CAMBIO AUTH E FIRESTORE ---
    const handleAuthChange = () => {
        console.log("Stato di autenticazione cambiato. Ricarico la vista corrente.");
        const currentTab = document.querySelector('.nav-item.active')?.dataset.tab || 'agenda';
        loadContent(currentTab);
        loadingOverlay.style.display = 'none'; // Nascondi l'overlay dopo il primo caricamento
    };
    
    // Event listener per ricaricare i dati quando l'utente effettua il login/logout
    window.addEventListener('auth-changed', handleAuthChange);
    // Event listener per segnalare che Firestore è pronto
    window.addEventListener('firestore-ready', () => {
        console.log("Firestore è pronto. L'app può procedere.");
        handleAuthChange(); // Ricarica la vista iniziale
    });

    // --- INIZIALIZZAZIONE APP ---
    const initializeApp = (firebaseApp) => {
        navItems.forEach(item => {
            item.addEventListener('click', () => window.navigateToTab(item.dataset.tab));
        });

        // Carica i moduli di autenticazione e Firestore
        const authScript = document.createElement('script');
        authScript.src = 'js/auth.js';
        authScript.onload = () => window.setupAuth(firebaseApp);
        document.head.appendChild(authScript);

        const firestoreScript = document.createElement('script');
        firestoreScript.src = 'js/firestore.js';
        document.head.appendChild(firestoreScript);
        
        const initialTab = 'agenda';
        document.querySelector(`.nav-item[data-tab="${initialTab}"]`).classList.add('active');
        // Il contenuto verrà caricato dall'evento 'auth-changed'
    };

    // --- INIZIALIZZAZIONE FIREBASE ---
    fetch('/firebase-config.json')
        .then(response => {
            if (!response.ok) throw new Error('firebase-config.json non trovato.');
            return response.json();
        })
        .then(config => {
            const firebaseApp = firebase.initializeApp(config);
            initializeApp(firebaseApp);
        })
        .catch(error => {
            console.error("Errore critico nell'inizializzazione di Firebase:", error.message);
            loadingOverlay.innerHTML = '<p style="color: red;">Errore di connessione. Impossibile caricare l\'app.</p>';
        });
});
