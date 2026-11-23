/* Kennis Academy Ropar — studio motion (vanilla, zero deps) */
(function () {
  "use strict";
  var doc = document;
  doc.documentElement.classList.add("js");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };

  /* ---------- intro loader + hero line reveal ---------- */
  var loader = doc.querySelector(".loader");
  var heroMega = doc.querySelector(".hero-mega");
  function start() {
    if (loader) loader.classList.add("done");
    if (heroMega) heroMega.classList.add("in");
  }
  if (reduce) {
    start();
  } else {
    var started = false;
    function go() { if (started) return; started = true; setTimeout(start, 480); }
    window.addEventListener("load", go);
    setTimeout(go, 2600); // safety net
    if (doc.readyState === "complete") go();
  }

  /* ---------- header ---------- */
  var head = doc.querySelector(".head");
  function hs() { if (head) head.classList.toggle("scrolled", window.scrollY > 30); }
  window.addEventListener("scroll", hs, { passive: true });
  hs();

  /* ---------- year ---------- */
  var y = doc.getElementById("year");
  if (y) y.textContent = String(new Date().getFullYear());

  /* ---------- reveals (IO + scroll fallback) ---------- */
  var els = [].slice.call(doc.querySelectorAll(".reveal"));
  function show(e) { e.classList.add("visible"); }
  if (reduce) {
    els.forEach(show);
  } else {
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (en) {
        en.forEach(function (e) { if (e.isIntersecting) { show(e.target); io.unobserve(e.target); } });
      }, { threshold: 0.14, rootMargin: "0px 0px -6% 0px" });
      els.forEach(function (e) { io.observe(e); });
    }
    function fb() {
      var vh = window.innerHeight;
      els.forEach(function (e) {
        if (e.classList.contains("visible")) return;
        var r = e.getBoundingClientRect();
        if (r.top < vh * 0.92 && r.bottom > 0) show(e);
      });
    }
    window.addEventListener("scroll", fb, { passive: true });
    window.addEventListener("resize", fb);
    fb();
  }

  /* ---------- looping strokes draw-in ---------- */
  var loops = [].slice.call(doc.querySelectorAll(".loop"));
  if (reduce || !("IntersectionObserver" in window)) {
    loops.forEach(function (l) { l.classList.add("drawn"); });
  } else {
    var lio = new IntersectionObserver(function (en) {
      en.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("drawn"); lio.unobserve(e.target); } });
    }, { threshold: 0.2 });
    loops.forEach(function (l) { lio.observe(l); });
  }

  /* ---------- scroll-scrubbed picture zoom ---------- */
  var medias = [].slice.call(doc.querySelectorAll("[data-cine]")).map(function (w) {
    var amp = parseFloat(w.getAttribute("data-amp")) || 0.16;
    return { wrap: w, img: w.querySelector("img"), amp: amp, cur: { s: 1 + amp, y: 0 }, tgt: { s: 1 + amp, y: 0 } };
  }).filter(function (m) { return m.img; });

  function targets() {
    var vh = window.innerHeight;
    for (var i = 0; i < medias.length; i++) {
      var m = medias[i];
      var r = m.wrap.getBoundingClientRect();
      if (r.bottom < -260 || r.top > vh + 260) continue;
      var t = clamp((vh - r.top) / (vh + r.height), 0, 1);
      var c = 1 - Math.abs(t - 0.5) * 2;
      m.tgt.s = 1 + m.amp * (1 - c);
      m.tgt.y = (t - 0.5) * 26;
    }
  }
  var running = false;
  function loop() {
    var d = 0;
    for (var i = 0; i < medias.length; i++) {
      var m = medias[i];
      m.cur.s += (m.tgt.s - m.cur.s) * 0.12;
      m.cur.y += (m.tgt.y - m.cur.y) * 0.12;
      d += Math.abs(m.tgt.s - m.cur.s) + Math.abs(m.tgt.y - m.cur.y) * 0.01;
      m.img.style.transform = "translate3d(0," + m.cur.y.toFixed(2) + "px,0) scale(" + m.cur.s.toFixed(4) + ")";
    }
    if (d > 0.0008) requestAnimationFrame(loop);
    else running = false;
  }
  function wake() { targets(); if (!running) { running = true; requestAnimationFrame(loop); } }

  if (!reduce && medias.length) {
    window.addEventListener("scroll", wake, { passive: true });
    window.addEventListener("resize", wake);
    targets();
    running = true;
    requestAnimationFrame(loop);
  } else {
    medias.forEach(function (m) { m.img.style.transform = "none"; });
  }
})();
