/* Shared bits: scroll reveals, a little heart burst, and the Myntra link check. */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Fade things up as they scroll into view
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el, idx) {
      el.style.transitionDelay = Math.min(idx * 90, 450) + "ms";
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-in");
    });
  }

  var HEART_PATH =
    "M12 21.6 10.3 20C4.1 14.4 0 10.7 0 6.2 0 2.7 2.7 0 6.2 0c2 0 3.9.9 5.8 2.6C13.9.9 15.8 0 17.8 0 21.3 0 24 2.7 24 6.2c0 4.5-4.1 8.2-10.3 13.8L12 21.6z";
  var COLORS = ["#ff375f", "#ffffff", "#ff6b8b", "#ffb3c4", "#bf5af2"];

  // Burst of little hearts from the centre of an element
  function burst(el, opts) {
    if (reduceMotion || !el || !el.getBoundingClientRect) return;
    opts = opts || {};
    var n = opts.count || 22;
    var spread = opts.spread || 160;
    var r = el.getBoundingClientRect();
    var cx = r.left + r.width / 2;
    var cy = r.top + r.height / 2;

    for (var i = 0; i < n; i++) {
      var d = document.createElement("span");
      d.className = "burst";
      var size = 10 + Math.random() * 14;
      d.style.width = size + "px";
      d.style.height = size * 0.92 + "px";
      d.innerHTML =
        '<svg viewBox="0 0 24 22" aria-hidden="true"><path fill="' +
        COLORS[i % COLORS.length] +
        '" d="' +
        HEART_PATH +
        '"/></svg>';
      document.body.appendChild(d);

      var angle = Math.random() * Math.PI * 2;
      var dist = spread * (0.45 + Math.random() * 0.75);
      var dx = Math.cos(angle) * dist;
      var dy = Math.sin(angle) * dist - 40;
      var rot = Math.random() * 120 - 60;

      if (d.animate) {
        var a = d.animate(
          [
            { transform: "translate(" + cx + "px," + cy + "px) scale(0.3) rotate(0deg)", opacity: 1 },
            { transform: "translate(" + (cx + dx) + "px," + (cy + dy) + "px) scale(1) rotate(" + rot + "deg)", opacity: 1, offset: 0.7 },
            { transform: "translate(" + (cx + dx * 1.1) + "px," + (cy + dy + 60) + "px) scale(0.8) rotate(" + rot * 1.4 + "deg)", opacity: 0 }
          ],
          { duration: 1100 + Math.random() * 500, easing: "cubic-bezier(0.2, 0.7, 0.3, 1)" }
        );
        a.onfinish = (function (node) {
          return function () {
            node.remove();
          };
        })(d);
      } else {
        d.remove();
      }
    }
  }

  // Pull the first Myntra URL out of whatever was dropped/pasted (share text often wraps the link in a sentence).
  // Accepts myntra.com (and subdomains) plus Myntra's myntr.it short links. Returns a clean URL string or null.
  function extractMyntra(text) {
    if (!text) return null;
    text = String(text);
    var found = text.match(/https?:\/\/[^\s<>"']+/gi) || [];
    var bare = text.match(/(?:[a-z0-9-]+\.)*(?:myntra\.com|myntr\.it)(?:\/[^\s<>"']*)?/gi) || [];
    var candidates = found.concat(
      bare.map(function (b) {
        return "https://" + b;
      })
    );

    for (var i = 0; i < candidates.length; i++) {
      var c = candidates[i].replace(/[).,!?;:'"\]]+$/, "");
      var u;
      try {
        u = new URL(c);
      } catch (e) {
        continue;
      }
      if (u.protocol !== "https:" && u.protocol !== "http:") continue;
      var h = u.hostname.toLowerCase();
      if (h === "myntra.com" || /\.myntra\.com$/.test(h) || h === "myntr.it" || /\.myntr\.it$/.test(h)) {
        return u.href;
      }
    }
    return null;
  }

  window.Sorry = {
    reduceMotion: reduceMotion,
    burst: burst,
    heartPath: HEART_PATH,
    extractMyntra: extractMyntra
  };
})();
