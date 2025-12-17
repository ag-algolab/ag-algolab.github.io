import React, { useEffect, useRef } from "react";

export default function DecisionField() {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    let w = 0, h = 0, dpr = 1;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;

      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = Math.max(320, Math.floor(parent.clientWidth));
      h = 220;

      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    // --- helpers ---
    const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
    const lerp = (a, b, t) => a + (b - a) * t;

    // Deterministic pseudo-random
    const hash = (n) => {
      const x = Math.sin(n * 999.123) * 10000;
      return x - Math.floor(x);
    };

    // Streamlines setup (no feature labels, no nodes)
    const lineCount = 14;
    const lines = Array.from({ length: lineCount }).map((_, i) => {
      const y0 = lerp(40, h - 40, (i + 1) / (lineCount + 1));
      return {
        seed: i + 1,
        y0,
        amp: lerp(6, 18, hash(i + 11)),
        freq: lerp(0.6, 1.4, hash(i + 23)),
        speed: lerp(0.35, 0.9, hash(i + 37)),
        phase: hash(i + 71) * Math.PI * 2,
      };
    });

    const drawRoundedRect = (x, y, rw, rh, r) => {
      const rr = Math.min(r, rw / 2, rh / 2);
      ctx.beginPath();
      ctx.moveTo(x + rr, y);
      ctx.arcTo(x + rw, y, x + rw, y + rh, rr);
      ctx.arcTo(x + rw, y + rh, x, y + rh, rr);
      ctx.arcTo(x, y + rh, x, y, rr);
      ctx.arcTo(x, y, x + rw, y, rr);
      ctx.closePath();
    };

    let t0 = performance.now();

    const render = (now) => {
      const t = (now - t0) / 1000;

      ctx.clearRect(0, 0, w, h);

      // Panel frame (subtle)
      ctx.save();
      ctx.globalAlpha = 1;

      // Background glass
      drawRoundedRect(0, 0, w, h, 18);
      ctx.fillStyle = "rgba(255,255,255,0.03)";
      ctx.fill();

      // Soft border
      ctx.strokeStyle = "rgba(255,255,255,0.08)";
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.restore();

      // Define "field zone" in the middle (acts like the model)
      const fieldX0 = Math.floor(w * 0.28);
      const fieldX1 = Math.floor(w * 0.78);
      const fieldW = fieldX1 - fieldX0;

      // Field haze (moving noise-like dots)
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.globalAlpha = 0.35;
      for (let i = 0; i < 140; i++) {
        const s = i + 1;
        const px = lerp(fieldX0, fieldX1, hash(s * 3.1 + t * 0.12));
        const py = lerp(20, h - 20, hash(s * 7.7 + t * 0.18));
        const a = 0.03 + 0.09 * hash(s * 9.9);
        ctx.fillStyle = `rgba(183,195,230,${a})`;
        ctx.fillRect(px, py, 1, 1);
      }
      ctx.restore();

      // Streamlines (the "pressure field" bends them in the zone)
      ctx.save();
      ctx.lineCap = "round";

      for (let i = 0; i < lines.length; i++) {
        const L = lines[i];

        const yBase = L.y0 + Math.sin(t * L.speed + L.phase) * 2.2;
        const segments = 90;

        // alpha by distance to center to create depth
        const distToCenter = Math.abs(yBase - h / 2) / (h / 2);
        const a0 = clamp(0.16 + (1 - distToCenter) * 0.28, 0.12, 0.44);

        ctx.beginPath();

        for (let s = 0; s <= segments; s++) {
          const u = s / segments; // 0..1 across width
          const x = u * w;

          // Base wave
          const wave = Math.sin((u * Math.PI * 2) * L.freq + t * (0.9 + L.speed) + L.phase);

          // Field influence is strongest in [fieldX0, fieldX1]
          const inField = clamp((x - fieldX0) / fieldW, 0, 1);
          const bell = Math.sin(inField * Math.PI); // 0..1..0 bell curve

          // Pressure bends/compresses within the field zone
          const bend = bell * (0.9 + 0.4 * Math.sin(t * 0.8 + L.seed));
          const y = yBase + wave * L.amp * (0.25 + 0.75 * bend);

          if (s === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        // Stroke gradient feel via two passes
        ctx.strokeStyle = `rgba(231,236,255,${a0})`;
        ctx.lineWidth = 1.15;
        ctx.stroke();

        ctx.strokeStyle = `rgba(47,68,134,${a0 * 0.55})`;
        ctx.lineWidth = 2.6;
        ctx.stroke();
      }

      ctx.restore();

      // Input stream (left)
      ctx.save();
      ctx.globalAlpha = 0.9;
      ctx.fillStyle = "rgba(231,236,255,0.14)";
      for (let i = 0; i < 32; i++) {
        const px = lerp(16, fieldX0 - 10, (i / 31));
        const py = h / 2 + Math.sin(t * 1.4 + i * 0.35) * lerp(6, 26, i / 31);
        ctx.fillRect(px, py, 2, 2);
      }
      ctx.restore();

      // Output beam (right) — stable signal
      ctx.save();
      const outX0 = fieldX1 + 10;
      const outX1 = w - 16;
      const outY = h / 2;

      ctx.strokeStyle = "rgba(231,236,255,0.18)";
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(outX0, outY);
      ctx.lineTo(outX1, outY);
      ctx.stroke();

      ctx.strokeStyle = "rgba(47,68,134,0.55)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(outX0, outY);
      ctx.lineTo(outX1, outY);
      ctx.stroke();
      ctx.restore();

      // Small label badges (not features)
      ctx.save();
      ctx.globalAlpha = 1;

      // "Decision field" label
      ctx.font = "12px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto";
      ctx.fillStyle = "rgba(231,236,255,0.68)";
      ctx.fillText("Decision field", 16, 20);

      // "Raw signal" label at output
      const txt = "Raw signal";
      const tw = ctx.measureText(txt).width;
      const bx = w - tw - 18;
      const by = h - 16;

      ctx.fillStyle = "rgba(255,255,255,0.04)";
      ctx.strokeStyle = "rgba(255,255,255,0.10)";
      drawRoundedRect(bx - 10, by - 18, tw + 20, 22, 10);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "rgba(231,236,255,0.72)";
      ctx.fillText(txt, bx, by - 3);

      ctx.restore();

      rafRef.current = requestAnimationFrame(render);
    };

    rafRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="w-full">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
        <canvas ref={canvasRef} className="block w-full rounded-xl" />
        <div className="mt-3 flex items-center justify-between text-xs text-white/55">
          <span>Transforms structured inputs into a stable decision signal.</span>
          <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/5 border border-white/10">
            Model layer: <span className="text-white/75">CatBoost core</span>
          </span>
        </div>
      </div>
    </div>
  );
}
