document.addEventListener('DOMContentLoaded', () => {
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

        // Use emulators if on localhost
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
          console.log("Connecting to Firebase emulators");
          firebase.firestore().useEmulator("localhost", 9014);
          firebase.storage().useEmulator("localhost", 9199);
          firebase.auth().useEmulator('http://localhost:9099');
        }
        
        // Invia l'evento per notificare che Firebase è pronto
        const event = new CustomEvent('firebase-ready', { detail: { firebaseApp: app } });
        window.dispatchEvent(event);

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
