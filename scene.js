const SKIES = {
  Dusk:  { top: [16, 34, 58],  mid: [64, 92, 126],  hz: [236, 172, 124], sea: [14, 38, 62],  deep: [5, 15, 28],  sun: [255, 196, 142], cloud: [255, 226, 210] },
  Dawn:  { top: [30, 52, 92],  mid: [126, 152, 188], hz: [248, 210, 176], sea: [30, 62, 92],  deep: [9, 24, 42],  sun: [255, 226, 198], cloud: [255, 244, 238] },
  Night: { top: [4, 9, 20],    mid: [14, 28, 50],   hz: [64, 92, 126],   sea: [7, 20, 38],   deep: [2, 6, 14],   sun: [186, 210, 240], cloud: [176, 196, 222] }
};
const SPECIES = [
  { n: "Sardine",   p: 1,  w: 26, s: 1.0,  k: "fish",  c1: "#dceaf6", c2: "#8fb6d6", fin: "#bfd8ec" },
  { n: "Sunfish",   p: 2,  w: 19, s: 1.15, k: "round", c1: "#ffd977", c2: "#e08c30", fin: "#ffeaa8" },
  { n: "Clownfish", p: 3,  w: 15, s: 0.95, k: "clown", c1: "#ff9a4d", c2: "#dd5510", fin: "#ffffff" },
  { n: "Mahi-mahi", p: 5,  w: 12, s: 1.35, k: "fish",  c1: "#63e3c0", c2: "#2478b8", fin: "#b4f2e2" },
  { n: "Swordfish", p: 8,  w: 8,  s: 1.6,  k: "sword", c1: "#9db4cc", c2: "#3b4f66", fin: "#cbdcee" },
  { n: "Shark",     p: 10, w: 7,  s: 1.9,  k: "shark", c1: "#98a5b1", c2: "#465260", fin: "#aeb9c4" },
  { n: "Orca",      p: 15, w: 5,  s: 2.3,  k: "orca",  c1: "#1d232b", c2: "#0a0e13", fin: "#f2f6fa" },
  { n: "Whale",     p: 25, w: 2,  s: 3.2,  k: "whale", c1: "#4a6580", c2: "#1f3245", fin: "#7794ae" }
];
const SPW = SPECIES.reduce((a, s) => a + s.w, 0);
const pickSpecies = () => {
  let r = Math.random() * SPW;
  for (const s of SPECIES) { r -= s.w; if (r <= 0) return s; }
  return SPECIES[0];
};
const mix = (a, b, k) => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
const rgb = (c) => "rgb(" + (c[0] | 0) + "," + (c[1] | 0) + "," + (c[2] | 0) + ")";
const scene = {props: {sky:"Night",motion:!matchMedia("(prefers-reduced-motion: reduce)").matches},flowRef:{current:document.querySelector("#scene")},  startFlow() {
    const cv = this.flowRef.current;
    if (!cv) { this._raf = requestAnimationFrame(() => this.startFlow()); return; }
    const ctx = cv.getContext("2d");
    let w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      const r = cv.getBoundingClientRect();
      w = Math.max(1, Math.round(r.width)); h = Math.max(1, Math.round(r.height));
      cv.width = w * dpr; cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    new ResizeObserver(resize).observe(cv);

    let mx = -9999, my = -9999, caught = 0, nextFish = 0;
    const clouds = [], ripples = [], RLIFE = 5200, fish = [], pops = [];
    const rnd = (a, b) => a + Math.random() * (b - a);
    const stars = [], birds = [], shots = [];
    let nextShot = performance.now() + 4000, nextFlock = performance.now() + 5000;
    let swoop = null, nextSwoop = performance.now() + 9000, swipeT = -9999;
    for (let i = 0; i < 190; i++) stars.push({ x: Math.random(), y: Math.random(), r: 0.4 + Math.random() * 1.1, p: Math.random() * 9, s: 0.6 + Math.random() * 2.2 });
    for (let i = 0; i < 8; i++) {
      const puffs = [];
      const n = 4 + ((Math.random() * 4) | 0);
      for (let j = 0; j < n; j++) puffs.push({ dx: rnd(-1, 1), dy: rnd(-0.28, 0.28), r: rnd(0.42, 1) });
      clouds.push({ x: rnd(-0.1, 1.1), y: rnd(0.06, 0.44), s: rnd(70, 210), spd: rnd(0.0016, 0.0055), a: rnd(0.12, 0.4), ox: 0, oy: 0, puffs });
    }

    const drawFish = (sp) => {
      const L = 8 * sp.s;
      const Hh = L * (sp.k === "round" ? 0.86 : sp.k === "whale" ? 0.46 : sp.k === "orca" ? 0.4 : 0.42);
      const g = ctx.createLinearGradient(0, -Hh, 0, Hh);
      g.addColorStop(0, sp.c1); g.addColorStop(1, sp.c2);

      ctx.fillStyle = sp.fin;                                    // tail
      ctx.beginPath();
      if (sp.k === "orca" || sp.k === "whale") {
        ctx.fillStyle = sp.c2;
        ctx.moveTo(-L * 0.8, 0); ctx.lineTo(-L * 1.55, -Hh * 1.05); ctx.lineTo(-L * 1.2, 0); ctx.lineTo(-L * 1.55, Hh * 1.05);
      } else if (sp.k === "shark") {
        ctx.moveTo(-L * 0.78, 0); ctx.lineTo(-L * 1.5, -Hh * 1.7); ctx.lineTo(-L * 1.14, 0); ctx.lineTo(-L * 1.42, Hh * 1.15);
      } else {
        ctx.moveTo(-L * 0.78, 0); ctx.lineTo(-L * 1.42, -Hh * 1.25); ctx.lineTo(-L * 1.42, Hh * 1.25);
      }
      ctx.closePath(); ctx.fill();

      if (sp.k === "shark" || sp.k === "orca") {                 // dorsal
        ctx.fillStyle = sp.k === "orca" ? sp.c2 : sp.fin;
        ctx.beginPath();
        ctx.moveTo(L * 0.1, -Hh * 0.9); ctx.lineTo(-L * 0.22, -Hh * 2.15); ctx.lineTo(-L * 0.42, -Hh * 0.88);
        ctx.closePath(); ctx.fill();
      }

      ctx.fillStyle = g;                                         // body
      ctx.beginPath();
      if (sp.k === "round") ctx.ellipse(0, 0, L * 0.86, Hh, 0, 0, 7);
      else if (sp.k === "sword" || sp.k === "shark") ctx.ellipse(0, 0, L * 1.05, Hh * 0.92, 0, 0, 7);
      else ctx.ellipse(0, 0, L, Hh, 0, 0, 7);
      ctx.fill();

      ctx.save();                                                // pectoral
      ctx.globalAlpha = 0.85; ctx.fillStyle = sp.fin;
      ctx.beginPath(); ctx.ellipse(L * 0.08, Hh * 0.58, L * 0.3, Hh * 0.28, 0.55, 0, 7); ctx.fill();
      ctx.restore();

      if (sp.k === "clown") {
        ctx.fillStyle = "rgba(255,255,255,0.95)";
        for (const bxx of [L * 0.42, -L * 0.04, -L * 0.5]) {
          ctx.beginPath(); ctx.ellipse(bxx, 0, L * 0.1, Hh * 0.97, 0, 0, 7); ctx.fill();
        }
      }
      if (sp.k === "orca") {
        ctx.fillStyle = "#f2f6fa";
        ctx.beginPath(); ctx.ellipse(L * 0.42, -Hh * 0.34, L * 0.17, Hh * 0.2, 0, 0, 7); ctx.fill();
        ctx.beginPath(); ctx.ellipse(-L * 0.08, Hh * 0.5, L * 0.6, Hh * 0.38, 0, 0, 7); ctx.fill();
      }
      if (sp.k === "whale") {
        ctx.fillStyle = "rgba(255,255,255,0.16)";
        ctx.beginPath(); ctx.ellipse(-L * 0.05, Hh * 0.55, L * 0.62, Hh * 0.32, 0, 0, 7); ctx.fill();
        ctx.strokeStyle = "rgba(0,0,0,0.25)"; ctx.lineWidth = Math.max(0.5, L * 0.04);
        for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(L * (0.5 - i * 0.12), Hh * 0.25); ctx.lineTo(L * (0.5 - i * 0.12), Hh * 0.8); ctx.stroke(); }
      }
      if (sp.k === "sword") {
        ctx.strokeStyle = sp.fin; ctx.lineWidth = Math.max(1, L * 0.08); ctx.lineCap = "round";
        ctx.beginPath(); ctx.moveTo(L * 0.98, -Hh * 0.05); ctx.lineTo(L * 1.75, -Hh * 0.12); ctx.stroke();
        ctx.fillStyle = sp.fin;
        ctx.beginPath(); ctx.moveTo(L * 0.3, -Hh * 0.85); ctx.lineTo(-L * 0.1, -Hh * 1.9); ctx.lineTo(-L * 0.45, -Hh * 0.85); ctx.closePath(); ctx.fill();
      }
      if (sp.k === "fish" || sp.k === "round") {
        ctx.strokeStyle = "rgba(255,255,255,0.35)"; ctx.lineWidth = Math.max(0.5, L * 0.05);
        ctx.beginPath(); ctx.moveTo(L * 0.45, Hh * 0.05); ctx.quadraticCurveTo(-L * 0.1, Hh * 0.3, -L * 0.65, Hh * 0.05); ctx.stroke();
      }

      const er = Math.max(0.8, L * 0.075);
      ctx.fillStyle = "rgba(10,12,16,0.92)";
      ctx.beginPath(); ctx.arc(L * (sp.k === "round" ? 0.5 : 0.6), -Hh * 0.24, er, 0, 7); ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.85)";
      ctx.beginPath(); ctx.arc(L * (sp.k === "round" ? 0.52 : 0.62), -Hh * 0.32, er * 0.42, 0, 7); ctx.fill();
    };

    this._onMove = (e) => {
      const r = cv.getBoundingClientRect();
      mx = e.clientX - r.left; my = e.clientY - r.top;
      if (mx < 0 || my < 0 || mx > w || my > h) { mx = my = -9999; return; }
      const hz = h * 0.58;
      if (my > hz && (ripples.length === 0 || performance.now() - ripples[ripples.length - 1].t > 90)) {
        ripples.push({ x: mx, y: my, t: performance.now() });
        if (ripples.length > 7) ripples.shift();
      }
    };
    window.addEventListener("pointermove", this._onMove, { passive: true });

    const frame = () => {
      if (this.flowRef.current !== cv) {          // hero remounted — rebind to the new canvas
        window.removeEventListener("pointermove", this._onMove);
        this.startFlow();
        return;
      }
      this._raf = requestAnimationFrame(frame);
      const P = SKIES[this.props.sky] || SKIES.Night;
      const now = performance.now();
      const t = now * 0.001 * (this.props.motion === false ? 0 : 1);
      const hz = Math.round(h * 0.58);
      const sunX = w * 0.72;

      const sky = ctx.createLinearGradient(0, 0, 0, hz);
      sky.addColorStop(0, rgb(P.top));
      sky.addColorStop(0.62, rgb(P.mid));
      sky.addColorStop(1, rgb(P.hz));
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, hz);

      const night = this.props.sky === "Dawn" ? 0 : this.props.sky === "Dusk" ? 0.4 : 1;
      if (night > 0) {
        for (const s of stars) {
          const sy = s.y * hz * 0.92;
          const tw = 0.32 + 0.68 * Math.abs(Math.sin(t * s.s * 0.5 + s.p));
          ctx.globalAlpha = night * tw * (0.35 + 0.65 * (1 - s.y));
          ctx.fillStyle = "#fff";
          ctx.beginPath(); ctx.arc(s.x * w, sy, s.r, 0, 7); ctx.fill();
          if (tw > 0.982 && s.r > 0.95) {              // occasional flare
            const fl = (tw - 0.982) / 0.018 * s.r * 5;
            ctx.globalAlpha = night * 0.5;
            ctx.strokeStyle = "#fff"; ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(s.x * w - fl, sy); ctx.lineTo(s.x * w + fl, sy);
            ctx.moveTo(s.x * w, sy - fl); ctx.lineTo(s.x * w, sy + fl);
            ctx.stroke();
          }
        }
        ctx.globalAlpha = 1;
      }

      const moonY = hz * 0.34, moonR = Math.max(16, Math.min(30, w * 0.021));
      const glow = ctx.createRadialGradient(sunX, night === 1 ? moonY : hz, 0, sunX, night === 1 ? moonY : hz, h * 0.55);
      glow.addColorStop(0, "rgba(" + P.sun.join(",") + "," + (night === 1 ? 0.3 : 0.5) + ")");
      glow.addColorStop(0.3, "rgba(" + P.sun.join(",") + ",0.1)");
      glow.addColorStop(1, "rgba(" + P.sun.join(",") + ",0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, hz);

      if (night === 1) {
        const md = ctx.createRadialGradient(sunX - moonR * 0.3, moonY - moonR * 0.3, moonR * 0.1, sunX, moonY, moonR);
        md.addColorStop(0, "#fdfbf4");
        md.addColorStop(0.75, "#e7e3d6");
        md.addColorStop(1, "#c9c6ba");
        ctx.fillStyle = md;
        ctx.beginPath(); ctx.arc(sunX, moonY, moonR, 0, 7); ctx.fill();
        ctx.fillStyle = "rgba(150,152,148,0.22)";
        ctx.beginPath(); ctx.arc(sunX - moonR * 0.3, moonY + moonR * 0.15, moonR * 0.22, 0, 7); ctx.fill();
        ctx.beginPath(); ctx.arc(sunX + moonR * 0.25, moonY - moonR * 0.3, moonR * 0.15, 0, 7); ctx.fill();
        ctx.beginPath(); ctx.arc(sunX + moonR * 0.4, moonY + moonR * 0.35, moonR * 0.12, 0, 7); ctx.fill();
      }

      // shooting stars
      if (this.props.motion !== false && night > 0.4 && now > nextShot) {
        nextShot = now + 7000 + Math.random() * 15000;
        shots.push({ x: w * (0.1 + Math.random() * 0.75), y: hz * (0.04 + Math.random() * 0.4),
          ang: 0.28 + Math.random() * 0.34, dir: Math.random() < 0.55 ? 1 : -1,
          t0: now, dur: 800 + Math.random() * 600, len: 110 + Math.random() * 140 });
      }
      for (let i = shots.length - 1; i >= 0; i--) {
        const s = shots[i], k = (now - s.t0) / s.dur;
        if (k >= 1) { shots.splice(i, 1); continue; }
        const dx = Math.cos(s.ang) * s.dir, dy = Math.sin(s.ang);
        const hx = s.x + dx * s.len * k * 2.4, hy = s.y + dy * s.len * k * 2.4;
        const tl = s.len * 0.55;
        const g2 = ctx.createLinearGradient(hx - dx * tl, hy - dy * tl, hx, hy);
        g2.addColorStop(0, "rgba(255,255,255,0)");
        g2.addColorStop(1, "rgba(255,255,255," + (0.8 * (1 - k * k)).toFixed(3) + ")");
        ctx.strokeStyle = g2; ctx.lineWidth = 1.5; ctx.lineCap = "round";
        ctx.beginPath(); ctx.moveTo(hx - dx * tl, hy - dy * tl); ctx.lineTo(hx, hy); ctx.stroke();
        ctx.globalAlpha = 1 - k * k; ctx.fillStyle = "#fff";
        ctx.beginPath(); ctx.arc(hx, hy, 1.7, 0, 7); ctx.fill();
        ctx.globalAlpha = 1;
      }

      // birds
      if (this.props.motion !== false && now > nextFlock) {
        nextFlock = now + 13000 + Math.random() * 18000;
        const dir = Math.random() < 0.5 ? 1 : -1, n = 3 + ((Math.random() * 4) | 0);
        const baseY = hz * (0.52 + Math.random() * 0.34), sp = 0.00034 + Math.random() * 0.00028;
        for (let i = 0; i < n; i++) {
          birds.push({ dir, sp, x: dir === 1 ? -0.06 - i * 0.036 : 1.06 + i * 0.036,
            y: baseY + i * 8 * (i % 2 ? -1 : 1), s: 8.5 + Math.random() * 5.5, ph: Math.random() * 6 });
        }
      }
      for (let i = birds.length - 1; i >= 0; i--) {
        const b = birds[i];
        b.x += b.sp * b.dir;
        if (b.x < -0.25 || b.x > 1.25) { birds.splice(i, 1); continue; }
        const bxp = b.x * w, byp = b.y + Math.sin(t * 0.7 + b.ph) * 4;
        const flap = 0.42 + 0.58 * Math.sin(t * 5.2 + b.ph);
        ctx.strokeStyle = "rgba(206,220,238,0.5)";
        ctx.lineWidth = Math.max(0.9, b.s * 0.2); ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(bxp - b.s, byp + flap * b.s * 0.5);
        ctx.quadraticCurveTo(bxp - b.s * 0.45, byp - b.s * 0.34 * flap - b.s * 0.16, bxp, byp);
        ctx.quadraticCurveTo(bxp + b.s * 0.45, byp - b.s * 0.34 * flap - b.s * 0.16, bxp + b.s, byp + flap * b.s * 0.5);
        ctx.stroke();
      }

      for (const c of []) {
        c.x += c.spd * 0.004;
        if (c.x > 1.25) c.x = -0.25;
        let cx = c.x * w, cy = c.y * hz;
        if (my < hz && mx > -9000) {
          const dx = cx - mx, dy = cy - my, d = Math.hypot(dx, dy) || 1;
          const push = Math.max(0, 1 - d / 300) * 90;
          c.ox += (dx / d * push - c.ox) * 0.06;
          c.oy += (dy / d * push * 0.4 - c.oy) * 0.06;
        } else {
          c.ox += (0 - c.ox) * 0.02; c.oy += (0 - c.oy) * 0.02;
        }
        cx += c.ox; cy += c.oy;
        for (const p of c.puffs) {
          const r = c.s * p.r, x = cx + p.dx * c.s, y = cy + p.dy * c.s * 0.5;
          const g = ctx.createRadialGradient(x, y, 0, x, y, r);
          g.addColorStop(0, "rgba(" + P.cloud.join(",") + "," + (c.a * 0.85).toFixed(3) + ")");
          g.addColorStop(0.55, "rgba(" + P.cloud.join(",") + "," + (c.a * 0.35).toFixed(3) + ")");
          g.addColorStop(1, "rgba(" + P.cloud.join(",") + ",0)");
          ctx.fillStyle = g;
          ctx.fillRect(x - r, y - r, r * 2, r * 2);
        }
      }

      const CW = 16, CH = 6, seaH = h - hz;
      for (let y = 0; y < seaH; y += CH) {
        const yy = y / seaH;
        const band = mix(P.sea, P.deep, Math.pow(yy, 0.7));
        const amp = (1 - yy) * 9 + 3;
        for (let x = 0; x < w; x += CW) {
          const cx = x + CW / 2, cy = hz + y + CH / 2;
          let wv = Math.sin(cx * 0.028 + y * 0.17 - t * 1.7) * 0.5
                 + Math.sin(cx * 0.0095 - y * 0.1 + t * 0.85) * 0.5;
          for (let i = 0; i < ripples.length; i++) {
            const r = ripples[i], age = (now - r.t) / RLIFE;
            if (age >= 1) continue;
            const d = Math.hypot(cx - r.x, cy - r.y);
            wv += Math.sin(d * 0.085 - age * 9) * Math.exp(-d * 0.011) * (1 - age) * 2.1;
          }
          const l = wv * amp;
          const refl = Math.exp(-Math.pow(cx - sunX, 2) / (2 * Math.pow(w * 0.1, 2))) * (0.55 + 0.45 * wv) * (1 - yy * 0.75);
          ctx.fillStyle = rgb([
            band[0] + l + P.sun[0] * refl * 0.32,
            band[1] + l * 1.05 + P.sun[1] * refl * 0.26,
            band[2] + l * 1.15 + P.sun[2] * refl * 0.2
          ]);
          ctx.fillRect(x, hz + y, CW + 1, CH + 1);
        }
      }
      while (ripples.length && now - ripples[0].t > RLIFE) ripples.shift();

      // ---- boat, angler, bucket ----
      const S = Math.max(1.05, Math.min(1.7, w / 880));
      const bx = w * 0.3, by = hz + seaH * 0.3 + Math.sin(t * 0.9) * 2.5 * S;
      const tilt = Math.sin(t * 0.7) * 0.026;
      const bucket = { x: bx + 34 * S, y: by - 9 * S };
      ctx.save();
      ctx.translate(bx, by);
      ctx.rotate(tilt);
      ctx.scale(S, S);

      const RIM = "rgba(232,236,246,";           // moonlight rim
      ctx.fillStyle = "rgba(0,0,0,0.3)";
      ctx.beginPath(); ctx.ellipse(0, 10, 56, 5.5, 0, 0, 7); ctx.fill();

      // hull — outer shell, then interior, then trim
      ctx.beginPath();
      ctx.moveTo(-54, -6); ctx.quadraticCurveTo(-50, 6, -34, 11);
      ctx.quadraticCurveTo(0, 15, 40, 11); ctx.quadraticCurveTo(52, 8, 54, -6);
      ctx.closePath();
      const hullG = ctx.createLinearGradient(0, -6, 0, 14);
      hullG.addColorStop(0, "#3c2a1e"); hullG.addColorStop(1, "#150e0a");
      ctx.fillStyle = hullG; ctx.fill();

      ctx.strokeStyle = "rgba(120,88,64,0.55)"; ctx.lineWidth = 0.6;
      ctx.beginPath(); ctx.moveTo(-49, 1); ctx.quadraticCurveTo(0, 7, 49, 1); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-45, 6); ctx.quadraticCurveTo(0, 11, 45, 6); ctx.stroke();

      ctx.fillStyle = "#241811";                  // interior
      ctx.beginPath(); ctx.ellipse(0, -6, 50, 4.6, 0, 0, 7); ctx.fill();
      ctx.strokeStyle = RIM + "0.5)"; ctx.lineWidth = 1.6;   // gunwale
      ctx.beginPath(); ctx.ellipse(0, -6, 50, 4.6, 0, 0, 7); ctx.stroke();
      ctx.fillStyle = "rgba(180,132,96,0.5)";     // thwart
      ctx.fillRect(-16, -8.5, 22, 2.4);
      ctx.fillStyle = "rgba(255,255,255,0.05)";
      ctx.beginPath(); ctx.moveTo(-54, -6); ctx.lineTo(54, -6); ctx.lineTo(52, -3.4); ctx.lineTo(-52, -3.4); ctx.closePath(); ctx.fill();

      // oar resting across the stern
      ctx.strokeStyle = "rgba(150,110,78,0.8)"; ctx.lineWidth = 1.8; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(-50, -12); ctx.lineTo(-14, -6); ctx.stroke();
      ctx.fillStyle = "rgba(150,110,78,0.8)";
      ctx.beginPath(); ctx.ellipse(-52, -12.5, 4.6, 2.2, -0.16, 0, 7); ctx.fill();

      // ---- the angler ----
      ctx.save();
      ctx.translate(-6, 0);
      // legs, tucked forward
      ctx.fillStyle = "#1b2a3a";
      ctx.beginPath();
      ctx.moveTo(-2, -8); ctx.quadraticCurveTo(12, -9, 17, -6);
      ctx.lineTo(17, -3.2); ctx.quadraticCurveTo(6, -4.2, -2, -5); ctx.closePath(); ctx.fill();
      ctx.fillStyle = "#12100f";
      ctx.beginPath(); ctx.ellipse(18, -4.4, 3.4, 2, -0.2, 0, 7); ctx.fill();

      // torso — jacket
      const jk = ctx.createLinearGradient(-8, -26, 8, -8);
      jk.addColorStop(0, "#33465c"); jk.addColorStop(1, "#1a2634");
      ctx.fillStyle = jk;
      ctx.beginPath();
      ctx.moveTo(-8, -7); ctx.quadraticCurveTo(-10, -20, -5, -25);
      ctx.quadraticCurveTo(2, -28, 6, -23); ctx.quadraticCurveTo(8, -14, 7, -7);
      ctx.closePath(); ctx.fill();
      ctx.strokeStyle = RIM + "0.42)"; ctx.lineWidth = 0.9;
      ctx.beginPath(); ctx.moveTo(6, -23); ctx.quadraticCurveTo(8, -14, 7, -7); ctx.stroke();
      ctx.fillStyle = "rgba(255,255,255,0.1)";                     // collar
      ctx.beginPath(); ctx.moveTo(-4, -24.5); ctx.lineTo(3, -23.5); ctx.lineTo(0, -20); ctx.closePath(); ctx.fill();

      // arms — far arm holds the rod, near arm rests on the knee
      ctx.strokeStyle = "#3f5570"; ctx.lineWidth = 3.4; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(2, -22); ctx.quadraticCurveTo(9, -19, 14, -16); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-2, -21); ctx.quadraticCurveTo(5, -16, 9, -11); ctx.stroke();
      ctx.strokeStyle = "#6b4529"; ctx.lineWidth = 2.6;
      ctx.beginPath(); ctx.moveTo(14, -16); ctx.lineTo(17, -14.6); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(9, -11); ctx.lineTo(11.5, -9.6); ctx.stroke();

      // head, ear, hair
      ctx.fillStyle = "#5d3d27";
      ctx.beginPath(); ctx.ellipse(0.5, -29.6, 4.6, 5.2, 0.05, 0, 7); ctx.fill();
      ctx.fillStyle = "#4a3020";
      ctx.beginPath(); ctx.ellipse(-3.4, -29.2, 1.1, 1.5, 0, 0, 7); ctx.fill();
      ctx.fillStyle = "#171008";
      ctx.beginPath(); ctx.arc(0.4, -31.2, 4.8, Math.PI * 0.96, Math.PI * 2.1); ctx.fill();
      ctx.beginPath(); ctx.ellipse(-3.6, -31.4, 1.5, 2.4, 0.3, 0, 7); ctx.fill();
      ctx.beginPath(); ctx.ellipse(4.2, -31.2, 1.4, 2.2, -0.3, 0, 7); ctx.fill();
      ctx.strokeStyle = RIM + "0.5)"; ctx.lineWidth = 0.85;        // rim light, moon side
      ctx.beginPath(); ctx.arc(0.5, -29.6, 4.9, -1.35, 0.75); ctx.stroke();
      ctx.restore();

      // rod, reel, line
      ctx.strokeStyle = "rgba(228,214,198,0.9)"; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(6, -12); ctx.quadraticCurveTo(38, -34, 64, -46); ctx.stroke();
      ctx.strokeStyle = "rgba(255,255,255,0.35)"; ctx.lineWidth = 0.5;
      ctx.beginPath(); ctx.moveTo(8, -13.5); ctx.quadraticCurveTo(38, -35, 64, -47); ctx.stroke();
      ctx.fillStyle = "#8c8478";
      ctx.beginPath(); ctx.arc(13, -16.4, 2.2, 0, 7); ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.4)";
      ctx.beginPath(); ctx.arc(13, -16.4, 0.8, 0, 7); ctx.fill();
      const bob = Math.sin(t * 1.6) * 1.5;
      ctx.strokeStyle = "rgba(255,255,255,0.3)"; ctx.lineWidth = 0.7;
      ctx.beginPath(); ctx.moveTo(64, -46); ctx.quadraticCurveTo(69, -20, 66, 3 + bob); ctx.stroke();
      ctx.fillStyle = "#e8663c";
      ctx.beginPath(); ctx.arc(66, 3 + bob, 2, 0, 7); ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.5)";
      ctx.beginPath(); ctx.arc(65.4, 2.4 + bob, 0.6, 0, 7); ctx.fill();

      // bucket, with the tally on it
      const bg = ctx.createLinearGradient(28, -16, 44, -2);
      bg.addColorStop(0, "#4a3627"); bg.addColorStop(1, "#251a12");
      ctx.fillStyle = bg;
      ctx.beginPath(); ctx.moveTo(27, -16); ctx.lineTo(43, -16); ctx.lineTo(40.5, -3); ctx.lineTo(29.5, -3); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = RIM + "0.45)"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(26.6, -16); ctx.lineTo(43.4, -16); ctx.stroke();
      ctx.strokeStyle = "rgba(120,88,64,0.7)"; ctx.lineWidth = 0.6;
      ctx.beginPath(); ctx.moveTo(28.2, -9.5); ctx.lineTo(41.8, -9.5); ctx.stroke();
      ctx.strokeStyle = RIM + "0.3)"; ctx.lineWidth = 0.7;
      ctx.beginPath(); ctx.arc(35, -16.4, 6.6, Math.PI * 1.12, Math.PI * 1.88); ctx.stroke();
      ctx.fillStyle = "rgba(120,190,220,0.35)";
      ctx.beginPath(); ctx.ellipse(35, -15.4, 7.4, 1.5, 0, 0, 7); ctx.fill();
      ctx.fillStyle = "#f2e7d8";
      ctx.font = "600 8.5px 'JetBrains Mono', monospace";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(String(caught), 35, -7.6);
      ctx.restore();

      // ---- jumping fish ----
      if (this.props.motion !== false && now > nextFish) {
        nextFish = now + 1200 + Math.random() * 2200;
        const dir = Math.random() < 0.5 ? -1 : 1;
        const sp = pickSpecies();
        fish.push({
          sp, x0: w * (0.08 + Math.random() * 0.84), y0: hz + seaH * (0.12 + Math.random() * 0.55),
          dx: dir * (26 + Math.random() * 40) / Math.sqrt(sp.s), rise: (30 + Math.random() * 44) / Math.pow(sp.s, 0.6),
          t0: now, dur: (1000 + Math.random() * 700) * Math.pow(sp.s, 0.45), dir, hooked: 0
        });
      }
      for (let i = fish.length - 1; i >= 0; i--) {
        const f = fish[i];
        let fx, fy, ang;
        if (f.hooked) {
          const k = Math.min(1, (now - f.hooked) / 520);
          fx = f.hx + (bucket.x - f.hx) * k;
          fy = f.hy + (bucket.y - f.hy) * k - Math.sin(k * Math.PI) * 44;
          ang = k * 6;
          if (k >= 1) { fish.splice(i, 1); caught += f.sp.p; continue; }
        } else {
          const u = (now - f.t0) / f.dur;
          if (u >= 1) { fish.splice(i, 1); continue; }
          fx = f.x0 + f.dx * u;
          fy = f.y0 - Math.sin(u * Math.PI) * f.rise;
          ang = (u - 0.5) * 1.9 * f.dir;
          if (u > 0.1 && u < 0.9 && mx > -9000 && Math.hypot(mx - fx, my - fy) < 20 + 10 * f.sp.s) {
            f.hooked = now; f.hx = fx; f.hy = fy;
            pops.push({ x: fx, y: fy, t: now, p: f.sp.p, n: f.sp.n });
          }
          if (u < 0.1 || u > 0.9) {
            ctx.strokeStyle = "rgba(255,255,255,0.3)"; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.ellipse(f.x0 + f.dx * u, f.y0, 7 + u * 5, 2.2, 0, 0, 7); ctx.stroke();
          }
        }
        f.cx = fx; f.cy = fy;
        ctx.save();
        ctx.translate(fx, fy); ctx.rotate(ang); ctx.scale(S * f.dir, S);
        drawFish(f.sp);
        ctx.restore();
      }

      if (false) {
        nextSwoop = now + 15000 + Math.random() * 20000;
        swoop = { t0: now, dur: 4800, dir: Math.random() < 0.5 ? 1 : -1, fish: null, y0: hz * 0.46 };
      }
      if (swoop) {
        const u = (now - swoop.t0) / swoop.dur;
        if (u >= 1) { swoop = null; }
        else {
          const sx = swoop.dir === 1 ? -70 : w + 70, ex = swoop.dir === 1 ? w + 70 : -70;
          const gx = sx + (ex - sx) * u;
          const dip = Math.sin(Math.min(1, Math.max(0, (u - 0.16) / 0.66)) * Math.PI);
          const gy = swoop.y0 + (by - 40 - swoop.y0) * dip;

          if (!swoop.fish && dip > 0.55) {
            for (let j = fish.length - 1; j >= 0; j--) {
              const f = fish[j];
              if (!f.hooked && f.cx != null && Math.hypot(f.cx - gx, f.cy - gy) < 40 + 6 * f.sp.s) {
                swoop.fish = f.sp; fish.splice(j, 1); break;
              }
            }
          }
          if (dip > 0.6 && Math.hypot(gx - bx, gy - (by - 30)) < 105) swipeT = now;

          ctx.save();
          ctx.translate(gx, gy);
          ctx.scale(swoop.dir * S * 1.45, S * 1.45);
          const fl = Math.sin(t * 4.4) * (1 - dip * 0.55);
          ctx.strokeStyle = "rgba(228,238,250,0.9)";
          ctx.lineWidth = 1.7; ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(-12, fl * 5.5 + 1); ctx.quadraticCurveTo(-5.5, -5 - fl * 3.5, 0, 0.4);
          ctx.quadraticCurveTo(5.5, -5 - fl * 3.5, 12, fl * 5.5 + 1);
          ctx.stroke();
          ctx.fillStyle = "rgba(232,240,250,0.94)";
          ctx.beginPath(); ctx.ellipse(0.6, 1.4, 5.4, 2.3, 0.1, 0, 7); ctx.fill();
          ctx.fillStyle = "#e0a24a";
          ctx.beginPath(); ctx.moveTo(5.2, 0.9); ctx.lineTo(8.8, 1.7); ctx.lineTo(5.2, 2.5); ctx.closePath(); ctx.fill();
          ctx.fillStyle = "rgba(14,18,24,0.85)";
          ctx.beginPath(); ctx.arc(3.6, 0.5, 0.7, 0, 7); ctx.fill();
          if (swoop.fish) {
            ctx.save(); ctx.translate(9.4, 3.4); ctx.rotate(0.5); ctx.scale(0.45, 0.45);
            drawFish(swoop.fish); ctx.restore();
          }
          ctx.restore();
        }
      }

      for (let i = pops.length - 1; i >= 0; i--) {
        const p = pops[i], k = (now - p.t) / 950;
        if (k >= 1) { pops.splice(i, 1); continue; }
        ctx.save();
        ctx.globalAlpha = 1 - k * k;
        ctx.fillStyle = "#ffe6cf";
        ctx.font = "600 13px 'JetBrains Mono', monospace";
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText("+" + p.p, p.x, p.y - 18 - k * 26);
        ctx.font = "500 8px 'JetBrains Mono', monospace";
        ctx.globalAlpha = (1 - k * k) * 0.7;
        ctx.fillText(p.n.toUpperCase(), p.x, p.y - 6 - k * 26);
        ctx.restore();
      }

      const hzl = ctx.createLinearGradient(0, hz - 3, 0, hz + 5);
      hzl.addColorStop(0, "rgba(" + P.hz.join(",") + ",0)");
      hzl.addColorStop(0.4, "rgba(" + P.hz.join(",") + ",0.55)");
      hzl.addColorStop(1, "rgba(" + P.hz.join(",") + ",0)");
      ctx.fillStyle = hzl;
      ctx.fillRect(0, hz - 3, w, 8);

      const vig = ctx.createLinearGradient(0, h * 0.78, 0, h);
      vig.addColorStop(0, "rgba(0,0,0,0)");
      vig.addColorStop(1, "rgba(0,0,0,0.92)");
      ctx.fillStyle = vig;
      ctx.fillRect(0, h * 0.78, w, h * 0.22);
    };
    frame();
  }
};
scene.startFlow();
document.querySelector("#motion").addEventListener("click", function(){scene.props.motion=!scene.props.motion;this.textContent=scene.props.motion?"Pause scene":"Play scene";this.setAttribute("aria-pressed",String(!scene.props.motion));});