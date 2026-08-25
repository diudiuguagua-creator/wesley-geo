const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const navLabel = navToggle?.querySelector(".sr-only");
const serviceMenus = document.querySelectorAll("[data-service-menu]");
const dialog = document.querySelector("[data-wechat-dialog]");

const closeNavigation = () => {
  nav?.classList.remove("is-open");
  navToggle?.setAttribute("aria-expanded", "false");
  serviceMenus.forEach((menu) => menu.removeAttribute("open"));
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

const desktopNavigation = window.matchMedia("(min-width: 1051px)");
desktopNavigation.addEventListener?.("change", (event) => {
  if (event.matches) closeNavigation();
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
    scoreRing?.style.setProperty("--score", String(percent));
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
