/* =========================================================================
   feio.in — interactions
   Vanilla JS, no dependencies. Everything degrades gracefully.
   ========================================================================= */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var finePointer = window.matchMedia("(pointer: fine)");

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function clamp(n, lo, hi) { return n < lo ? lo : n > hi ? hi : n; }

  /* ---- toast ------------------------------------------------------------ */
  var toast = $("#toast");
  var toastMsg = $("#toastMsg");
  var toastTimer = null;

  function say(msg) {
    if (!toast) return;
    toastMsg.textContent = msg;
    toast.setAttribute("data-show", "true");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.setAttribute("data-show", "false");
    }, 2200);
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.cssText = "position:fixed;top:-1000px;opacity:0";
      document.body.appendChild(ta);
      ta.select();
      var ok = false;
      try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
      document.body.removeChild(ta);
      ok ? resolve() : reject(new Error("copy failed"));
    });
  }

  /* ---- 1. header scroll state + progress bar ---------------------------- */
  var head = $(".site-head");
  var progress = $("#progress");

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (head) head.setAttribute("data-scrolled", y > 12 ? "true" : "false");
    if (progress) {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.transform = "scaleX(" + (max > 0 ? clamp(y / max, 0, 1) : 0) + ")";
    }
  }

  var ticking = false;
  window.addEventListener("scroll", function () {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      onScroll();
      ticking = false;
    });
  }, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  onScroll();

  /* ---- 2. mobile nav ---------------------------------------------------- */
  var navToggle = $("#navToggle");
  var nav = $("#primaryNav");

  function setNav(open) {
    if (!navToggle || !nav) return;
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    nav.setAttribute("data-open", open ? "true" : "false");
  }

  if (navToggle) {
    navToggle.addEventListener("click", function () {
      setNav(navToggle.getAttribute("aria-expanded") !== "true");
    });
  }
  if (nav) {
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setNav(false);
    });
  }

  /* ---- 3. theme picker -------------------------------------------------- */
  var THEMES = {
    midnight: { label: "Midnight", color: "#0a1428" },
    day:      { label: "Day",      color: "#f4f8fd" },
    aurora:   { label: "Aurora",   color: "#120a26" },
    ocean:    { label: "Ocean",    color: "#041821" },
    ember:    { label: "Ember",    color: "#1e0f07" },
    forest:   { label: "Forest",   color: "#04180f" },
    neon:     { label: "Neon",     color: "#100616" },
    espresso: { label: "Espresso", color: "#17100c" }
  };

  var themeBtn = $("#themeBtn");
  var themeMenu = $("#themeMenu");
  var themeLabel = $("#themeLabel");
  var metaTheme = $("#metaTheme");

  function applyTheme(name, persist) {
    if (!THEMES[name]) return;
    document.documentElement.setAttribute("data-theme", name);
    if (metaTheme) metaTheme.setAttribute("content", THEMES[name].color);
    if (themeLabel) themeLabel.textContent = THEMES[name].label;
    $$("[data-set-theme]").forEach(function (btn) {
      btn.setAttribute("aria-checked", btn.getAttribute("data-set-theme") === name ? "true" : "false");
    });
    if (persist) {
      try { localStorage.setItem("feio-theme", name); } catch (e) {}
    }
  }

  function setThemeMenu(open) {
    if (!themeBtn || !themeMenu) return;
    themeBtn.setAttribute("aria-expanded", open ? "true" : "false");
    themeMenu.setAttribute("data-open", open ? "true" : "false");
  }

  if (themeBtn) {
    themeBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      setThemeMenu(themeBtn.getAttribute("aria-expanded") !== "true");
    });
  }
  if (themeMenu) {
    themeMenu.addEventListener("click", function (e) {
      var opt = e.target.closest("[data-set-theme]");
      if (!opt) return;
      applyTheme(opt.getAttribute("data-set-theme"), true);
      setThemeMenu(false);
      themeBtn.focus();
    });
  }
  document.addEventListener("click", function (e) {
    if (themeMenu && themeMenu.getAttribute("data-open") === "true" &&
        !e.target.closest(".theme-picker")) {
      setThemeMenu(false);
    }
  });
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    if (themeMenu && themeMenu.getAttribute("data-open") === "true") {
      setThemeMenu(false);
      if (themeBtn) themeBtn.focus();
    } else if (navToggle && navToggle.getAttribute("aria-expanded") === "true") {
      setNav(false);
      navToggle.focus();
    }
  });

  // sync label/aria on load (the inline head script may have set the theme)
  applyTheme(document.documentElement.getAttribute("data-theme") || "midnight", false);

  /* ---- 4. constellation stars ------------------------------------------- */
  (function stars() {
    var host = $("#stars");
    if (!host) return;

    var seed = 20260929;
    function rnd() {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    }

    var frag = document.createDocumentFragment();
    var N = window.innerWidth < 760 ? 46 : 96;
    for (var i = 0; i < N; i++) {
      var d = document.createElement("span");
      d.className = "star-dot";
      d.style.left = (rnd() * 100).toFixed(2) + "%";
      d.style.top = (rnd() * 72).toFixed(2) + "%";
      d.style.animationDelay = (rnd() * 6).toFixed(2) + "s";
      d.style.animationDuration = (4.5 + rnd() * 4).toFixed(2) + "s";
      var sc = (0.6 + rnd() * 1.5).toFixed(2);
      d.style.transform = "scale(" + sc + ")";
      frag.appendChild(d);
    }

    // a handful of connected nodes to make it read as a constellation
    var NS = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", "0 0 1000 520");
    svg.setAttribute("preserveAspectRatio", "none");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");

    var nodes = [
      [140, 130], [300, 78], [455, 190], [620, 96],
      [790, 205], [905, 120], [235, 300], [520, 330],
      [700, 268], [860, 372], [110, 392], [375, 430]
    ];
    var edges = [[0,1],[1,2],[2,3],[3,4],[4,5],[0,6],[2,7],[4,8],[6,7],[7,8],[8,9],[6,10],[7,11],[3,4]];
    var seen = {};
    edges.forEach(function (p) {
      var key = p[0] + "-" + p[1];
      if (seen[key]) return;
      seen[key] = 1;
      var ln = document.createElementNS(NS, "line");
      ln.setAttribute("x1", nodes[p[0]][0]); ln.setAttribute("y1", nodes[p[0]][1]);
      ln.setAttribute("x2", nodes[p[1]][0]); ln.setAttribute("y2", nodes[p[1]][1]);
      ln.setAttribute("class", "star-line");
      svg.appendChild(ln);
    });
    nodes.forEach(function (n, i) {
      var c = document.createElementNS(NS, "circle");
      c.setAttribute("cx", n[0]); c.setAttribute("cy", n[1]); c.setAttribute("r", "2.4");
      c.setAttribute("class", "star-node");
      c.style.animationDelay = (i * 0.28).toFixed(2) + "s";
      var t = document.createElementNS(NS, "title");
      t.textContent = "node";
      c.appendChild(t);
      svg.appendChild(c);
    });

    frag.appendChild(svg);
    host.appendChild(frag);
  })();

  /* ---- 5. marquee: duplicate for a seamless -50% loop ------------------- */
  (function marquee() {
    var track = $("#marqueeTrack");
    if (!track) return;
    track.innerHTML += track.innerHTML;
  })();

  /* ---- 6. scroll reveals + counters + lang bar -------------------------- */
  (function reveals() {
    var items = $$(".reveal");
    var counts = $$("[data-count]");
    var bar = $(".lang-bar");

    function runCount(el) {
      var target = parseFloat(el.getAttribute("data-count")) || 0;
      var suffix = el.getAttribute("data-suffix") || "";
      if (reduceMotion.matches) { el.textContent = target + suffix; return; }
      var dur = 1100;
      var start = null;
      function frame(ts) {
        if (start === null) start = ts;
        var p = clamp((ts - start) / dur, 0, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (p < 1) window.requestAnimationFrame(frame);
      }
      window.requestAnimationFrame(frame);
    }

    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("in"); });
      counts.forEach(runCount);
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in");
        io.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });

    var countsDone = false;
    var statBlock = $(".stats");
    if (statBlock && counts.length) {
      var cio = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting || countsDone) return;
          countsDone = true;
          counts.forEach(runCount);
          if (bar) {
            $$("i", bar).forEach(function (s) {
              var w = s.style.width;
              s.style.width = "0%";
              window.requestAnimationFrame(function () { s.style.width = w; });
            });
          }
          cio.disconnect();
        });
      }, { threshold: 0.25 });
      cio.observe(statBlock);
    }
  })();

  /* ---- 7. terminal replay ----------------------------------------------- */
  (function terminal() {
    var body = $("#termBody");
    if (!body) return;
    var lines = $$("[data-anim]", body);
    if (reduceMotion.matches) {
      lines.forEach(function (l) { l.classList.add("in"); });
      return;
    }
    function play() {
      lines.forEach(function (l) { l.classList.remove("in"); });
      // force reflow so the animation restarts
      void body.offsetWidth;
      window.setTimeout(function () {
        lines.forEach(function (l) { l.classList.add("in"); });
      }, 260);
    }
    if (!("IntersectionObserver" in window)) { play(); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { play(); io.disconnect(); }
      });
    }, { threshold: 0.35 });
    io.observe(body);
  })();

  /* ---- 8. 3D: hero parallax + card tilt (fine pointers only) ------------ */
  (function tilt() {
    if (!finePointer.matches || reduceMotion.matches) return;

    var mockup = $("#mockup");
    if (mockup) {
      var hero = $(".hero");
      if (hero) {
        var raf = null;
        hero.addEventListener("pointermove", function (e) {
          if (raf) return;
          raf = window.requestAnimationFrame(function () {
            var r = hero.getBoundingClientRect();
            var px = (e.clientX - r.left) / r.width - 0.5;
            var py = (e.clientY - r.top) / r.height - 0.5;
            mockup.style.transform =
              "perspective(1400px) rotateY(" + (px * 5).toFixed(2) + "deg) rotateX(" +
              (-py * 4).toFixed(2) + "deg) translate3d(0,0,0)";
            raf = null;
          });
        });
        hero.addEventListener("pointerleave", function () {
          mockup.style.transform = "";
        });
      }
    }

    $$(".card").forEach(function (card) {
      var frame = null;
      card.addEventListener("pointermove", function (e) {
        if (frame) return;
        frame = window.requestAnimationFrame(function () {
          var r = card.getBoundingClientRect();
          var px = (e.clientX - r.left) / r.width - 0.5;
          var py = (e.clientY - r.top) / r.height - 0.5;
          card.style.transform =
            "perspective(900px) rotateY(" + (px * 4).toFixed(2) + "deg) rotateX(" +
            (-py * 4).toFixed(2) + "deg) translateY(-5px)";
          frame = null;
        });
      });
      card.addEventListener("pointerleave", function () {
        card.style.transform = "";
      });
    });
  })();

  /* ---- 9. copy buttons --------------------------------------------------- */
  var copyEmail = $("#copyEmail");
  if (copyEmail) {
    copyEmail.addEventListener("click", function () {
      copyText(copyEmail.getAttribute("data-email")).then(function () {
        say("Email address copied");
      }).catch(function () { say("Copy failed — select it manually"); });
    });
  }

  var copyCode = $("#copyCode");
  if (copyCode) {
    copyCode.addEventListener("click", function () {
      var target = $("#" + copyCode.getAttribute("data-copy-target"));
      if (!target) return;
      copyText(target.textContent).then(function () {
        say("Config copied");
      }).catch(function () { say("Copy failed — select it manually"); });
    });
  }

  /* ---- 10. nav scrollspy -------------------------------------------------- */
  (function scrollspy() {
    var links = $$('#primaryNav a[href^="#"]');
    if (!links.length || !("IntersectionObserver" in window)) return;
    var map = {};
    var sections = [];
    links.forEach(function (a) {
      var id = a.getAttribute("href").slice(1);
      var sec = document.getElementById(id);
      if (sec) { map[id] = a; sections.push(sec); }
    });
    if (!sections.length) return;

    var current = null;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) current = entry.target.id;
      });
      links.forEach(function (a) {
        a.removeAttribute("aria-current");
      });
      if (current && map[current]) map[current].setAttribute("aria-current", "true");
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
    sections.forEach(function (s) { io.observe(s); });
  })();
})();
