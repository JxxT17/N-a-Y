/* Page 3 — thank you, plus a P.S. when she picked a top. */
(function () {
  "use strict";

  var S = window.Sorry || { reduceMotion: false, burst: function () {} };

  if (!S.reduceMotion) {
    setTimeout(function () {
      S.burst(document.getElementById("bigHeart"), { count: 24, spread: 200 });
    }, 500);
  }

  // The Myntra link from the journey page, if there is one
  var top = null;
  try {
    top = new URLSearchParams(window.location.search).get("top");
  } catch (e) {}
  var url = top && S.extractMyntra ? S.extractMyntra(top) : null;

  if (url) {
    document.getElementById("ps").hidden = false;
  }
})();
