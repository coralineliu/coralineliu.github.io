// Route before rendering; explicit academic links and deep links stay readable.
(() => {
  const base = new URL('.', document.currentScript.src);
  const desk = location.pathname.startsWith(new URL('desk/', base).pathname);
  const home = location.pathname === base.pathname || location.pathname === new URL('index.html', base).pathname;
  const compact = matchMedia('(max-width: 900px), (pointer: coarse) and (max-width: 1100px)');
  function route() {
    if (desk && compact.matches) {
      const sections = {quote:'about',contact:'about',rick:'projects',mood:'projects','paper-0':'publications','paper-1':'publications',books:'misc',music:'misc',climbing:'misc'};
      const key = location.hash.slice(1);
      const section = sections[key] || key;
      const target = ['blog','misc'].includes(section) ? section + '/' : 'index.html?view=academic';
      location.replace(new URL(target + (section && !['blog','misc'].includes(section) ? '#' + section : ''), base));
    } else if (home && !compact.matches && !location.hash && new URLSearchParams(location.search).get('view') !== 'academic') {
      location.replace(new URL('desk/', base));
    }
  }
  route();
  compact.addEventListener('change', route);
})();
