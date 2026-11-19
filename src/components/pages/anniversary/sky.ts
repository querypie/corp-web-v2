import { symbol } from "./symbol";

const tau = Math.PI * 2;
const tones = [
  { color: "244,242,235", core: "255,254,249", cutoff: 0.56 },
  { color: "249,218,161", core: "255,249,232", cutoff: 0.85 },
  { color: "226,171,109", core: "255,238,205", cutoff: 0.98 },
  { color: "142,193,216", core: "231,246,250", cutoff: 1 },
];
const pixelBudget = 2_400_000;
const formHoldSeconds = 2;
const formTransitionSeconds = 3;
const formCycleHalf = formHoldSeconds + formTransitionSeconds;
// Follow the numerals in querypie-10th.svg, extending their baseline past
// the plaque's crop so the freestanding particle shape ends naturally.
const anniversaryTen =
  "M0 37.2949L42.2793 23V151Q42.2793 155 38.2793 155H22.2793Q18.2793 155 18.2793 151V56L0 62.9551Z" +
  "M188 90.5C188 53.2208 157.779 23 120.5 23C83.2208 23 53 53.2208 53 90.5C53 127.779 83.2208 158 120.5 158C157.779 158 188 127.779 188 90.5Z" +
  "M120.5 47C144.524 47 164 66.4756 164 90.5C164 114.524 144.524 134 120.5 134C96.4757 134 77.0001 114.524 77 90.5C77 66.4756 96.4756 47 120.5 47Z";
function randomGenerator(seed: number) {
  return () =>
    (seed = (Math.imul(1664525, seed) + 1013904223) >>> 0) / 4294967296;
}
function tile(w: number, h = w) {
  const el = document.createElement("canvas");
  el.width = w;
  el.height = h;
  return el;
}
function glow({ color, core }: (typeof tones)[number], flare = false) {
  const el = tile(64),
    ctx = el.getContext("2d")!;
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  for (const [r, a] of [
    [0, 1],
    [0.12, 1],
    [0.19, 0.86],
    [0.23, 0.29],
    [0.35, 0.08],
    [0.54, 0.01],
    [1, 0],
  ])
    g.addColorStop(r, `rgba(${r <= 0.12 ? core : color},${a})`);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  if (flare) {
    ctx.fillStyle = `rgba(${color},.23)`;
    ctx.beginPath();
    ctx.moveTo(0, 32);
    ctx.lineTo(31, 30.9);
    ctx.lineTo(32, 4);
    ctx.lineTo(33, 31);
    ctx.lineTo(64, 32);
    ctx.lineTo(33, 33);
    ctx.lineTo(32, 60);
    ctx.lineTo(31, 33);
    ctx.fill();
  }
  return el;
}

