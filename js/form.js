/**
 * form.js — Booking form validation & submission
 * Shivangi's Beauty Art & Hair
 */

'use strict';

(function initBookingForm() {
  const form = document.getElementById('booking-form');
  if (!form) return;

  const successMsg = document.getElementById('form-success');

  const rules = {
    name:    { min: 2, max: 80 },
    phone:   { pattern: /^[\+]?[0-9\s\-\(\)]{10,15}$/ },
    email:   { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, optional: true },
    service: { required: true },
    date:    { required: true },
    message: { min: 0, max: 500 },
  };

  function getError(field, value) {
    const rule = rules[field];
    if (!rule) return null;
    if (!value && !rule.optional && rule.required !== false) return 'This field is required.';
    if (rule.pattern && value && !rule.pattern.test(value)) {
      if (field === 'phone') return 'Please enter a valid phone number.';
      if (field === 'email') return 'Please enter a valid email address.';
    }
    if (rule.min && value && value.length < rule.min) return `Minimum ${rule.min} characters required.`;
    if (rule.max && value && value.length > rule.max) return `Maximum ${rule.max} characters allowed.`;
    return null;
  }

  function validateField(input) {
    const field = input.name || input.id;
    const value = input.value.trim();
    const error = getError(field, value);
    const errEl = input.parentElement.querySelector('.form-error');

    input.classList.toggle('error', !!error);
    if (errEl) {
      errEl.textContent = error || '';
      errEl.style.display = error ? 'block' : 'none';
    }
    return !error;
  }

  // Real-time validation on blur
  form.querySelectorAll('input, select, textarea').forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
      if (input.classList.contains('error')) validateField(input);
    });
  });

  // Set min date to today
  const dateInput = form.querySelector('#booking-date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let valid = true;
    form.querySelectorAll('input[name], select[name], textarea[name]').forEach(input => {
      if (!validateField(input)) valid = false;
    });

    if (!valid) {
      // Scroll to first error
      const firstError = form.querySelector('.error');
      if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // Show loading state
    const submitBtn = form.querySelector('[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;

    // Simulate form submission (replace with actual endpoint)
    setTimeout(() => {
      form.reset();
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;

      if (successMsg) {
        successMsg.style.display = 'block';
        setTimeout(() => { successMsg.style.display = 'none'; }, 6000);
      }

      // WhatsApp fallback option
      const nameVal = form.querySelector('#booking-name') ? form.querySelector('#booking-name').value : '';
      const serviceVal = form.querySelector('#booking-service') ? form.querySelector('#booking-service').value : '';
      const dateVal = form.querySelector('#booking-date') ? form.querySelector('#booking-date').value : '';
      const phone = '+919624354492';
      const msg = encodeURIComponent(
        `Hello! I'd like to book an appointment.\n\nName: ${nameVal}\nService: ${serviceVal}\nDate: ${dateVal}\n\nThank you!`
      );

      // Show WhatsApp option
      if (confirm('Your booking request has been sent! Would you also like to confirm via WhatsApp?')) {
        window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
      }
    }, 1800);
  });
})();

/* ============================================================
   Contact Form (contact.html)
   ============================================================ */
(function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const successMsg = document.getElementById('contact-success');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let valid = true;
    const required = form.querySelectorAll('[required]');
    required.forEach(field => {
      if (!field.value.trim()) {
        field.classList.add('error');
        valid = false;
      } else {
        field.classList.remove('error');
      }
    });

    if (!valid) return;

    const submitBtn = form.querySelector('[type="submit"]');
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;

    setTimeout(() => {
      form.reset();
      submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
      submitBtn.disabled = false;
      if (successMsg) {
        successMsg.style.display = 'block';
        setTimeout(() => { successMsg.style.display = 'none'; }, 6000);
      }
    }, 1500);
  });
})();
