
// Funzione per gestire l'autenticazione e l'interfaccia utente relativa
const setupAuth = async (firebaseApp) => {
    const auth = firebaseApp.auth();
    const authContainer = document.getElementById('auth-container');

    // Monitora i cambiamenti dello stato di autenticazione
    auth.onAuthStateChanged(async user => {
        if (user) {
            // L'utente è loggato
            console.log('Utente loggato:', user.uid);
            authContainer.innerHTML = `
                <div class="user-info">
                    <span id="user-email">${user.email}</span>
                    <button id="logout-btn" class="btn btn-secondary">Logout</button>
                </div>
            `;
            document.getElementById('logout-btn').addEventListener('click', () => auth.signOut());

            // Inizializza il database Firestore per l'utente
            await setupFirestore(firebaseApp, user.uid);
        } else {
            // L'utente non è loggato
            console.log('Utente non loggato.');
            authContainer.innerHTML = `
                <button id="login-btn" class="btn btn-primary">Login con Google</button>
            `;
            document.getElementById('login-btn').addEventListener('click', () => {
                const provider = new firebase.auth.GoogleAuthProvider();
                auth.signInWithPopup(provider);
            });
            // Se l'utente non è loggato, potresti voler disabilitare l'app o mostrare dati locali
            // Per ora, l'app continuerà a funzionare con localStorage
        }
        // Ricarica la vista corrente per aggiornare i dati
        window.dispatchEvent(new CustomEvent('auth-changed', { detail: { user } }));
    });
};


