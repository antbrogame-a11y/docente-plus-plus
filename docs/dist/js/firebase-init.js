
document.addEventListener('DOMContentLoaded', () => {
  // Funzione per caricare dinamicamente lo script principale dell'app
  const loadMainApp = () => {
    const script = document.createElement('script');
    script.src = 'app.js?v=2.2'; // Aggiunto un nuovo numero di versione per il cache busting
    document.body.appendChild(script);
    console.log("Script principale dell'app caricato e avviato.");
  };

  // Carica la configurazione da un file JSON esterno
  fetch('/firebase-config.json')
    .then(response => {
      if (!response.ok) {
        throw new Error("File firebase-config.json non trovato.");
      }
      return response.json();
    })
    .then(firebaseConfig => {
      // Inizializza Firebase con la configurazione caricata
      try {
        const app = firebase.initializeApp(firebaseConfig);
        console.log("Firebase inizializzato con successo dalla configurazione.");

        // Utilizza gli emulatori se in ambiente locale
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
          console.log("Connessione agli emulatori Firebase in corso...");
          firebase.firestore().useEmulator("localhost", 9014);
          firebase.auth().useEmulator('http://localhost:9099');
        }
        
        // Ora che Firebase è pronto, carica il resto dell'applicazione
        loadMainApp();

      } catch (error) {
        console.error("Errore durante l'inizializzazione di Firebase:", error);
        document.querySelector('main').innerHTML = '<p style="color: red; text-align: center;">Errore critico: Impossibile inizializzare Firebase. Controlla la console per i dettagli.</p>';
      }
    })
    .catch(error => {
      console.error("Impossibile caricare la configurazione di Firebase:", error);
      document.querySelector('main').innerHTML = '<p style="color: red; text-align: center;">Errore critico: File di configurazione di Firebase non trovato o non valido.</p>';
    });
});
