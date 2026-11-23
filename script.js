'use strict';
const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
const navLinks = Array.from(document.querySelectorAll('.main-nav a[href^="#"]'));

function closeMenu() {
  nav.classList.remove('is-open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open navigation');
}
menuButton.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('is-open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
});
navLinks.forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
document.addEventListener('click', e => { if (!nav.contains(e.target) && !menuButton.contains(e.target)) closeMenu(); });
window.addEventListener('resize', () => { if (window.innerWidth > 800) closeMenu(); });

document.getElementById('year').textContent = new Date().getFullYear();

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if ('IntersectionObserver' in window && !reduceMotion) {
  const elements = document.querySelectorAll('.section-heading, .skill-card, .project-card, .cert-card, .about-grid, .resume-panel');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  elements.forEach(el => { el.classList.add('reveal'); observer.observe(el); });
}

const sections = Array.from(document.querySelectorAll('main section[id]'));
if ('IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          const isCurrent = link.getAttribute('href') === `#${entry.target.id}`;
          link.classList.toggle('active', isCurrent);
          if (isCurrent) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      }
    });
  }, { rootMargin: '-25% 0px -65% 0px' });
  sections.forEach(section => sectionObserver.observe(section));
}


// Theme button: light is the initial default; saved preference wins on future visits.
const themeButton = document.querySelector('.theme-toggle');
const themeMeta = document.querySelector('meta[name="theme-color"]');
function syncThemeButton() {
  const dark = document.documentElement.dataset.theme === 'dark';
  themeButton.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
  themeButton.setAttribute('aria-pressed', String(dark));
  themeButton.title = dark ? 'Switch to light theme' : 'Switch to dark theme';
  themeButton.querySelector('.theme-label').textContent = dark ? 'Light mode' : 'Dark mode';
  if (themeMeta) themeMeta.setAttribute('content', dark ? '#0b1720' : '#f8fcfb');
}
syncThemeButton();
themeButton.addEventListener('click', () => {
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  try { localStorage.setItem('portfolio-theme', next); } catch (_) { /* private mode */ }
  syncThemeButton();
});


// SMARTMENU image gallery. Images are local files; no third-party service needed.
const galleryItems = [
  { src: 'assets/projects/welcome.webp', label: 'Welcome screen', alt: 'SMARTMENU landing page' },
  { src: 'assets/projects/customer.webp', label: 'Customer ordering', alt: 'SMARTMENU pizza menu and ordering interface' },
  { src: 'assets/projects/cashier.webp', label: 'Cashier dashboard', alt: 'SMARTMENU cashier dashboard with order details hidden' },
  { src: 'assets/projects/admin.webp', label: 'Admin dashboard', alt: 'SMARTMENU admin product management screen' }
];
const galleryImage = document.querySelector('#gallery-image');
const galleryCaption = document.querySelector('#gallery-caption');
const thumbs = Array.from(document.querySelectorAll('.gallery-thumb'));
const galleryDialog = document.querySelector('.gallery-dialog');
const dialogImage = document.querySelector('#dialog-image');
const dialogCaption = document.querySelector('#dialog-caption');
let galleryIndex = 0;
function showGalleryItem(index) {
  galleryIndex = (index + galleryItems.length) % galleryItems.length;
  const item = galleryItems[galleryIndex];
  galleryImage.src = item.src;
  galleryImage.alt = item.alt;
  galleryCaption.textContent = item.label + ' · ' + (galleryIndex + 1) + ' / ' + galleryItems.length;
  dialogImage.src = item.src;
  dialogImage.alt = item.alt;
  dialogCaption.textContent = item.label;
  thumbs.forEach((btn, i) => {
    const selected = i === galleryIndex;
    btn.classList.toggle('is-selected', selected);
    btn.setAttribute('aria-pressed', String(selected));
  });
}
document.querySelector('.gallery-prev').addEventListener('click', () => showGalleryItem(galleryIndex - 1));
document.querySelector('.gallery-next').addEventListener('click', () => showGalleryItem(galleryIndex + 1));
thumbs.forEach(btn => btn.addEventListener('click', () => showGalleryItem(Number(btn.dataset.index))));
document.querySelector('.gallery-open').addEventListener('click', () => {
  if (typeof galleryDialog.showModal === 'function') galleryDialog.showModal();
  else window.open(galleryItems[galleryIndex].src, '_blank', 'noopener');
});
document.querySelector('.dialog-close').addEventListener('click', () => galleryDialog.close());
galleryDialog.addEventListener('click', event => {
  if (event.target === galleryDialog) galleryDialog.close();
});
