// ---------- Footer year ----------
document.getElementById('year').textContent = new Date().getFullYear();

// ---------- Mobile navigation toggle ----------
const navToggle = document.getElementById('nav-toggle');
const siteNav = document.getElementById('site-nav');

navToggle.addEventListener('click', () => {
  const isOpen = siteNav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

siteNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    siteNav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// ---------- Dark / light theme toggle ----------
const themeToggle = document.getElementById('theme-toggle');

function applyTheme(theme) {
  const isDark = theme === 'dark';
  document.documentElement.setAttribute('data-theme', theme);
  themeToggle.setAttribute('aria-pressed', String(isDark));
  themeToggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
  themeToggle.innerHTML = isDark ? '&#9728;&#65039; Light' : '&#127769; Dark';
}

let savedTheme = 'light';
try { savedTheme = localStorage.getItem('theme') || 'light'; } catch (e) { /* storage unavailable */ }
applyTheme(savedTheme);

themeToggle.addEventListener('click', () => {
  const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  try { localStorage.setItem('theme', next); } catch (e) { /* ignore */ }
});

// ---------- Project filter ----------
const filterButtons = document.querySelectorAll('.filter-btn');
const cards = document.querySelectorAll('.card');

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const filter = btn.dataset.filter;

    filterButtons.forEach(b => {
      const active = b === btn;
      b.classList.toggle('active', active);
      b.setAttribute('aria-pressed', String(active));
    });

    cards.forEach(card => {
      card.hidden = !(filter === 'all' || card.dataset.category === filter);
    });
  });
});

// ---------- Contact form validation ----------
const form = document.getElementById('contact-form');
const status = document.getElementById('form-status');

function setError(input, message) {
  const errorEl = document.getElementById(input.id + '-error');
  errorEl.textContent = message;
  input.setAttribute('aria-invalid', message ? 'true' : 'false');
}

function validateField(input) {
  const value = input.value.trim();
  if (!value) {
    setError(input, 'This field is required.');
    return false;
  }
  if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    setError(input, 'Please enter a valid email address.');
    return false;
  }
  setError(input, '');
  return true;
}

form.querySelectorAll('input, textarea').forEach(field => {
  field.addEventListener('blur', () => validateField(field));
});

form.addEventListener('submit', event => {
  event.preventDefault();
  status.textContent = '';

  const fields = [...form.querySelectorAll('input, textarea')];
  const allValid = fields.map(validateField).every(Boolean);

  if (allValid) {
    status.textContent = 'Thanks! Your message has been sent (demo).';
    form.reset();
  } else {
    fields.find(f => f.getAttribute('aria-invalid') === 'true').focus();
  }
});
