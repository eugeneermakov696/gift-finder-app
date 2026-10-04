import React, { useRef, useLayoutEffect } from 'react';

const CSS = String.raw`
/* Declares the canvas: see the note in borderGlow.export.js */
.bgl-export-host{width:100%;}
.bgl-root{width:100%;height:100%}
.bgl-frame{display:grid;place-items:center;width:100%;height:100%;padding:0;overflow:visible;background:var(--bgl-stage);font-family:var(--font-display,'Inter',ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif)}
.bgl-frame *,.bgl-frame *::before,.bgl-frame *::after{box-sizing:border-box}
.bgl-card{--bgl-x:0px;--bgl-y:0px;--bgl-lit:0;position:relative;display:grid;overflow:visible;width:var(--bgl-w);height:var(--bgl-h);border:1px solid color-mix(in srgb,var(--bgl-ink) 14%,transparent);border-radius:var(--bgl-radius);background:var(--bgl-card-bg);color:var(--bgl-ink);outline:none;transform:translate3d(0,0,.01px)}
.bgl-card:focus-visible{outline:2px solid color-mix(in srgb,var(--bgl-ink) 45%,transparent);outline-offset:6px}
.bgl-lamp{position:absolute;inset:calc(var(--bgl-halo) * -1);z-index:0;pointer-events:none;opacity:calc(var(--bgl-lit) * var(--bgl-brightness));-webkit-mask-image:radial-gradient(circle var(--bgl-spread) at calc(var(--bgl-x) + var(--bgl-halo)) calc(var(--bgl-y) + var(--bgl-halo)),#000 0%,rgb(0 0 0 / 55%) 38%,transparent 100%);mask-image:radial-gradient(circle var(--bgl-spread) at calc(var(--bgl-x) + var(--bgl-halo)) calc(var(--bgl-y) + var(--bgl-halo)),#000 0%,rgb(0 0 0 / 55%) 38%,transparent 100%)}
.bgl-wash{position:absolute;inset:var(--bgl-halo);border-radius:var(--bgl-radius);background:var(--bgl-wheel);opacity:var(--bgl-wash);filter:blur(18px)}
.bgl-bloom{position:absolute;inset:var(--bgl-halo);filter:blur(calc(var(--bgl-halo) * .5))}
.bgl-bloom-ring{position:absolute;inset:0;border-radius:var(--bgl-radius);background:var(--bgl-wheel);padding:calc(var(--bgl-rim) * 3 + 2px);-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);mask-composite:exclude;}
.bgl-rim{position:absolute;inset:var(--bgl-halo);border-radius:var(--bgl-radius);background:var(--bgl-wheel);padding:var(--bgl-rim);-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);mask-composite:exclude;}
.bgl-inner{position:relative;z-index:1;display:flex;flex-direction:column;justify-content:flex-end;gap:8px;overflow:auto;padding:var(--bgl-pad)}
.bgl-eyebrow{color:color-mix(in srgb,var(--bgl-ink) 48%,transparent);font-size:11px;font-weight:600;line-height:1;letter-spacing:.18em;text-transform:uppercase}
.bgl-title{margin:0;color:var(--bgl-ink);font-size:26px;font-weight:500;line-height:1.14;letter-spacing:-.025em}
.bgl-description{margin:0;color:color-mix(in srgb,var(--bgl-ink) 58%,transparent);font-size:14px;font-weight:400;line-height:1.45}
.bgl-action{margin-top:4px;color:color-mix(in srgb,var(--bgl-ink) 70%,transparent);font-size:13px;font-weight:500}
`;

interface GlowCardProps {
  className?: string;
  eyebrow?: string;
  title: string;
  description: string;
}

interface BorderGlowConfig {
  activation?: 'pointer' | 'orbit';
  intro?: boolean;
  introDuration?: number;
  orbitDuration?: number;
  attack?: number;
  release?: number;
  reach?: number;
}

