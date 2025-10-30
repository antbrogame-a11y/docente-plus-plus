document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.getElementById('main-nav');
    const navItems = document.querySelectorAll('.nav-item');
    const mainContent = document.querySelector('main');

    const loadContent = (tab) => {
        const url = `${tab}.html`;
        fetch(url)
            .then(response => response.text())
            .then(html => {
                mainContent.innerHTML = html;
            })
            .catch(error => {
                console.error(`Error loading content for ${tab}:`, error);
                mainContent.innerHTML = '<h2>Pagina non trovata</h2>';
            });
    };

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            const isNavVisible = mainNav.style.display === 'block';
            if (isNavVisible) {
                mainNav.style.display = 'none';
                mainContent.style.paddingLeft = '20px';
            } else {
                mainNav.style.display = 'block';
                mainContent.style.paddingLeft = '260px';
            }
        });
    }

    if (navItems) {
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                navItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                const tab = item.getAttribute('data-tab');
                loadContent(tab);
            });
        });
    }

    if (mainNav && mainContent) {
        if (mainNav.style.display === 'none') {
            mainContent.style.paddingLeft = '20px';
        } else {
            mainContent.style.paddingLeft = '260px';
        }
    }

    // Load the initial content
    loadContent('home');
});
