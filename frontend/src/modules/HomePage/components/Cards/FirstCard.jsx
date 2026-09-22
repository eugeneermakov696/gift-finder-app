// @ts-nocheck

import { useLayoutEffect, useRef } from 'react';

const CSS = String.raw`
/* Declares the canvas: see the note in borderGlow.export.js */


.bgl-export-host{width:100%;}
.bgl-root{width:100%;height:100%}
.bgl-frame{display:grid;place-items:center;width:100%;height:100%;padding:0жoverflow:hidden;background:var(--bgl-stage);font-family:var(--font-display,'Inter',ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif)}
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

export default function FirstCard() {
  const root = useRef(null);

  useLayoutEffect(() => {
    if (!document.querySelector('style[data-border-glow]')) {
      const tag = document.createElement('style');
      tag.setAttribute('data-border-glow', '');
      tag.textContent = CSS;
      document.head.append(tag);
    }
    const node = root.current;
    const __q = (sel) => (node.matches(sel) ? node : node.querySelector(sel));
    // Border Glow runtime — original HorizonX implementation.
    //
    // The subject is a card whose outline behaves like a strip of glass with one
    // lamp inside it. The lamp is not a mood: it has a position, and that position
    // is a real point ON the border. Move the pointer and the lamp slides to the
    // spot on the outline closest to it; the further the pointer is from the
    // border, the dimmer the lamp burns.
    //
    // That single idea decides the whole implementation:
    //
    //   - The geometry is a projection, not a heuristic. `nearestEdgePoint` solves
    //     the closest point on a rounded rectangle exactly, splitting the plane into
    //     the four corner quadrants (project onto the arc) and the four straight
    //     bands (drop a perpendicular). Its by-product, the distance in pixels, is
    //     the only brightness input there is — which is why `reach` is a length in
    //     px and means what it says, instead of a unitless sensitivity.
    //   - Colour is free. The rim is painted with a conic gradient of the palette
    //     fixed to the card, and the lamp is a soft circular mask travelling over
    //     it, so whichever hue happens to live at that part of the perimeter is the
    //     hue that lights up. No JS touches colour at all.
    //   - The lamp has attack and release. Brightness is eased toward its target by
    //     an exponential approach in one rAF loop rather than by a CSS transition on
    //     a `:hover` gate, because the same loop already has to run for the orbit
    //     and the intro lap. There is therefore no hover selector anywhere in the
    //     sheet, and the standalone export animates for exactly the same reason the
    //     editor does.
    //
    // The engine writes three custom properties onto the card and nothing else:
    // `--bgl-x` / `--bgl-y` (the lamp, in px, in card-local coordinates) and
    // `--bgl-lit` (0-1). Everything visible is CSS reading those. `borderGlow.js`
    // holds the sheet; the HTML export inlines THIS file verbatim with `?raw`, so
    // the download and the editor cannot drift.

    const DEG = Math.PI / 180;

    /** Ease used for the intro lap: slow at both ends so the lamp lands, not stops. */
    const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

    /** Clamp a radius to something a box that size can actually round. */
    const usableRadius = (width, height, radius) =>
      Math.max(0, Math.min(radius || 0, width / 2, height / 2));

    const pointOnArc = (cx, cy, r, startDeg, turn) => {
      const angle = (startDeg + 90 * turn) * DEG;
      return { x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r };
    };

    /**
     * Closest point on the outline of a rounded rectangle to `(x, y)`, in the same
     * card-local coordinates, plus the distance to it.
     *
     * The plane splits into eight regions. Outside both the horizontal and the
     * vertical straight bands you are in a corner quadrant, and the answer is the
     * projection onto that corner's arc. Otherwise at least one band holds and the
     * answer is the nearest perpendicular foot on a straight side — both sides of a
     * band are candidates, because a point near the left edge of a wide card is
     * still, formally, some distance from the right one.
     */
    function nearestEdgePoint(width, height, radius, x, y) {
      const r = usableRadius(width, height, radius);
      const insideX = x >= r && x <= width - r;
      const insideY = y >= r && y <= height - r;

      if (!insideX && !insideY) {
        const cx = x < r ? r : width - r;
        const cy = y < r ? r : height - r;
        const dx = x - cx;
        const dy = y - cy;
        const reachOut = Math.hypot(dx, dy);
        // Standing exactly on the arc's centre gives no direction to project along,
        // and a zero radius has no arc at all. Both land on the square corner.
        if (r === 0 || reachOut === 0) {
          const px = x < r ? 0 : width;
          const py = y < r ? 0 : height;
          return { x: px, y: py, distance: Math.hypot(x - px, y - py) };
        }
        return {
          x: cx + (dx / reachOut) * r,
          y: cy + (dy / reachOut) * r,
          distance: Math.abs(reachOut - r)
        };
      }

      let best = null;
      const consider = (px, py) => {
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

    /**
     * The point `t` of the way around the outline, `t` in [0, 1), walking clockwise
     * from the top-left corner. Used by the intro lap and the orbit — the two cases
     * where the lamp has to move without a pointer telling it where to go.
     */
    function perimeterPoint(width, height, radius, t) {
      const r = usableRadius(width, height, radius);
      const flatX = Math.max(width - 2 * r, 0);
      const flatY = Math.max(height - 2 * r, 0);
      const arc = (Math.PI * r) / 2;
      const turn = (u) => (arc > 0 ? u / arc : 0);

      const legs = [
        { length: flatX, at: (u) => ({ x: r + u, y: 0 }) },
        { length: arc, at: (u) => pointOnArc(width - r, r, r, -90, turn(u)) },
        { length: flatY, at: (u) => ({ x: width, y: r + u }) },
        { length: arc, at: (u) => pointOnArc(width - r, height - r, r, 0, turn(u)) },
        { length: flatX, at: (u) => ({ x: width - r - u, y: height }) },
        { length: arc, at: (u) => pointOnArc(r, height - r, r, 90, turn(u)) },
        { length: flatY, at: (u) => ({ x: 0, y: height - r - u }) },
        { length: arc, at: (u) => pointOnArc(r, r, r, 180, turn(u)) }
      ];

      const total = legs.reduce((sum, leg) => sum + leg.length, 0);
      if (!(total > 0)) return { x: width / 2, y: height / 2 };

      let travel = (((t % 1) + 1) % 1) * total;
      for (let i = 0; i < legs.length; i += 1) {
        const leg = legs[i];
        if (travel <= leg.length || i === legs.length - 1) return leg.at(Math.min(travel, leg.length));
        travel -= leg.length;
      }
      return legs[0].at(0);
    }

    /**
     * Brightness for a pointer `distance` px away from the border, given `reach`.
     * Smoothstepped rather than linear: a linear ramp makes the lamp appear to snap
     * on at the threshold, because the eye reads the discontinuity in the slope.
     */
    function lampFalloff(distance, reach) {
      if (!(reach > 0)) return distance <= 0 ? 1 : 0;
      const t = Math.min(Math.max(1 - distance / reach, 0), 1);
      return t * t * (3 - 2 * t);
    }

    /**
     * One frame of an exponential approach. `duration` is the time to cover ~95% of
     * the remaining gap, which is why the time constant is a third of it. Framerate
     * independent on purpose: a 120Hz display must not fade twice as fast as a 60Hz
     * one, and it would if this were a fixed per-frame fraction.
     */
    function approach(current, target, elapsed, duration) {
      if (!(duration > 0)) return target;
      if (!(elapsed > 0)) return current;
      return current + (target - current) * (1 - Math.exp((-elapsed * 3) / duration));
    }

    const prefers = (query) =>
      typeof window !== 'undefined' && typeof window.matchMedia === 'function'
        ? window.matchMedia(query).matches
        : false;

    function buildBorderGlow(card, config = {}) {
      const opts = {
        activation: 'pointer',
        intro: true,
        introDuration: 2600,
        orbitDuration: 7000,
        attack: 180,
        release: 540,
        reach: 120,
        ...config
      };

      const reducedMotion = prefers('(prefers-reduced-motion: reduce)');
      // A device that reports no hover will never move a pointer across this card,
      // so pointer activation would leave it a plain dark rectangle for ever. It
      // orbits instead: same lamp, driven by a clock rather than by a hand.
      const hoverless = prefers('(hover: none)');

      let disposed = false;
      let raf = 0;
      let lastFrame = 0;
      let lit = 0;
      let litTarget = 0;
      // 'pointer' waits for a hand, 'orbit' runs the lamp round for ever, 'intro'
      // is one lap that hands back to 'pointer' when it finishes.
      let mode = opts.activation === 'orbit' || hoverless ? 'orbit' : 'pointer';
      let autoStart = 0;

      const geometry = () => {
        const rect = card.getBoundingClientRect();
        const style = typeof getComputedStyle === 'function' ? getComputedStyle(card) : null;
        const radius = style ? parseFloat(style.borderTopLeftRadius) || 0 : 0;
        return { rect, width: rect.width, height: rect.height, radius };
      };

      const writeLamp = (x, y) => {
        card.style.setProperty('--bgl-x', `${x.toFixed(2)}px`);
        card.style.setProperty('--bgl-y', `${y.toFixed(2)}px`);
      };
      const writeLit = () => {
        card.style.setProperty('--bgl-lit', lit.toFixed(4));
      };

      const parkLamp = (t) => {
        const { width, height, radius } = geometry();
        const point = perimeterPoint(width, height, radius, t);
        writeLamp(point.x, point.y);
      };

      const frame = (now) => {
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
            // A bell rather than a ramp: the lap should arrive and leave, so the
            // card settles dark instead of stranding a lit edge nobody asked for.
            lit = Math.sin(Math.PI * progress) ** 0.7;
            litTarget = lit;
          }
        } else if (mode === 'orbit') {
          parkLamp(((now - autoStart) % Math.max(opts.orbitDuration, 1)) / Math.max(opts.orbitDuration, 1));
          litTarget = 1;
        }

        lit = approach(lit, litTarget, elapsed, litTarget > lit ? opts.attack : opts.release);
        if (Math.abs(lit - litTarget) < 0.0005) lit = litTarget;
        writeLit();

        if (mode !== 'pointer' || lit !== litTarget) raf = requestAnimationFrame(frame);
        else raf = 0;
      };

      // The loop only exists while something is changing. An idle card with the
      // pointer away costs nothing, which matters in a catalogue that mounts a page
      // full of these at once.
      const wake = () => {
        if (raf || disposed) return;
        lastFrame = 0;
        raf = requestAnimationFrame(frame);
      };

      const sleep = () => {
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
      };

      const startAuto = (next) => {
        mode = next;
        autoStart = typeof performance !== 'undefined' ? performance.now() : Date.now();
        if (reducedMotion) {
          // Reduced motion keeps the component's subject and drops its travel: the
          // lamp is parked on the top edge and simply lit. Nothing moves.
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

      const onPointerMove = (event) => {
        if (mode === 'orbit') return;
        // A pointer lap in flight is a greeting, not a state: the hand outranks it.
        if (mode === 'intro') mode = 'pointer';
        const { rect, width, height, radius } = geometry();
        const point = nearestEdgePoint(width, height, radius, event.clientX - rect.left, event.clientY - rect.top);
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

      // The keyboard door. Focus is the only way a keyboard user can ever address
      // this card, and the component's whole content is the lamp — so focus lights
      // it the way a hover would, and blur puts it out.
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
        // Tuning, not structure. Reach is read on every pointer move and the three
        // timings on every frame, so an edit lands on the next one without the
        // lamp losing its place. `activation` and `intro` decide which lap the
        // lamp starts on and stay constructor arguments.
        configure(next = {}) {
          for (const key of ['orbitDuration', 'attack', 'release', 'reach', 'introDuration']) {
            if (next[key] !== undefined) opts[key] = next[key];
          }
        },
        destroy() {
          disposed = true;
          sleep();
          card.removeEventListener('pointermove', onPointerMove);
          card.removeEventListener('pointerleave', onPointerLeave);
          card.removeEventListener('focus', onFocus);
          card.removeEventListener('blur', onBlur);
          card.style.removeProperty('--bgl-x');
          card.style.removeProperty('--bgl-y');
          card.style.removeProperty('--bgl-lit');
        }
      };
    }
    const card=__q('.bgl-card');
    buildBorderGlow(card,{
      "activation": "pointer",
      "intro": true,
      "orbitDuration": 7000,
      "attack": 180,
      "release": 540,
      "reach": 120
    });
  }, []);

  return (
    <div ref={root} className="bgl-export-host">
      <div className="bgl-frame" style={{ '--bgl-stage': '#fbf7f3', '--bgl-w': '412px', '--bgl-h': '216px', '--bgl-radius': '28px', '--bgl-pad': '32px', '--bgl-card-bg': '#ffffff', '--bgl-ink': '#2f2a2c', '--bgl-rim': '1px', '--bgl-halo': '20px', '--bgl-spread': '130px', '--bgl-brightness': '1', '--bgl-wash': '0.12', '--bgl-wheel': 'conic-gradient(from -90deg at 50% 50%,#653f49,#f49898,#ec2d30,#653f49)' }}>
        <div className="bgl-card" tabIndex="0">
          <span className="bgl-lamp" aria-hidden="true">
            <span className="bgl-wash"></span>
            <span className="bgl-bloom">
              <i className="bgl-bloom-ring"></i>
            </span>
            <span className="bgl-rim"></span>
          </span>
          <div className="bgl-inner">
            <span className="bgl-eyebrow">
              STEP 01
            </span>
            <h3 className="bgl-title">
              Share Who You're Celebrating
            </h3>
            <p className="bgl-description">
              Select their age, hobbies, personality, and your budget limit. It takes less than 60 seconds.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
