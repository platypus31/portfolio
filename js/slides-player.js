// 投影片播放器（slides.html?deck=<slug>） — 獨立小檔，不影響其他頁的 js/main.js
(function () {
  "use strict";

  var DECKS = {
    biobonding: { title: "Bio Bonding", count: 13 },
    repairability: { title: "Repairability", count: 15 },
    quickfit: { title: "快速穿脫", count: 22 }
  };

  var PRELOAD_RADIUS = 2;

  function pad(n) {
    return n < 10 ? "0" + n : String(n);
  }

  function getDeckSlug() {
    var params = new URLSearchParams(window.location.search);
    return params.get("deck") || "";
  }

  function showError(msg) {
    var page = document.getElementById("playerPage");
    page.innerHTML =
      '<div class="player-error">' +
      "<p>" + msg + "</p>" +
      '<p><a href="presentation.html">&larr; 返回 Presentation 頁</a></p>' +
      "</div>";
  }

  function buildSlideUrl(slug, n) {
    return "slides/" + slug + "/" + pad(n) + ".webp";
  }

  function buildThumbUrl(slug, n) {
    return "slides/" + slug + "/thumb/" + pad(n) + ".webp";
  }

  function init() {
    var slug = getDeckSlug();
    var deck = DECKS[slug];
    if (!deck) {
      showError("找不到這份簡報（deck=" + (slug || "（空）") + "）。");
      return;
    }

    document.title = deck.title + " — 投影播放";
    document.getElementById("playerTitle").textContent = deck.title;

    var wrapper = document.getElementById("slideWrapper");
    var thumbStrip = document.getElementById("thumbStrip");
    var counterEl = document.getElementById("pageCounter");
    var slidesHtml = "";
    var thumbsHtml = "";

    for (var i = 1; i <= deck.count; i++) {
      slidesHtml +=
        '<div class="swiper-slide" data-index="' + (i - 1) + '">' +
        '<img data-src="' + buildSlideUrl(slug, i) + '" alt="' + deck.title + " 第 " + i + ' 頁">' +
        "</div>";
      thumbsHtml +=
        '<img class="thumb-item" data-index="' + (i - 1) + '" data-src="' + buildThumbUrl(slug, i) + '" alt="第 ' + i + ' 頁縮圖" loading="lazy">';
    }
    wrapper.innerHTML = slidesHtml;
    thumbStrip.innerHTML = thumbsHtml;

    // 縮圖：全部一次載入（每張數十 KB，總量可接受），避免橫向捲動時 native lazy 判斷不準
    var thumbImgs = thumbStrip.querySelectorAll("img.thumb-item");
    thumbImgs.forEach(function (img) {
      img.src = img.getAttribute("data-src");
    });

    var slideImgs = wrapper.querySelectorAll(".swiper-slide img");

    function preloadAround(activeIndex) {
      for (var idx = activeIndex - PRELOAD_RADIUS; idx <= activeIndex + PRELOAD_RADIUS; idx++) {
        if (idx < 0 || idx >= slideImgs.length) continue;
        var img = slideImgs[idx];
        if (!img.src && img.getAttribute("data-src")) {
          img.src = img.getAttribute("data-src");
        }
      }
    }

    function updateUI(activeIndex) {
      counterEl.textContent = (activeIndex + 1) + " / " + deck.count;
      thumbImgs.forEach(function (t) {
        t.classList.toggle("active", Number(t.getAttribute("data-index")) === activeIndex);
      });
      var activeThumb = thumbStrip.querySelector('img[data-index="' + activeIndex + '"]');
      if (activeThumb && activeThumb.scrollIntoView) {
        activeThumb.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
      }
      preloadAround(activeIndex);
    }

    var swiper = new Swiper("#slideSwiper", {
      effect: "slide",
      speed: 280,
      keyboard: { enabled: true, onlyInViewport: false, pageUpDown: true },
      navigation: {
        nextEl: "#nextBtn",
        prevEl: "#prevBtn"
      },
      on: {
        slideChange: function (sw) {
          updateUI(sw.activeIndex);
        }
      }
    });

    updateUI(0);

    thumbStrip.addEventListener("click", function (e) {
      var img = e.target.closest(".thumb-item");
      if (!img) return;
      swiper.slideTo(Number(img.getAttribute("data-index")));
    });

    // Space / PageUp / PageDown 手動補（Swiper keyboard module 不處理空白鍵）
    document.addEventListener("keydown", function (e) {
      if (e.code === "Space") {
        e.preventDefault();
        swiper.slideNext();
      } else if (e.key === "Escape" && document.body.classList.contains("immersive-fallback")) {
        document.body.classList.remove("immersive-fallback");
      }
    });

    // 全螢幕（Fullscreen API，iOS Safari 等不支援時退化成沉浸模式 CSS class）
    var stageArea = document.getElementById("stageArea");
    var fsBtn = document.getElementById("fsBtn");

    function toggleImmersiveFallback() {
      document.body.classList.toggle("immersive-fallback");
    }

    fsBtn.addEventListener("click", function () {
      if (document.fullscreenElement) {
        if (document.exitFullscreen) document.exitFullscreen();
        return;
      }
      if (stageArea.requestFullscreen) {
        stageArea.requestFullscreen().catch(function () {
          toggleImmersiveFallback();
        });
      } else if (stageArea.webkitRequestFullscreen) {
        try {
          stageArea.webkitRequestFullscreen();
        } catch (err) {
          toggleImmersiveFallback();
        }
      } else {
        toggleImmersiveFallback();
      }
    });

    document.addEventListener("fullscreenchange", function () {
      document.body.classList.toggle("is-fullscreen", !!document.fullscreenElement);
      if (document.fullscreenElement && swiper) swiper.update();
    });

    window.addEventListener("resize", function () {
      if (swiper) swiper.update();
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();
