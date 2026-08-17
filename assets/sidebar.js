/* A visible question list pinned to the left, for pages that are mostly Q&A.
   Opt in per page with <body data-sidebar>. Falls back to the existing dot rail
   and the mobile "Jump to" pill when there isn't room for a column. */
(function () {
  if (!document.body.hasAttribute("data-sidebar")) return;
  var toc = document.querySelector("#toc ol");
  if (!toc) return;

  var items = [].slice.call(toc.querySelectorAll("a")).map(function (a) {
    return { id: a.getAttribute("href").slice(1), label: a.textContent.trim() };
  });
  if (items.length < 3) return;

  var css = document.createElement("style");
  css.textContent =
    "#sideToc{position:fixed;left:26px;top:50%;transform:translateY(-50%);width:250px;z-index:44;" +
    "max-height:82vh;overflow-y:auto;padding:18px 16px;background:var(--card);" +
    "border:2px solid var(--ink);border-radius:16px 9px 18px 8px/8px 18px 9px 16px;" +
    "box-shadow:4px 5px 0 rgba(33,27,20,.10);scrollbar-width:thin}" +
    "#sideToc h4{font-size:11.5px;letter-spacing:.1em;text-transform:uppercase;color:var(--mute);" +
    "font-weight:800;margin-bottom:11px}" +
    "#sideToc a{display:block;font-size:13.5px;line-height:1.36;color:var(--body);text-decoration:none;" +
    "padding:8px 9px;border-radius:8px;margin-bottom:2px;font-weight:700;transition:.14s}" +
    "#sideToc a:hover{background:#fff;color:var(--ink)}" +
    "#sideToc a.on{background:var(--ink);color:#fff}" +
    "#sideToc a .qn{display:inline-block;min-width:17px;color:var(--mute);font-weight:800}" +
    "#sideToc a.on .qn{color:rgba(255,255,255,.6)}" +
    /* the column shifts right to make room, rather than the two overlapping */
    "@media(min-width:1240px){body[data-sidebar]{padding-left:300px}}" +
    "@media(max-width:1239px){#sideToc{display:none}}" +
    "body[data-sidebar] #navRail{display:none}" +
    "@media print{#sideToc{display:none}}" +
    "body.present #sideToc,body.editing-copy #sideToc{display:none !important}" +
    "body.present #tocTab,body.editing-copy #tocTab{display:none !important}" +
    /* collapsed: the column slides away and leaves a tab to bring it back */
    "#sideToc{transition:transform .22s ease,opacity .22s ease}" +
    "body.toc-off #sideToc{transform:translateY(-50%) translateX(-320px);opacity:0;pointer-events:none}" +
    "@media(min-width:1240px){body.toc-off[data-sidebar]{padding-left:0}}" +
    "#tocX{position:absolute;top:11px;right:11px;width:24px;height:24px;border:none;border-radius:6px;"+
    "background:transparent;color:var(--mute);font-size:17px;line-height:1;cursor:pointer;font-family:inherit}" +
    "#tocX:hover{background:#fff;color:var(--ink)}" +
    "#tocTab{position:fixed;left:0;top:50%;transform:translateY(-50%);z-index:44;display:none;" +
    "background:var(--ink);color:#fff;border:none;border-radius:0 12px 12px 0;padding:15px 11px;" +
    "cursor:pointer;font:inherit;font-size:12px;font-weight:800;letter-spacing:.09em;" +
    "writing-mode:vertical-rl;box-shadow:3px 3px 0 rgba(33,27,20,.14)}" +
    "body.toc-off #tocTab{display:block}" +
    "@media(max-width:1239px){#tocTab{display:none !important}}";
  document.head.appendChild(css);

  var el = document.createElement("nav");
  el.id = "sideToc";
  el.innerHTML = '<button id="tocX" title="Hide">&times;</button><h4>The questions</h4>' +
    items.map(function (it, i) {
    return '<a href="#' + it.id + '" data-id="' + it.id + '">' +
           '<span class="qn">' + (i + 1) + "</span> " + it.label + "</a>";
  }).join("");
  document.body.appendChild(el);

  var tab = document.createElement("button");
  tab.id = "tocTab"; tab.textContent = "QUESTIONS";
  document.body.appendChild(tab);

  // remember the choice, so it stays hidden across pages and reloads
  var KEY = "ugcw_faq_toc";
  function setOff(v) {
    document.body.classList.toggle("toc-off", v);
    try { localStorage.setItem(KEY, v ? "1" : "0"); } catch (e) {}
  }
  try { if (localStorage.getItem(KEY) === "1") document.body.classList.add("toc-off"); } catch (e) {}
  el.querySelector("#tocX").onclick = function () { setOff(true); };
  tab.onclick = function () { setOff(false); };

  var links = [].slice.call(el.querySelectorAll("a"));
  var targets = items.map(function (it) { return document.getElementById(it.id); });

  function mark() {
    var y = scrollY + innerHeight * 0.3, active = 0;
    targets.forEach(function (t, i) { if (t && t.offsetTop <= y) active = i; });
    links.forEach(function (a, i) { a.classList.toggle("on", i === active); });
    var cur = links[active];
    if (cur && cur.offsetTop < el.scrollTop) el.scrollTop = cur.offsetTop - 40;
    if (cur && cur.offsetTop > el.scrollTop + el.clientHeight - 60) {
      el.scrollTop = cur.offsetTop - el.clientHeight + 80;
    }
  }
  links.forEach(function (a) {
    a.addEventListener("click", function () { setTimeout(mark, 400); });
  });

  addEventListener("scroll", mark, { passive: true });
  addEventListener("resize", mark);
  mark();
})();