export function mountSky(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const rand = randomGenerator(10026),
    bell = () => rand() + rand() + rand() + rand() - 2;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const compactViewport = matchMedia("(max-width: 767px)");
  const sprites = tones.map((c) => glow(c)),
    flares = tones.map((c) => glow(c, true));
  const dotColors = tones.map(({ color }) => `rgb(${color})`);
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", symbol);
  const len = path.getTotalLength(),
    outline = Array.from({ length: 1600 }, (_, i) =>
      path.getPointAtLength((i * len) / 1600),
    );
  const mask = tile(320),
    mc = mask.getContext("2d")!;
  mc.scale(5, 5);
  mc.fill(new Path2D(symbol), "evenodd");
  const logo = mc.getImageData(0, 0, 320, 320).data;
  mc.setTransform(1, 0, 0, 1, 0, 0);
  mc.clearRect(0, 0, 320, 320);
  // Centre the 188 × 135 numeral bounds with one uniform scale.
  mc.translate(160, 160);
  mc.scale(1.65, 1.65);
  mc.translate(-94, -90.5);
  mc.fill(new Path2D(anniversaryTen), "evenodd");
  const num = mc.getImageData(0, 0, 320, 320).data;
  function sample(data: Uint8ClampedArray) {
    let x, y;
    do {
      x = Math.floor(rand() * 320);
      y = Math.floor(rand() * 320);
    } while (data[(y * 320 + x) * 4 + 3] < 128);
    return [(x - 160) / 320, (y - 160) / 320];
  }
  const mobile = canvas.clientWidth < 760;
  const stars = Array.from({ length: mobile ? 1800 : 3300 }, (_, i) => {
    let x, y;
    if (i % 5 < 3) {
      const p = outline[Math.floor(rand() * outline.length)];
      const spread = i % 3 === 0 ? 0.003 : 0.019;
      x = (p.x - 32) / 64 + bell() * spread;
      y = (p.y - 32) / 64 + bell() * spread;
    } else [x, y] = sample(logo);
    const a = rand() * tau,
      bend = 0.035 + rand() * 0.095,
      n = sample(num),
      tint = rand(),
      magnitude = rand();
    const tone = tones.findIndex(({ cutoff }) => tint < cutoff);
    return {
      x,
      y,
      nx: n[0] * 1.24,
      ny: n[1] * 1.24,
      ex: Math.cos(a) * bend,
      ey: Math.sin(a) * bend,
      delay: 0.17 * rand() + 0.12 * (y + 0.5),
      z: rand(),
      radius: 0.43 + magnitude ** 2.7 * 1.6,
      halo: 9 + magnitude ** 23 * 34 + magnitude ** 175 * 12,
      light: 0.34 + 0.66 * magnitude,
      phase: rand() * tau,
      image:
        magnitude > 0.82
          ? (magnitude > 0.997 && i % 2 === 0 ? flares : sprites)[tone]
          : null,
      color: dotColors[tone],
      size: 0,
      ox: 0,
      oy: 0,
    };
  });
  // Match horizontal bands and then nearby columns so stars flow into the digits
  // without all crossing the centre at once. This work happens only at setup.
  const targets = stars
    .map(({ nx, ny }) => ({ nx, ny }))
    .sort((a, b) => a.ny - b.ny);
  const sources = [...stars].sort((a, b) => a.y - b.y);
  const band = Math.ceil(stars.length / 9);
  for (let start = 0; start < stars.length; start += band) {
    const from = sources.slice(start, start + band).sort((a, b) => a.x - b.x);
    const to = targets.slice(start, start + band).sort((a, b) => a.nx - b.nx);
    from.forEach((s, i) => {
      s.nx = to[i].nx;
      s.ny = to[i].ny;
    });
  }
  let w = 1,
    h = 1,
    cx = 0,
    cy = 0,
    scale = 1,
    dpr = 1;
  let pointerX = -999,
    pointerY = -999,
    visible = false,
    needsPaint = true,
    frame = 0,
    last = 0,
    time = 0;
  function prepare() {
    const width = canvas.clientWidth,
      height = canvas.clientHeight;
    if (!width || !height) return;
    const ratio = Math.min(
      devicePixelRatio || 1,
      1.7,
      Math.sqrt(pixelBudget / (width * height)),
    );
    if (w === width && h === height && dpr === ratio) return;
    w = width;
    h = height;
    const small = w < 760;
    dpr = ratio;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    cx = w * 0.5;
    cy = h * 0.5;
    scale = small
      ? Math.min(w * 0.72, h * 0.88)
      : Math.min(w * 0.4, h * 0.9, 540);
    const particleSizeFactor = compactViewport.matches ? 0.94 : 1;
    const haloScale = Math.min(1.2, 0.49 + scale / 700) * particleSizeFactor;
    const dotScale = (0.81 + scale / 1350) * 0.76 * particleSizeFactor;
    for (const s of stars)
      s.size = s.image ? s.halo * haloScale : s.radius * dotScale;
  }
  function draw() {
    if (!ctx) return;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const stage = Math.floor(time / formCycleHalf) % 2,
      t = Math.max(0, ((time % formCycleHalf) - formHoldSeconds) / formTransitionSeconds),
      progress = stage ? 1 - t : t;
    const range = Math.max(37, scale * 0.19);
    for (const s of stars) {
      const u = Math.max(0, Math.min(1, (progress - s.delay) / 0.7)),
        m = u * u * (3 - 2 * u),
        arc = 4 * m * (1 - m),
        beat = s.phase + time * (0.46 + s.z * 0.49),
        tw = Math.sin(beat),
        drift = 0.003 + s.z * 0.008,
        x = cx + scale * (s.x + (s.nx - s.x) * m + s.ex * arc + drift * tw),
        y =
          cy +
          scale *
            (s.y +
              (s.ny - s.y) * m +
              s.ey * arc +
              drift * Math.cos(beat * 0.84 + s.phase));
      const dx = x - pointerX,
        dy = y - pointerY,
        d2 = dx * dx + dy * dy;
      let tx = 0,
        ty = 0;
      if (d2 < range * range && d2 > 0) {
        const d = Math.sqrt(d2),
          f = ((1 - d / range) ** 2 * range * 0.62) / d;
        tx = dx * f;
        ty = dy * f;
      }
      s.ox += (tx - s.ox) * 0.14;
      s.oy += (ty - s.oy) * 0.14;
      const px = x + s.ox,
        py = y + s.oy;
      ctx.globalAlpha = s.light * (0.89 + tw * 0.11);
      if (s.image) {
        ctx.drawImage(
          s.image,
          px - s.size / 2,
          py - s.size / 2,
          s.size,
          s.size,
        );
      } else {
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(px, py, s.size, 0, tau);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
  }
  function tick(now: number) {
    frame = 0;
    if (last && now - last < 30) {
      frame = requestAnimationFrame(tick);
      return;
    }
    time += last ? Math.min((now - last) / 1000, 0.08) : 0;
    last = now;
    draw();
    frame = requestAnimationFrame(tick);
  }
  function schedule() {
    cancelAnimationFrame(frame);
    frame = 0;
    last = 0;
    if (!visible || document.hidden) return;
    if (needsPaint) {
      prepare();
      draw();
      needsPaint = false;
    }
    if (!reduced.matches) frame = requestAnimationFrame(tick);
  }
  const move = (e: PointerEvent) => {
    const box = canvas.getBoundingClientRect();
    pointerX = e.clientX - box.left;
    pointerY = e.clientY - box.top;
  };
  const leave = () => {
    pointerX = pointerY = -999;
  };
  const resize = () => {
    needsPaint = true;
    schedule();
  };
  const ro = new ResizeObserver(resize),
    io = new IntersectionObserver(
      ([entry]) => {
        if (visible === entry.isIntersecting) return;
        visible = entry.isIntersecting;
        if (!visible) leave();
        schedule();
      },
      { rootMargin: "-64px 0px 0px 0px" },
    );
  ro.observe(canvas);
  io.observe(canvas);
  window.addEventListener("resize", resize);
  canvas.addEventListener("pointermove", move);
  canvas.addEventListener("pointerleave", leave);
  canvas.addEventListener("pointerup", leave);
  document.addEventListener("visibilitychange", schedule);
  reduced.addEventListener("change", schedule);
  return () => {
    cancelAnimationFrame(frame);
    ro.disconnect();
    io.disconnect();
    window.removeEventListener("resize", resize);
    canvas.removeEventListener("pointermove", move);
    canvas.removeEventListener("pointerleave", leave);
    canvas.removeEventListener("pointerup", leave);
    document.removeEventListener("visibilitychange", schedule);
    reduced.removeEventListener("change", schedule);
  };
}
