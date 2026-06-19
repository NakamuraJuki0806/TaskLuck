import { useEffect, useRef, useCallback } from 'react';

export function useGachaEffects() {
  const emberCanvasRef = useRef<HTMLCanvasElement>(null);
  const confettiCanvasRef = useRef<HTMLCanvasElement>(null);
  const lightningCanvasRef = useRef<HTMLCanvasElement>(null);

  // Ember particles
  const embersRef = useRef<any[]>([]);
  const emberRafRef = useRef<number | null>(null);
  const emberOnRef = useRef(false);
  const emberColorRef = useRef('#bc29ea');
  const emberRateRef = useRef(60);

  // Confetti particles
  const confettisRef = useRef<any[]>([]);
  const confRafRef = useRef<number | null>(null);

  // Lightning
  const lightningRafRef = useRef<number | null>(null);

  // Aura state
  const auraRef = useRef<HTMLDivElement | null>(null);

  // Initialize canvas contexts
  useEffect(() => {
    // Resize ember canvas
    if (emberCanvasRef.current) {
      const ecv = emberCanvasRef.current;
      const ectx = ecv.getContext('2d');
      if (ectx) {
        ecv.width = window.innerWidth;
        ecv.height = window.innerHeight;
      }
    }

    // Resize confetti canvas
    if (confettiCanvasRef.current) {
      const ccv = confettiCanvasRef.current;
      const cctx = ccv.getContext('2d');
      if (cctx) {
        ccv.width = window.innerWidth;
        ccv.height = window.innerHeight;
      }
    }

    // Resize lightning canvas
    if (lightningCanvasRef.current) {
      const lcv = lightningCanvasRef.current;
      const lctx = lcv.getContext('2d');
      if (lctx) {
        lcv.width = window.innerWidth;
        lcv.height = window.innerHeight;
      }
    }

    const handleResize = () => {
      if (emberCanvasRef.current) {
        emberCanvasRef.current.width = window.innerWidth;
        emberCanvasRef.current.height = window.innerHeight;
      }
      if (confettiCanvasRef.current) {
        confettiCanvasRef.current.width = window.innerWidth;
        confettiCanvasRef.current.height = window.innerHeight;
      }
      if (lightningCanvasRef.current) {
        lightningCanvasRef.current.width = window.innerWidth;
        lightningCanvasRef.current.height = window.innerHeight;
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Ember system
  const spawnEmber = useCallback(() => {
    const ecv = emberCanvasRef.current;
    if (!ecv) return;
    const EW = ecv.width;
    const EH = ecv.height;

    embersRef.current.push({
      x: Math.random() * EW,
      y: EH + 10,
      vx: (Math.random() - 0.5) * 2.8,
      vy: -(Math.random() * 4 + 1.8),
      r: Math.random() * 4 + 1,
      life: 1,
      decay: Math.random() * 0.013 + 0.007,
      color: emberColorRef.current,
    });
  }, []);

  const tickEmbers = useCallback(() => {
    const ecv = emberCanvasRef.current;
    if (!ecv) return;
    const ectx = ecv.getContext('2d');
    if (!ectx) return;
    const EW = ecv.width;
    const EH = ecv.height;

    ectx.clearRect(0, 0, EW, EH);

    for (let i = embersRef.current.length - 1; i >= 0; i--) {
      const e = embersRef.current[i];
      e.x += e.vx;
      e.y += e.vy;
      e.vy -= 0.04;
      e.life -= e.decay;

      if (e.life <= 0) {
        embersRef.current.splice(i, 1);
        continue;
      }

      ectx.beginPath();
      ectx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
      ectx.fillStyle = e.color + Math.round(e.life * 180).toString(16).padStart(2, '0');
      ectx.fill();
    }

    if (embersRef.current.length < emberRateRef.current) {
      spawnEmber();
    }

    if (emberOnRef.current) {
      emberRafRef.current = requestAnimationFrame(tickEmbers);
    }
  }, [spawnEmber]);

  const startEmbers = useCallback(
    (color: string, rate: number) => {
      emberColorRef.current = color || '#bc29ea';
      emberRateRef.current = rate || 60;
      embersRef.current = [];
      emberOnRef.current = true;
      tickEmbers();
    },
    [tickEmbers]
  );

  const stopEmbers = useCallback(() => {
    emberOnRef.current = false;
    if (emberRafRef.current) {
      cancelAnimationFrame(emberRafRef.current);
    }
    const ecv = emberCanvasRef.current;
    if (ecv) {
      const ectx = ecv.getContext('2d');
      if (ectx) ectx.clearRect(0, 0, ecv.width, ecv.height);
    }
  }, []);

  // Confetti system
  const fireConfetti = useCallback(
    (colors: string[], count = 160, cx = window.innerWidth / 2, cy = window.innerHeight * 0.42) => {
      for (let i = 0; i < count; i++) {
        const a = Math.random() * Math.PI * 2;
        const spd = Math.random() * 22 + 6;

        confettisRef.current.push({
          x: cx,
          y: cy,
          vx: Math.cos(a) * spd * (Math.random() * 0.9 + 0.1),
          vy: Math.sin(a) * spd * (Math.random() * 0.9 + 0.1) - 14,
          color: colors[Math.floor(Math.random() * colors.length)],
          w: Math.random() * 9 + 3,
          h: Math.random() * 13 + 5,
          rot: Math.random() * Math.PI * 2,
          rotv: (Math.random() - 0.5) * 0.35,
          life: 1,
          shape: Math.random() < 0.25 ? 'circle' : 'rect',
        });
      }

      if (confRafRef.current) {
        cancelAnimationFrame(confRafRef.current);
      }
      tickConfetti();
    },
    []
  );

  const tickConfetti = useCallback(() => {
    const ccv = confettiCanvasRef.current;
    if (!ccv) return;
    const cctx = ccv.getContext('2d');
    if (!cctx) return;
    const CW = ccv.width;
    const CH = ccv.height;

    cctx.clearRect(0, 0, CW, CH);

    let any = false;

    confettisRef.current.forEach(c => {
      c.x += c.vx;
      c.y += c.vy;
      c.vy += 0.5;
      c.vx *= 0.99;
      c.rot += c.rotv;
      c.life -= 0.01;

      if (c.life <= 0 || c.y > CH + 80) return;
      any = true;

      cctx.save();
      cctx.translate(c.x, c.y);
      cctx.rotate(c.rot);
      cctx.globalAlpha = Math.max(0, c.life);
      cctx.fillStyle = c.color;

      if (c.shape === 'circle') {
        cctx.beginPath();
        cctx.arc(0, 0, c.w / 2, 0, Math.PI * 2);
        cctx.fill();
      } else {
        cctx.fillRect(-c.w / 2, -c.h / 2, c.w, c.h);
      }

      cctx.restore();
    });

    if (any) {
      confRafRef.current = requestAnimationFrame(tickConfetti);
    }
  }, []);

  // Lightning system
  const drawBolt = useCallback((x1: number, y1: number, x2: number, y2: number, width = 2, alpha = 0.9, color = '#fff') => {
    const lcv = lightningCanvasRef.current;
    if (!lcv) return;
    const lctx = lcv.getContext('2d');
    if (!lctx) return;

    const pts: [number, number][] = [[x1, y1]];
    for (let i = 1; i < 10; i++) {
      const t = i / 10;
      pts.push([
        x1 + (x2 - x1) * t + (Math.random() - 0.5) * 80,
        y1 + (y2 - y1) * t + (Math.random() - 0.5) * 40,
      ]);
    }
    pts.push([x2, y2]);

    lctx.beginPath();
    lctx.moveTo(pts[0][0], pts[0][1]);
    pts.slice(1).forEach(p => lctx.lineTo(p[0], p[1]));
    lctx.strokeStyle = color;
    lctx.lineWidth = width;
    lctx.globalAlpha = alpha;
    lctx.stroke();
    lctx.globalAlpha = 1;
  }, []);

  const doLightning = useCallback(
    (count: number, color = '#fff') => {
      const lcv = lightningCanvasRef.current;
      if (!lcv) return;
      const lctx = lcv.getContext('2d');
      if (!lctx) return;
      const LW = lcv.width;
      const LH = lcv.height;

      let flashes = 0;

      const flash = () => {
        lctx.clearRect(0, 0, LW, LH);

        const n = Math.floor(count / 2) + 1;
        for (let i = 0; i < n; i++) {
          const sx = Math.random() * LW;
          const ex = LW * 0.2 + Math.random() * LW * 0.6;
          const ey = LH * 0.4 + Math.random() * LH * 0.3;
          drawBolt(sx, 0, ex, ey, Math.random() * 3 + 1, 0.9, color);

          if (Math.random() < 0.5) {
            drawBolt(ex, ey, ex + (Math.random() - 0.5) * 100, ey + Math.random() * 100, 1, 0.5, color);
          }
        }

        flashes++;
        if (flashes < count) {
          setTimeout(() => {
            lctx.clearRect(0, 0, LW, LH);
            setTimeout(flash, 80);
          }, 80);
        } else {
          lctx.clearRect(0, 0, LW, LH);
        }
      };

      flash();
    },
    [drawBolt]
  );

  // Aura system
  const showAura = useCallback((color: string, size = 300) => {
    const aura = document.getElementById('ov-aura');
    if (aura) {
      aura.innerHTML = `<div style="width:${size}px;height:${size}px;border-radius:50%;background:radial-gradient(circle,${color}44 0%,${color}11 50%,transparent 70%);animation:gglpulse 1.4s ease-in-out infinite;filter:blur(2px)"></div>`;
    }
  }, []);

  const hideAura = useCallback(() => {
    const aura = document.getElementById('ov-aura');
    if (aura) {
      aura.innerHTML = '';
    }
  }, []);

  // Shockwave system
  const doShockwave = useCallback((color = '#fff') => {
    const sw = document.getElementById('ov-shockwave');
    if (!sw) return;

    const el = document.createElement('div');
    el.style.cssText = `width:10px;height:10px;border-radius:50%;border:4px solid ${color};animation:shockwave .7s ease-out forwards`;

    if (!document.getElementById('sw-style')) {
      const s = document.createElement('style');
      s.id = 'sw-style';
      s.textContent = `@keyframes shockwave{0%{width:10px;height:10px;opacity:.9;border-width:4px}100%{width:${Math.min(window.innerWidth, window.innerHeight) * 0.9}px;height:${Math.min(window.innerWidth, window.innerHeight) * 0.9}px;opacity:0;border-width:1px}}`;
      document.head.appendChild(s);
    }

    sw.innerHTML = '';
    sw.appendChild(el);
    setTimeout(() => el.remove(), 800);
  }, []);

  return {
    emberCanvasRef,
    confettiCanvasRef,
    lightningCanvasRef,
    auraRef,
    startEmbers,
    stopEmbers,
    fireConfetti,
    doLightning,
    showAura,
    hideAura,
    doShockwave,
  };
}
