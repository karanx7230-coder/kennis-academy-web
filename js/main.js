/* Kennis Academy Ropar — editorial interactions (vanilla, zero deps) */
(function () {
  "use strict";
  var doc = document;
  doc.documentElement.classList.add("js");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };

  /* ---------- year ---------- */
  var y = doc.getElementById("year");
  if (y) y.textContent = String(new Date().getFullYear());

  /* ---------- header + scroll progress ---------- */
  var head = doc.querySelector(".head");
  var progress = doc.querySelector(".progress");
  function onScroll() {
    if (head) head.classList.toggle("scrolled", window.scrollY > 24);
    if (progress) {
      var max = doc.documentElement.scrollHeight - window.innerHeight;
      progress.style.transform = "scaleX(" + (max > 0 ? clamp(window.scrollY / max, 0, 1) : 0) + ")";
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- mobile menu ---------- */
  var toggle = doc.querySelector(".nav-toggle");
  var nav = doc.getElementById("nav");
  function setMenu(open) {
    if (!toggle || !nav) return;
    nav.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    doc.body.classList.toggle("menu-open", open);
  }
  if (toggle && nav) {
    toggle.addEventListener("click", function () { setMenu(!nav.classList.contains("open")); });
    nav.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
    doc.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });
    window.addEventListener("resize", function () { if (window.innerWidth > 860) setMenu(false); });
  }

  /* ---------- hero line reveal ---------- */
  var heroTitle = doc.querySelector(".hero-title");
  if (heroTitle) {
    if (reduce) heroTitle.classList.add("in");
    else requestAnimationFrame(function () { requestAnimationFrame(function () { heroTitle.classList.add("in"); }); });
  }

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

  /* ---------- gentle scroll-zoom on pictures ---------- */
  var medias = [].slice.call(doc.querySelectorAll("[data-cine]")).map(function (w) {
    var amp = parseFloat(w.getAttribute("data-amp")) || 0.1;
    return { wrap: w, img: w.querySelector("img"), amp: amp, cur: 1 + amp, tgt: 1 + amp };
  }).filter(function (m) { return m.img; });
  function targets() {
    var vh = window.innerHeight;
    for (var i = 0; i < medias.length; i++) {
      var m = medias[i];
      var r = m.wrap.getBoundingClientRect();
      if (r.bottom < -240 || r.top > vh + 240) continue;
      var t = clamp((vh - r.top) / (vh + r.height), 0, 1);
      var c = 1 - Math.abs(t - 0.5) * 2;
      m.tgt = 1 + m.amp * (1 - c);
    }
  }
  var running = false;
  function loop() {
    var d = 0;
    for (var i = 0; i < medias.length; i++) {
      var m = medias[i];
      m.cur += (m.tgt - m.cur) * 0.12;
      d += Math.abs(m.tgt - m.cur);
      m.img.style.transform = "scale(" + m.cur.toFixed(4) + ")";
    }
    if (d > 0.0006) requestAnimationFrame(loop); else running = false;
  }
  function wake() { targets(); if (!running) { running = true; requestAnimationFrame(loop); } }
  if (!reduce && medias.length) {
    window.addEventListener("scroll", wake, { passive: true });
    window.addEventListener("resize", wake);
    targets(); running = true; requestAnimationFrame(loop);
  } else {
    medias.forEach(function (m) { m.img.style.transform = "none"; });
  }

  /* ---------- program pre-select from enquiry links ---------- */
  var programSelect = doc.getElementById("f-program");
  var nameInput = doc.getElementById("f-name");
  [].slice.call(doc.querySelectorAll("[data-program]")).forEach(function (link) {
    link.addEventListener("click", function () {
      var want = link.getAttribute("data-program");
      if (programSelect) {
        var matched = false;
        [].slice.call(programSelect.options).forEach(function (opt) {
          if (opt.text === want) { programSelect.value = opt.value || opt.text; matched = true; }
        });
        if (!matched) programSelect.selectedIndex = programSelect.options.length - 1; // "Not sure yet"
      }
      setTimeout(function () { if (nameInput) nameInput.focus({ preventScroll: true }); }, 450);
    });
  });

  /* ---------- admission enquiry form -> WhatsApp ---------- */
  var form = doc.getElementById("enquiry-form");
  var note = doc.getElementById("form-note");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = form.name.value.trim();
      var phone = form.phone.value.trim();
      var program = form.program.value;
      var message = form.message.value.trim();
      var ok = true;

      form.name.classList.toggle("invalid", !name);
      if (!name) ok = false;
      var digits = phone.replace(/\D/g, "");
      var phoneOk = digits.length >= 10;
      form.phone.classList.toggle("invalid", !phoneOk);
      if (!phoneOk) ok = false;

      if (!ok) {
        if (note) { note.textContent = "Please add a name and a valid 10-digit phone number."; note.classList.add("error"); }
        (!name ? form.name : form.phone).focus();
        return;
      }

      var text = "Admission enquiry — Kennis Academy\n\n" +
        "Name: " + name + "\n" +
        "Phone: " + phone + "\n" +
        "Program: " + program +
        (message ? "\nMessage: " + message : "");
      var url = "https://wa.me/918872981296?text=" + encodeURIComponent(text);
      window.open(url, "_blank", "noopener");
      if (note) { note.textContent = "Opening WhatsApp with your details…"; note.classList.remove("error"); }
    });

    ["input", "change"].forEach(function (evt) {
      form.addEventListener(evt, function (e) {
        if (e.target.classList) e.target.classList.remove("invalid");
        if (note && note.classList.contains("error")) { note.textContent = "Opens WhatsApp with your details pre-filled."; note.classList.remove("error"); }
      });
    });
  }
})();
