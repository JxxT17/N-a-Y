/* Page 3 — thank you, and a way to actually send over the top she picked. */
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
