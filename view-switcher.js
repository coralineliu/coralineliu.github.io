(() => {
  const base = new URL('.', document.currentScript.src);
  const isDesk = /\/desk(?:\/|$)/.test(location.pathname);
  const known = ['about', 'publications', 'projects', 'blog', 'misc'];
  const deskSections = {quote:'about',contact:'about',rick:'projects',mood:'projects','paper-0':'publications','paper-1':'publications',books:'misc',music:'misc',climbing:'misc'};
  function context() {
    const hash = location.hash.slice(1);
    return known.includes(hash) ? hash : deskSections[hash] || known.find(key => location.pathname.includes('/' + key + '/')) || '';
  }
  const style = document.createElement('style');
  style.textContent = '.mode-switch{position:fixed;right:28px;bottom:24px;z-index:40;display:flex;gap:3px;padding:5px;border:1px solid #ffffffd9;border-radius:40px;background:#edf3f8eF;box-shadow:0 5px 24px #263b6420;font:13px/1.4 system-ui,sans-serif;backdrop-filter:blur(16px)}.mode-switch a{padding:10px 19px;border-radius:30px;color:var(--ink-soft,#3d5d92);text-decoration:none}.mode-switch a[aria-current=page]{background:var(--blue,#0b66a3);color:white;box-shadow:0 2px 8px #325a6e22}.mode-switch a:focus-visible{outline:3px solid #8360a3;outline-offset:3px}body:not(.desk-page){padding-bottom:72px}@media(max-width:700px){.mode-switch{bottom:14px;right:14px;font-size:12px}.mode-switch a{padding:9px 15px}}';
  document.head.append(style);
  const nav = document.createElement('nav');
  nav.className = 'mode-switch'; nav.ariaLabel = 'Browsing mode';
  nav.innerHTML = `<a href="${new URL('desk/', base)}" ${isDesk ? 'aria-current="page"' : ''}>Desk View</a><a href="${new URL('index.html', base)}" ${!isDesk ? 'aria-current="page"' : ''}>Academic View</a>`;
  const [desk, academic] = nav.children;
  function update() {
    const key = context();
    desk.href = new URL('desk/' + (isDesk ? location.hash : key ? '#' + key : ''), base);
    academic.href = new URL('index.html' + (key ? '#' + key : ''), base);
  }
  update(); window.addEventListener('hashchange', update);
  if (!isDesk && !context() && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => { for (const entry of entries) if (entry.isIntersecting) desk.href = new URL('desk/#' + entry.target.id, base); }, {rootMargin: '-15% 0px -50% 0px'});
    known.forEach(key => { const section = document.getElementById(key); if (section) observer.observe(section); });
  }
  document.body.append(nav);
})();
