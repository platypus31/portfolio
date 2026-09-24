// 極簡 JS：Tab 切換、Lightbox 左右切換（含手機滑動 + 鍵盤）、圖片淡入。
// 無 build step、無外部套件。動畫全部包在 CSS 的 prefers-reduced-motion 判斷內，
// 這支檔案只負責「加/移除 class」，實際動不動由 CSS 決定。
(function () {
  "use strict";

  var STAGGER_STEP = 40; // ms
  var STAGGER_CAP = 600; // ms 上限，圖多就不逐張等

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  // ---- 作品格線渲染 ----
  function renderGrid(container, items) {
    if (!container) return;
    var groupId = container.getAttribute("data-group");
    container.innerHTML = "";
    items.forEach(function (item, idx) {
      var fig = document.createElement("div");
      fig.className = "grid-item";
      fig.setAttribute("data-index", idx);
      fig.innerHTML =
        '<img src="images/' + item.thumb + '" alt="' + escapeHtml(item.title) + '" loading="lazy">' +
        '<div class="cap">' + escapeHtml(item.title) + "</div>";
      fig.addEventListener("click", function () {
        openLightbox(groupId, idx);
      });
      container.appendChild(fig);
    });
  }

  // 對一個容器範圍內的 .grid-item 播放依序錯開淡入
  function playStagger(scopeEl) {
    if (!scopeEl) return;
    var items = scopeEl.querySelectorAll(".grid-item");
    items.forEach(function (el, i) {
      el.classList.remove("show");
      var delay = Math.min(i * STAGGER_STEP, STAGGER_CAP);
      el.style.transitionDelay = delay + "ms";
    });
    void scopeEl.offsetWidth; // 強制 reflow，確保 transition 會播放
    requestAnimationFrame(function () {
      items.forEach(function (el) { el.classList.add("show"); });
    });
  }

  // ---- Lightbox ----
  var lbState = { group: null, index: 0 };
  var lbEl, lbImg, lbCaption;
  var touchStartX = null, touchStartY = null;

  function openLightbox(groupKey, index) {
    lbState.group = groupKey;
    lbState.index = index;
    renderLightboxImage();
    lbEl.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lbEl.classList.remove("open");
    document.body.style.overflow = "";
  }

  function renderLightboxImage() {
    var items = PORTFOLIO_DATA[lbState.group] || [];
    if (!items.length) return;
    var item = items[lbState.index];
    lbImg.src = "images/" + item.full;
    lbImg.alt = item.title;
    lbCaption.textContent = item.title + "（" + (lbState.index + 1) + " / " + items.length + "）";
  }

  function updateLightbox() {
    lbImg.classList.add("fading");
    window.setTimeout(function () {
      renderLightboxImage();
      lbImg.classList.remove("fading");
    }, 120);
  }

  function stepLightbox(delta) {
    var items = PORTFOLIO_DATA[lbState.group] || [];
    if (!items.length) return;
    lbState.index = (lbState.index + delta + items.length) % items.length;
    updateLightbox();
  }

  function initLightbox() {
    lbEl = document.getElementById("lightbox");
    lbImg = document.getElementById("lb-img");
    lbCaption = document.getElementById("lb-caption");
    document.getElementById("lb-close").addEventListener("click", closeLightbox);
    document.getElementById("lb-prev").addEventListener("click", function () { stepLightbox(-1); });
    document.getElementById("lb-next").addEventListener("click", function () { stepLightbox(1); });
    lbEl.addEventListener("click", function (e) {
      if (e.target === lbEl) closeLightbox();
    });
    document.addEventListener("keydown", function (e) {
      if (!lbEl.classList.contains("open")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") stepLightbox(-1);
      if (e.key === "ArrowRight") stepLightbox(1);
    });
    // 手機左右滑動切換
    lbEl.addEventListener("touchstart", function (e) {
      if (e.touches.length !== 1) return;
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }, { passive: true });
    lbEl.addEventListener("touchend", function (e) {
      if (touchStartX === null) return;
      var endX = (e.changedTouches && e.changedTouches[0].clientX) || touchStartX;
      var endY = (e.changedTouches && e.changedTouches[0].clientY) || touchStartY;
      var dx = endX - touchStartX;
      var dy = endY - touchStartY;
      touchStartX = null;
      touchStartY = null;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
        stepLightbox(dx < 0 ? 1 : -1);
      }
    }, { passive: true });
  }

  // ---- Tabs ----
  function initTabs(tabGroupEl) {
    var buttons = tabGroupEl.querySelectorAll(".tab-btn");
    var panels = tabGroupEl.parentElement.querySelectorAll(".tab-panel");
    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        buttons.forEach(function (b) { b.classList.remove("active"); });
        panels.forEach(function (p) { p.classList.remove("active"); });
        btn.classList.add("active");
        var target = document.getElementById(btn.getAttribute("data-target"));
        if (target) {
          target.classList.add("active");
          playStagger(target);
        }
      });
    });
  }

  // ---- Menu toggle ----
  function initMenuToggle() {
    var btn = document.getElementById("menu-toggle");
    var nav = document.getElementById("main-nav");
    if (!btn || !nav) return;
    btn.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("open");
        btn.setAttribute("aria-expanded", "false");
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initLightbox();
    initMenuToggle();

    document.querySelectorAll(".grid[data-group]").forEach(function (grid) {
      var key = grid.getAttribute("data-group");
      var items = PORTFOLIO_DATA[key] || [];
      renderGrid(grid, items);
    });

    document.querySelectorAll(".tabs").forEach(initTabs);

    // 每頁只有一個「畫面」，載入時對目前可見的 tab-panel（或整頁的格線）跑一次淡入
    document.querySelectorAll(".tab-panel.active").forEach(playStagger);
    if (!document.querySelector(".tab-panel")) {
      document.querySelectorAll(".grid[data-group]").forEach(function (grid) {
        playStagger(grid.parentElement);
      });
    }
  });
})();
