document.addEventListener("DOMContentLoaded", () => {
    const appRoot = document.getElementById('app-root');
    const navLinks = document.querySelectorAll('.navbar a');
    
    // Track the active scene to know what to unmount
    let currentRoute = '';

    function handleRouting() {
        // 1. Get the requested route, defaulting to #home
        const hash = window.location.hash || '#home';
        
        // Prevent rebuilding if the user clicks the active page's link
        if (hash === currentRoute) return;

        // --- PHASE 1: UNMOUNT & CLEANUP ---
        // Safely call the unmount functions to clear event listeners (preventing memory leaks)
        if (currentRoute === '#home' && typeof unmountHome === 'function') unmountHome();
        if (currentRoute === '#projects' && typeof unmountProjects === 'function') unmountProjects();
        if (currentRoute === '#about' && typeof unmountAbout === 'function') unmountAbout();
        if (currentRoute === '#contact' && typeof unmountContact === 'function') unmountContact();

        // Clear the root container
        appRoot.innerHTML = '';
        
        // Strip previous theme classes from the body
        document.body.className = '';

        // --- PHASE 2: INSTANCE NEW SCENE & APPLY THEME ---
        if (hash === '#home') {
            document.body.classList.add('theme-neon');
            if (typeof mountHome === 'function') mountHome(appRoot);
        } 
        else if (hash === '#projects') {
            document.body.classList.add('theme-twilight');
            if (typeof mountProjects === 'function') mountProjects(appRoot);
        } 
        else if (hash === '#about') {
            document.body.classList.add('theme-light');
            if (typeof mountAbout === 'function') mountAbout(appRoot);
        } 
        else if (hash === '#contact') {
            document.body.classList.add('theme-neon');
            if (typeof mountContact === 'function') mountContact(appRoot);
        } 
        else {
            // 404 Fallback
            document.body.classList.add('theme-neon');
            appRoot.innerHTML = `<div class="main" style="text-align:center; padding:5em;"><h1>404</h1><h2>Signal Lost.</h2></div>`;
        }

        // --- PHASE 3: UPDATE UI STATE ---
        updateActiveNav(hash);
        currentRoute = hash;
        window.scrollTo(0, 0); // Scroll to top on page change
    }

    // Highlights the correct link in the persistent navbar
    function updateActiveNav(hash) {
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === hash) {
                link.classList.add('active');
            }
        });
    }

    // --- BACK TO TOP LOGIC ---
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', (e) => {
            e.preventDefault(); // Stops the hashtag from entering the URL
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    // Listen for back/forward browser buttons and navbar clicks
    window.addEventListener('hashchange', handleRouting);

    // Boot the engine on initial load
    handleRouting();
});