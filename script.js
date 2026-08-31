const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const navLabel = navToggle?.querySelector(".sr-only");
const serviceMenus = document.querySelectorAll("[data-service-menu]");
const dialog = document.querySelector("[data-wechat-dialog]");

nav?.querySelectorAll(":scope > a:not(.button)").forEach((link) => {
  if (link.querySelector(".nav-row-arrow")) return;
  const arrow = document.createElement("span");
  arrow.className = "nav-row-arrow";
  arrow.setAttribute("aria-hidden", "true");
  arrow.textContent = "↘";
  link.append(arrow);
});

serviceMenus.forEach((menu) => {
  const panel = menu.querySelector(".nav-service-menu");
  if (!panel || panel.querySelector(".nav-service-heading")) return;

  const heading = document.createElement("p");
  heading.className = "nav-service-heading";
  heading.textContent = "服务选择 / SERVICE ROUTES";

  const context = document.createElement("aside");
  context.className = "nav-service-context";
  const contextTitle = document.createElement("strong");
  contextTitle.textContent = "先判断，再安排动作";
  const contextCopy = document.createElement("p");
  contextCopy.textContent =
    "平台、页面、内容和销售反馈被拆成可检查的运营路线。";
  const contextNote = document.createElement("p");
  contextNote.textContent = "当前目标：找到最先该修的环节。";
  context.append(contextTitle, contextCopy, contextNote);

  const supportRoutes = [
    {
      code: "MET",
      title: "运营方法",
      copy: "诊断、规划、执行与复盘",
      href: "/method",
    },
    {
      code: "TOOL",
      title: "运营工具",
      copy: "自研工具目录与使用边界",
      href: "/tools",
    },
  ];

  const supportLinks = supportRoutes.map((route) => {
    const link = document.createElement("a");
    link.className = "nav-service-support";
    link.href = route.href;
    if (window.location.pathname === route.href) {
      link.setAttribute("aria-current", "page");
    }
    const code = document.createElement("b");
    code.textContent = route.code;
    const content = document.createElement("span");
    const title = document.createElement("strong");
    title.textContent = route.title;
    const copy = document.createElement("small");
    copy.textContent = route.copy;
    content.append(title, copy);
    link.append(code, content);
    return link;
  });

  const footer = document.createElement("a");
  footer.className = "nav-service-footer";
  footer.href = "/services";
  if (window.location.pathname === "/services") {
    footer.setAttribute("aria-current", "page");
  }
  const footerLabel = document.createElement("span");
  footerLabel.textContent = "不知道选哪条？先看服务总览";
  const footerArrow = document.createElement("span");
  footerArrow.setAttribute("aria-hidden", "true");
  footerArrow.textContent = "↘";
  footer.append(footerLabel, footerArrow);

  panel.prepend(heading);
  panel.append(...supportLinks, context, footer);
});

const pageSurfaces = document.querySelectorAll("main, footer");
const syncPageInert = () => {
  const navigationIsOpen = Boolean(nav?.classList.contains("is-open"));
  const serviceIsOpen = [...serviceMenus].some((menu) =>
    menu.hasAttribute("open"),
  );
  pageSurfaces.forEach((surface) => {
    surface.inert = navigationIsOpen || serviceIsOpen;
  });
};

const closeNavigation = ({ restoreFocus = false } = {}) => {
  const mobileMenuWasOpen = nav?.classList.contains("is-open");
  const openServiceSummary = [...serviceMenus]
    .find((menu) => menu.hasAttribute("open"))
    ?.querySelector("summary");

  nav?.classList.remove("is-open");
  navToggle?.setAttribute("aria-expanded", "false");
  serviceMenus.forEach((menu) => menu.removeAttribute("open"));
  document.body.classList.remove("nav-open");
  syncPageInert();
  if (navLabel) navLabel.textContent = "打开菜单";

  if (restoreFocus) {
    if (mobileMenuWasOpen) navToggle?.focus();
    else openServiceSummary?.focus();
  }
};

navToggle?.addEventListener("click", () => {
  const open = !nav?.classList.contains("is-open");
  nav?.classList.toggle("is-open", open);
  navToggle.setAttribute("aria-expanded", String(open));
  document.body.classList.toggle("nav-open", open);
  syncPageInert();
  if (navLabel) navLabel.textContent = open ? "关闭菜单" : "打开菜单";
});

