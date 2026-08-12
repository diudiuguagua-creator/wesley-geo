const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const navLabel = navToggle?.querySelector(".sr-only");
const serviceMenus = document.querySelectorAll("[data-service-menu]");
const dialog = document.querySelector("[data-wechat-dialog]");

const closeNavigation = () => {
  nav?.classList.remove("is-open");
  navToggle?.setAttribute("aria-expanded", "false");
  document.body.classList.remove("nav-open");
  if (navLabel) navLabel.textContent = "打开菜单";
};

navToggle?.addEventListener("click", () => {
  const open = !nav?.classList.contains("is-open");
  nav?.classList.toggle("is-open", open);
  navToggle.setAttribute("aria-expanded", String(open));
  document.body.classList.toggle("nav-open", open);
  if (navLabel) navLabel.textContent = open ? "关闭菜单" : "打开菜单";
});

nav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    serviceMenus.forEach((menu) => menu.removeAttribute("open"));
    closeNavigation();
  });
});

document.addEventListener("click", (event) => {
  serviceMenus.forEach((menu) => {
    if (!menu.contains(event.target)) menu.removeAttribute("open");
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    serviceMenus.forEach((menu) => menu.removeAttribute("open"));
    closeNavigation();
  }
});

document.querySelectorAll("[data-wechat-open]").forEach((button) => {
  button.addEventListener("click", () => {
    closeNavigation();
    if (typeof dialog?.showModal === "function") dialog.showModal();
  });
});

document
  .querySelector("[data-wechat-close]")
  ?.addEventListener("click", () => dialog?.close());
dialog?.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});

document.querySelectorAll("[data-copy-wechat]").forEach((button) => {
  button.addEventListener("click", async () => {
    const scope = button.closest("[data-wechat-scope]") || document;
    const status = scope.querySelector("[data-copy-status]");
    try {
      await navigator.clipboard.writeText("Wesleyb2b");
      if (status) status.textContent = "已复制微信号 Wesleyb2b。";
    } catch {
      if (status) status.textContent = "复制失败，请手动复制 Wesleyb2b。";
    }
  });
});

document.querySelectorAll("[data-year]").forEach((node) => {
  node.textContent = new Date().getFullYear();
});
