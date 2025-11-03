
import { auth } from './firebase.js'; // Importa l'istanza di auth centralizzata
import { onAuthStateChanged, GoogleAuthProvider, signInWithRedirect, getRedirectResult, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

export const initializeAuth = (onAuthStateReady) => {
    const authContainer = document.getElementById('auth-container');

    const updateAuthUI = (user) => {
        if (!authContainer) return;
        if (user) {
            authContainer.innerHTML = `
                <div class="user-info">
                    <span>${user.email}</span>
                    <button id="logout-btn">Logout</button>
                </div>
            `;
            document.getElementById('logout-btn').addEventListener('click', () => {
                signOut(auth)
                    .then(() => {
                        // Reload the page to ensure a clean state after logout
                        window.location.reload();
                    })
                    .catch(error => console.error('Logout Error:', error));
            });
        } else {
            authContainer.innerHTML = '<button id="login-btn">Login con Google</button>';
            document.getElementById('login-btn').addEventListener('click', () => {
                const provider = new GoogleAuthProvider();
                signInWithRedirect(auth, provider);
            });
        }
    };

    // Handle the redirect result before setting up the real-time listener
    // to avoid race conditions.
    getRedirectResult(auth)
        .then((result) => {
            if (result) {
                console.log("Login successful after redirect:", result.user);
            }
            // Whether there was a redirect result or not, set up the auth state listener.
            onAuthStateChanged(auth, user => {
                updateAuthUI(user);
                if (onAuthStateReady) {
                    onAuthStateReady(user);
                }
            });
        }).catch((error) => {
            console.error('Login Redirect Error:', error);
            // Even on error, set up the listener. A user might be signed in from a previous session.
             onAuthStateChanged(auth, user => {
                updateAuthUI(user);
                if (onAuthStateReady) {
                    onAuthStateReady(user);
                }
            });
        });
};
