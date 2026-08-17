/* Horizontal swipe rail for the live campaigns.
   Touch and trackpad already scroll it. This adds click-drag on desktop and
   arrows that step one card at a time, and greys them out at each end. */
(function () {
  [].slice.call(document.querySelectorAll("[data-rail]")).forEach(function (rail) {
    var track = rail.querySelector(".rail-track");
    var prev = rail.querySelector(".rail-prev"), next = rail.querySelector(".rail-next");
    if (!track) return;

    function step() {
      // move a whole card, and never less than the visible width when cards are wide
      var f = track.querySelector("figure");
      var w = f ? f.offsetWidth + 14 : 300;
      return Math.max(w, Math.min(track.clientWidth * 0.9, w * 2));
    }

    function slide(dir) {
      var target = track.scrollLeft + dir * step();
      var max = track.scrollWidth - track.clientWidth;
      target = Math.max(0, Math.min(max, target));
      try { track.scrollTo({ left: target, behavior: "smooth" }); }
      catch (e) { track.scrollLeft = target; }
      // if smooth scrolling is blocked, land it anyway
      setTimeout(function () {
        if (Math.abs(track.scrollLeft - target) > 8) track.scrollLeft = target;
        mark();
      }, 420);
    }

    function mark() {
      var max = track.scrollWidth - track.clientWidth - 2;
      if (prev) prev.disabled = track.scrollLeft <= 2;
      if (next) next.disabled = track.scrollLeft >= max;
    }

    if (prev) prev.onclick = function (e) { e.preventDefault(); slide(-1); };
    if (next) next.onclick = function (e) { e.preventDefault(); slide(1); };
    track.addEventListener("scroll", mark, { passive: true });
    addEventListener("resize", mark);
    mark();

    // click and drag, the way a deck feels
    var down = false, startX = 0, startL = 0, moved = 0;
    track.addEventListener("pointerdown", function (e) {
      if (e.pointerType === "touch") return;
      down = true; moved = 0; startX = e.clientX; startL = track.scrollLeft;
    });
    addEventListener("pointermove", function (e) {
      if (!down) return;
      var d = e.clientX - startX;
      if (Math.abs(d) > 3) moved = 1;
      track.scrollLeft = startL - d;
    });
    addEventListener("pointerup", function () {
      // a drag should not also open the lightbox
      if (moved) track.addEventListener("click", function k(ev) {
        ev.stopPropagation(); ev.preventDefault(); track.removeEventListener("click", k, true);
      }, true);
      down = false;
    });
  });
})();
