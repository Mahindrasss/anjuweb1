// Shared JavaScript for all pages

// Footer year
const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// Scroll reveal using IntersectionObserver
const revealElements = document.querySelectorAll('.reveal');
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

// Scroll to top button
const scrollTopBtn = document.getElementById('scrollTopBtn');
if (scrollTopBtn) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 250) {
      scrollTopBtn.classList.add('show');
    } else {
      scrollTopBtn.classList.remove('show');
    }
  });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Contact form validation + dummy submit handling
const demoForm = document.getElementById('demoForm');
if (demoForm) {
  demoForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = document.getElementById('name');
    const classField = document.getElementById('class');
    const phone = document.getElementById('phone');
    const message = document.getElementById('message');
    const status = document.getElementById('formStatus');

    const isPhoneValid = /^[0-9]{10}$/.test(phone.value.trim());

    if (!name.value.trim() || !classField.value || !message.value.trim() || !isPhoneValid) {
      status.textContent = 'Please enter valid details. Phone number must be 10 digits.';
      status.className = 'mt-3 mb-0 text-danger fw-semibold';
      return;
    }

    status.textContent = 'Thank you! Your demo request has been submitted. We will contact you shortly.';
    status.className = 'mt-3 mb-0 text-success fw-semibold';
    demoForm.reset();
  });
}
