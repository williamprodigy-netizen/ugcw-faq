/* Section navigation.
   Desktop: a quiet dot rail on the right, labels on hover, active dot tracks scroll.
   Mobile: a small "Jump to" pill that opens the section list.
   Hidden while presenting, since the deck has its own controls. */
(function () {
  var toc = document.querySelector("#toc ol");
  if (!toc) return;
  var items = [].slice.call(toc.querySelectorAll("a")).map(function (a) {
    return { id: a.getAttribute("href").slice(1), label: a.textContent.trim() };
  });
  if (!items.length) return;

  var css = document.createElement("style");
  css.textContent =
    /* desktop rail */
    "#navRail{position:fixed;right:18px;top:50%;transform:translateY(-50%);z-index:40;display:flex;" +
    "flex-direction:column;gap:14px;align-items:flex-end}" +
    "#navRail a{display:flex;align-items:center;gap:10px;text-decoration:none;color:var(--mute);" +
    "font-size:13.5px;font-weight:700;font-family:inherit}" +
    "#navRail .dot{width:10px;height:10px;border-radius:50%;border:2px solid #c8c4bb;background:#fff;" +
    "flex:0 0 auto;transition:.18s}" +
    "#navRail .lbl{opacity:0;transform:translateX(6px);transition:.18s;white-space:nowrap;" +
    "background:var(--ink);color:#fff;padding:5px 11px;border-radius:7px;font-size:12.5px;pointer-events:none}" +
    "#navRail a:hover .lbl{opacity:1;transform:translateX(0)}" +
    "#navRail a:hover .dot{border-color:var(--ink)}" +
    "#navRail a.on .dot{background:var(--accent);border-color:var(--accent);transform:scale(1.35)}" +
    "body.present #navRail,body.present #navBtn,body.present #navSheet{display:none !important}" +
    "body.editing-copy #navRail{display:none}" +
    /* mobile */
    "#navBtn{display:none;position:fixed;left:16px;bottom:16px;z-index:41;background:var(--ink);color:#fff;" +
    "border:none;border-radius:999px;padding:11px 16px;font-size:13.5px;font-weight:700;font-family:inherit;" +
    "box-shadow:0 6px 20px rgba(0,0,0,.22);cursor:pointer}" +
    "#navSheet{display:none;position:fixed;inset:0;z-index:42;background:rgba(33,27,20,.45)}" +
    "#navSheet.on{display:block}" +
    "#navSheet .in{position:absolute;left:0;right:0;bottom:0;background:#fff;border-radius:18px 18px 0 0;" +
    "padding:20px 20px 28px;max-height:76vh;overflow:auto}" +
    "#navSheet h4{font-size:13px;letter-spacing:.12em;text-transform:uppercase;color:var(--mute);" +
    "margin-bottom:14px;font-weight:800}" +
    "#navSheet a{display:block;padding:13px 4px;border-bottom:1px solid var(--line);color:var(--ink);" +
    "text-decoration:none;font-size:16.5px;font-weight:700}" +
    "#navSheet a:last-child{border-bottom:none}" +
    "@media(max-width:900px){#navRail{display:none}#navBtn{display:block}}" +
    "@media print{#navRail,#navBtn,#navSheet{display:none}}";
  document.head.appendChild(css);

  var rail = document.createElement("nav");
  rail.id = "navRail";
  rail.innerHTML = items.map(function (it) {
    return '<a href="#' + it.id + '" data-id="' + it.id + '">' +
           '<span class="lbl">' + it.label + "</span><span class=\"dot\"></span></a>";
  }).join("");
  document.body.appendChild(rail);

  var btn = document.createElement("button");
  btn.id = "navBtn"; btn.textContent = "Jump to";
  document.body.appendChild(btn);

  var sheet = document.createElement("div");
  sheet.id = "navSheet";
  sheet.innerHTML = '<div class="in"><h4>Jump to</h4>' +
    items.map(function (it) { return '<a href="#' + it.id + '">' + it.label + "</a>"; }).join("") +
    "</div>";
  document.body.appendChild(sheet);

  btn.onclick = function () { sheet.classList.add("on"); };
  sheet.onclick = function (e) { if (e.target === sheet || e.target.tagName === "A") sheet.classList.remove("on"); };

  var dots = [].slice.call(rail.querySelectorAll("a"));
  var targets = items.map(function (it) { return document.getElementById(it.id); });

  function mark() {
    var y = window.scrollY + innerHeight * 0.35, active = 0;
    targets.forEach(function (t, i) { if (t && t.offsetTop <= y) active = i; });
    dots.forEach(function (d, i) { d.classList.toggle("on", i === active); });
  }
  addEventListener("scroll", mark, { passive: true });
  addEventListener("resize", mark);
  mark();
})();
