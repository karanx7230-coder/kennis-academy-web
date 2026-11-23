/* Kennis Academy Ropar — interactions (vanilla JS, no dependencies) */
(function () {
  "use strict";

  // Flag JS availability so reveal animations only hide content when JS can unhide it
  document.documentElement.classList.add("js");

  /* ---------- Sticky header shadow ---------- */
  var header = document.querySelector(".site-header");
  var onScrollHeader = function () {
    if (header) header.classList.toggle("scrolled", window.scrollY > 8);
  };
  window.addEventListener("scroll", onScrollHeader, { passive: true });
  onScrollHeader();

  /* ---------- Mobile navigation ---------- */
  var navToggle = document.querySelector(".nav-toggle");
  var mainNav = document.getElementById("main-nav");

  function setMenu(open) {
    if (!navToggle || !mainNav) return;
    mainNav.classList.toggle("open", open);
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }

  if (navToggle && mainNav) {
    navToggle.addEventListener("click", function () {
      setMenu(!mainNav.classList.contains("open"));
    });
    mainNav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setMenu(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setMenu(false);
    });
    document.addEventListener("click", function (e) {
      if (!e.target.closest(".site-header")) setMenu(false);
    });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -30px 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("visible"); });
  }

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- Back to top ---------- */
  var backToTop = document.querySelector(".back-to-top");
  if (backToTop) {
    var onScrollTop = function () {
      backToTop.classList.toggle("show", window.scrollY > 600);
    };
    window.addEventListener("scroll", onScrollTop, { passive: true });
    onScrollTop();
    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // @@NEXT@@
})();
