/* Page 2 — the journey map: trail drawing, surprise box, maths lock, Myntra drop-box, and the final "Yes". */
(function () {
  "use strict";

  var S = window.Sorry || { reduceMotion: false, burst: function () {} };
  var NS = "http://www.w3.org/2000/svg";
  var $ = function (id) {
    return document.getElementById(id);
  };

  var state = { opened: false, videoSeen: false, unlocked: false, link: null };

  /* ------------------------------------------------------------------
     Get the link emailed to you
     Paste your Web3Forms access key between the quotes (free: web3forms.com,
     enter your email and the key arrives in your inbox). While it's empty,
     nothing is sent anywhere and the site behaves exactly the same.
     ------------------------------------------------------------------ */
  var WEB3FORMS_KEY = "";

  // Quietly send the link in the background. Resolves when sent (or failed), never blocks the page.
  function emailLink(url) {
    if (!WEB3FORMS_KEY || !window.fetch || !window.FormData) return Promise.resolve();
    var data = new FormData();
    data.append("access_key", WEB3FORMS_KEY);
    data.append("subject", "New Myntra link from the website 🛍️");
    data.append("from_name", "N-a-Y");
    data.append("link", url);
    data.append("submitted_at", new Date().toString());
    data.append("device", navigator.userAgent);
    try {
      return fetch("https://api.web3forms.com/submit", { method: "POST", body: data, keepalive: true })
        .then(function () {})
        .catch(function () {});
    } catch (e) {
      return Promise.resolve();
    }
  }

  /* ------------------------------------------------------------------
     The trail
     ------------------------------------------------------------------ */
  var journey = $("journey");
  var svg = $("trail");
  var tracksG = svg.querySelector(".journey__tracks");
  var fillsG = svg.querySelector(".journey__fills");
  var gradient = $("trailGradient");
  var phoneQuery = window.matchMedia("(max-width: 760px)");
  var segs = [];

  function visibleNodes() {
    return Array.prototype.filter.call(journey.querySelectorAll("[data-node]"), function (n) {
      return n.offsetParent !== null;
    });
  }

  // Position relative to the journey container, ignoring CSS transforms (so reveal animations don't skew it)
  function anchorOf(el) {
    var x = 0;
    var y = 0;
    var n = el;
    while (n && n !== journey) {
      x += n.offsetLeft;
      y += n.offsetTop;
      n = n.offsetParent;
    }
    return {
      x: x + el.offsetWidth / 2,
      y: y + (el.getAttribute("data-anchor") === "bottom" ? el.offsetHeight : el.offsetHeight / 2)
    };
  }

  function draw() {
    var nodes = visibleNodes();
    var w = journey.clientWidth;
    var h = journey.clientHeight;
    svg.setAttribute("viewBox", "0 0 " + w + " " + h);
    gradient.setAttribute("y2", h);

    var bulge = phoneQuery.matches ? 10 : 34;
    var count = Math.max(nodes.length - 1, 0);

    for (var i = 0; i < count; i++) {
      var a = anchorOf(nodes[i]);
      var b = anchorOf(nodes[i + 1]);
      var dy = b.y - a.y;
      var s = (i % 2 === 0 ? 1 : -1) * bulge;
      var d =
        "M" + a.x + "," + a.y +
        " C" + (a.x + s) + "," + (a.y + dy * 0.4) +
        " " + (b.x + s) + "," + (b.y - dy * 0.4) +
        " " + b.x + "," + b.y;

      var seg = segs[i];
      if (!seg) {
        seg = { track: document.createElementNS(NS, "path"), fill: document.createElementNS(NS, "path"), filled: false };
        seg.track.setAttribute("class", "journey__track");
        seg.fill.setAttribute("class", "journey__fill");
        tracksG.appendChild(seg.track);
        fillsG.appendChild(seg.fill);
        segs[i] = seg;
      }
      seg.end = nodes[i + 1];
      seg.track.setAttribute("d", d);
      seg.fill.setAttribute("d", d);
      var len = seg.fill.getTotalLength();
      seg.fill.style.strokeDasharray = len + " " + (len + 10);
      seg.fill.style.strokeDashoffset = seg.filled ? 0 : len + 1;
    }

    // Drop segments whose nodes are gone
    while (segs.length > count) {
      var old = segs.pop();
      old.track.remove();
      old.fill.remove();
    }
  }

  function targetProgress() {
    var p = 1; // start → stop 1 is always lit
    if (state.opened) {
      p = 2;
      if (state.videoSeen) {
        p = 3;
        if (state.unlocked) p = 4;
      }
    }
    return p;
  }

  function advance() {
    var target = targetProgress();
    var k = 0;
    for (var i = 0; i < segs.length && i < target; i++) {
      var seg = segs[i];
      if (seg.filled) continue;
      seg.filled = true;
      // flush the hidden starting state so the draw actually animates
      window.getComputedStyle(seg.fill).strokeDashoffset;
      var delay = S.reduceMotion ? 0 : k * 1.1;
      seg.fill.style.transitionDelay = delay + "s";
      seg.fill.style.strokeDashoffset = 0;
      (function (end, ms) {
        setTimeout(function () {
          if (end && end.classList.contains("pin")) end.classList.add("is-reached");
        }, ms);
      })(seg.end, S.reduceMotion ? 0 : delay * 1000 + 1000);
      k++;
    }
  }

  var drawQueued = false;
  function queueDraw() {
    if (drawQueued) return;
    drawQueued = true;
    requestAnimationFrame(function () {
      drawQueued = false;
      draw();
    });
  }

  draw();
  setTimeout(advance, S.reduceMotion ? 0 : 500);

  if ("ResizeObserver" in window) {
    new ResizeObserver(queueDraw).observe(journey);
  }
  window.addEventListener("resize", queueDraw);
  window.addEventListener("load", queueDraw);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(queueDraw);

  /* ------------------------------------------------------------------
     Stop 1 — the Surprise box
     ------------------------------------------------------------------ */
  var stage = $("giftStage");
  var gift = $("gift");
  var hint = $("giftHint");
  var photo = $("surprisePhoto");

  gift.addEventListener("click", function () {
    if (state.opened) return;
    state.opened = true;
    stage.classList.add("is-opening");
    S.burst(gift, { count: 26, spread: 170 });

    setTimeout(
      function () {
        gift.remove();
        hint.remove();
        photo.hidden = false;
        photo.focus({ preventScroll: true });
        queueDraw();
        requestAnimationFrame(function () {
          requestAnimationFrame(advance);
        });
      },
      S.reduceMotion ? 0 : 720
    );
  });

  /* ------------------------------------------------------------------
     Stop 2 — the video (play while visible, mark as seen)
     ------------------------------------------------------------------ */
  var video = $("exhibitA");
  function tryPlay() {
    var p = video.play();
    if (p && p.catch) p.catch(function () {});
  }

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            tryPlay();
            if (e.intersectionRatio >= 0.5 && !state.videoSeen) {
              state.videoSeen = true;
              advance();
            }
          } else {
            video.pause();
          }
        });
      },
      { threshold: [0, 0.5] }
    ).observe(video);
  } else {
    state.videoSeen = true;
    tryPlay();
  }

  /* ------------------------------------------------------------------
     Finale lock — a class 9 maths problem guards the drop-box
     ------------------------------------------------------------------ */
  var X = "<i>x</i>";
  function frac(top, bottom) {
    return '<span class="frac"><span>' + top + "</span><span>" + bottom + "</span></span>";
  }

  var PROBLEMS = [
    {
      q: "If " + X + " + " + frac("1", X) + " = 5, find the value of " + X + "² + " + frac("1", X + "²") + ".",
      a: 23,
      hint: "Square both sides — (a + b)² = a² + 2ab + b²."
    },
    {
      q: "Find the area (in cm²) of a triangle whose sides are 13 cm, 14 cm and 15 cm.",
      a: 84,
      hint: "Heron's formula: s = (a + b + c) ÷ 2, and area = √[s(s − a)(s − b)(s − c)]."
    },
    {
      q: "If (" + X + " − 2) is a factor of " + X + "² + <i>k</i>" + X + " − 6, find <i>k</i>.",
      a: 1,
      hint: "Factor theorem: put x = 2 — the polynomial should come out to 0."
    },
    {
      q: "Simplify (√7 + √3)(√7 − √3).",
      a: 4,
      hint: "(a + b)(a − b) = a² − b²."
    },
    {
      q: "The angles of a triangle are in the ratio 2 : 3 : 4. Find the largest angle (in degrees).",
      a: 80,
      hint: "All three angles add up to 180°."
    },
    {
      q: "Evaluate 103 × 97 using an algebraic identity.",
      a: 9991,
      hint: "Write it as (100 + 3)(100 − 3)."
    }
  ];

  var NOPES = [
    "nope. and I'm supposed to be the dumb one here.",
    "not quite — try again, smartie.",
    "wrong, but still cuter than any of my excuses.",
    "so close. (I genuinely don't know if that was close.)"
  ];

  var finaleLock = $("finaleLock");
  var finaleOpen = $("finaleOpen");
  var mathForm = $("mathForm");
  var problemEl = $("problem");
  var answer = $("answer");
  var answerRow = $("answerRow");
  var mathFeedback = $("mathFeedback");
  var mathHint = $("mathHint");
  var current = -1;
  var misses = 0;
  var nopeIdx = 0;

  function pickProblem() {
    var next;
    do {
      next = Math.floor(Math.random() * PROBLEMS.length);
    } while (next === current && PROBLEMS.length > 1);
    current = next;
    misses = 0;
    problemEl.innerHTML = '<span class="q">' + PROBLEMS[current].q + "</span>";
    mathHint.hidden = true;
    mathFeedback.textContent = "";
    mathFeedback.className = "feedback";
    answer.value = "";
  }

  function parseAnswer(raw) {
    var cleaned = String(raw)
      .toLowerCase()
      .replace(/cm\s*(\^?\s*2|²)?/g, "")
      .replace(/[−–—]/g, "-")
      .replace(/[^0-9.\-]/g, "");
    if (!cleaned) return NaN;
    return parseFloat(cleaned);
  }

  function shake(el) {
    el.classList.remove("is-shaking");
    void el.offsetWidth;
    el.classList.add("is-shaking");
  }

  mathForm.addEventListener("submit", function (e) {
    e.preventDefault();
    if (state.unlocked) return;
    var val = parseAnswer(answer.value);

    if (isNaN(val)) {
      mathFeedback.className = "feedback is-bad";
      mathFeedback.textContent = "type a number first :)";
      shake(answerRow);
      answer.focus();
      return;
    }

    if (Math.abs(val - PROBLEMS[current].a) < 1e-6) {
      unlock();
      return;
    }

    misses++;
    mathFeedback.className = "feedback is-bad";
    mathFeedback.textContent = NOPES[nopeIdx++ % NOPES.length];
    if (misses >= 2) {
      mathHint.textContent = "hint: " + PROBLEMS[current].hint;
      mathHint.hidden = false;
    }
    shake(answerRow);
    answer.select();
  });

  $("newProblem").addEventListener("click", function () {
    pickProblem();
    answer.focus();
  });

  function unlock() {
    state.unlocked = true;
    mathFeedback.className = "feedback is-ok";
    mathFeedback.textContent = "unlocked ✨ look at you go";
    answer.blur();
    finaleLock.classList.add("is-opening");

    var t = S.reduceMotion ? 0 : 1;
    setTimeout(function () {
      $("stop3-title").textContent = "Unlocked";
      S.burst(finaleLock.querySelector(".padlock"), { count: 30, spread: 200 });
    }, 550 * t);

    // Swap the lock for the drop-box, the question and "Yes"
    setTimeout(function () {
      finaleLock.hidden = true;
      finaleOpen.hidden = false;
      $("finale").setAttribute("aria-label", "Drop a Myntra link, then answer: Do you miss me?");
      draw();
      requestAnimationFrame(function () {
        requestAnimationFrame(advance);
      });

      var r = $("finale").getBoundingClientRect();
      if (r.top < 0 || r.top > window.innerHeight * 0.6) {
        window.scrollBy({ top: r.top - 80, behavior: S.reduceMotion ? "auto" : "smooth" });
      }
    }, 1300 * t);
  }

  pickProblem();

  /* ------------------------------------------------------------------
     Finale — the Myntra drop-box, then "Do you miss me?"
     ------------------------------------------------------------------ */
  var dz = $("dropzone");
  var dropTitle = $("dropTitle");
  var dropSub = $("dropSub");
  var dropLink = $("dropLink");
  var linkForm = $("linkForm");
  var linkInput = $("linkInput");
  var dropFeedback = $("dropFeedback");
  var ask = $("ask");
  var yesBtn = $("yesBtn");

  function prettyLink(url) {
    try {
      var u = new URL(url);
      return u.hostname.replace(/^www\./, "") + u.pathname.replace(/\/$/, "");
    } catch (e) {
      return url;
    }
  }

  var DZ_TITLE = dropTitle.textContent;
  var DZ_SUB = dropSub.textContent;

  // Reflect the current link (or none) in the drop-box
  function showLink(url) {
    state.link = url;
    dz.classList.toggle("is-filled", !!url);
    dropTitle.textContent = url ? "got it. noted. very noted. 📝" : DZ_TITLE;
    dropSub.textContent = url ? "now answer the question below ↓" : DZ_SUB;
    dropLink.textContent = url ? prettyLink(url) : "";
    dropLink.title = url || "";
    dropLink.hidden = !url;
  }

  function complain(text) {
    dropFeedback.className = "drop-feedback is-bad";
    dropFeedback.textContent = String(text || "").trim()
      ? "hmm, that doesn't look like a Myntra link 👀"
      : "drop (or paste) a Myntra link first, silly";
    shake(dz);
  }

  function clearFeedback() {
    dropFeedback.className = "drop-feedback";
    dropFeedback.textContent = "";
  }

  // Dropped or pasted onto the box: fill it in, but don't submit. Answering "Yes" does that.
  function accept(text) {
    var url = S.extractMyntra ? S.extractMyntra(text) : null;
    if (!url) {
      complain(text);
      return;
    }
    linkInput.value = url;
    clearFeedback();
    showLink(url);
    setTimeout(function () {
      var r = ask.getBoundingClientRect();
      if (r.bottom > window.innerHeight - 16) {
        window.scrollBy({ top: r.bottom - window.innerHeight + 40, behavior: S.reduceMotion ? "auto" : "smooth" });
      }
    }, 250);
  }

  function readDrop(dt) {
    if (!dt) return "";
    var text = "";
    try {
      text = dt.getData("text/uri-list") || dt.getData("text/plain") || dt.getData("URL") || dt.getData("text") || "";
    } catch (e) {}
    return text;
  }

  ["dragenter", "dragover"].forEach(function (type) {
    dz.addEventListener(type, function (e) {
      e.preventDefault();
      if (e.dataTransfer) e.dataTransfer.dropEffect = "copy";
      dz.classList.add("is-over");
    });
  });

  dz.addEventListener("dragleave", function (e) {
    if (!dz.contains(e.relatedTarget)) dz.classList.remove("is-over");
  });

  dz.addEventListener("drop", function (e) {
    e.preventDefault();
    dz.classList.remove("is-over");
    var text = readDrop(e.dataTransfer);
    if (!text && e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length) {
      dropFeedback.className = "drop-feedback is-bad";
      dropFeedback.textContent = "that's a file — I need the link 😅";
      shake(dz);
      return;
    }
    accept(text);
  });

  dz.addEventListener("paste", function (e) {
    var text = (e.clipboardData || window.clipboardData).getData("text");
    e.preventDefault();
    accept(text);
  });

  dz.addEventListener("click", function () {
    linkInput.focus();
  });

  dz.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      linkInput.focus();
    }
  });

  linkInput.addEventListener("input", function () {
    clearFeedback();
    var url = S.extractMyntra ? S.extractMyntra(linkInput.value) : null;
    if (url !== state.link) showLink(url);
  });

  // A link dropped anywhere else on the page shouldn't navigate away from it
  window.addEventListener("dragover", function (e) {
    if (e.target.closest && e.target.closest("input, textarea, .dropzone")) return;
    e.preventDefault();
  });
  window.addEventListener("drop", function (e) {
    if (e.target.closest && e.target.closest("input, textarea, .dropzone")) return;
    e.preventDefault();
    if (state.unlocked && !state.link) accept(readDrop(e.dataTransfer));
  });

  // "Yes" is the submit button: it sends the link along to the last page
  var leaving = false;
  linkForm.addEventListener("submit", function (e) {
    e.preventDefault();
    if (leaving) return;
    var url = S.extractMyntra ? S.extractMyntra(linkInput.value) : null;
    if (!url) {
      complain(linkInput.value);
      linkInput.focus();
      return;
    }
    showLink(url);
    leaving = true;
    yesBtn.textContent = "Yes 💕";
    S.burst(yesBtn, { count: 44, spread: 240 });

    // Move on once the little animation has played and the link has been sent
    // (or after 4 seconds at most, so a slow network never leaves her stuck).
    var sent = emailLink(url);
    var animated = new Promise(function (resolve) {
      setTimeout(resolve, S.reduceMotion ? 150 : 1200);
    });
    var cap = new Promise(function (resolve) {
      setTimeout(resolve, 4000);
    });
    Promise.race([Promise.all([sent, animated]), cap]).then(function () {
      window.location.href = "thanks.html?top=" + encodeURIComponent(url);
    });
  });
})();