const desktopNavigation = window.matchMedia("(min-width: 1051px)");
const hoverNavigation = window.matchMedia(
  "(hover: hover) and (pointer: fine) and (min-width: 1051px)",
);

desktopNavigation.addEventListener?.("change", () => {
  closeNavigation();
});

serviceMenus.forEach((menu) => {
  menu.addEventListener("toggle", syncPageInert);

  menu.addEventListener("pointerenter", () => {
    if (hoverNavigation.matches) menu.setAttribute("open", "");
  });

  menu.addEventListener("pointerleave", () => {
    if (hoverNavigation.matches && !menu.matches(":focus-within")) {
      menu.removeAttribute("open");
    }
  });

  menu.addEventListener("focusin", () => {
    if (desktopNavigation.matches) menu.setAttribute("open", "");
  });

  menu.addEventListener("focusout", (event) => {
    const nextTarget = event.relatedTarget;
    if (
      desktopNavigation.matches &&
      (!(nextTarget instanceof Node) || !menu.contains(nextTarget))
    ) {
      menu.removeAttribute("open");
    }
  });
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
    closeNavigation({ restoreFocus: true });
  }

  if (event.key === "Tab" && nav?.classList.contains("is-open")) {
    const focusable = [
      navToggle,
      ...nav.querySelectorAll('a, summary, button:not([disabled]), [tabindex="0"]'),
    ].filter(Boolean);
    const first = focusable[0];
    const last = focusable.at(-1);

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
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

const assessment = document.querySelector("[data-channel-assessment]");

if (assessment) {
  const inputs = [...assessment.querySelectorAll('input[type="checkbox"]')];
  const scoreNode = assessment.querySelector("[data-score]");
  const scoreRing = assessment.querySelector("[data-score-ring]");
  const labelNode = assessment.querySelector("[data-result-label]");
  const titleNode = assessment.querySelector("[data-result-title]");
  const copyNode = assessment.querySelector("[data-result-copy]");
  const statusNode = assessment.querySelector("[data-assessment-status]");
  let resultText = "";

  const updateAssessment = () => {
    const selected = inputs.filter((input) => input.checked);
    const grouped = {};

    inputs.forEach((input) => {
      const group = input.dataset.group;
      if (!grouped[group]) grouped[group] = { complete: 0, total: 0 };
      grouped[group].total += 1;
      if (input.checked) grouped[group].complete += 1;
    });

    const score = selected.length;
    const percent = Math.round((score / inputs.length) * 100);
    const weakest = Object.entries(grouped).sort(
      ([, a], [, b]) => a.complete / a.total - b.complete / b.total,
    )[0];

    scoreNode.textContent = String(score);
    scoreRing?.setAttribute("data-score-percent", String(percent));
    if (statusNode) statusNode.textContent = "";

    if (score === 0) {
      labelNode.textContent = "勾选真实完成项后生成判断";
      titleNode.textContent = "还未开始自检";
      copyNode.textContent = "系统会优先显示完成度最低的一层，并给出下一步建议。";
      resultText = "外贸渠道运营自检：尚未勾选已完成项目。";
      return;
    }

    const [weakestName, weakestScore] = weakest;
    const completion = `${weakestScore.complete}/${weakestScore.total}`;
    const guidance = {
      事实基础: "先统一产品、市场、参数和素材权限；事实不稳定时，继续扩内容会放大返工。",
      页面承接: "先检查核心页面是否回答采购问题，并在移动端完成一次真实咨询路径测试。",
      渠道追踪: "先建立动作日期、页面版本、流量与询盘的同周期记录，再判断变化原因。",
      销售反馈: "先为每条询盘补齐负责人、有效性原因和下一步，让运营获得业务反馈。",
    };

    labelNode.textContent = `当前完成 ${score}/${inputs.length} 项`;
    titleNode.textContent = `优先补齐：${weakestName}`;
    copyNode.textContent = `${weakestName}当前完成 ${completion}。${guidance[weakestName]}`;
    resultText = [
      `外贸渠道运营自检：${score}/${inputs.length} 项已完成。`,
      `优先补齐：${weakestName}（${completion}）。`,
      guidance[weakestName],
    ].join("\n");
  };

  inputs.forEach((input) => input.addEventListener("change", updateAssessment));
  assessment.addEventListener("submit", (event) => {
    event.preventDefault();
    updateAssessment();
  });
  assessment.addEventListener("reset", () => setTimeout(updateAssessment));
  assessment
    .querySelector("[data-copy-assessment]")
    ?.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(resultText);
        if (statusNode) statusNode.textContent = "已复制自检结果。";
      } catch {
        if (statusNode) statusNode.textContent = "复制失败，请手动记录结果。";
      }
    });
  updateAssessment();
}

