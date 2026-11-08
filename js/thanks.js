/* Page 3 — thank you: floating hearts, and a way to actually send over the top she picked. */
(function () {
  "use strict";

  var S = window.Sorry || { reduceMotion: false, burst: function () {} };

  // Floating hearts
  if (!S.reduceMotion) {
    var n = window.innerWidth < 600 ? 12 : 20;
    for (var i = 0; i < n; i++) {
      var h = document.createElement("span");
      h.className = "floaty";
      h.setAttribute("aria-hidden", "true");
      var size = 10 + Math.random() * 22;
      h.style.left = Math.random() * 100 + "%";
      h.style.width = size + "px";
      h.style.height = size * 0.92 + "px";
      h.style.animationDuration = 9 + Math.random() * 10 + "s";
      h.style.animationDelay = -Math.random() * 18 + "s";
      h.style.setProperty("--dx", (Math.random() * 160 - 80).toFixed(0) + "px");
      h.style.setProperty("--r", (Math.random() * 80 - 40).toFixed(0) + "deg");
      h.style.setProperty("--o", (0.25 + Math.random() * 0.5).toFixed(2));
      h.style.color = Math.random() > 0.35 ? "#ff5c8a" : "#ffb547";
      h.innerHTML = '<svg viewBox="0 0 24 22" width="100%" height="100%"><path fill="currentColor" d="' + S.heartPath + '"/></svg>';
      document.body.appendChild(h);
    }

    setTimeout(function () {
      S.burst(document.getElementById("bigHeart"), { count: 30, spread: 220 });
    }, 500);
  }

  // The Myntra link from the journey page, if there is one
  var top = null;
  try {
    top = new URLSearchParams(window.location.search).get("top");
  } catch (e) {}
  var url = top && S.extractMyntra ? S.extractMyntra(top) : null;

  if (url) {
    var ps = document.getElementById("ps");
    var send = document.getElementById("sendTop");
    var message = "this one 👉 " + url;
    send.href = "https://wa.me/?text=" + encodeURIComponent(message);
    send.addEventListener("click", function (e) {
      if (navigator.share) {
        e.preventDefault();
        navigator.share({ text: "this one 👉", url: url }).catch(function () {});
      }
    });
    ps.hidden = false;
  }
})();
