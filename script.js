const header = document.querySelector('[data-header]');
const nav = document.querySelector('[data-nav]');
const navToggle = document.querySelector('[data-nav-toggle]');
const navLabel = navToggle?.querySelector('.sr-only');
const dialog = document.querySelector('[data-wechat-dialog]');
const copyStatus = document.querySelector('[data-copy-status]');

const updateHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 12);
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

navToggle?.addEventListener('click', () => {
  const open = nav.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', String(open));
  if (navLabel) navLabel.textContent = open ? '关闭菜单' : '打开菜单';
});

nav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('is-open');
    navToggle?.setAttribute('aria-expanded', 'false');
    if (navLabel) navLabel.textContent = '打开菜单';
  });
});

document.querySelectorAll('[data-wechat-open]').forEach((button) => {
  button.addEventListener('click', () => {
    nav?.classList.remove('is-open');
    navToggle?.setAttribute('aria-expanded', 'false');
    if (navLabel) navLabel.textContent = '打开菜单';
    if (typeof dialog?.showModal === 'function') dialog.showModal();
  });
});

document.querySelector('[data-wechat-close]')?.addEventListener('click', () => dialog.close());
dialog?.addEventListener('click', (event) => {
  if (event.target === dialog) dialog.close();
});

document.querySelector('[data-copy-wechat]')?.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText('Wesleyb2b');
    copyStatus.textContent = '已复制微信号。';
  } catch {
    copyStatus.textContent = '复制失败，请手动复制 Wesleyb2b。';
  }
});

document.querySelector('[data-year]').textContent = new Date().getFullYear();
