// Mobile menu functionality
document.addEventListener('DOMContentLoaded', function() {
    // Create hamburger button
    const headerContainer = document.querySelector('.header-container');
    const nav = document.querySelector('.nav');
    
    // Create hamburger button HTML
    const hamburgerButton = document.createElement('button');
    hamburgerButton.className = 'hamburger';
    hamburgerButton.setAttribute('aria-label', 'Toggle menu');
    hamburgerButton.innerHTML = `
        <span></span>
        <span></span>
        <span></span>
    `;
    
    // Create overlay element
    const overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    
    // Insert hamburger after logo
    const logo = document.querySelector('.logo');
    logo.insertAdjacentElement('afterend', hamburgerButton);
    
    // Insert overlay into body
    document.body.appendChild(overlay);
    
    // Toggle menu function
    function toggleMenu() {
        const isActive = nav.classList.contains('active');
        
        if (isActive) {
            // Close menu
            nav.classList.remove('active');
            hamburgerButton.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        } else {
            // Open menu
            nav.classList.add('active');
            hamburgerButton.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }
    
    // Event listeners
    hamburgerButton.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', toggleMenu);
    
    // Close menu when clicking nav links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (nav.classList.contains('active')) {
                toggleMenu();
            }
        });
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && nav.classList.contains('active')) {
            toggleMenu();
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth >= 1200 && nav.classList.contains('active')) {
            toggleMenu();
        }
    });
});