document.querySelectorAll("[data-copy-template]").forEach((button) => {
  button.addEventListener("click", async () => {
    const template = document.getElementById(button.dataset.copyTemplate);
    const section = button.closest("section");
    const status = section?.querySelector("[data-template-status]");
    const content = template?.content.textContent.trim();

    if (!content) return;
    try {
      await navigator.clipboard.writeText(content);
      if (status) status.textContent = "模板已复制，可以粘贴到你的工作记录中。";
    } catch {
      if (status) status.textContent = "复制失败，请手动选择模板内容。";
    }
  });
});

/*
 * Homepage Dot Grid
 *
 * This is intentionally a progressive-enhancement-only decoration. The
 * canvas never captures pointer input, keeps content/card areas subdued, and
 * switches to an entirely static drawing for touch layouts and for visitors
 * who request reduced motion.
 */
const dotGridCanvas = document.querySelector("[data-dot-grid]");

if (dotGridCanvas instanceof HTMLCanvasElement) {
  const dotGridHero = dotGridCanvas.closest(".home-hero");
  const dotGridContext = dotGridCanvas.getContext("2d");
  const dotGridFinePointer = window.matchMedia(
    "(hover: hover) and (pointer: fine) and (min-width: 1051px)",
  );
  const dotGridReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  );

  if (dotGridHero && dotGridContext) {
    const dotGridState = {
      width: 0,
      height: 0,
      dpr: 1,
      pointerX: 0,
      pointerY: 0,
      targetX: 0,
      targetY: 0,
      energy: 0,
      inside: false,
      frame: 0,
      lastFrame: 0,
      listening: false,
    };

    const getDotGridProtectedAreas = () =>
      [
        dotGridHero.querySelector(".evidence-hero-copy"),
        dotGridHero.querySelector(".hero-answer"),
      ]
        .filter(Boolean)
        .map((node) => {
          const heroRect = dotGridHero.getBoundingClientRect();
          const rect = node.getBoundingClientRect();
          return {
            left: rect.left - heroRect.left - 34,
            top: rect.top - heroRect.top - 26,
            right: rect.right - heroRect.left + 34,
            bottom: rect.bottom - heroRect.top + 26,
          };
        });

    const isInDotGridProtectedArea = (x, y, protectedAreas) =>
      protectedAreas.some(
        (area) =>
          x >= area.left &&
          x <= area.right &&
          y >= area.top &&
          y <= area.bottom,
      );

    const drawDotGrid = () => {
      const { width, height, dpr } = dotGridState;
      if (!width || !height) return;

      const context = dotGridContext;
      const spacing = width < 720 ? 30 : 31;
      const protectedAreas = getDotGridProtectedAreas();
      const influenceRadius = 148;
      const hasPointerEffect = dotGridState.energy > 0.008;

      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, width, height);

      for (let y = spacing / 2; y < height; y += spacing) {
        for (let x = spacing / 2; x < width; x += spacing) {
          const protectedArea = isInDotGridProtectedArea(x, y, protectedAreas);
          const edgeDistance = Math.min(x, width - x, y, height - y);
          const edgeBoost = Math.min(1, edgeDistance / 110);
          let alpha = (0.13 + (1 - edgeBoost) * 0.09) * (protectedArea ? 0.2 : 1);
          let offsetX = 0;
          let offsetY = 0;

          if (hasPointerEffect) {
            const xDistance = x - dotGridState.pointerX;
            const yDistance = y - dotGridState.pointerY;
            const distance = Math.hypot(xDistance, yDistance);

            if (distance < influenceRadius) {
              const effect = (1 - distance / influenceRadius) ** 2 * dotGridState.energy;
              const directionX = distance ? xDistance / distance : 0;
              const directionY = distance ? yDistance / distance : 0;
              alpha += effect * (protectedArea ? 0.08 : 0.28);
              offsetX = directionX * effect * 3.4;
              offsetY = directionY * effect * 3.4;
            }
          }

          context.beginPath();
          context.fillStyle = `rgba(42, 112, 166, ${Math.min(alpha, 0.48)})`;
          context.arc(x + offsetX, y + offsetY, 1, 0, Math.PI * 2);
          context.fill();
        }
      }
    };

    const stopDotGridFrame = () => {
      if (dotGridState.frame) {
        window.cancelAnimationFrame(dotGridState.frame);
        dotGridState.frame = 0;
      }
    };

    const animateDotGrid = (timestamp) => {
      const elapsed = dotGridState.lastFrame
        ? Math.min(timestamp - dotGridState.lastFrame, 48)
        : 16;
      dotGridState.lastFrame = timestamp;

      if (dotGridState.inside) {
        dotGridState.pointerX += (dotGridState.targetX - dotGridState.pointerX) * 0.22;
        dotGridState.pointerY += (dotGridState.targetY - dotGridState.pointerY) * 0.22;
        dotGridState.energy = 1;
      } else {
        dotGridState.energy = Math.max(0, dotGridState.energy - elapsed / 300);
      }

      drawDotGrid();

      if (dotGridState.inside || dotGridState.energy > 0.008) {
        dotGridState.frame = window.requestAnimationFrame(animateDotGrid);
      } else {
        dotGridState.frame = 0;
        dotGridState.lastFrame = 0;
      }
    };

    const requestDotGridFrame = () => {
      if (!dotGridState.frame) {
        dotGridState.frame = window.requestAnimationFrame(animateDotGrid);
      }
    };

    const updateDotGridPointer = (event) => {
      const rect = dotGridHero.getBoundingClientRect();
      dotGridState.targetX = event.clientX - rect.left;
      dotGridState.targetY = event.clientY - rect.top;

      if (!dotGridState.inside) {
        dotGridState.pointerX = dotGridState.targetX;
        dotGridState.pointerY = dotGridState.targetY;
      }

      dotGridState.inside = true;
      dotGridState.energy = 1;
      requestDotGridFrame();
    };

    const leaveDotGrid = () => {
      dotGridState.inside = false;
      requestDotGridFrame();
    };

    const enableDotGridInteraction = () => {
      if (dotGridState.listening) return;
      dotGridHero.addEventListener("pointermove", updateDotGridPointer, { passive: true });
      dotGridHero.addEventListener("pointerleave", leaveDotGrid, { passive: true });
      dotGridState.listening = true;
    };

    const disableDotGridInteraction = () => {
      if (!dotGridState.listening) return;
      dotGridHero.removeEventListener("pointermove", updateDotGridPointer);
      dotGridHero.removeEventListener("pointerleave", leaveDotGrid);
      dotGridState.listening = false;
      dotGridState.inside = false;
      dotGridState.energy = 0;
      stopDotGridFrame();
    };

    const syncDotGridMode = () => {
      const canAnimate = dotGridFinePointer.matches && !dotGridReducedMotion.matches;
      if (canAnimate) enableDotGridInteraction();
      else disableDotGridInteraction();
      drawDotGrid();
    };

    const resizeDotGrid = () => {
      const rect = dotGridHero.getBoundingClientRect();
      const width = Math.max(0, Math.round(rect.width));
      const height = Math.max(0, Math.round(rect.height));
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      if (
        width === dotGridState.width &&
        height === dotGridState.height &&
        dpr === dotGridState.dpr
      ) {
        return;
      }

      dotGridState.width = width;
      dotGridState.height = height;
      dotGridState.dpr = dpr;
      dotGridCanvas.width = Math.max(1, width * dpr);
      dotGridCanvas.height = Math.max(1, height * dpr);
      dotGridCanvas.style.width = `${width}px`;
      dotGridCanvas.style.height = `${height}px`;
      drawDotGrid();
    };

    if ("ResizeObserver" in window) {
      const dotGridResizeObserver = new ResizeObserver(resizeDotGrid);
      dotGridResizeObserver.observe(dotGridHero);
    } else {
      window.addEventListener("resize", resizeDotGrid, { passive: true });
    }
    dotGridFinePointer.addEventListener?.("change", syncDotGridMode);
    dotGridReducedMotion.addEventListener?.("change", syncDotGridMode);
    window.addEventListener("pageshow", resizeDotGrid, { passive: true });

    resizeDotGrid();
    syncDotGridMode();
  }
}
