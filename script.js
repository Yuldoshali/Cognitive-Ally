/* ================================================
   COGNITIVE ALLY — script.js
   All 3 mouse events from the chart:
   1. click        — Change colors on click
   2. mouseover    — Move elements on hover
   3. mousemove    — Parallax glow follows cursor
   + Show/hide content (FAQ accordion)
   ================================================ */


/* ── 3. MOUSEMOVE — PARALLAX GLOW IN HERO ──────────
   As the mouse moves across the hero section,
   a soft glowing orb follows the cursor position.
   This is a parallax / cursor trail effect.
-------------------------------------------------- */
const hero = document.querySelector('.hero');

if (hero) {
  // Create the glow orb element
  const glow = document.createElement('div');
  glow.id = 'hero-glow';
  hero.appendChild(glow);

  hero.addEventListener('mousemove', (e) => {
    const rect   = hero.getBoundingClientRect();
    const x      = e.clientX - rect.left;
    const y      = e.clientY - rect.top;
    glow.style.left = x + 'px';
    glow.style.top  = y + 'px';
    glow.style.opacity = '1';
  });

  hero.addEventListener('mouseleave', () => {
    glow.style.opacity = '0';
  });
}


/* ── 1. CHANGE COLOR ON CLICK ──────────────────────
   The hero CTA button cycles through brand colors
   each time it is clicked.
-------------------------------------------------- */
const colorBtn = document.getElementById('color-btn');
const colors = ['#1a2744', '#1e3a8a', '#6cc4e0', '#57a87a', '#e05c6c'];
const labels = [
  'Get Cognitive Ally free →',
  'Color 2 — click again →',
  'Color 3 — click again →',
  'Color 4 — click again →',
  'Color 5 — click again →'
];
let colorIndex = 0;

if (colorBtn) {
  colorBtn.addEventListener('click', (e) => {
    e.preventDefault();
    colorIndex = (colorIndex + 1) % colors.length;
    colorBtn.style.background = colors[colorIndex];
    colorBtn.textContent = labels[colorIndex];
  });
}


/* ── 2. MOVE ELEMENTS ON HOVER ─────────────────────
   Service rows rise smoothly when the mouse
   enters them, and drop back when it leaves.
-------------------------------------------------- */
const serviceRows = document.querySelectorAll('.service-row');

serviceRows.forEach(row => {
  row.addEventListener('mouseenter', () => {
    row.classList.add('hovered');
  });
  row.addEventListener('mouseleave', () => {
    row.classList.remove('hovered');
  });
});


/* ── 3. SHOW / HIDE CONTENT (FAQ ACCORDION) ────────
   Click a question → answer smoothly appears.
   Click again → answer smoothly hides.
   Only one answer open at a time.
-------------------------------------------------- */
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
  const question = item.querySelector('.faq-question');
  const answer   = item.querySelector('.faq-answer');
  const icon     = item.querySelector('.faq-icon');

  question.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');

    // Close all open items first
    faqItems.forEach(other => {
      other.classList.remove('open');
      other.querySelector('.faq-answer').style.maxHeight = null;
      other.querySelector('.faq-icon').textContent = '+';
    });

    // If it wasn't open, open it now
    if (!isOpen) {
      item.classList.add('open');
      answer.style.maxHeight = answer.scrollHeight + 'px';
      icon.textContent = '×';
    }
  });
});


/* ── CONTACT FORM SUBMISSION ────────────────────────
   Collects Name, Email, Message and sends to
   Google Sheets via Apps Script.
   Replace APPS_SCRIPT_URL with your deployed URL.
-------------------------------------------------- */
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwBbAvegSkSYR11HrInG-QxUA85xey1gif-_KOJR-W5sVopgeUvBSdqWjf2O-avh1KB/exec';

const contactForm = document.getElementById('contact-form');
const submitBtn   = document.getElementById('submit-btn');
const formStatus  = document.getElementById('form-status');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = {
      name:    document.getElementById('cf-name').value.trim(),
      email:   document.getElementById('cf-email').value.trim(),
      message: document.getElementById('cf-message').value.trim()
    };

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    formStatus.className = 'form-status';

    try {
      // Send as FormData — required for no-cors mode with Google Apps Script
      const formData = new FormData();
      formData.append('name',    data.name);
      formData.append('email',   data.email);
      formData.append('message', data.message);

      await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: formData
      });

      // no-cors always returns opaque response so we assume success if no error thrown
      formStatus.textContent = '✓ Message sent! We\'ll be in touch within 24 hours.';
      formStatus.className = 'form-status success';
      contactForm.reset();

    } catch (err) {
      formStatus.textContent = '✗ Something went wrong. Please check your connection and try again.';
      formStatus.className = 'form-status error';
    }

    submitBtn.disabled = false;
    submitBtn.textContent = 'Send Message →';
  });
}