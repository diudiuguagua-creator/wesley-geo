(() => {
  'use strict';
  function initialize(){
    const url=new URL(location.href);
    const reduced=url.searchParams.get('motion')==='off';
    const toggle=document.querySelector('.blog-motion-toggle');
    if(toggle){const target=new URL(url);target.searchParams.set('motion',reduced?'on':'off');toggle.href=target.pathname+target.search;toggle.textContent=reduced?'开启动效':'减少动效';}
    if(reduced) document.querySelectorAll('a[href^="/insights"]:not(.blog-motion-toggle)').forEach(a=>{const href=new URL(a.href);href.searchParams.set('motion','off');a.href=href.pathname+href.search+href.hash;});
    const mobile=document.querySelector('.mmenu-link');
    const navigation=document.querySelector('#fw-menu-primary');
    if(mobile&&navigation){
      mobile.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();mobile.click();}});
      if(reduced) mobile.addEventListener('click',()=>navigation.classList.toggle('active'));
      new MutationObserver(()=>mobile.setAttribute('aria-expanded',String(navigation.classList.contains('active')))).observe(navigation,{attributes:true,attributeFilter:['class']});
    }
    document.querySelectorAll('.home-sort-b,.theme-clear-filters,.theme-no-results-reset').forEach(el=>{
      if(!/^(BUTTON|A|INPUT)$/.test(el.tagName)){el.setAttribute('role','button');el.tabIndex=0;el.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();el.click();}});}
    });
    document.querySelectorAll('.home-sort-b').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('.home-sort-b').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));}));
    const total=document.querySelector('#theme-count-current');
    total?.setAttribute('aria-live','polite');
    // The source catalogue registers its initialization through jQuery ready.
    // Apply the inbound topic after it has initialized all filter defaults.
    const applyTopic=()=>{
      const topic=url.searchParams.get('topic');
      if(['platform','website','review'].includes(topic)&&window.jQuery){
        const inputs=window.jQuery('.theme-filter-list').eq(0).find('input');
        inputs.prop('checked',false).filter(`[value="${topic}"]`).prop('checked',true).trigger('change');
      }
    };
    if(window.jQuery) window.jQuery(applyTopic);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initialize);else initialize();
})();
