(() => {
  'use strict';
  const url=new URL(location.href);
  const quiet={'/insights':'/insights/quiet','/insights/':'/insights/quiet','/insights/all':'/insights/all-quiet','/insights/all/':'/insights/all-quiet'};
  if(url.searchParams.get('motion')==='off'&&quiet[url.pathname]){url.pathname=quiet[url.pathname];location.replace(url.href);}
  if(url.searchParams.get('motion')==='on'&&/\/(quiet|all-quiet)$/.test(url.pathname)){url.pathname=url.pathname.endsWith('all-quiet')?'/insights/all':'/insights';location.replace(url.href);}
  if(!url.searchParams.has('motion') && matchMedia('(prefers-reduced-motion: reduce)').matches){
    url.searchParams.set('motion','off'); location.replace(url.href);
  }
  window.__WESLEY_BLOG__=Object.freeze({version:'2026-08-31',articleCount:3});
})();
