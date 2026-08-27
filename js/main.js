/**
 * GEZAHEGN SHUTTER WORKS - COMPLETE JAVASCRIPT
 * All interactive features in one file
 */

(function() {
    'use strict';

    // ============================================================
    // 1. MOBILE NAVIGATION
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
    // 2. SMOOTH SCROLLING
    // ============================================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || !targetId) return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const headerOffset = document.querySelector('header')?.offsetHeight || 70;
                const pos = target.getBoundingClientRect().top + window.pageYOffset - headerOffset - 10;
                window.scrollTo({ top: pos, behavior: 'smooth' });
            }
        });
    });

    // ============================================================
    // 3. CONTACT FORM (with Formspree integration)
    // ============================================================
    const form = document.getElementById('contactForm');
    const feedback = document.getElementById('formFeedback');

    if (form && feedback) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            const name = document.getElementById('fullName')?.value.trim() || '';
            const email = document.getElementById('emailAddr')?.value.trim() || '';
            const phone = document.getElementById('phoneNum')?.value.trim() || '';
            const subject = document.getElementById('subject')?.value.trim() || '';
            const message = document.getElementById('msgText')?.value.trim() || '';

            // Validation
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

            if (phone && !/^[0-9+\-\s()]{7,20}$/.test(phone)) {
                feedback.innerHTML = '<i class="fas fa-exclamation-circle"></i> Please enter a valid phone number.';
                feedback.style.color = '#d4a02b';
                return;
            }

            // Show sending status
            feedback.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending message...';
            feedback.style.color = '#94a3b8';

            // Prepare data for Formspree
            const formData = {
                name: name,
                email: email,
                phone: phone,
                subject: subject || 'New Inquiry from Website',
                message: message
            };

            // Send to Formspree (replace with your endpoint)
            fetch('https://formspree.io/f/YOUR_FORM_ID', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Network response was not ok.');
            })
            .then(() => {
                feedback.innerHTML = '<i class="fas fa-check-circle"></i> Thank you! We\'ll get back to you shortly.';
                feedback.style.color = '#22c55e';
                form.reset();
                setTimeout(() => {
                    feedback.innerHTML = '';
                }, 6000);
            })
            .catch((error) => {
                console.error('Error:', error);
                feedback.innerHTML = '<i class="fas fa-exclamation-circle"></i> Something went wrong. Please try again or call us directly.';
                feedback.style.color = '#ef4444';
                setTimeout(() => {
                    feedback.innerHTML = '';
                }, 6000);
            });
        });
    }

    // ============================================================
    // 4. FAQ ACCORDION
    // ============================================================
    document.querySelectorAll('.faq-item').forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', function() {
                const isActive = item.classList.contains('active');
                // Close all FAQ items
                document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        }
    });

    // ============================================================
    // 5. COOKIE CONSENT
    // ============================================================
    const cookieBanner = document.getElementById('cookieBanner');

    function setCookie(name, value, days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = name + '=' + value + '; expires=' + date.toUTCString() + '; path=/';
    }

    function getCookie(name) {
        const value = '; ' + document.cookie;
        const parts = value.split('; ' + name + '=');
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }

    function acceptCookies() {
        setCookie('cookie_consent', 'accepted', 365);
        if (cookieBanner) {
            cookieBanner.classList.remove('show');
        }
        // Enable analytics tracking
        if (typeof gtag !== 'undefined') {
            gtag('consent', 'update', {
                'analytics_storage': 'granted'
            });
        }
    }

    function declineCookies() {
        setCookie('cookie_consent', 'declined', 365);
        if (cookieBanner) {
            cookieBanner.classList.remove('show');
        }
        // Disable analytics tracking
        if (typeof gtag !== 'undefined') {
            gtag('consent', 'update', {
                'analytics_storage': 'denied'
            });
        }
    }

    // Check cookie consent on load
    if (cookieBanner) {
        const consent = getCookie('cookie_consent');
        if (!consent) {
            cookieBanner.classList.add('show');
        }
    }

    // Make functions globally accessible
    window.acceptCookies = acceptCookies;
    window.declineCookies = declineCookies;

    // ============================================================
    // 6. DYNAMIC YEAR IN FOOTER
    // ============================================================
    const yearEl = document.querySelector('.footer-bottom p');
    if (yearEl) {
        yearEl.innerHTML = yearEl.innerHTML.replace('2026', new Date().getFullYear());
    }

    // ============================================================
    // 7. ACTIVE NAV LINK (Scroll Spy for single page)
    // ============================================================
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-links a');

    if (sections.length > 0 && navItems.length > 0) {
        let scrollTimeout;

        window.addEventListener('scroll', function() {
            if (scrollTimeout) cancelAnimationFrame(scrollTimeout);
            scrollTimeout = requestAnimationFrame(function() {
                const scrollPos = window.pageYOffset + 120;
                let current = '';
                sections.forEach(sec => {
                    const top = sec.offsetTop;
                    const height = sec.offsetHeight;
                    if (scrollPos >= top && scrollPos < top + height) {
                        current = sec.getAttribute('id');
                    }
                });
                navItems.forEach(link => {
                    link.classList.remove('active');
                    const href = link.getAttribute('href');
                    if (href === '#' + current) {
                        link.classList.add('active');
                    }
                });
            });
        });
    }

    // ============================================================
    // 8. GALLERY IMAGE LIGHTBOX (Click to view)
    // ============================================================
    document.querySelectorAll('.gallery-item, .gallery-full-item span').forEach(item => {
        item.addEventListener('click', function(e) {
            // Find the parent gallery item
            const galleryItem = this.closest('.gallery-item') || this.closest('.gallery-full-item');
            if (galleryItem) {
                const title = galleryItem.querySelector('h4')?.textContent || 
                             galleryItem.querySelector('h4')?.textContent || 
                             'Shutter Project';
                const icon = galleryItem.querySelector('i')?.className || 'fas fa-image';
                
                // Simple visual feedback
                galleryItem.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    galleryItem.style.transform = '';
                }, 200);
                
                // Show alert with project info (can be replaced with modal)
                if (window.innerWidth < 768) {
                    alert(`📸 ${title}\nClick "Contact Us" for more details about this project.`);
                }
            }
        });
    });

    // ============================================================
    // 9. WHATSAPP WIDGET WITH PRE-FILLED MESSAGE
    // ============================================================
    const whatsappWidget = document.querySelector('.whatsapp-widget');
    if (whatsappWidget) {
        const phone = '251913008164'; // Replace with your WhatsApp number
        const message = 'Hello! I visited your website and would like to know more about your shutter services.';
        whatsappWidget.href = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
        whatsappWidget.target = '_blank';
        whatsappWidget.rel = 'noopener noreferrer';
        whatsappWidget.setAttribute('aria-label', 'Chat on WhatsApp');
    }

    // ============================================================
    // 10. CONSOLE LOG (For developers)
    // ============================================================
    console.log('✅ Gezahegn Shutter Works — Website Loaded Successfully');
    console.log('📍 Location: Tracon Tower, Piassa, Addis Ababa, Ethiopia');
    console.log('📞 Phone: 09 13 00 81 64 | 09 12 37 71 11');
    console.log('📧 Email: gezahegntad6266@gmail.com');

})();