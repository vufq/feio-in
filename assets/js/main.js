/* feio.in — interactions. There is one theme, so no theme logic; three nav
   links that fit on a phone line, so no menu toggle; the masthead scrolls
   away, so no sticky bar; content is visible by default, so no scroll
   reveal. What remains is the copy button. Vanilla, no dependencies. */
(function () {
  "use strict";

  /* ---------- copy email ---------- */
  var copyBtn = document.getElementById("copyEmail");
  if (!copyBtn) return;

  copyBtn.addEventListener("click", function () {
    var email = copyBtn.getAttribute("data-email");

    var flash = function (text) {
      copyBtn.textContent = text;
      setTimeout(function () { copyBtn.textContent = "copy"; }, 2000);
    };
    var done = function () {
      copyBtn.setAttribute("data-copied", "true");
      flash("copied");
      setTimeout(function () { copyBtn.removeAttribute("data-copied"); }, 2000);
    };
    var legacy = function () {
      var ta = document.createElement("textarea");
      ta.value = email;
      ta.setAttribute("readonly", "");
      ta.style.cssText = "position:fixed;top:0;left:0;opacity:0";
      document.body.appendChild(ta);
      ta.select();
      ta.setSelectionRange(0, email.length);
      var ok = false;
      try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
      document.body.removeChild(ta);
      return ok;
    };

    /* writeText rejects in some contexts, so always fall back rather than
       leaving the button looking unresponsive */
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(email).then(done, function () {
        if (legacy()) done();
        else flash("press ctrl+c");
      });
    } else if (legacy()) {
      done();
    } else {
      flash("press ctrl+c");
    }
  });
})();
