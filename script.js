// Shared JavaScript for all pages

const CONTACT_NUMBER = '+919999999999';

// Footer year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Scroll reveal (with graceful fallback)
const revealElements = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    },
    { threshold: 0.1 }
  );
  revealElements.forEach((el) => observer.observe(el));
} else {
  revealElements.forEach((el) => el.classList.add('active'));
}

// Scroll to top button
const scrollTopBtn = document.getElementById('scrollTopBtn');
if (scrollTopBtn) {
  window.addEventListener('scroll', () => {
    scrollTopBtn.classList.toggle('show', window.scrollY > 250);
  });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Optional analytics event helper
function trackEvent(eventName, params = {}) {
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, params);
  }
}

// Track click intent from key CTAs
const trackableLinks = document.querySelectorAll('a[href^="tel:"], a[href*="wa.me"], a[href*="#contact-form"]');
trackableLinks.forEach((link) => {
  link.addEventListener('click', () => {
    const href = link.getAttribute('href') || '';
    const type = href.startsWith('tel:') ? 'call_click' : href.includes('wa.me') ? 'whatsapp_click' : 'demo_cta_click';
    trackEvent(type, { href });
  });
});

// Contact form validation + WhatsApp fallback submission
const demoForm = document.getElementById('demoForm');
if (demoForm) {
  demoForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = document.getElementById('name');
    const classField = document.getElementById('class');
    const phone = document.getElementById('phone');
    const message = document.getElementById('message');
    const status = document.getElementById('formStatus');
    const honeypot = demoForm.querySelector('input[name="website"]');
    const submitBtn = demoForm.querySelector('button[type="submit"]');

    const isPhoneValid = /^[0-9]{10}$/.test(phone.value.trim());
    const isSpam = honeypot && honeypot.value.trim().length > 0;

    if (isSpam) {
      status.textContent = 'Submission blocked.';
      status.className = 'mt-3 mb-0 text-danger fw-semibold';
      return;
    }

    if (!name.value.trim() || !classField.value || !message.value.trim() || !isPhoneValid) {
      status.textContent = 'Please enter valid details. Phone number must be 10 digits.';
      status.className = 'mt-3 mb-0 text-danger fw-semibold';
      return;
    }

    const payload = {
      studentName: name.value.trim(),
      studentClass: classField.value,
      parentPhone: phone.value.trim(),
      message: message.value.trim()
    };

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Submitting...';
    }

    // Static-site friendly reliable fallback: prefilled WhatsApp message
    const waText = encodeURIComponent(
      `New Demo Request\nName: ${payload.studentName}\nClass: ${payload.studentClass}\nPhone: ${payload.parentPhone}\nMessage: ${payload.message}`
    );
    const waLink = `https://wa.me/${CONTACT_NUMBER.replace(/\D/g, '')}?text=${waText}`;

    status.textContent = 'Thanks! Opening WhatsApp to confirm your demo request.';
    status.className = 'mt-3 mb-0 text-success fw-semibold';
    trackEvent('demo_form_submit', payload);
    window.open(waLink, '_blank', 'noopener');

    demoForm.reset();
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = submitBtn.dataset.submitLabel || 'Submit Request';
    }
  });
}

// Dynamic urgency indicator (non-negative seats counter)
const seatsLeftEl = document.getElementById('seatsLeft');
if (seatsLeftEl) {
  const dayFactor = new Date().getDate() % 5;
  const seatsLeft = Math.max(5, 12 - dayFactor);
  seatsLeftEl.textContent = seatsLeft.toString();
}
