(function() {
    'use strict';

    // ============================================================
    // MOBILE NAVIGATION
    // ============================================================
    const hamburger = document.getElementById('hamburgerBtn');
    const navLinks = document.getElementById('navLinks');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function(e) {
            e.stopPropagation();
            const isActive = navLinks.classList.toggle('active');
            this.innerHTML = isActive ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
            document.body.style.overflow = isActive ? 'hidden' : '';
        });

        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', function() {
                navLinks.classList.remove('active');
                hamburger.innerHTML = '<i class="fas fa-bars"></i>';
                document.body.style.overflow = '';
            });
        });

        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
                navLinks.classList.remove('active');
                hamburger.innerHTML = '<i class="fas fa-bars"></i>';
                document.body.style.overflow = '';
            }
        });

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                hamburger.innerHTML = '<i class="fas fa-bars"></i>';
                document.body.style.overflow = '';
            }
        });
    }

    // ============================================================
    // CONTACT FORM
    // ============================================================
    const form = document.getElementById('contactForm');
    const feedback = document.getElementById('formFeedback');

    if (form && feedback) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            const name = document.getElementById('fullName')?.value.trim() || '';
            const email = document.getElementById('emailAddr')?.value.trim() || '';
            const message = document.getElementById('msgText')?.value.trim() || '';

            if (!name || !email || !message) {
                feedback.innerHTML = '<i class="fas fa-exclamation-circle"></i> Please fill in all required fields.';
                feedback.style.color = '#d4a02b';
                return;
            }

            if (!email.includes('@') || !email.includes('.')) {
                feedback.innerHTML = '<i class="fas fa-exclamation-circle"></i> Please enter a valid email address.';
                feedback.style.color = '#d4a02b';
                return;
            }

            feedback.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending message...';
            feedback.style.color = '#94a3b8';

            setTimeout(() => {
                feedback.innerHTML = '<i class="fas fa-check-circle"></i> Thank you! We\'ll get back to you shortly.';
                feedback.style.color = '#22c55e';
                form.reset();
                setTimeout(() => {
                    feedback.innerHTML = '';
                }, 6000);
            }, 1500);
        });
    }

    // ============================================================
    // DYNAMIC YEAR
    // ============================================================
    const yearEl = document.querySelector('.footer-bottom p');
    if (yearEl) {
        yearEl.innerHTML = yearEl.innerHTML.replace('2026', new Date().getFullYear());
    }

    console.log('✅ Gezahegn Shutter Works — Multi-page website loaded');
    console.log('📍 Tracon Tower, Piassa, Addis Ababa');

})();