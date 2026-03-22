/**
 * PRINCIPE DEL PACIFICO — Main JS
 * js/main.js
 * Version: 1.0 — March 2026
 */

/* ══════════════════════════════════════════════
   HEADER — scroll state
══════════════════════════════════════════════ */
const hdr = document.getElementById('hdr');
if (hdr) {
  window.addEventListener('scroll', () => {
    hdr.classList.toggle('on', window.scrollY > 60);
  }, { passive: true });
}

/* ══════════════════════════════════════════════
   MOBILE MENU
══════════════════════════════════════════════ */
const mmenu = document.getElementById('mmenu');
const ham   = document.getElementById('ham');
let menuOpen = false;

function toggleMobile() {
  menuOpen ? closeMobile() : openMobile();
}

function openMobile() {
  menuOpen = true;
  mmenu.style.display = 'flex';
  requestAnimationFrame(() => mmenu.classList.add('open'));
  ham.classList.add('open');
  ham.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
  mmenu.setAttribute('aria-hidden', 'false');
}

function closeMobile() {
  menuOpen = false;
  mmenu.classList.remove('open');
  ham.classList.remove('open');
  ham.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
  mmenu.setAttribute('aria-hidden', 'true');
  setTimeout(() => {
    if (!menuOpen) mmenu.style.display = 'none';
  }, 260);
}

// Close on ESC key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && menuOpen) closeMobile();
});

// Close on backdrop click
if (mmenu) {
  mmenu.addEventListener('click', e => {
    if (e.target === mmenu) closeMobile();
  });
}

/* ══════════════════════════════════════════════
   SEARCH WIDGET
══════════════════════════════════════════════ */
const ciEl = document.getElementById('ci');
const coEl = document.getElementById('co');

if (ciEl && coEl) {
  // Set min date to today
  const today = new Date().toISOString().split('T')[0];
  ciEl.min = today;
  coEl.min = today;

  // Pre-fill from URL params (user navigated back from listing)
  const params = new URLSearchParams(window.location.search);
  if (params.get('checkin'))  ciEl.value = params.get('checkin');
  if (params.get('checkout')) coEl.value = params.get('checkout');
  if (params.get('guests')) {
    const guEl = document.getElementById('gu');
    if (guEl) guEl.value = params.get('guests');
  }

  // Update checkout min when checkin changes
  ciEl.addEventListener('change', () => {
    coEl.min = ciEl.value;
    if (coEl.value && coEl.value <= ciEl.value) coEl.value = '';
    document.getElementById('sf-ci')?.classList.remove('err');
  });

  coEl.addEventListener('change', () => {
    document.getElementById('sf-co')?.classList.remove('err');
  });
}

function handleSearch(e) {
  e.preventDefault();

  const ci = ciEl?.value;
  const co = coEl?.value;
  const gu = document.getElementById('gu')?.value || '2';

  let hasError = false;

  if (!ci) {
    document.getElementById('sf-ci')?.classList.add('err');
    hasError = true;
  }
  if (!co) {
    document.getElementById('sf-co')?.classList.add('err');
    hasError = true;
  }
  if (hasError) return;

  // Redirect to listing with params
  const searchParams = new URLSearchParams({ checkin: ci, checkout: co, guests: gu });
  window.location.href = `/appartamenti?${searchParams}`;

  // ── DEV ONLY: remove before launch ──
  // console.log(`Search: ${ci} → ${co}, ${gu} guests`);
}

/* ══════════════════════════════════════════════
   MOBILE STICKY CTA — show after hero scrolls out
══════════════════════════════════════════════ */
const mobCta = document.getElementById('mob-cta');
const heroEl = document.querySelector('.hero');

if (mobCta && heroEl) {
  const mobObs = new IntersectionObserver(([entry]) => {
    mobCta.classList.toggle('show', !entry.isIntersecting);
  }, { threshold: 0 });
  mobObs.observe(heroEl);
}

/* ══════════════════════════════════════════════
   SCROLL ANIMATIONS — apartment & review cards
══════════════════════════════════════════════ */
const animObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('vis');
      animObs.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.08,
  rootMargin: '0px 0px -30px 0px'
});

document.querySelectorAll('.apt-card, .rev-card').forEach(el => {
  animObs.observe(el);
});
