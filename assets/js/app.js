/* ============================================================================
   APP — diavoorstelling-motor (autoplay-loop, overgangen, wereldbol-aansturing)
   ========================================================================== */
(function () {
  "use strict";

  const cfg = window.CONFIG;
  const COUNTRIES = window.COUNTRIES || [];
  const app = document.getElementById("app");
  const stage = document.getElementById("stage");
  const progressBar = document.getElementById("progressbar");
  const globeLayer = document.getElementById("globe-layer");

  /* ---------- iconen (inline SVG) ----------------------------------------- */
  const P = {
    war: '<path d="M12 2l2.3 5.2L20 5l-2.6 5.4L22 12l-4.6 1.6L20 19l-5.7-2.2L12 22l-2.3-5.2L4 19l2.6-5.4L2 12l4.6-1.6L4 5l5.7 2.2z"/>',
    mother: '<circle cx="11" cy="6" r="2.4"/><path d="M5.5 21c0-4.2 2.4-7 5.5-7s5.5 2.8 5.5 7"/><circle cx="17.5" cy="12.5" r="1.7"/><path d="M16 21c0-2 .6-3.4 1.5-4"/>',
    nutrition: '<path d="M4 11h16a8 8 0 0 1-16 0z"/><path d="M5 20h14"/><path d="M9 8c0-1.2-.8-1.6-.8-2.6S9 4 9 4M13 8c0-1.2-.8-1.6-.8-2.6S13 4 13 4"/>',
    vaccine: '<path d="M14 4l6 6"/><path d="M17 7l-9 9-3.2 1 .9-3.3 9-9z"/><path d="M11 9l3 3"/><path d="M4.5 19.5L6 18"/>',
    surgery: '<path d="M12 3l7 3v5c0 4.6-3 7.6-7 9-4-1.4-7-4.4-7-9V6z"/><path d="M12 8.5v5M9.5 11h5"/>',
    mind: '<path d="M16 20.5v-1.8a6.2 6.2 0 1 0-6.4-.2"/><path d="M9.5 20.5v-2"/><path d="M12.4 12.3c-1.1-1-2.7-.2-2.7 1 0 1.3 2.7 2.7 2.7 2.7s2.7-1.4 2.7-2.7c0-1.2-1.6-2-2.7-1z"/>',
    epidemic: '<circle cx="12" cy="12" r="4.2"/><path d="M12 4v2.4M12 17.6V20M4 12h2.4M17.6 12H20M6.3 6.3l1.7 1.7M16 16l1.7 1.7M17.7 6.3L16 8M8 16l-1.7 1.7"/>',
    water: '<path d="M12 3s6.5 6.7 6.5 11A6.5 6.5 0 1 1 5.5 14C5.5 9.7 12 3 12 3z"/>',
    independent: '<path d="M12 3l7 3v5c0 4.6-3 7.6-7 9-4-1.4-7-4.4-7-9V6z"/><path d="M9 12l2.2 2.2L15.5 10"/>',
    neutral: '<path d="M12 4v15M7 19h10M5 8h14M5 8l-2.2 4.2a3 3 0 0 0 5.4 0L6 8M19 8l-2.2 4.2a3 3 0 0 0 5.4 0L20 8"/><circle cx="12" cy="4.4" r="1"/>',
    impartial: '<circle cx="12" cy="12" r="9"/><path d="M8 10h8M8 14h8"/>',
  };
  const icon = (k) => `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[k] || ""}</svg>`;

  /* ---------- helpers ----------------------------------------------------- */
  function E(tag, cls, html) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  function anim(node, delay) { node.classList.add("anim"); if (delay) node.style.setProperty("--d", delay + "ms"); return node; }
  const photo = (file) => "assets/photos/" + file;
  const nl = (n) => n.toLocaleString("nl-NL");

  /* ---------- slide-renderers -------------------------------------------- */
  function renderTitle() {
    const s = E("section", "slide slide--title");
    s.innerHTML = `
      <div class="title-bg"></div>
      <div class="title-inner">
        <p class="title-kicker anim" style="--d:80ms">Kom in actie voor</p>
        <img class="title-logo anim" style="--d:240ms" src="${photo("logo-azg.png")}" alt="Artsen zonder Grenzen">
        <p class="title-quote anim" style="--d:480ms">“Steun onze actie en draag bij aan medische hulp waar dat het meest nodig is.”</p>
      </div>`;
    return s;
  }

  function renderStatement(d) {
    const cls = "slide slide--statement " + (d.theme === "teal" ? "is-teal" : "is-red") + (d.image ? " has-photo" : "");
    const s = E("section", cls);
    const bg = d.image
      ? `<div class="state-photo" style="background-image:url('${photo(d.image)}')"></div><div class="state-scrim"></div>`
      : "";
    s.innerHTML = `
      ${bg}
      <div class="state-inner">
        ${d.kicker ? `<p class="kicker anim" style="--d:60ms">${d.kicker}</p>` : ""}
        <p class="state-text anim" style="--d:220ms">${d.text}</p>
        <span class="state-mark anim" style="--d:520ms"></span>
      </div>`;
    return s;
  }

  function renderAbout() {
    const cards = window.PRINCIPLES.map((p, i) => `
      <div class="pcard anim" style="--d:${360 + i * 140}ms">
        <span class="pcard__ic">${icon(p.icon)}</span>
        <h3>${p.title}</h3>
        <p>${p.text}</p>
      </div>`).join("");
    const s = E("section", "slide slide--about");
    s.innerHTML = `
      <div class="about-inner">
        <p class="kicker anim" style="--d:60ms">Wie wij zijn</p>
        <h2 class="h-lead anim" style="--d:160ms">Onafhankelijke medische noodhulp,<br>daar waar de nood het hoogst is.</h2>
        <p class="about-timeline anim" style="--d:260ms"><b>1971</b> opgericht · <b>1984</b> in Nederland · <b>1999</b> Nobelprijs voor de Vrede</p>
        <div class="pcards">${cards}</div>
      </div>`;
    return s;
  }

  function renderThemes() {
    const tiles = window.THEMES.map((t, i) => `
      <div class="tile anim" style="--d:${260 + i * 90}ms">
        <span class="tile__ic">${icon(t.icon)}</span>
        <h3>${t.title}</h3>
        <p>${t.text}</p>
      </div>`).join("");
    const s = E("section", "slide slide--themes");
    s.innerHTML = `
      <div class="themes-inner">
        <header class="themes-head">
          <p class="kicker anim" style="--d:40ms">Wat we doen</p>
          <h2 class="h-lead anim" style="--d:140ms">Medische hulp in al haar vormen</h2>
        </header>
        <div class="tiles">${tiles}</div>
      </div>`;
    return s;
  }

  function renderStats() {
    const items = window.STATS.map((st, i) => `
      <div class="stat anim" style="--d:${200 + i * 120}ms">
        <div class="stat__num" data-val="${st.value}" data-prefix="${st.prefix || ""}" data-suffix="${st.suffix || ""}">${st.prefix || ""}0${st.suffix || ""}</div>
        <div class="stat__label">${st.label}</div>
      </div>`).join("");
    const s = E("section", "slide slide--stats");
    s.innerHTML = `
      <div class="stats-inner">
        <header class="stats-head">
          <p class="kicker anim" style="--d:40ms">Onze impact, wereldwijd</p>
          <h2 class="h-lead anim" style="--d:140ms">Elk jaar opnieuw, in cijfers</h2>
        </header>
        <div class="stats-grid">${items}</div>
        <p class="source anim" style="--d:1100ms">${cfg.sourceNote}</p>
      </div>`;
    return s;
  }

  function renderGlobeIntro() {
    const s = E("section", "slide slide--globe-intro");
    s.innerHTML = `
      <div class="gi-inner">
        <p class="kicker anim" style="--d:120ms">Ons werk over de hele wereld</p>
        <h2 class="gi-title anim" style="--d:280ms">In meer dan <b>70 landen</b><br>staan onze teams klaar</h2>
        <p class="gi-sub anim" style="--d:460ms">Van oorlogsgebieden tot vluchtelingenkampen — overal waar mensen medische hulp nodig hebben.</p>
      </div>`;
    return s;
  }

  function renderCountry(co, i) {
    const stats = co.stats.map((st) => `
      <div class="cchip"><span class="cchip__v">${st.value}</span><span class="cchip__l">${st.label}</span></div>`).join("");
    const s = E("section", "slide slide--country" + (co.accent === "aqua" ? " is-aqua" : ""));
    s.dataset.country = i;
    const photoBlock = co.photo
      ? `<figure class="cphoto"><img src="${photo(co.photo)}" alt=""></figure>`
      : "";
    s.innerHTML = `
      <div class="ccard ${co.photo ? "has-photo" : ""}">
        ${photoBlock}
        <div class="ccard__body">
          <p class="cregion anim" style="--d:140ms"><span class="cdot"></span>${co.region}</p>
          <h2 class="cname anim" style="--d:240ms">${co.name}</h2>
          <p class="ckicker anim" style="--d:340ms">${co.kicker}</p>
          <p class="ctext anim" style="--d:440ms">${co.text}</p>
          <div class="cchips anim" style="--d:580ms">${stats}</div>
        </div>
      </div>`;
    return s;
  }

  function renderCTA() {
    const s = E("section", "slide slide--cta");
    s.innerHTML = `
      <div class="photo-bg" style="background-image:url('${photo("credo-bg.jpg")}')"></div>
      <div class="photo-scrim"></div>
      <div class="cta-inner">
        <div class="cta-left">
          <p class="kicker kicker--light anim" style="--d:80ms">Help je mee?</p>
          <h2 class="cta-title anim" style="--d:200ms">Steun onze actie</h2>
          <p class="cta-text anim" style="--d:340ms">Draag bij aan medische hulp waar dat het meest nodig is. Elke gift telt — en blijft: ruim 98% van onze inkomsten komt van donateurs zoals jij.</p>
          <span class="logo-chip cta-chip anim" style="--d:520ms"><img src="${photo("logo-azg.png")}" alt="Artsen zonder Grenzen"></span>
        </div>
        <div class="cta-right anim" style="--d:420ms">
          <div class="qr-card">
            <img class="qr-actie" src="${photo("logo-actie.png")}" alt="Kom in actie">
            <div class="qr-holder" id="qr-holder">
              <img src="${photo("adobe-express-qr-code.png")}" alt="QR code" style="width: 100%; height: 100%; object-fit: contain; border-radius: 6px;">
            </div>
            <p class="qr-scan">Scan &amp; doneer</p>
          </div>
          <p class="cta-url">${cfg.actionUrlLabel}</p>
        </div>
      </div>`;
    return s;
  }

  function renderThanks() {
    const s = E("section", "slide slide--thanks");
    s.innerHTML = `
      <div class="photo-bg" style="background-image:url('${photo("credo-bg.jpg")}')"></div>
      <div class="photo-scrim"></div>
      <div class="thanks-inner">
        <span class="thanks-heart anim" style="--d:80ms">${heartSVG()}</span>
        <h2 class="thanks-title anim" style="--d:240ms">Samen,<br>zonder grenzen</h2>
        <p class="thanks-sub anim" style="--d:440ms">Dank je wel voor je steun.</p>
        <span class="logo-chip anim" style="--d:600ms"><img class="thanks-azg" src="${photo("logo-azg.png")}" alt="Artsen zonder Grenzen"></span>
      </div>`;
    return s;
  }

  function heartSVG() {
    return `<svg viewBox="0 0 32 30" aria-hidden="true"><path fill="currentColor" d="M16 28S2.5 19.6 2.5 10.4C2.5 6 6 2.8 9.8 2.8c2.6 0 4.8 1.4 6.2 3.6 1.4-2.2 3.6-3.6 6.2-3.6 3.8 0 7.3 3.2 7.3 7.6C29.5 19.6 16 28 16 28z"/></svg>`;
  }

  /* ---------- QR-code ----------------------------------------------------- */
  function buildQR(text, size) {
    let qr = null;
    for (let t = 4; t <= 20; t++) {
      try { const q = qrcode(t, "M"); q.addData(text); q.make(); qr = q; break; } catch (e) { /* te klein, probeer groter */ }
    }
    const holder = document.getElementById("qr-holder");
    if (!holder) return;
    holder.innerHTML = "";
    if (!qr) { holder.textContent = "QR"; return; }
    const count = qr.getModuleCount();
    const margin = 2, total = count + margin * 2;
    const cell = Math.max(3, Math.floor(size / total));
    const px = cell * total;
    const cv = document.createElement("canvas");
    cv.width = cv.height = px;
    const x = cv.getContext("2d");
    x.fillStyle = "#ffffff"; x.fillRect(0, 0, px, px);
    x.fillStyle = "#26090b";
    for (let r = 0; r < count; r++) {
      for (let c = 0; c < count; c++) {
        if (qr.isDark(r, c)) x.fillRect((c + margin) * cell, (r + margin) * cell, cell, cell);
      }
    }
    holder.appendChild(cv);
  }

  /* ---------- count-up --------------------------------------------------- */
  function countUp(node) {
    const val = parseInt(node.dataset.val, 10);
    const prefix = node.dataset.prefix || "", suffix = node.dataset.suffix || "";
    const dur = 1500, t0 = performance.now();
    function tick(now) {
      const p = Math.min(1, (now - t0) / dur);
      const e = 1 - Math.pow(1 - p, 3);           // easeOutCubic
      node.textContent = prefix + nl(Math.round(val * e)) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  /* ---------- bouw de diavoorstelling ------------------------------------ */
  const slides = [];   // {type, node, duration, globe}
  const DUR = { title: 7000, statement: 6500, about: 11000, themes: 10500, stats: 10000, globeIntro: 8500, country: 9000, cta: 13000, thanks: 6000 };

  function add(type, node, opts) {
    slides.push(Object.assign({ type, node, duration: DUR[type] || cfg.defaultDuration, globe: null }, opts || {}));
    stage.appendChild(node);
  }

  function build() {
    add("title", renderTitle());
    add("statement", renderStatement({ kicker: "Onze drijfveer", text: cfg.credo, theme: "red", image: "credo-bg.jpg" }));
    add("about", renderAbout());
    add("themes", renderThemes());
    add("stats", renderStats());
    add("globeIntro", renderGlobeIntro(), { globe: "free" });
    COUNTRIES.forEach((co, i) => add("country", renderCountry(co, i), { globe: { country: i } }));
    add("statement", renderStatement({ kicker: "Zonder grenzen", text: "Grenzen bepalen niet wie hulp verdient.", theme: "teal", image: "credo-bg.jpg" }));
    if (cfg.showDonateCTA) add("cta", renderCTA());
    add("thanks", renderThanks());
  }

  /* ---------- afspelen ---------------------------------------------------- */
  let idx = -1, timer = null, paused = false, startTime = 0, remaining = 0;

  function setGlobe(s) {
    if (!window.Globe || !window.Globe.ready) { app.dataset.globe = "none"; return; }
    if (s.globe === "free") { app.dataset.globe = "free"; window.Globe.start(); window.Globe.free(); }
    else if (s.globe && typeof s.globe === "object") { app.dataset.globe = "country"; window.Globe.start(); window.Globe.focus(s.globe.country); }
    else { app.dataset.globe = "none"; window.Globe.stop(); }
  }

  function onEnter(s) {
    setGlobe(s);
    if (s.type === "stats") s.node.querySelectorAll(".stat__num").forEach(countUp);
    // Use static QR code image instead of dynamically building one
    // if (s.type === "cta") buildQR(cfg.actionUrl, 360);
  }

  function restartProgress(dur) {
    progressBar.style.animation = "none";
    void progressBar.offsetWidth;             // forceer reflow
    progressBar.style.animation = `fill ${dur}ms linear forwards`;
  }

  function show(i) {
    const prev = slides[idx];
    if (prev) prev.node.classList.remove("active");
    idx = (i + slides.length) % slides.length;
    const s = slides[idx];
    s.node.classList.add("active");
    onEnter(s);
    schedule(s.duration);
    restartProgress(s.duration);
  }

  function schedule(dur) {
    clearTimeout(timer);
    startTime = performance.now();
    remaining = dur;
    if (!paused) timer = setTimeout(next, dur);
  }
  function next() { show(idx + 1); }
  function prev() { show(idx - 1); }

  function pause() {
    if (paused) return;
    paused = true; app.classList.add("is-paused");
    clearTimeout(timer);
    remaining -= performance.now() - startTime;
  }
  function play() {
    if (!paused) return;
    paused = false; app.classList.remove("is-paused");
    startTime = performance.now();
    timer = setTimeout(next, Math.max(400, remaining));
  }
  function toggle() { paused ? play() : pause(); }

  /* ---------- bediening (kiosk) ------------------------------------------ */
  // Volledig scherm — met webkit-prefix zodat het ook op iPad/Safari werkt.
  function fsElement() { return document.fullscreenElement || document.webkitFullscreenElement || null; }
  function goFullscreen() {
    const el = document.documentElement;
    if (fsElement()) {
      const exit = document.exitFullscreen || document.webkitExitFullscreen || document.webkitCancelFullScreen;
      if (exit) { try { const r = exit.call(document); if (r && r.catch) r.catch(() => {}); } catch (e) {} }
    } else {
      const req = el.requestFullscreen || el.webkitRequestFullscreen || el.webkitRequestFullScreen;
      if (req) { try { const r = req.call(el); if (r && r.catch) r.catch(() => {}); } catch (e) {} }
    }
  }
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") { next(); }
    else if (e.key === "ArrowLeft") { prev(); }
    else if (e.key === " ") { e.preventDefault(); toggle(); }
    else if (e.key === "Enter" || e.key.toLowerCase() === "f") { goFullscreen(); }
  });
  // Tik = pauze/hervat · dubbeltik = volledig scherm · swipe = navigeren · pijltjes/Enter/F.
  let clickTimer = null, swiped = false;
  stage.addEventListener("click", () => {
    if (swiped) { swiped = false; return; }   // het was een veegbeweging, geen tik
    if (clickTimer) {                          // tweede tik => dubbeltik
      clearTimeout(clickTimer); clickTimer = null;
      goFullscreen();
      return;
    }
    clickTimer = setTimeout(() => { clickTimer = null; toggle(); }, 320);
  });

  // Veeg-navigatie (touch): naar links = volgende dia, naar rechts = vorige dia.
  // Op document (vangt de beweging ongeacht het aangeraakte element) + bijhouden
  // van de laatste positie als fallback voor touchend.
  let tStartX = null, tStartY = null, tLastX = 0, tLastY = 0;
  document.addEventListener("touchstart", (e) => {
    if (!e.touches || e.touches.length !== 1) { tStartX = null; return; }
    tStartX = e.touches[0].clientX; tStartY = e.touches[0].clientY;
    tLastX = tStartX; tLastY = tStartY; swiped = false;
  }, { passive: true });
  document.addEventListener("touchmove", (e) => {
    if (tStartX === null || !e.touches || !e.touches[0]) return;
    tLastX = e.touches[0].clientX; tLastY = e.touches[0].clientY;
  }, { passive: true });
  document.addEventListener("touchend", (e) => {
    if (tStartX === null) return;
    let ex = tLastX, ey = tLastY;
    if (e.changedTouches && e.changedTouches[0]) { ex = e.changedTouches[0].clientX; ey = e.changedTouches[0].clientY; }
    const dx = ex - tStartX, dy = ey - tStartY;
    tStartX = null;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.2) {
      swiped = true;                            // onderdruk de tik die hierna kan volgen
      if (clickTimer) { clearTimeout(clickTimer); clickTimer = null; }
      if (dx < 0) next(); else prev();          // links = volgende, rechts = vorige
    }
  }, { passive: true });
  document.addEventListener("touchcancel", () => { tStartX = null; }, { passive: true });

  // cursor verbergen bij inactiviteit
  let cursorTimer = null;
  function pokeCursor() {
    app.classList.remove("hide-cursor");
    clearTimeout(cursorTimer);
    cursorTimer = setTimeout(() => app.classList.add("hide-cursor"), 2800);
  }
  window.addEventListener("mousemove", pokeCursor); pokeCursor();

  document.addEventListener("visibilitychange", () => { document.hidden ? pause() : play(); });

  /* ---------- start ------------------------------------------------------- */
  function init() {
    build();
    try { if (window.Globe) window.Globe.init(globeLayer, COUNTRIES); }
    catch (e) { console.error("Globe init mislukt:", e); }
    // Hulp-parameters: ?slide=N springt naar een dia, ?still=1 zet autoplay uit (voor previews)
    const params = new URLSearchParams(location.search);
    const startAt = parseInt(params.get("slide"), 10);
    show(Number.isFinite(startAt) ? startAt : 0);
    if (params.has("still")) pause();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
