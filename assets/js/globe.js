/* ============================================================================
   GLOBE — 3D-aandoende roterende wereldbol op een 2D-CANVAS
   ----------------------------------------------------------------------------
   Bewust GEEN WebGL: de 2D Canvas-API werkt op élk apparaat/browser (geen GPU/
   driver-afhankelijkheid). Orthografische projectie geeft een echte bol-look.
   - Gepunte landmassa in het Artsen-zonder-Grenzen-palet
   - Rode hart-markers per uitgelicht land (aqua voor de zee-redding)
   - Vrije rotatie, of "focus" op een land
   Zelfde publieke API als voorheen: init / focus / free / start / stop / ready
   ========================================================================== */
window.Globe = (function () {
  "use strict";

  const COL = {
    oceanLight: "#7a141a",      // donkere maroon-bol op rode achtergrond
    oceanMid: "#4a0b10",
    oceanDark: "#250609",
    land: "rgba(255,238,231,1)",// warm-witte landpunten (pop op maroon)
    glow: "255,180,158",        // rgb voor warme atmosfeer-gloed
    marker: "#ff4a4f",          // inactieve markers (rood)
    markerAqua: "#ff4a4f",
  };

  let canvas, ctx, dpr = 1, W = 0, H = 0, cx = 0, cy = 0, R = 0;
  let raf = null, running = false, ready = false, last = 0;
  let mode = "free", activeIndex = -1;
  let yaw = 0, pitch = -0.32, targetYaw = 0, targetPitch = -0.32;
  const TILT_FREE = -0.32, SPIN = 0.14;       // rad/sec vrije rotatie
  let landPts = [], markers = [], countries = [];

  const D2R = Math.PI / 180;
  function unit(lng, lat) {
    const a = lat * D2R, b = lng * D2R;
    return { x: Math.cos(a) * Math.sin(b), y: Math.sin(a), z: Math.cos(a) * Math.cos(b) };
  }

  /* ---- Landmasker uit GeoJSON (zelf getekend → geen externe afbeelding) --- */
  function buildLandMask(w, h) {
    const c = document.createElement("canvas"); c.width = w; c.height = h;
    const x = c.getContext("2d");
    x.fillStyle = "#000"; x.fillRect(0, 0, w, h);
    x.fillStyle = "#fff";
    const data = window.WORLD_LAND;
    const ring = (r) => { for (let i = 0; i < r.length; i++) { const px = (r[i][0] + 180) / 360 * w, py = (90 - r[i][1]) / 180 * h; i ? x.lineTo(px, py) : x.moveTo(px, py); } };
    const poly = (p) => { x.beginPath(); p.forEach(ring); x.fill("evenodd"); };
    if (data && data.features) data.features.forEach((f) => { const g = f.geometry; if (!g) return; if (g.type === "Polygon") poly(g.coordinates); else if (g.type === "MultiPolygon") g.coordinates.forEach(poly); });
    const img = x.getImageData(0, 0, w, h).data;
    return (lng, lat) => {
      let px = ((lng + 180) / 360 * w) | 0, py = ((90 - lat) / 180 * h) | 0;
      if (px < 0) px = 0; else if (px >= w) px = w - 1;
      if (py < 0) py = 0; else if (py >= h) py = h - 1;
      return img[(py * w + px) * 4] > 128;
    };
  }

  function buildLandPoints() {
    const mask = buildLandMask(1024, 512);
    const pts = [], step = 2.0;
    for (let lat = -84; lat <= 84; lat += step) {
      const circ = Math.cos(lat * D2R);
      const n = Math.max(6, Math.round((360 / step) * circ));
      const off = Math.random() * (360 / n);
      for (let k = 0; k < n; k++) {
        const lng = -180 + k * (360 / n) + off;
        if (lng > 180) continue;
        if (mask(lng, lat)) pts.push(unit(lng, lat));
      }
    }
    return pts;
  }

  function buildMarkers() {
    return countries.map((co) => Object.assign(unit(co.lng, co.lat), { aqua: co.accent === "aqua" }));
  }

  /* ---- rotatie (yaw om Y, daarna pitch om X) ------------------------------ */
  function rot(p, sy, cyw, sp, cp) {
    const x1 = p.x * cyw + p.z * sy, z1 = -p.x * sy + p.z * cyw, y1 = p.y;
    return { x: x1, y: y1 * cp - z1 * sp, z: y1 * sp + z1 * cp };
  }

  function resize() {
    const el = canvas.parentElement;
    W = (el && el.clientWidth) || window.innerWidth;
    H = (el && el.clientHeight) || window.innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    canvas.style.width = W + "px"; canvas.style.height = H + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cx = W / 2; cy = H / 2; R = Math.min(W, H) * 0.42;
  }

  function init(container, cs) {
    countries = cs || window.COUNTRIES || [];
    canvas = document.createElement("canvas");
    ctx = canvas.getContext("2d");
    container.appendChild(canvas);
    landPts = buildLandPoints();
    markers = buildMarkers();
    resize();
    window.addEventListener("resize", resize);
    ready = true;
    return api;
  }

  function focus(i) {
    const m = countries[i]; if (!m) return;
    mode = "focus"; activeIndex = i;
    targetYaw = -m.lng * D2R;
    targetPitch = Math.max(-1.0, Math.min(1.0, m.lat * D2R - 0.12)); // iets boven het midden
  }
  function free() { mode = "free"; activeIndex = -1; }

  function shortest(a, b) { let d = (b - a) % (Math.PI * 2); if (d > Math.PI) d -= Math.PI * 2; if (d < -Math.PI) d += Math.PI * 2; return d; }

  function heart(x, y, s, color, glow, glowColor) {
    ctx.save(); ctx.translate(x, y);
    ctx.beginPath();
    ctx.moveTo(0, s * 0.32);
    ctx.bezierCurveTo(s * 0.95, -s * 0.55, s * 0.78, s * 0.5, 0, s);
    ctx.bezierCurveTo(-s * 0.78, s * 0.5, -s * 0.95, -s * 0.55, 0, s * 0.32);
    ctx.closePath();
    if (glow) { ctx.shadowColor = glowColor || color; ctx.shadowBlur = s * 1.8; }
    ctx.fillStyle = color; ctx.fill();
    ctx.restore();
  }

  function draw(t) {
    ctx.clearRect(0, 0, W, H);

    // atmosfeer-gloed
    const g = ctx.createRadialGradient(cx, cy, R * 0.82, cx, cy, R * 1.32);
    g.addColorStop(0, `rgba(${COL.glow},0.42)`);
    g.addColorStop(0.5, `rgba(${COL.glow},0.12)`);
    g.addColorStop(1, `rgba(${COL.glow},0)`);
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(cx, cy, R * 1.32, 0, Math.PI * 2); ctx.fill();

    // oceaan-bol (licht van linksboven)
    const og = ctx.createRadialGradient(cx - R * 0.35, cy - R * 0.38, R * 0.1, cx, cy, R);
    og.addColorStop(0, COL.oceanLight);
    og.addColorStop(0.55, COL.oceanMid);
    og.addColorStop(1, COL.oceanDark);
    ctx.fillStyle = og;
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fill();

    const sy = Math.sin(yaw), cyw = Math.cos(yaw), sp = Math.sin(pitch), cp = Math.cos(pitch);

    // landpunten (alleen voorzijde)
    ctx.fillStyle = COL.land;
    for (let i = 0; i < landPts.length; i++) {
      const p = rot(landPts[i], sy, cyw, sp, cp);
      if (p.z <= 0.02) continue;
      const sx = cx + p.x * R, syy = cy - p.y * R;
      const s = 1.1 + 1.4 * p.z;
      ctx.globalAlpha = 0.3 + 0.6 * p.z;
      ctx.fillRect(sx - s / 2, syy - s / 2, s, s);
    }
    ctx.globalAlpha = 1;

    // rand-accent
    ctx.strokeStyle = "rgba(255,232,224,0.32)"; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(cx, cy, R - 0.75, 0, Math.PI * 2); ctx.stroke();

    // markers (alleen voorzijde)
    const pulse = (t % 1600) / 1600;
    for (let i = 0; i < markers.length; i++) {
      const p = rot(markers[i], sy, cyw, sp, cp);
      if (p.z <= 0.02) continue;
      const sx = cx + p.x * R, syy = cy - p.y * R;
      const isActive = i === activeIndex;
      const depth = 0.55 + 0.45 * p.z;
      const size = (isActive ? 27 : 9.5) * depth;
      const col = isActive ? "#ffffff" : COL.marker;
      if (isActive) {
        // het geselecteerde gebied "licht op" (groter + kleurverandering)
        const hg = ctx.createRadialGradient(sx, syy, 0, sx, syy, size * 3.5);
        hg.addColorStop(0, "rgba(255,255,255,0.55)");
        hg.addColorStop(0.35, "rgba(255,212,150,0.34)");
        hg.addColorStop(1, "rgba(255,212,150,0)");
        ctx.fillStyle = hg;
        ctx.beginPath(); ctx.arc(sx, syy, size * 3.5, 0, Math.PI * 2); ctx.fill();
        // pulserende ring
        ctx.save();
        ctx.strokeStyle = "#ffffff"; ctx.globalAlpha = 0.85 * (1 - pulse); ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(sx, syy, size * (0.85 + pulse * 2.1), 0, Math.PI * 2); ctx.stroke();
        ctx.restore();
      }
      ctx.globalAlpha = 1;
      heart(sx, syy, size, col, true, isActive ? "#ffffff" : "rgba(255,255,255,0.95)");
    }
    ctx.globalAlpha = 1;
  }

  function step(ts) {
    raf = requestAnimationFrame(step);
    const dt = Math.min(0.05, (ts - last) / 1000) || 0.016; last = ts;
    if (mode === "free") {
      yaw += SPIN * dt;
      pitch += (TILT_FREE - pitch) * Math.min(1, dt * 2.5);
    } else {
      yaw += shortest(yaw, targetYaw) * Math.min(1, dt * 3.2);
      pitch += (targetPitch - pitch) * Math.min(1, dt * 3.2);
    }
    draw(ts);
  }

  function start() { if (ready && !running) { running = true; last = performance.now(); raf = requestAnimationFrame(step); } }
  function stop() { if (raf) cancelAnimationFrame(raf); raf = null; running = false; }

  const api = { init, focus, free, start, stop, get ready() { return ready; } };
  return api;
})();
