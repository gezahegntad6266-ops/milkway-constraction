// Mobile Navigation Toggle
(function() {
  const hamburger = document.getElementById('hamburgerBtn');
  const navLinks = document.getElementById('navLinks');
  
  if (hamburger && navLinks) {
    // Toggle menu on hamburger click
    hamburger.addEventListener('click', function(e) {
      e.stopPropagation();
      navLinks.classList.toggle('active');
    });
    
    // Close menu when a link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
      });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
      if (!hamburger.contains(event.target) && !navLinks.contains(event.target)) {
        navLinks.classList.remove('active');
      }
    });
  }
})();

// Contact Form Handler with Validation
(function() {
  const form = document.getElementById('contactForm');
  const feedback = document.getElementById('formFeedback');
  
  if (form && feedback) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form values
      const name = document.getElementById('fullName')?.value.trim() || '';
      const email = document.getElementById('emailAddr')?.value.trim() || '';
      const phone = document.getElementById('phoneNum')?.value.trim() || '';
      const message = document.getElementById('msgText')?.value.trim() || '';
      
      // Validate required fields
      if (!name || !email || !message) {
        feedback.innerHTML = '<i class="fas fa-exclamation-circle"></i> Please fill in all required fields.';
        feedback.style.color = '#f5c542';
        return;
      }
      
      // Validate email format
      if (!email.includes('@') || !email.includes('.')) {
        feedback.innerHTML = '<i class="fas fa-exclamation-circle"></i> Please enter a valid email address.';
        feedback.style.color = '#f5c542';
        return;
      }
      
      // Simulate sending
      feedback.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending message...';
      feedback.style.color = '#a0bcd9';
      
      // Simulate successful submission
      setTimeout(() => {
        feedback.innerHTML = '<i class="fas fa-check-circle"></i> Thank you! We\'ll get back to you shortly.';
        feedback.style.color = '#7ddf9a';
        form.reset();
        
        // Clear feedback after 6 seconds
        setTimeout(() => {
          feedback.innerHTML = '';
        }, 6000);
      }, 1800);
    });
  }
})();

// Smooth scrolling for anchor links (optional enhancement)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      e.preventDefault();
      const headerHeight = document.querySelector('header')?.offsetHeight || 0;
      const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});