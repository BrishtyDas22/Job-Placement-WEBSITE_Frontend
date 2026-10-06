document.documentElement.classList.add('js');
const root = document.documentElement;
const themeButton = document.querySelector('.theme-toggle');
const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
let storedTheme;
try { storedTheme = localStorage.getItem('wolt-theme'); } catch {}
function setTheme(theme) {
  root.dataset.theme = theme;
  themeButton.querySelector('span').textContent = theme === 'dark' ? '☀' : '☾';
  themeButton.setAttribute('aria-label', translate(`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`));
}
setTheme(storedTheme === 'light' || storedTheme === 'dark' ? storedTheme : systemTheme.matches ? 'dark' : 'light');
themeButton.addEventListener('click', () => {
  const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
  setTheme(next);
  storedTheme = next;
  try { localStorage.setItem('wolt-theme', next); } catch {}
});
systemTheme.addEventListener('change', event => { if (!storedTheme) setTheme(event.matches ? 'dark' : 'light'); });
const menu = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
function closeMenu() { navigation.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); menu.setAttribute('aria-label', translate('Open navigation')); }
menu.addEventListener('click', () => {
  const open = navigation.classList.toggle('open');
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', translate(open ? 'Close navigation' : 'Open navigation'));
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape' && navigation.classList.contains('open')) { closeMenu(); menu.focus(); } });
document.addEventListener('click', event => { if (!event.target.closest('.header')) closeMenu(); });
const revealElements = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); } });
  }, { threshold: 0.08 });
  revealElements.forEach((element) => revealObserver.observe(element));
} else { revealElements.forEach(element => element.classList.add('visible')); }
const sections = [...document.querySelectorAll('main section[id]')];
const navLinks = [...navigation.querySelectorAll('a')];
let ticking = false;
function updateScroll() {
  const available = document.documentElement.scrollHeight - innerHeight;
  document.querySelector('.scroll-progress').style.width = `${available > 0 ? scrollY / available * 100 : 0}%`;
  let current = 'home';
  sections.forEach(section => { if (section.getBoundingClientRect().top <= 160) current = section.id; });
  navLinks.forEach(link => { const active = link.hash === `#${current}`; link.classList.toggle('active', active); if (active) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current'); });
  ticking = false;
}
addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(updateScroll); ticking = true; } }, { passive: true });
addEventListener('resize', updateScroll);
updateScroll();
document.querySelectorAll('[data-track]').forEach(card => card.addEventListener('click', () => { document.querySelector('#track-select').value = card.dataset.track; }));
const form = document.querySelector('.application-form');
form.querySelectorAll('input[type="file"]').forEach(input => {
  input.addEventListener('change', () => {
    const file = input.files[0];
    const allowed = input.name === 'cv' ? /\.(pdf|doc|docx)$/i : /\.(jpg|jpeg|png)$/i;
    const error = file && file.size > 5 * 1024 * 1024 ? translate('Please choose a file smaller than 5 MB.') : file && !allowed.test(file.name) ? translate('Please choose a supported file type.') : '';
    input.setCustomValidity(error);
    if (error) input.reportValidity();
  });
});
const dialog = document.querySelector('#preview-dialog');
form.addEventListener('submit', event => {
  event.preventDefault();
  document.querySelector('#preview-name').textContent = form.elements.name.value.trim().split(/\s+/)[0];
  document.querySelector('#preview-track').textContent = translate(form.elements.track.value);
  document.querySelector('.form-status').textContent = translate('Preview ready. Nothing has been submitted.');
  dialog.showModal();
});
document.querySelectorAll('.dialog-close, .dialog-done').forEach(button => button.addEventListener('click', () => dialog.close()));
dialog.addEventListener('click', event => { if (event.target === dialog) { const rect = dialog.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close(); } });
document.querySelector('#year').textContent = new Date().getFullYear();

document.addEventListener('languagechange', () => {
  setTheme(root.dataset.theme);
  menu.setAttribute('aria-label', translate(navigation.classList.contains('open') ? 'Close navigation' : 'Open navigation'));
  document.querySelector('#preview-track').textContent = translate(form.elements.track.value);
  const status = document.querySelector('.form-status');
  if (status.textContent) status.textContent = translate('Preview ready. Nothing has been submitted.');
  form.querySelectorAll('input[type="file"]').forEach(input => {
    const file = input.files[0];
    const allowed = input.name === 'cv' ? /\.(pdf|doc|docx)$/i : /\.(jpg|jpeg|png)$/i;
    input.setCustomValidity(file && file.size > 5 * 1024 * 1024 ? translate('Please choose a file smaller than 5 MB.') : file && !allowed.test(file.name) ? translate('Please choose a supported file type.') : '');
  });
  updateScroll();
});