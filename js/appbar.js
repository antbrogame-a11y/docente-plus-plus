// js/appbar.js
// AppBar scroll behavior and interactions

let lastScrollY = 0;
let ticking = false;

/**
 * Initialize AppBar scroll behavior
 * Hides AppBar when scrolling down, shows when scrolling up
 */
export function initAppBarScrollBehavior() {
    const header = document.getElementById('app-header');
    if (!header) {
        console.warn('AppBar header not found');
        return;
    }

    // Handle scroll events with throttling for performance
    const handleScroll = () => {
        const currentScrollY = window.scrollY;
        
        // Don't hide header if we're at the top
        if (currentScrollY < 10) {
            header.classList.remove('header-hidden');
            lastScrollY = currentScrollY;
            return;
        }

        // Hide header when scrolling down, show when scrolling up
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            // Scrolling down
            header.classList.add('header-hidden');
        } else if (currentScrollY < lastScrollY) {
            // Scrolling up
            header.classList.remove('header-hidden');
        }

        lastScrollY = currentScrollY;
    };

    // Use requestAnimationFrame for smooth performance
    const onScroll = () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
}

/**
 * Initialize workspace button functionality
 * Replaces the old active-class-badge
 * 
 * TEMPORANEAMENTE DISABILITATO - La funzionalità Workspace non è attualmente utilizzata
 * Per ripristinare: decommentare questa funzione e la chiamata in initAppBar()
 */
/* 
export function initWorkspaceButton() {
    const workspaceBtn = document.getElementById('workspace-btn');
    if (!workspaceBtn) {
        console.warn('Workspace button not found');
        return;
    }

    // Add click handler to show workspace selector (to be implemented)
    workspaceBtn.addEventListener('click', () => {
        // TODO: Show workspace/class selector modal or dropdown
        console.log('Workspace button clicked - implement selector');
    });
}
*/

/**
 * Initialize all AppBar functionality
 */
export function initAppBar() {
    initAppBarScrollBehavior();
    // initWorkspaceButton(); // TEMPORANEAMENTE DISABILITATO - Workspace non utilizzato
}
