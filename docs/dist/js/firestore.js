
// Funzione per configurare Firestore e le funzioni di interazione con i dati
const setupFirestore = async (firebaseApp, userId) => {
    if (!userId) {
        console.error("ID Utente non fornito, impossibile inizializzare Firestore.");
        return;
    }

    const db = firebaseApp.firestore();
    const userDocRef = db.collection('users').doc(userId);

    console.log(`Firestore inizializzato per l'utente: ${userId}`);

    // --- FUNZIONI GLOBALI SOVRASCRITTE ---

    // Funzione globale per caricare i dati. Ora legge da Firestore.
    window.loadData = async (collectionName, defaultValue = []) => {
        try {
            const collectionRef = userDocRef.collection(collectionName);
            const snapshot = await collectionRef.get();
            if (snapshot.empty) {
                console.log(`Nessun dato trovato nella collezione '${collectionName}', ritorno il valore di default.`);
                return defaultValue;
            }
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
             // Converte gli ID numerici legacy in stringhe se necessario
            return data.map(item => ({ ...item, id: String(item.id) }));
        } catch (error) {
            console.error(`Errore nel caricamento dati da Firestore per la collezione ${collectionName}:`, error);
            showToast(`Errore nel caricamento dei dati. ${error.message}`, 'error');
            return defaultValue; // Ritorna un valore di default in caso di errore
        }
    };

    // Funzione globale per salvare i dati. Ora scrive su Firestore.
    window.saveData = async (collectionName, data) => {
        if (!Array.isArray(data)) {
            console.error(`I dati per '${collectionName}' non sono un array. Il salvataggio è stato interrotto.`);
            return;
        }

        try {
            const batch = db.batch();
            const collectionRef = userDocRef.collection(collectionName);

            // Primo: Ottieni tutti i documenti esistenti per trovare quelli da eliminare
            const snapshot = await collectionRef.get();
            const existingIds = snapshot.docs.map(doc => doc.id);
            const dataIds = data.map(item => String(item.id)); // Assicura che gli ID siano stringhe

            // Documenti da eliminare: quelli in Firestore ma non nei dati correnti
            const toDelete = existingIds.filter(id => !dataIds.includes(id));
            toDelete.forEach(id => {
                batch.delete(collectionRef.doc(id));
            });

            // Documenti da aggiungere o aggiornare
            data.forEach(item => {
                const docId = String(item.id); // Usa un ID stringa consistente
                const docRef = collectionRef.doc(docId);
                const itemData = { ...item };
                delete itemData.id; // Rimuovi l'ID dall'oggetto dati, perché è già l'ID del documento
                batch.set(docRef, itemData, { merge: true }); // Usa merge per aggiornare o creare
            });

            await batch.commit();
            console.log(`Dati per '${collectionName}' salvati con successo su Firestore.`);
        } catch (error) {
            console.error(`Errore nel salvataggio dati su Firestore per la collezione ${collectionName}:`, error);
            showToast(`Errore nel salvataggio dei dati. ${error.message}`, 'error');
        }
    };
    
    // Funzione specifica per dati non-array (come l'orario)
    window.loadObjectData = async (docName, defaultValue = {}) => {
        try {
            const docRef = userDocRef.collection('single_docs').doc(docName);
            const doc = await docRef.get();
            if (!doc.exists) {
                return defaultValue;
            }
            return doc.data();
        } catch (error) {
            console.error(`Errore nel caricamento del documento ${docName}:`, error);
            return defaultValue;
        }
    };

    window.saveObjectData = async (docName, data) => {
        try {
            const docRef = userDocRef.collection('single_docs').doc(docName);
            await docRef.set(data);
        } catch (error) {
            console.error(`Errore nel salvataggio del documento ${docName}:`, error);
        }
    };


    // --- NOTIFICA DI CAMBIAMENTO --- 
    // Notifica all'applicazione che le funzioni di dati sono state aggiornate
    window.dispatchEvent(new CustomEvent('firestore-ready'));
};