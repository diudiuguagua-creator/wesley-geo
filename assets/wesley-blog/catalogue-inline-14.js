
// Preloader define
!function(){const e=Number(localStorage.getItem("wpkoi-preloader")||0);window.WPKOI_SHOW_PRELOADER=Date.now()-e>36e5,window.WPKOI_SHOW_PRELOADER&&document.documentElement.classList.add("wpkoi-show-preloader")}();
// Scene mode (elore, JS-scene-init elott) - ld. home.js getSceneMode()/updateSceneMode().
// Cel: a .h-texts .pin-height (555vh/400vh/initial) ne a JS-bol keson (window.load
// + fonts.ready + 3x rAF utan) hozzaadott .scene-portrait/.scene-medium classra varjon,
// mert addig a nem-scopeolt alapertelmezes (555vh) ervenyesul minden eszkozon, mobilon is
// - ez az oka a #themes utani tartalom (pl. .htl-infinite) hatalmas CLS-enek: a 555vh
// hirtelen initial-ra zsugorodik, minden utana kovetkezo tartalom felugrik. Ez a kis,
// szinkron script mar az elso festes elott felteszi a helyes html.wpkoi-scene-* classt,
// a kesobbi JS updateSceneMode() ugyanerre az eredmenyre fog jutni (nagyobb specificitassal
// felul is irja), tehat nincs dupla allapot, csak a kezdeti FOUC-ablak tunik el.
!function(){const w=window.innerWidth,h=window.innerHeight,r=w/h,m=(w<=768||r<9/7)?"portrait":(r<12/7?"medium":"desktop");document.documentElement.classList.add("wpkoi-scene-"+m)}();
