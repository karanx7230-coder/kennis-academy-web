/* Kennis Academy Ropar — light interactions (vanilla, zero deps) */
(function () {
  "use strict";
  var doc = document;
  doc.documentElement.classList.add("js");

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* year */
  var y = doc.getElementById("year");
  if (y) y.textContent = String(new Date().getFullYear());

  /* reveals — IntersectionObserver + scroll fallback (robust in any viewport) */
  var els = [].slice.call(doc.querySelectorAll(".reveal"));
  function show(el) { el.classList.add("visible"); }

  if (reduce) {
    els.forEach(show);
  } else {
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) { show(e.target); io.unobserve(e.target); } });
      }, { threshold: 0.14, rootMargin: "0px 0px -6% 0px" });
      els.forEach(function (el) { io.observe(el); });
    }
    function fallback() {
      var vh = window.innerHeight;
      els.forEach(function (el) {
        if (el.classList.contains("visible")) return;
        var r = el.getBoundingClientRect();
        if (r.top < vh * 0.92 && r.bottom > 0) show(el);
      });
    }
    window.addEventListener("scroll", fallback, { passive: true });
    window.addEventListener("resize", fallback);
    fallback();
  }
})();
