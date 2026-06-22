const scrollIndicator = document.getElementById('scroll-indicator');
const floatingButtons = document.getElementById('floating-buttons');

window.addEventListener('scroll', () => {
    if (window.scrollY > 200) {
        
        if(scrollIndicator) {
            scrollIndicator.classList.add('opacity-0', 'pointer-events-none');
        }
        
        if(floatingButtons) {
            floatingButtons.classList.remove('opacity-0', 'translate-y-10', 'pointer-events-none');
            floatingButtons.classList.add('opacity-100', 'translate-y-0');
        }

    } else {
        
        if(scrollIndicator) {
            scrollIndicator.classList.remove('opacity-0', 'pointer-events-none');
        }
        
        if(floatingButtons) {
            floatingButtons.classList.add('opacity-0', 'translate-y-10', 'pointer-events-none');
            floatingButtons.classList.remove('opacity-100', 'translate-y-0');
        }
    }
});

// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
}