export function startLake(cv, pauseButton) {
    const scene = {state:{paused:false}};
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const img = new Image();
    const base = document.createElement("canvas");
    const baseCtx = base.getContext("2d");
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let w = 0, h = 0, dpr = 1, loaded = false, stopped = false, visible = true;
    let clock = 0, last = 0, horizon = 0;
    const paint = () => {
      if (!loaded || !w || !h) return;
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(base, 0, 0, w, h);
      if (motionQuery.matches || scene.state.paused) return;
      // Only the open water moves; shorelines and foreground plants remain still.
      const top = Math.max(horizon + 14, h * 0.62);
      const bottom = h * 0.91;
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(w * .10, top); ctx.lineTo(w * .73, top);
      ctx.lineTo(w * .86, bottom); ctx.lineTo(w * .14, bottom); ctx.closePath(); ctx.clip();
      for (let y = top; y < bottom; y += 2) {
        const depth = (y - top) / Math.max(1, bottom - top);
        const envelope = Math.sin(depth * Math.PI);
        // Layer slow swells and smaller ripples so reflections visibly drift.
        const swell = y * .045 + clock * .00065;
        const ripple = y * .105 - clock * .0009;
        const strength = envelope * (.65 + depth * .65);
        const shift = (Math.sin(swell) * 4.8 + Math.sin(ripple) * 1.8) * strength;
        const lift = Math.cos(swell * .85) * 1.3 * strength;
        ctx.drawImage(base, 0, (y + lift) * dpr, base.width, 2 * dpr, shift, y, w, 2);
        // Soft moving light catches the wave crests without sparkling or flashing.
        ctx.fillStyle = "rgba(235,248,241," + ((Math.sin(ripple) + 1) * .018 * envelope) + ")";
        ctx.fillRect(0, y, w, 2);
      }
      ctx.restore();
    };
    const resize = () => {
      const r = cv.getBoundingClientRect();
      w = Math.round(r.width); h = Math.round(r.height);
      if (!w || !h) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = base.width = Math.round(w * dpr);
      cv.height = base.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (loaded) {
        const scale = Math.max(base.width / img.width, base.height / img.height);
        const dw = img.width * scale, dh = img.height * scale;
        const dx = (base.width - dw) * .5, dy = (base.height - dh) * .5;
        baseCtx.drawImage(img, dx, dy, dw, dh);
        horizon = (dy + dh * .61) / dpr;
      }
      paint();
    };
    const frame = (now) => {
      scene._raf = 0;
      if (stopped || !visible || document.hidden || !loaded || motionQuery.matches || scene.state.paused) return;
      if (!last || now - last >= 32) { clock += last ? Math.min(now-last, 70) : 0; last = now; paint(); }
      scene._raf = requestAnimationFrame(frame);
    };
    const resume = () => {
      cancelAnimationFrame(scene._raf); scene._raf = 0; last = 0;
      paint();
      if (!stopped && visible && !document.hidden && loaded && !motionQuery.matches && !scene.state.paused) scene._raf = requestAnimationFrame(frame);
    };
    scene._sceneResume = resume;
    img.onload = () => { if (stopped) return; loaded = true; resize(); resume(); };
    img.src = "assets/morning-lake.webp";
    const observer = new ResizeObserver(resize); observer.observe(cv);
    const intersection = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; resume(); });
    intersection.observe(cv);
    document.addEventListener("visibilitychange", resume);
    motionQuery.addEventListener("change", resume);
    scene._sceneCleanup = () => {
      stopped = true; cancelAnimationFrame(scene._raf); observer.disconnect(); intersection.disconnect();
      document.removeEventListener("visibilitychange", resume); motionQuery.removeEventListener("change", resume);
      img.onload = null;
    };
    pauseButton.addEventListener("click", () => {
      scene.state.paused = !scene.state.paused;
      pauseButton.textContent = scene.state.paused ? "Resume water" : "Pause water";
      pauseButton.setAttribute("aria-pressed", String(scene.state.paused));
      resume();
    });
    resize();
    return scene._sceneCleanup;
  }

