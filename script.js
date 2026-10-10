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

// ---------- Dark / light theme toggle (dark is the default) ----------
const themeToggle = document.getElementById('theme-toggle');

function applyTheme(theme) {
  const isLight = theme === 'light';
  document.documentElement.setAttribute('data-theme', theme);
  themeToggle.setAttribute('aria-pressed', String(isLight));
  themeToggle.setAttribute('aria-label', isLight ? 'Switch to dark mode' : 'Switch to light mode');
  themeToggle.textContent = isLight ? 'Dark' : 'Light';
}

let savedTheme = 'dark';
try { savedTheme = localStorage.getItem('theme') || 'dark'; } catch (e) { /* storage unavailable */ }
applyTheme(savedTheme);

themeToggle.addEventListener('click', () => {
  const next = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
  applyTheme(next);
  try { localStorage.setItem('theme', next); } catch (e) { /* ignore */ }
});

// ---------- Animated skill bars (fill when scrolled into view) ----------
const stats = document.querySelectorAll('.stat');

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  stats.forEach(stat => observer.observe(stat));
} else {
  stats.forEach(stat => stat.classList.add('in-view'));
}

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
    status.textContent = 'Message sent! (demo)';
    form.reset();
  } else {
    fields.find(f => f.getAttribute('aria-invalid') === 'true').focus();
  }
});
