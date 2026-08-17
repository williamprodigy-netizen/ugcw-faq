/* Click any attachment to blow it up full screen.
   Arrow keys and the on-screen chevrons step through every image on the page,
   so a screenshot that reads small in the flow can always be inspected properly.
   Stays out of the way while presenting, commenting or editing copy. */
(function () {
  var lb = document.createElement("div");
  lb.id = "lb";
  lb.innerHTML = '<button class="lbx" aria-label="Close">&times;</button>' +
                 '<button class="lbn p" aria-label="Previous">&#8249;</button>' +
                 '<img alt=""><button class="lbn n" aria-label="Next">&#8250;</button>' +
                 '<div class="lbcap"></div>';
  document.body.appendChild(lb);

  var big = lb.querySelector("img"), cap = lb.querySelector(".lbcap"), i = -1;

  function shots() {
    return [].slice.call(document.querySelectorAll(".card img, .card figure.att img"))
      .filter(function (im) { return im.offsetParent !== null || document.body.classList.contains("present"); });
  }

  function captionFor(im) {
    var f = im.closest("figure");
    var c = f && f.querySelector("figcaption");
    return c ? c.textContent.replace(/\s+/g, " ").trim() : (im.alt || "");
  }

  function show(n) {
    var list = shots();
    if (!list.length) return;
    i = (n + list.length) % list.length;
    var im = list[i];
    big.src = im.currentSrc || im.src;
    cap.textContent = captionFor(im);
    lb.classList.add("on");
    document.body.style.overflow = "hidden";
    var many = list.length > 1;
    lb.querySelector(".lbn.p").style.display = many ? "" : "none";
    lb.querySelector(".lbn.n").style.display = many ? "" : "none";
  }

  function close() {
    lb.classList.remove("on");
    big.removeAttribute("src");
    document.body.style.overflow = "";
  }

  // one delegated listener, so images added later (attachments) work too
  document.addEventListener("click", function (e) {
    var im = e.target.closest && e.target.closest(".card img");
    if (!im) return;
    // let the other layers keep their clicks
    if (document.body.classList.contains("commenting")) return;
    if (document.body.classList.contains("editing-copy")) return;
    if (im.closest("a")) return;
    e.preventDefault();
    var list = shots(), at = list.indexOf(im);
    if (at > -1) show(at);
  });

  lb.addEventListener("click", function (e) {
    if (e.target.classList.contains("lbn")) {
      show(i + (e.target.classList.contains("n") ? 1 : -1));
    } else {
      close();
    }
  });

  addEventListener("keydown", function (e) {
    if (!lb.classList.contains("on")) return;
    if (e.key === "Escape") { close(); }
    else if (e.key === "ArrowRight") { e.stopPropagation(); show(i + 1); }
    else if (e.key === "ArrowLeft") { e.stopPropagation(); show(i - 1); }
  }, true);

  window.UGCW_LAYERS = window.UGCW_LAYERS || {};
  window.UGCW_LAYERS.lightbox = function (v) { if (!v) close(); };
})();
