/* Kennis Academy Ropar — cinematic motion engine (vanilla JS, zero deps) */
(function () {
  "use strict";

  var doc = document;
  doc.documentElement.classList.add("js");

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };

  /* ---------- Sticky header state ---------- */
  var header = doc.querySelector(".site-header");
  function headerState() { if (header) header.classList.toggle("scrolled", window.scrollY > 40); }
  window.addEventListener("scroll", headerState, { passive: true });
  headerState();

  /* ---------- Full-screen mobile menu ---------- */
  var navToggle = doc.querySelector(".nav-toggle");
  var mainNav = doc.getElementById("main-nav");
  function setMenu(open) {
    if (!navToggle || !mainNav) return;
    mainNav.classList.toggle("open", open);
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    doc.body.classList.toggle("menu-open", open);
  }
  if (navToggle && mainNav) {
    navToggle.addEventListener("click", function () { setMenu(!mainNav.classList.contains("open")); });
    mainNav.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
    doc.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });
    window.addEventListener("resize", function () { if (window.innerWidth >= 900) setMenu(false); });
  }

  /* ---------- Footer year ---------- */
  var yearEl = doc.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- Hero headline line reveal ---------- */
  var heroTitle = doc.querySelector(".hero-title");
  if (heroTitle) {
    if (reduce) heroTitle.classList.add("in");
    else requestAnimationFrame(function () { requestAnimationFrame(function () { heroTitle.classList.add("in"); }); });
  }

  /* ---------- Reveal on scroll (IO + scroll fallback) ---------- */
  var revealEls = [].slice.call(doc.querySelectorAll(".reveal"));
  if (reduce) {
    revealEls.forEach(function (el) { el.classList.add("visible"); });
  } else if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add("visible"); io.unobserve(entry.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -7% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("visible"); });
  }
  function revealFallback() {
    var vh = window.innerHeight;
    revealEls.forEach(function (el) {
      if (el.classList.contains("visible")) return;
      var r = el.getBoundingClientRect();
      if (r.top < vh * 0.92 && r.bottom > 0) el.classList.add("visible");
    });
  }

  /* ---------- Back to top ---------- */
  var backToTop = doc.querySelector(".back-to-top");
  function topState() { if (backToTop) backToTop.classList.toggle("show", window.scrollY > 640); }
  window.addEventListener("scroll", topState, { passive: true });
  topState();
  if (backToTop) backToTop.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }); });

  /* ---------- Cinematic scrub-zoom media ---------- */
  var heroMedia = doc.querySelector(".hero-media");
  var heroContent = doc.querySelector(".hero-content");
  var medias = [].slice.call(doc.querySelectorAll("[data-cine]")).map(function (wrap) {
    var amp = parseFloat(wrap.getAttribute("data-amp")) || 0.16;
    return {
      wrap: wrap,
      img: wrap.querySelector("img"),
      amp: amp,
      par: parseFloat(wrap.getAttribute("data-par")) || 30,
      cur: { s: 1 + amp, y: 0 },
      tgt: { s: 1 + amp, y: 0 }
    };
  }).filter(function (m) { return m.img; });

  function computeTargets() {
    var vh = window.innerHeight;
    for (var i = 0; i < medias.length; i++) {
      var m = medias[i];
      var r = m.wrap.getBoundingClientRect();
      if (r.bottom < -260 || r.top > vh + 260) continue;
      // t: 0 when element enters at bottom, 1 when it leaves at top
      var t = clamp((vh - r.top) / (vh + r.height), 0, 1);
      // c: 0 at edges, 1 at viewport centre -> zoom OUT to centre, zoom IN away
      var c = 1 - Math.abs(t - 0.5) * 2;
      m.tgt.s = 1 + m.amp * (1 - c);
      m.tgt.y = (t - 0.5) * m.par;
    }
    // Hero: scroll-linked dolly zoom + content parallax fade
    if (heroMedia) {
      var p = clamp(window.scrollY / vh, 0, 1);
      heroMedia.style.transform = "scale(" + (1 + p * 0.2).toFixed(4) + ")";
      if (heroContent) {
        heroContent.style.transform = "translateY(" + (window.scrollY * 0.3).toFixed(1) + "px)";
        heroContent.style.opacity = String(clamp(1 - p * 1.25, 0, 1));
      }
    }
  }

  var running = false;
  function loop() {
    var delta = 0;
    for (var i = 0; i < medias.length; i++) {
      var m = medias[i];
      m.cur.s += (m.tgt.s - m.cur.s) * 0.12;
      m.cur.y += (m.tgt.y - m.cur.y) * 0.12;
      delta += Math.abs(m.tgt.s - m.cur.s) + Math.abs(m.tgt.y - m.cur.y) * 0.01;
      m.img.style.transform = "translate3d(0," + m.cur.y.toFixed(2) + "px,0) scale(" + m.cur.s.toFixed(4) + ")";
    }
    if (delta > 0.0008) requestAnimationFrame(loop);
    else running = false;
  }
  function wake() {
    computeTargets();
    revealFallback();
    if (!running) { running = true; requestAnimationFrame(loop); }
  }

  if (!reduce && medias.length) {
    window.addEventListener("scroll", wake, { passive: true });
    window.addEventListener("resize", wake);
    computeTargets();
    running = true;
    requestAnimationFrame(loop);
  } else {
    // Reduced motion or no media: keep everything settled & visible
    medias.forEach(function (m) { m.img.style.transform = "none"; });
    revealFallback();
    window.addEventListener("scroll", revealFallback, { passive: true });
  }
})();
