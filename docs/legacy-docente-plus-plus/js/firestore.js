
// Funzioni per interagire con Firestore
const firestoreDB = firebase.firestore();

// Funzione per aggiungere uno studente a Firestore
const addStudentToFirestore = (studentData) => {
    return firestoreDB.collection("students").add(studentData);
};

// Funzione per verificare se uno studente esiste già
const checkStudentExists = (classId, email) => {
    return firestoreDB.collection("students")
        .where("classId", "==", classId)
        .where("email", "==", email)
        .get()
        .then(snapshot => !snapshot.empty);
};

// Funzione per ottenere le classi da Firestore
const getClassesFromFirestore = () => {
    return firestoreDB.collection("classes").get().then(snapshot => {
        const classes = [];
        snapshot.forEach(doc => {
            classes.push({ id: doc.id, ...doc.data() });
        });
        return classes;
    });
};
