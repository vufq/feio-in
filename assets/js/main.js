/* feio.in — interactions. Vanilla, no dependencies, ~2kB. */
(function () {
  "use strict";

  var root = document.documentElement;
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- theme ---------- */
  var toggle = document.getElementById("themeToggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
    });
  }

  /* ---------- mobile nav ---------- */
  var navBtn = document.getElementById("navToggle");
  var nav = document.getElementById("primaryNav");

  function setNav(open) {
    if (!nav || !navBtn) return;
    nav.classList.toggle("open", open);
    navBtn.setAttribute("aria-expanded", String(open));
    navBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }

  if (navBtn && nav) {
    navBtn.addEventListener("click", function () {
      setNav(navBtn.getAttribute("aria-expanded") !== "true");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setNav(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setNav(false);
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 768) setNav(false);
    });
  }

  /* ---------- scroll reveal ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if (reveals.length) {
    if (reduced || !("IntersectionObserver" in window)) {
      for (var i = 0; i < reveals.length; i++) reveals[i].classList.add("in");
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        });
      }, { rootMargin: "0px 0px -6% 0px", threshold: 0.05 });

      /* group siblings so a list reveals as a cascade, not all at once */
      var groups = {};
      for (var j = 0; j < reveals.length; j++) {
        var el = reveals[j];
        var parent = el.parentNode;
        var key = parent && parent.nodeName ? parent.nodeName + "-" + (parent.className || "") : "root";
        var idx = groups[key] = (groups[key] || 0);
        el.style.setProperty("--rd", Math.min(idx, 6) * 45 + "ms");
        groups[key] = idx + 1;
        io.observe(el);
      }
    }
  }

  /* ---------- terminal: staggered type-in ---------- */
  var term = document.getElementById("termBody");
  if (term) {
    if (reduced || !("IntersectionObserver" in window)) {
      term.classList.add("in");
    } else {
      var tio = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("in");
          tio.unobserve(entry.target);
        });
      }, { threshold: 0.25 });
      tio.observe(term);
    }
  }

  /* ---------- marquee: duplicate track for a seamless loop ---------- */
  var track = document.getElementById("marqueeTrack");
  if (track) track.innerHTML += track.innerHTML;

  /* ---------- cursor-lit grain field ---------- */
  var fields = document.querySelectorAll(".field");
  if (fields.length && window.matchMedia("(pointer: fine)").matches) {
    var raf = null, px = 0, py = 0;
    function paint() {
      raf = null;
      for (var f = 0; f < fields.length; f++) {
        fields[f].style.setProperty("--mx", px + "px");
        fields[f].style.setProperty("--my", py + "px");
      }
    }
    window.addEventListener("pointermove", function (e) {
      px = e.clientX; py = e.clientY;
      if (!raf) raf = requestAnimationFrame(paint);
    }, { passive: true });
  }

  /* ---------- sticky header state ---------- */
  var head = document.querySelector(".site-head");
  if (head) {
    var ticking = false;
    var onScroll = function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        head.setAttribute("data-scrolled", String(window.scrollY > 12));
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- copy email ---------- */
  var copyBtn = document.getElementById("copyEmail");
  if (copyBtn) {
    copyBtn.addEventListener("click", function () {
      var email = copyBtn.getAttribute("data-email");
      var done = function () {
        copyBtn.setAttribute("data-copied", "true");
        copyBtn.textContent = "Copied";
        setTimeout(function () {
          copyBtn.removeAttribute("data-copied");
          copyBtn.textContent = "Copy address";
        }, 2000);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(done, function () {});
      } else {
        var ta = document.createElement("textarea");
        ta.value = email;
        ta.setAttribute("readonly", "");
        ta.style.cssText = "position:fixed;top:-1000px";
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand("copy"); done(); } catch (e) {}
        document.body.removeChild(ta);
      }
    });
  }
})();
