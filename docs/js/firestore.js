
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
        throw error;
    }
};

// ... (altre funzioni esistenti come addStudentToFirestore, checkStudentExists, etc. rimangono invariate)

// --- FUNZIONI PER IMPORTAZIONE ED ELABORAZIONE VALUTAZIONI ---

const getEvaluationsFromFirestore = async () => {
    const userId = getAuthenticatedUser();
    try {
        const snapshot = await db.collection('users').doc(userId).collection('evaluations').get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Errore durante il recupero delle valutazioni da Firestore: ", error);
        throw error;
    }
};

const addGradeToFirestore = async (evaluationId, studentId, grade) => {
    // ... (implementazione esistente)
};

const getRecentEvaluations = async (limit = 5) => {
    // ... (implementazione esistente)
};

/**
 * [NUOVA PER ANALISI] Recupera tutti i voti per una specifica valutazione, arricchiti con i dati degli studenti.
 * @param {string} evaluationId - L'ID della valutazione da cui recuperare i voti.
 * @returns {Promise<Array<Object>>} Una promessa che si risolve con un array di oggetti voto, ognuno con i dati dello studente.
 */
const getGradesForEvaluation = async (evaluationId) => {
    const userId = getAuthenticatedUser();
    if (!evaluationId) throw new Error("ID valutazione non fornito.");

    try {
        const gradesRef = db.collection('users').doc(userId).collection('evaluations').doc(evaluationId).collection('grades');
        const gradesSnapshot = await gradesRef.get();
        if (gradesSnapshot.empty) return [];

        const gradesData = gradesSnapshot.docs.map(doc => doc.data());
        const studentIds = [...new Set(gradesData.map(g => g.studentId))];
        
        // Ora, recuperiamo i dati di tutti gli studenti necessari con una singola query efficiente
        const studentsRef = db.collection('users').doc(userId).collection('students');
        const studentsSnapshot = await studentsRef.where(firebase.firestore.FieldPath.documentId(), 'in', studentIds).get();
        
        const studentsMap = new Map();
        studentsSnapshot.forEach(doc => studentsMap.set(doc.id, doc.data()));

        // Arricchiamo ogni voto con i dati dello studente corrispondente
        const enrichedGrades = gradesData.map(grade => {
            const studentInfo = studentsMap.get(grade.studentId);
            return {
                ...grade,
                studentName: studentInfo ? `${studentInfo.name} ${studentInfo.surname}` : 'Studente Sconosciuto',
                studentEmail: studentInfo ? studentInfo.email : 'N/A'
            };
        });

        return enrichedGrades;

    } catch (error) {
        console.error(`Errore durante il recupero dei voti per la valutazione ${evaluationId}:`, error);
        throw error;
    }
};


const getStudentsByEmails = async (emails) => {
    // ... (implementazione esistente)
};

const addGradesInBatch = async (evaluationId, gradesData) => {
    // ... (implementazione esistente)
};