export const GlowCard = ({ className = '', eyebrow, title, description }: GlowCardProps) => {
  const root = useRef<HTMLDivElement>(null);
  type BestPoint = { x: number; y: number; distance: number };

  useLayoutEffect(() => {
    if (!document.querySelector('style[data-border-glow]')) {
      const tag = document.createElement('style');
      tag.setAttribute('data-border-glow', '');
      tag.textContent = CSS;
      document.head.append(tag);
    }
    const node = root.current;
    if (!node) return;

    const __q = (sel: string) => (node.matches(sel) ? node : node.querySelector(sel));

    const DEG = Math.PI / 180;
    const easeInOutCubic = (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const usableRadius = (width: number, height: number, radius: number) =>
      Math.max(0, Math.min(radius || 0, width / 2, height / 2));

    const pointOnArc = (cx: number, cy: number, r: number, startDeg: number, turn: number) => {
      const angle = (startDeg + 90 * turn) * DEG;
      return { x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r };
    };

    function nearestEdgePoint(width: number, height: number, radius: number, x: number, y: number) {
      const r = usableRadius(width, height, radius);
      const insideX = x >= r && x <= width - r;
      const insideY = y >= r && y <= height - r;

      if (!insideX && !insideY) {
        const cx = x < r ? r : width - r;
        const cy = y < r ? r : height - r;
        const dx = x - cx;
        const dy = y - cy;
        const reachOut = Math.hypot(dx, dy);

        if (r === 0 || reachOut === 0) {
          const px = x < r ? 0 : width;
          const py = y < r ? 0 : height;
          return { x: px, y: py, distance: Math.hypot(x - px, y - py) };
        }
        return {
          x: cx + (dx / reachOut) * r,
          y: cy + (dy / reachOut) * r,
          distance: Math.abs(reachOut - r),
        };
      }

      let best: BestPoint | null = null;
      const consider = (px: number, py: number) => {
        const distance = Math.hypot(x - px, y - py);
        if (!best || distance < best.distance) best = { x: px, y: py, distance };
      };
      if (insideX) {
        consider(x, 0);
        consider(x, height);
      }
      if (insideY) {
        consider(0, y);
        consider(width, y);
      }
      return best;
    }

    function perimeterPoint(width: number, height: number, radius: number, t: number) {
      const r = usableRadius(width, height, radius);
      const flatX = Math.max(width - 2 * r, 0);
      const flatY = Math.max(height - 2 * r, 0);
      const arc = (Math.PI * r) / 2;
      const turn = (u: number) => (arc > 0 ? u / arc : 0);

      const legs = [
        { length: flatX, at: (u: number) => ({ x: r + u, y: 0 }) },
        { length: arc, at: (u: number) => pointOnArc(width - r, r, r, -90, turn(u)) },
        { length: flatY, at: (u: number) => ({ x: width, y: r + u }) },
        { length: arc, at: (u: number) => pointOnArc(width - r, height - r, r, 0, turn(u)) },
        { length: flatX, at: (u: number) => ({ x: width - r - u, y: height }) },
        { length: arc, at: (u: number) => pointOnArc(r, height - r, r, 90, turn(u)) },
        { length: flatY, at: (u: number) => ({ x: 0, y: height - r - u }) },
        { length: arc, at: (u: number) => pointOnArc(r, r, r, 180, turn(u)) },
      ];

      const total = legs.reduce((sum, leg) => sum + leg.length, 0);
      if (!(total > 0)) return { x: width / 2, y: height / 2 };

      let travel = (((t % 1) + 1) % 1) * total;
      for (let i = 0; i < legs.length; i += 1) {
        const leg = legs[i];
        if (travel <= leg.length || i === legs.length - 1)
          return leg.at(Math.min(travel, leg.length));
        travel -= leg.length;
      }
      return legs[0].at(0);
    }

    function lampFalloff(distance: number, reach: number) {
      if (!(reach > 0)) return distance <= 0 ? 1 : 0;
      const t = Math.min(Math.max(1 - distance / reach, 0), 1);
      return t * t * (3 - 2 * t);
    }

    function approach(current: number, target: number, elapsed: number, duration: number) {
      if (!(duration > 0)) return target;
      if (!(elapsed > 0)) return current;
      return current + (target - current) * (1 - Math.exp((-elapsed * 3) / duration));
    }

    const prefers = (query: string) =>
      typeof window !== 'undefined' && typeof window.matchMedia === 'function'
        ? window.matchMedia(query).matches
        : false;

    function buildBorderGlow(card: HTMLElement, config: BorderGlowConfig = {}) {
      const opts = {
        activation: 'pointer',
        intro: true,
        introDuration: 2600,
        orbitDuration: 7000,
        attack: 180,
        release: 540,
        reach: 120,
        ...config,
      };

      const reducedMotion = prefers('(prefers-reduced-motion: reduce)');
      const hoverless = prefers('(hover: none)');

      let disposed = false;
      let raf = 0;
      let lastFrame = 0;
      let lit = 0;
      let litTarget = 0;
      let mode = opts.activation === 'orbit' || hoverless ? 'orbit' : 'pointer';
      let autoStart = 0;

      const geometry = () => {
        const rect = card.getBoundingClientRect();
        const style = typeof getComputedStyle === 'function' ? getComputedStyle(card) : null;
        const radius = style ? parseFloat(style.borderTopLeftRadius) || 0 : 0;
        return { rect, width: rect.width, height: rect.height, radius };
      };

      const writeLamp = (x: number, y: number) => {
        card.style.setProperty('--bgl-x', `${x.toFixed(2)}px`);
        card.style.setProperty('--bgl-y', `${y.toFixed(2)}px`);
      };
      const writeLit = () => {
        card.style.setProperty('--bgl-lit', lit.toFixed(4));
      };

      const parkLamp = (t: number) => {
        const { width, height, radius } = geometry();
        const point = perimeterPoint(width, height, radius, t);
        writeLamp(point.x, point.y);
      };

      const frame = (now: number) => {
        if (disposed) return;
        const elapsed = lastFrame ? now - lastFrame : 16;
        lastFrame = now;

        if (mode === 'intro') {
          const progress = (now - autoStart) / Math.max(opts.introDuration, 1);
          if (progress >= 1) {
            mode = 'pointer';
            litTarget = 0;
          } else {
            parkLamp(easeInOutCubic(progress));
            lit = Math.sin(Math.PI * progress) ** 0.7;
            litTarget = lit;
          }
        } else if (mode === 'orbit') {
          parkLamp(
            ((now - autoStart) % Math.max(opts.orbitDuration, 1)) / Math.max(opts.orbitDuration, 1),
          );
          litTarget = 1;
        }

        lit = approach(lit, litTarget, elapsed, litTarget > lit ? opts.attack : opts.release);
        if (Math.abs(lit - litTarget) < 0.0005) lit = litTarget;
        writeLit();

        if (mode !== 'pointer' || lit !== litTarget) raf = requestAnimationFrame(frame);
        else raf = 0;
      };

      const wake = () => {
        if (raf || disposed) return;
        lastFrame = 0;
        raf = requestAnimationFrame(frame);
      };

      const sleep = () => {
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
      };

      const startAuto = (next: string) => {
        mode = next;
        autoStart = typeof performance !== 'undefined' ? performance.now() : Date.now();
        if (reducedMotion) {
          sleep();
          mode = next === 'orbit' ? 'orbit' : 'pointer';
          parkLamp(0.12);
          lit = next === 'orbit' ? 1 : 0;
          litTarget = lit;
          writeLit();
          return;
        }
        wake();
      };

      const onPointerMove = (e: Event) => {
        const event = e as PointerEvent;

        if (mode === 'orbit') return;
        if (mode === 'intro') mode = 'pointer';
        const { rect, width, height, radius } = geometry();
        const point = nearestEdgePoint(
          width,
          height,
          radius,
          event.clientX - rect.left,
          event.clientY - rect.top,
        );
        if (!point) return;
        writeLamp(point.x, point.y);
        litTarget = lampFalloff(point.distance, opts.reach);
        if (reducedMotion) {
          lit = litTarget;
          writeLit();
          return;
        }
        wake();
      };

      const onPointerLeave = () => {
        if (mode === 'orbit') return;
        mode = 'pointer';
        litTarget = 0;
        if (reducedMotion) {
          lit = 0;
          writeLit();
          return;
        }
        wake();
      };

      const onFocus = () => {
        if (opts.activation === 'orbit' || hoverless) return;
        if (typeof card.matches === 'function' && !card.matches(':focus-visible')) return;
        startAuto('orbit');
      };

      const onBlur = () => {
        if (opts.activation === 'orbit' || hoverless) return;
        sleep();
        mode = 'pointer';
        litTarget = 0;
        if (reducedMotion) {
          lit = 0;
          writeLit();
          return;
        }
        wake();
      };

      card.addEventListener('pointermove', onPointerMove);
      card.addEventListener('pointerleave', onPointerLeave);
      card.addEventListener('focus', onFocus);
      card.addEventListener('blur', onBlur);

      writeLit();
      parkLamp(0.12);
      if (mode === 'orbit') startAuto('orbit');
      else if (opts.intro) startAuto('intro');

      return {
        destroy() {
          disposed = true;
          sleep();
          card.addEventListener('pointermove', onPointerMove);
          card.removeEventListener('pointerleave', onPointerLeave);
          card.removeEventListener('focus', onFocus);
          card.removeEventListener('blur', onBlur);
          card.style.removeProperty('--bgl-x');
          card.style.removeProperty('--bgl-y');
          card.style.removeProperty('--bgl-lit');
        },
      };
    }

    const card = __q('.bgl-card') as HTMLElement;
    const glow = buildBorderGlow(card, {
      activation: 'pointer',
      intro: true,
      orbitDuration: 7000,
      attack: 180,
      release: 540,
      reach: 120,
    });

    return () => glow.destroy();
  }, []);

  return (
    <div ref={root} className={`bgl-export-host ${className}`.trim()}>
      <div
        className="bgl-frame"
        style={
          {
            '--bgl-stage': 'transparent',
            '--bgl-w': '100%',
            '--bgl-h': '100%',
            '--bgl-radius': '28px',
            '--bgl-pad': '32px',
            '--bgl-card-bg': '#ffffff',
            '--bgl-ink': '#2f2a2c',
            '--bgl-rim': '1px',
            '--bgl-halo': '20px',
            '--bgl-spread': '130px',
            '--bgl-brightness': '1',
            '--bgl-wash': '0.12',
            '--bgl-wheel': 'conic-gradient(from -90deg at 50% 50%,#653f49,#f49898,#ec2d30,#653f49)',
          } as React.CSSProperties
        }
      >
        <div className="bgl-card" tabIndex={0}>
          <span className="bgl-lamp" aria-hidden="true">
            <span className="bgl-wash"></span>
            <span className="bgl-bloom">
              <i className="bgl-bloom-ring"></i>
            </span>
            <span className="bgl-rim"></span>
          </span>

          <div className="bgl-inner">
            {eyebrow && <span className="bgl-eyebrow">{eyebrow}</span>}

            <h3 className="bgl-title">{title}</h3>

            <p className="bgl-description">{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
