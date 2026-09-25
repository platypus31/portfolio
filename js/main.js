// 極簡 JS：Tab 切換、Coverflow 輪播（Swiper）、Lightbox（Swiper + Zoom，支援手機雙指/雙擊縮放、
// 桌機雙擊/滾輪縮放）、選單開關。無 build step，Swiper 由各頁 <head>/</body> 前的 CDN <script> 引入。
(function () {
  "use strict";

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  // ---- Coverflow 作品輪播（取代原本的格線）----
  function renderCoverflow(container, items, onOpenLightbox) {
    if (!container) return null;
    var groupId = container.getAttribute("data-group");
    container.classList.remove("grid");
    container.classList.add("swiper", "coverflow-swiper");

    var slidesHtml = items.map(function (item, idx) {
      return (
        '<div class="swiper-slide" data-index="' + idx + '">' +
        '<img src="images/' + item.thumb + '" alt="' + escapeHtml(item.title) + '" loading="lazy">' +
        '<div class="cap">' + escapeHtml(item.title) + "</div>" +
        "</div>"
      );
    }).join("");

    container.innerHTML =
      '<div class="swiper-wrapper">' + slidesHtml + "</div>" +
      '<div class="swiper-button-prev" aria-label="上一張"></div>' +
      '<div class="swiper-button-next" aria-label="下一張"></div>';

    if (typeof Swiper === "undefined" || !items.length) return null;

    return new Swiper(container, {
      effect: "coverflow",
      grabCursor: true,
      centeredSlides: true,
      slidesPerView: "auto",
      keyboard: { enabled: true },
      coverflowEffect: { rotate: 40, stretch: 0, depth: 150, modifier: 1, slideShadows: false },
      navigation: {
        nextEl: container.querySelector(".swiper-button-next"),
        prevEl: container.querySelector(".swiper-button-prev")
      },
      observer: true,
      observeParents: true,
      on: {
        click: function (swInst) {
          if (swInst.clickedIndex === undefined || swInst.clickedIndex === null) return;
          if (swInst.clickedIndex === swInst.activeIndex) {
            onOpenLightbox(groupId, swInst.clickedIndex);
          } else {
            swInst.slideTo(swInst.clickedIndex);
          }
        }
      }
    });
  }

  // ---- Lightbox（每次開啟重建一個 Swiper + Zoom module）----
  var lbEl, lbWrapper, lbCaption, lbSwiperEl, lbSwiperInstance;

  function buildLightboxSlides(items) {
    return items.map(function (item) {
      return (
        '<div class="swiper-slide">' +
        '<div class="swiper-zoom-container">' +
        '<img src="images/' + item.full + '" alt="' + escapeHtml(item.title) + '">' +
        "</div></div>"
      );
    }).join("");
  }

  function updateCaption(items, index) {
    var item = items[index];
    if (!item) return;
    lbCaption.textContent = item.title + "（" + (index + 1) + " / " + items.length + "）";
  }

  function openLightbox(groupKey, index) {
    var items = (typeof PORTFOLIO_DATA !== "undefined" && PORTFOLIO_DATA[groupKey]) || [];
    if (!items.length || !lbEl) return;

    lbWrapper.innerHTML = buildLightboxSlides(items);

    if (lbSwiperInstance) {
      lbSwiperInstance.destroy(true, true);
      lbSwiperInstance = null;
    }

    if (typeof Swiper !== "undefined") {
      lbSwiperInstance = new Swiper(lbSwiperEl, {
        initialSlide: index,
        zoom: { maxRatio: 4, minRatio: 1 },
        keyboard: { enabled: true },
        navigation: { nextEl: ".lb-next-btn", prevEl: ".lb-prev-btn" },
        on: {
          slideChange: function (swInst) { updateCaption(items, swInst.activeIndex); }
        }
      });
    }
    updateCaption(items, index);
    lbEl.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    if (!lbEl) return;
    lbEl.classList.remove("open");
    document.body.style.overflow = "";
    if (lbSwiperInstance) {
      lbSwiperInstance.destroy(true, true);
      lbSwiperInstance = null;
    }
    lbWrapper.innerHTML = "";
  }

  function initLightbox() {
    lbEl = document.getElementById("lightbox");
    if (!lbEl) return;
    lbWrapper = document.getElementById("lb-wrapper");
    lbCaption = document.getElementById("lb-caption");
    lbSwiperEl = document.getElementById("lb-swiper");
    if (!lbWrapper || !lbSwiperEl) return; // 頁面無 gallery（如 index/about）不會有這組元素

    document.getElementById("lb-close").addEventListener("click", closeLightbox);
    lbEl.addEventListener("click", function (e) {
      if (e.target === lbEl) closeLightbox();
    });
    document.addEventListener("keydown", function (e) {
      if (!lbEl.classList.contains("open")) return;
      if (e.key === "Escape") closeLightbox();
    });
    // 桌機滑鼠滾輪縮放：往上滾放大、往下滾還原（雙擊/雙指縮放由 Swiper Zoom module 內建處理）
    lbSwiperEl.addEventListener("wheel", function (e) {
      if (!lbSwiperInstance || !lbSwiperInstance.zoom) return;
      e.preventDefault();
      if (e.deltaY < 0) { lbSwiperInstance.zoom.in(); } else { lbSwiperInstance.zoom.out(); }
    }, { passive: false });
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
          // 隱藏分頁裡的輪播在顯示前寬度可能算錯，切換到該分頁時強制重算一次
          target.querySelectorAll(".coverflow-swiper").forEach(function (el) {
            if (el.swiper) el.swiper.update();
          });
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
      var items = (typeof PORTFOLIO_DATA !== "undefined" && PORTFOLIO_DATA[key]) || [];
      renderCoverflow(grid, items, openLightbox);
    });

    document.querySelectorAll(".tabs").forEach(initTabs);
  });
})();
