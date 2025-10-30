
document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTI GLOBALI ---
    const mainContent = document.querySelector('main');
    const navItems = document.querySelectorAll('.nav-item');

    // --- VARIABILI GLOBALI (per i moduli) ---
    // Rendi queste variabili accessibili globalmente in modo che i moduli possano usarle.
    window.firebaseConfig = {};
    window.app = null;
    window.vertex = null;
    window.model = null;

    // --- FUNZIONI GLOBALI (per i moduli) ---
    window.loadData = (key, defaults) => {
        try {
            const dataJSON = localStorage.getItem(key);
            return dataJSON ? JSON.parse(dataJSON) : defaults;
        } catch {
            return defaults;
        }
    };

    window.saveData = (key, data) => {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (error) {
            console.error(`Errore durante il salvataggio dei dati per la chiave: ${key}`, error);
        }
    };
    
    window.navigateToTab = (tab) => {
        // Rimuovi 'active' da tutti gli item e aggiungilo a quello giusto
        document.querySelector('.nav-item.active')?.classList.remove('active');
        document.querySelector(`.nav-item[data-tab="${tab}"]`)?.classList.add('active');
        loadContent(tab);
    };

    // --- ROUTER PRINCIPALE ---
    const loadContent = (tab) => {
        fetch(`${tab}.html`)
            .then(response => {
                if (!response.ok) throw new Error(`Pagina ${tab}.html non trovata.`);
                return response.text();
            })
            .then(html => {
                mainContent.innerHTML = ''; // Pulisce il contenuto precedente
                const template = document.createElement('template');
                template.innerHTML = html;
                mainContent.appendChild(template.content.cloneNode(true));
                
                // Carica dinamicamente il modulo JS associato
                loadModule(tab);
            })
            .catch(error => {
                mainContent.innerHTML = `<h2>Pagina non trovata</h2><p>${error.message}</p>`;
            });
    };

    const loadModule = (tab) => {
        const scriptPath = `js/${tab}.js`;
        const scriptId = `module-${tab}`;

        // Non ricaricare lo script se è già presente
        if (document.getElementById(scriptId)) {
            runSetupFunction(tab);
            return;
        }

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
        // Converte 'classes' in 'setupClasses'
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

    // --- INIZIALIZZAZIONE FIREBASE E APP ---
    const initializeApp = () => {
        // Setup navigazione iniziale
        navItems.forEach(item => {
            item.addEventListener('click', () => navigateToTab(item.dataset.tab));
        });

        // Carica la tab iniziale (di default: agenda)
        const initialTab = 'agenda';
        document.querySelector(`.nav-item[data-tab="${initialTab}"]`).classList.add('active');
        loadContent(initialTab);
    };

    fetch('./firebase-config.json')
        .then(response => {
            if (!response.ok) throw new Error('firebase-config.json non trovato. L\'assistente AI sarà disabilitato.');
            return response.json();
        })
        .then(config => {
            window.firebaseConfig = config;
            window.app = firebase.initializeApp(window.firebaseConfig);
            window.vertex = firebase.vertexAI();
            window.model = window.vertex.getGenerativeModel({ model: "gemini-pro" });
            console.log("Firebase e Gemini inizializzati con successo.");
        })
        .catch(error => {
            console.error("Errore critico nell'inizializzazione di Firebase:", error.message);
        })
        .finally(() => {
            // L'app viene inizializzata indipendentemente dall'esito di Firebase
            initializeApp();
        });
});
