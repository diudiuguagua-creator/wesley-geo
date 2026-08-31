/* Keep the original animated tags, but measure their text outside moving cards. */
(function () {
  "use strict";
  if (window.__WPKOI_LAYOUT_REPAIR__) return;
  window.__WPKOI_LAYOUT_REPAIR__ = Object.freeze({ version: "1.0.0", scope: "homepage-card-tags" });

  const selector = '.home-theme-loop .theme-type a[data-scramble-ready="true"]';
  const pending = new Map();
  const observed = new WeakSet();
  const observedWidths = new WeakMap();
  const typeProperties = [
    "fontFamily", "fontSize", "fontWeight", "fontStyle", "fontStretch",
    "fontVariant", "fontKerning", "fontFeatureSettings", "fontVariationSettings",
    "letterSpacing", "wordSpacing", "textTransform", "textIndent", "direction",
  ];

  function eligible(element) {
    return document.body?.classList.contains("home") && window.innerWidth >= 768
      && element.isConnected && element.matches(selector) && element.dataset.scrambleText;
  }

  function measure(element) {
    if (!eligible(element)) return;
    const computed = getComputedStyle(element);
    const probe = document.createElement("span");
    probe.setAttribute("aria-hidden", "true");
    probe.style.cssText = "position:fixed;left:-10000px;top:0;display:inline-block;visibility:hidden;pointer-events:none;white-space:pre;width:auto;min-width:0;max-width:none;height:auto;margin:0;padding:0;border:0;transform:none;transition:none;animation:none;";
    for (const property of typeProperties) probe.style[property] = computed[property];
    probe.textContent = element.dataset.scrambleText;
    document.body.appendChild(probe);
    let width;
    try { width = Math.ceil(probe.getBoundingClientRect().width); }
    finally { probe.remove(); }
    if (!(width > 0 && Number.isFinite(width))) return;
    const value = `${width}px`;
    observedWidths.set(element, value);
    if (element.style.width !== value) element.style.width = value;
  }

  function schedule(element) {
    if (!eligible(element)) return;
    const previous = pending.get(element);
    if (previous?.timer) clearTimeout(previous.timer);
    const work = { timer: undefined };
    pending.set(element, work);
    const fontsReady = document.fonts?.ready || Promise.resolve();
    fontsReady.then(() => {
      if (pending.get(element) !== work) return;
      // The source has a 0.2s transition on these anchors. Do not sample it mid-frame.
      work.timer = setTimeout(() => {
        if (pending.get(element) !== work) return;
        pending.delete(element);
        measure(element);
      }, 250);
    });
  }

  function initialize() {
    if (!document.body.classList.contains("home")) return;
    const widthObserver = new MutationObserver((records) => {
      for (const { target } of records) {
        if (observedWidths.get(target) === target.style.width) continue;
        observedWidths.set(target, target.style.width);
        schedule(target);
      }
    });
    function watch(element) {
      if (!eligible(element)) return;
      if (!observed.has(element)) {
        observed.add(element);
        observedWidths.set(element, element.style.width);
        widthObserver.observe(element, { attributes: true, attributeFilter: ["style"] });
      }
      schedule(element);
    }
    function refresh() { document.querySelectorAll(selector).forEach(watch); }
    new MutationObserver((records) => {
      for (const { target } of records) watch(target);
    }).observe(document.body, { subtree: true, attributes: true, attributeFilter: ["data-scramble-ready"] });
    refresh();
    window.addEventListener("load", refresh);
    window.addEventListener("resize", refresh);
    document.addEventListener("visibilitychange", () => { if (!document.hidden) refresh(); });
    document.fonts?.addEventListener("loadingdone", refresh);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initialize, { once: true });
  else initialize();
})();
