
// Questo file contiene funzioni helper riutilizzabili per interagire con Firestore.

// Verifica che Firestore sia stato inizializzato
if (!window.db) {
    throw new Error("Errore critico: Istanza di Firestore (window.db) non trovata. Assicurati che firebase-init.js sia caricato e configurato correttamente.");
}

/**
 * Controlla se l'utente è attualmente autenticato.
 * @returns {string} L'UID dell'utente se autenticato.
 * @throws {Error} Se l'utente non è autenticato.
 */
const getAuthenticatedUser = () => {
    const user = firebase.auth().currentUser;
    if (!user) {
        throw new Error("Nessun utente autenticato. Impossibile eseguire l'operazione.");
    }
    return user.uid;
};

/**
 * Recupera tutte le classi per l'utente corrente.
 * @returns {Promise<Array<Object>>} Una promessa che si risolve con un array di oggetti classe.
 */
const getClassesFromFirestore = async () => {
    const userId = getAuthenticatedUser();
    try {
        const snapshot = await db.collection('users').doc(userId).collection('classes').get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Errore durante il recupero delle classi da Firestore: ", error);
        throw error; // Rilancia l'errore per essere gestito dal chiamante
    }
};

/**
 * Aggiunge un nuovo studente al database sotto uno specifico utente.
 * @param {Object} studentData - L'oggetto contenente i dati dello studente (es. { name, surname, email, classId }).
 * @returns {Promise<void>}
 */
const addStudentToFirestore = async (studentData) => {
    const userId = getAuthenticatedUser();
    if (!studentData || !studentData.classId) {
        throw new Error("Dati dello studente o classId mancanti.");
    }
    try {
        await db.collection('users').doc(userId).collection('students').add(studentData);
    } catch (error) {
        console.error("Errore durante l'aggiunta dello studente a Firestore: ", error);
        throw error;
    }
};

/**
 * Controlla se uno studente con una data email esiste già in una data classe per l'utente corrente.
 * @param {string} classId - L'ID della classe in cui cercare.
 * @param {string} email - L'email dello studente da controllare.
 * @returns {Promise<boolean>} Una promessa che si risolve con true se lo studente esiste, altrimenti false.
 */
const checkStudentExists = async (classId, email) => {
    const userId = getAuthenticatedUser();
    if (!classId || !email) {
        throw new Error("classId o email mancanti per il controllo dell'esistenza.");
    }
    try {
        const snapshot = await db.collection('users').doc(userId).collection('students')
            .where('classId', '==', classId)
            .where('email', '==', email)
            .limit(1)
            .get();
        return !snapshot.empty;
    } catch (error) {
        console.error("Errore durante il controllo dell'esistenza dello studente: ", error);
        throw error;
    }
};
