/**
 * GEZAHEGN SHUTTER WORKS - COMPLETE JAVASCRIPT WITH SUPABASE
 */

(function() {
    'use strict';

    // ============================================================
    // SUPABASE CONFIGURATION
    // ============================================================
    const SUPABASE_URL = 'https://ktfnvvuvaxlnnuoxohsl.supabase.co'; // REPLACE THIS
    const SUPABASE_KEY = 'sb_publishable_lfIZh_JL8RldOjREig84vw_g5ZUGJwy'; // REPLACE THIS

    // ============================================================
    // LOAD GALLERY IMAGES FROM SUPABASE
    // ============================================================
    async function loadGalleryImages() {
        try {
            const response = await fetch(`${SUPABASE_URL}/rest/v1/gallery_images?select=*&order=created_at.desc`, {
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch images');
            }

            const images = await response.json();
            return images;
        } catch (error) {
            console.error('Error loading gallery:', error);
            return [];
        }
    }

    // ============================================================
    // DISPLAY GALLERY
    // ============================================================
    async function displayGallery() {
        const galleryGrid = document.querySelector('.gallery-full-grid');
        if (!galleryGrid) return;

        const images = await loadGalleryImages();

        if (images.length === 0) {
            galleryGrid.innerHTML = `
                <div style="text-align:center; grid-column:1/-1; padding:40px; color:#64748b;">
                    <i class="fas fa-image" style="font-size:3rem; display:block; margin-bottom:16px; color:#d4a02b;"></i>
                    <p>No images in gallery yet. Add images from Supabase!</p>
                </div>
            `;
            return;
        }

        galleryGrid.innerHTML = images.map(img => `
            <div class="gallery-full-item" data-id="${img.id}">
                <div class="gallery-image-wrapper">
                    <img src="${img.url}" alt="${img.alt_text || img.title}" loading="lazy" />
                </div>
                <i class="fas ${img.is_premium ? 'fa-crown' : 'fa-image'}" style="color: ${img.is_premium ? '#d4a02b' : '#1e3a5f'};"></i>
                <h4>${img.title || 'Shutter Project'}</h4>
                <p>${img.alt_text || 'Professional installation'}</p>
                <span>View Project</span>
            </div>
        `).join('');
    }

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
    // CONTACT FORM (Using Formspree)
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

            feedback.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending message...';
            feedback.style.color = '#94a3b8';

            const formData = {
                name: name,
                email: email,
                phone: phone,
                subject: subject || 'New Inquiry from Website',
                message: message
            };

            // Replace with your Formspree ID
            fetch('https://formspree.io/f/YOUR_FORMSPREE_ID', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            .then(response => {
                if (response.ok) return response.json();
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
            .catch(() => {
                feedback.innerHTML = '<i class="fas fa-exclamation-circle"></i> Something went wrong. Please try again.';
                feedback.style.color = '#ef4444';
                setTimeout(() => {
                    feedback.innerHTML = '';
                }, 6000);
            });
        });
    }

    // ============================================================
    // FAQ ACCORDION
    // ============================================================
    document.querySelectorAll('.faq-item').forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', function() {
                const isActive = item.classList.contains('active');
                document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        }
    });

    // ============================================================
    // COOKIE CONSENT
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
        if (cookieBanner) cookieBanner.classList.remove('show');
    }

    function declineCookies() {
        setCookie('cookie_consent', 'declined', 365);
        if (cookieBanner) cookieBanner.classList.remove('show');
    }

    if (cookieBanner) {
        const consent = getCookie('cookie_consent');
        if (!consent) {
            cookieBanner.classList.add('show');
        }
    }

    window.acceptCookies = acceptCookies;
    window.declineCookies = declineCookies;

    // ============================================================
    // DYNAMIC YEAR IN FOOTER
    // ============================================================
    const yearEl = document.querySelector('.footer-bottom p');
    if (yearEl) {
        yearEl.innerHTML = yearEl.innerHTML.replace('2026', new Date().getFullYear());
    }

    // ============================================================
    // WHATSAPP WIDGET
    // ============================================================
    const whatsappWidget = document.querySelector('.whatsapp-widget');
    if (whatsappWidget) {
        const phone = '251913008164';
        const message = 'Hello! I visited your website and would like to know more about your shutter services.';
        whatsappWidget.href = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
        whatsappWidget.target = '_blank';
        whatsappWidget.rel = 'noopener noreferrer';
        whatsappWidget.setAttribute('aria-label', 'Chat on WhatsApp');
    }

    // ============================================================
    // RUN GALLERY ON PAGE LOAD
    // ============================================================
    if (document.querySelector('.gallery-full-grid')) {
        displayGallery();
    }

    console.log('✅ Gezahegn Shutter Works — Connected to Supabase');
    console.log('📍 Location: Tracon Tower, Piassa, Addis Ababa, Ethiopia');
    console.log('📞 Phone: 09 13 00 81 64 | 09 12 37 71 11');

})();