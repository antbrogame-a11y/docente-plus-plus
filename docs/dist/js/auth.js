// Funzione per configurare l'interfaccia di autenticazione
/* window.setupAuth = (firebaseApp) => {
    const auth = firebaseApp.auth();
    const authContainer = document.getElementById('auth-container');

    // Monitora i cambiamenti dello stato di autenticazione
    auth.onAuthStateChanged(user => {
        // Notifica all'applicazione il cambiamento di stato dell'utente
        window.dispatchEvent(new CustomEvent('auth-changed', { detail: { user } }));

        if (user) {
            // L'utente è autenticato: mostra le info e il pulsante di logout
            console.log('Utente autenticato:', user.email);
            authContainer.innerHTML = `
                <div class="user-info">
                    <span id="user-email">${user.email}</span>
                    <button id="logout-btn" class="btn btn-secondary">Logout</button>
                </div>
            `;
            // Aggiunge l'evento per il logout
            document.getElementById('logout-btn').addEventListener('click', () => {
                auth.signOut().catch(error => console.error('Errore durante il logout:', error));
            });
        } else {
            // L'utente non è autenticato: mostra il pulsante di login
            console.log('Nessun utente autenticato.');
            authContainer.innerHTML = '<button id="login-btn" class="btn btn-primary">Login con Google</button>';
            
            // Aggiunge l'evento per il login
            document.getElementById('login-btn').addEventListener('click', () => {
                const provider = new firebase.auth.GoogleAuthProvider();
                auth.signInWithPopup(provider).catch(error => {
                    console.error('Errore durante il login con popup:', error);
                    // Gestire qui eventuali errori, ad es. popup bloccati
                });
            });
        }
    });
}; */
