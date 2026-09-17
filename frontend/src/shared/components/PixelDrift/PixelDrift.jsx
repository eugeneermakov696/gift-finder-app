// @ts-nocheck

import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';

const CSS = String.raw`
.pdt-frame{display:flex;align-items:center;justify-content:center;width:100%;height:100%;overflow:hidden}
.pdt-viewport{position:relative;box-sizing:border-box;flex:0 0 auto;width:var(--pdt-viewport-width);max-width:100%;height:var(--pdt-viewport-height);overflow:hidden;border-radius:var(--pdt-radius);background:transparent;isolation:isolate;touch-action:none}
.pdt-stage,.pdt-stage canvas{position:absolute;inset:0;width:100%;height:100%}
.pdt-stage canvas{display:block;touch-action:none}
`;

export default function PixelDrift() {
  const root = useRef(null);

  useLayoutEffect(() => {
    if (!document.querySelector('style[data-pixel-drift]')) {
      const tag = document.createElement('style');
      tag.setAttribute('data-pixel-drift', '');
      tag.textContent = CSS;
      document.head.append(tag);
    }
    const node = root.current;
    const __q = (sel) => (node.matches(sel) ? node : node.querySelector(sel));
    const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

    const easeFor = (name) => {
      if (name === 'easeIn') return (t) => t * t;
      if (name === 'easeOut') return (t) => 1 - (1 - t) * (1 - t);
      if (name === 'easeInOut') return (t) => t < 0.5 ? 2 * t * t : 1 - ((-2 * t + 2) ** 2) / 2;
      return (t) => t;
    };

    // Text, size, fit and density decide which pixels become particles, so moving
    // one of them has to re-sample the label.
    const SAMPLE_KEYS = ['text', 'fontSize', 'autoFit', 'particleCount'];
    // Trigger, position and replay decide which listeners exist at all.
    const TRIGGER_KEYS = ['mode', 'position', 'replay'];
     function buildPixelDrift(_gsap, root, config) {
      const stage = root.querySelector('.pdt-stage');
      if (!stage) return null;

      const canvas = document.createElement('canvas');
      canvas.setAttribute('aria-hidden', 'true');
      stage.append(canvas);
      const ctx = canvas.getContext('2d', { alpha: true });
      if (!ctx) {
        root.dataset.ready = 'error';
        canvas.remove();
        return null;
      }

      const readPalette = () =>
        Array.isArray(config.colors) && config.colors.length ? config.colors : ['#f3e7d9', '#654f4a', '#f3e7d9'];

      let palette = readPalette();
      const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
      let ease = easeFor(config.ease);
      let durationMs = Math.max(0, Number(config.duration) * 1000);
      const pointer = { x: -99999, y: -99999, active: false };
      let previousX = -99999;
      let previousY = -99999;
      let smoothX = -99999;
      let smoothY = -99999;
      let mouseSpeed = 0;
      let count = 0;
      let originX = new Float32Array(0);
      let originY = new Float32Array(0);
      let spawnX = new Float32Array(0);
      let spawnY = new Float32Array(0);
      let positionX = new Float32Array(0);
      let positionY = new Float32Array(0);
      let repelX = new Float32Array(0);
      let repelY = new Float32Array(0);
      let colorIndex = new Uint8Array(0);
      let width = 1;
      let height = 1;
      let dpr = 1;
      let form = 0;
      let target = 0;
      let lastFrame = performance.now();
      let frame = 0;
      let entered = false;
      // Only the very first sample opens at nothing. A later one — a resize, or a
      // control that changes which pixels are particles — has to keep the form it
      // already had, or every edit replays the entrance under the cursor.
      let firstSample = true;
      const fitFont = (measure, label, maxWidth, maxHeight, cap) => {
        let low = 8;
        let high = cap;
        let best = low;
        for (let index = 0; index < 12; index += 1) {
          const size = (low + high) / 2;
          measure.font = `700 ${size}px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
          const metrics = measure.measureText(label);
          const glyphHeight = (metrics.actualBoundingBoxAscent || size * 0.8) + (metrics.actualBoundingBoxDescent || size * 0.2);
          if (metrics.width <= maxWidth && glyphHeight <= maxHeight) {
            best = size;
            low = size;
          } else high = size;
        }
        return Math.max(8, best);
      };

      const sampleText = () => {
        const offscreen = document.createElement('canvas');
        offscreen.width = Math.max(1, Math.floor(width * dpr));
        offscreen.height = Math.max(1, Math.floor(height * dpr));
        const sample = offscreen.getContext('2d', { willReadFrequently: true });
        if (!sample) return;
        sample.scale(dpr, dpr);
        const label = String(config.text || '');
        const maxWidth = width * 0.92;
        const maxHeight = height * 0.92;
        let size = Math.max(8, Number(config.fontSize) || 80);
        if (config.autoFit) size = fitFont(sample, label, maxWidth, maxHeight, size);
        sample.font = `700 ${size}px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
        const metrics = sample.measureText(label);
        const glyphHeight = (metrics.actualBoundingBoxAscent || size * 0.8) + (metrics.actualBoundingBoxDescent || size * 0.2);
        const fit = Math.min(1, maxWidth / Math.max(1, metrics.width), maxHeight / Math.max(1, glyphHeight));
        size = Math.max(8, size * fit);
        sample.clearRect(0, 0, width, height);
        sample.fillStyle = '#f3e7d9';
        sample.font = `700 ${size}px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
        sample.textAlign = 'center';
        sample.textBaseline = 'middle';
        sample.fillText(label, width / 2, height / 2);
        const image = sample.getImageData(0, 0, offscreen.width, offscreen.height);
        const scan = (step) => {
          const found = [];
          for (let y = 0; y < height; y += step) {
            for (let x = 0; x < width; x += step) {
              const alpha = image.data[(Math.floor(y * dpr) * image.width + Math.floor(x * dpr)) * 4 + 3];
              if (alpha > 128) found.push([x, y]);
            }
          }
          return found;
        };
        // The grid is anchored to the stage, not to the letters, so a coarse step
        // can fall entirely between them. Density 1 stepped 150px across a word
        // about that tall and matched nothing at all: the bottom of the slider drew
        // an empty stage, and dragging through it emptied the tool mid-gesture.
        // Halving until the word is actually on the grid makes the minimum sparse
        // instead of absent, and keeps the ramp in order — density 1 lands under
        // the 18 points density 6 gets. Anything above that never enters the loop.
        let stride = Math.max(2, Math.round(150 / clamp(Number(config.particleCount) || 1, 1, 50)));
        let candidates = scan(stride);
        while (!candidates.length && stride > 2) {
          stride = Math.max(2, Math.floor(stride / 2));
          candidates = scan(stride);
           }
        const skip = Math.max(1, Math.ceil(candidates.length / 30000));
        count = Math.ceil(candidates.length / skip);
        originX = new Float32Array(count);
        originY = new Float32Array(count);
        spawnX = new Float32Array(count);
        spawnY = new Float32Array(count);
        positionX = new Float32Array(count);
        positionY = new Float32Array(count);
        repelX = new Float32Array(count);
        repelY = new Float32Array(count);
        colorIndex = new Uint8Array(count);
        for (let index = 0; index < count; index += 1) {
          const [x, y] = candidates[index * skip];
          const angle = Math.random() * Math.PI * 2;
          const radius = Math.max(width, height) * (0.6 + Math.random() * 0.5);
          originX[index] = x;
          originY[index] = y;
          spawnX[index] = width / 2 + Math.cos(angle) * radius;
          spawnY[index] = height / 2 + Math.sin(angle) * radius;
          positionX[index] = spawnX[index];
          positionY[index] = spawnY[index];
          colorIndex[index] = Math.floor(Math.random() * palette.length);
        }
        if (reduced) {
          form = 1;
          target = 1;
        } else if (firstSample) {
          form = 0;
        }
        firstSample = false;
        root.dataset.particleCount = String(count);
      };

      const resize = () => {
        const rect = root.getBoundingClientRect();
        if (rect.width <= 0 || rect.height <= 0) return;
        width = Math.floor(rect.width);
        height = Math.floor(rect.height);
        dpr = clamp(devicePixelRatio || 1, 1, 1.5);
        const pixelWidth = Math.floor(width * dpr);
        const pixelHeight = Math.floor(height * dpr);
        // Assigning to canvas.width clears the canvas whether or not the number
        // changed, so a resize that settles on the same size must not touch it.
        if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
          canvas.width = pixelWidth;
          canvas.height = pixelHeight;
        }
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        sampleText();
      };

      const formIn = () => { target = 1; };
      const formOut = () => { if (!reduced) target = 0; };
      const onMove = (event) => {
        if (!config.mouseEnabled) return;
        const rect = canvas.getBoundingClientRect();
        const x = (event.clientX - rect.left) * (width / Math.max(1, rect.width));
        const y = (event.clientY - rect.top) * (height / Math.max(1, rect.height));
        if (previousX > -9000) mouseSpeed = Math.hypot(x - previousX, y - previousY);
        previousX = x;
        previousY = y;
        pointer.x = x;
        pointer.y = y;
        pointer.active = true;
      };
      const onLeave = () => {
        pointer.x = -99999;
        pointer.y = -99999;
        pointer.active = false;
        previousX = -99999;
        previousY = -99999;
      };
       canvas.addEventListener('pointermove', onMove);
      canvas.addEventListener('pointerleave', onLeave);
      canvas.addEventListener('pointercancel', onLeave);

      let observer = null;
      let sentinel = null;

      function attachTrigger() {
        if (config.mode === 'onHover') {
          // The cursor owns the form from here, so hand it back an unformed field
          // rather than leaving whatever the previous trigger had settled on.
          if (!reduced) target = 0;
          root.addEventListener('pointerenter', formIn);
          root.addEventListener('pointerleave', formOut);
          return;
        }
        sentinel = document.createElement('span');
        sentinel.style.cssText = 'position:absolute;left:0;width:1px;height:1px;pointer-events:none;';
        if (config.position === 'middle') sentinel.style.top = '50%';
        else if (config.position === 'below') sentinel.style.bottom = '0';
        else sentinel.style.top = '0';
        root.append(sentinel);
        observer = new IntersectionObserver(([entry]) => {
          if (entry.isIntersecting) {
            entered = true;
            formIn();
            if (!config.replay) observer?.disconnect();
          } else if (config.replay && entered) {
            entered = false;
            form = 0;
            target = 0;
          }
        });
        observer.observe(sentinel);
        const rect = root.getBoundingClientRect();
        if (rect.right >= 0 && rect.left <= innerWidth && rect.bottom >= 0 && rect.top <= innerHeight) {
          entered = true;
          formIn();
        }
      }

      function detachTrigger() {
        root.removeEventListener('pointerenter', formIn);
        root.removeEventListener('pointerleave', formOut);
        observer?.disconnect();
        observer = null;
        sentinel?.remove();
        sentinel = null;
      }

      attachTrigger();
      let buckets = palette.map(() => []);
      const draw = (now) => {
        const _rect = root.getBoundingClientRect();
        if (document.documentElement.classList.contains('is-scrolling') || _rect.bottom < 0 || _rect.top > innerHeight) {
          frame = requestAnimationFrame(draw);
          return;
        }
        const deltaMs = Math.min(64, Math.max(0, now - lastFrame));
        lastFrame = now;
        if (reduced || durationMs <= 0) form = target;
        else {
          const step = deltaMs / durationMs;
          form += Math.sign(target - form) * Math.min(Math.abs(target - form), step);
        }
        const factor = ease(clamp(form, 0, 1));
        ctx.clearRect(0, 0, width, height);
        const settled = form >= 1;
        const active = settled && config.mouseEnabled && pointer.active;
        const hitSpeed = mouseSpeed;
        mouseSpeed *= 0.88;
        if (active) {
          const follow = Math.max(0.08, 0.3 - hitSpeed * 0.006);
          if (smoothX < -9000) { smoothX = pointer.x; smoothY = pointer.y; }
          else { smoothX += (pointer.x - smoothX) * follow; smoothY += (pointer.y - smoothY) * follow; }
        } else { smoothX = -99999; smoothY = -99999; }
        const radius = Math.max(1, Number(config.mouseRadius) || 0);
        const radiusSq = radius * radius;
        let hits = 0;
        buckets.forEach((bucket) => { bucket.length = 0; });
        for (let index = 0; index < count; index += 1) {
          if (!settled) {
            positionX[index] = spawnX[index] + (originX[index] - spawnX[index]) * factor;
            positionY[index] = spawnY[index] + (originY[index] - spawnY[index]) * factor;
          } else {
            let inZone = false;
            if (active) {
              const dx = originX[index] - smoothX;
              const dy = originY[index] - smoothY;
              const distanceSq = dx * dx + dy * dy;
              if (distanceSq > 0 && distanceSq < radiusSq) {
                const distance = Math.sqrt(distanceSq);
                const nx = dx / distance;
                const ny = dy / distance;
                const falloff = 1 - distance / radius;
                const push = falloff * hitSpeed * Number(config.mouseForce) * 0.05;
                repelX[index] += nx * push;
                repelY[index] += ny * push;
                repelX[index] += (nx * (radius - distance) - repelX[index]) * 0.06;
                repelY[index] += (ny * (radius - distance) - repelY[index]) * 0.06;
                inZone = true;
                hits += 1;
              }
            }
            if (!inZone) { repelX[index] *= 0.97; repelY[index] *= 0.97; }
            positionX[index] = originX[index] + repelX[index];
            positionY[index] = originY[index] + repelY[index];
          }
          buckets[colorIndex[index]].push(index);
        }
        root.dataset.form = form.toFixed(3);
        root.dataset.pointerHits = String(hits);
        ctx.globalAlpha = settled ? 1 : factor;
        const size = Math.max(1, Number(config.particleSize) / 4);
        const half = size / 2;
        buckets.forEach((bucket, color) => {
          if (!bucket.length) return;
          ctx.fillStyle = palette[color];
          bucket.forEach((index) => ctx.fillRect(positionX[index] - half, positionY[index] - half, size, size));
        });
        ctx.globalAlpha = 1;
        frame = requestAnimationFrame(draw);
      };

      resize();
      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(root);
      root.dataset.ready = 'true';
      root.dataset.reducedMotion = String(reduced);
      frame = requestAnimationFrame(draw);

      return {
        update(next) {
          const resampled = SAMPLE_KEYS.some((key) => next[key] !== config[key]);
          const retriggered = TRIGGER_KEYS.some((key) => next[key] !== config[key]);
          const recoloured = String(next.colors) !== String(config.colors);
          Object.assign(config, next);

          ease = easeFor(config.ease);
          durationMs = Math.max(0, Number(config.duration) * 1000);
          // Particle size, pointer reach and force are already read out of the
          // config on every frame, so they need nothing here.

          if (recoloured) {
            palette = readPalette();
            buckets = palette.map(() => []);
            // A shorter palette would leave particles pointing past its end.
            for (let index = 0; index < count; index += 1) colorIndex[index] %= palette.length;
          }
          if (resampled) sampleText();
          if (retriggered) {
            detachTrigger();
            attachTrigger();
          }
        },
        destroy() {
          cancelAnimationFrame(frame);
          resizeObserver.disconnect();
          detachTrigger();
          canvas.removeEventListener('pointermove', onMove);
          canvas.removeEventListener('pointerleave', onLeave);
          canvas.removeEventListener('pointercancel', onLeave);
          canvas.remove();
          delete root.dataset.ready;
        }
      };
    }
     const config = {
      "text": "FIND A PERFECT GIFT",
      "colors": [
        "#f3e7d9",
        "#654f4a",
        "#f3e7d9"
      ],
      "mode": "onEnter",
      "replay": true,
      "position": "above",
      "particleSize": 10,
      "particleCount": 50,
      "mouseEnabled": true,
      "mouseRadius": 50,
      "mouseForce": 30,
      "fontSize": 80,
      "autoFit": false,
      "duration": 0,
      "ease": "linear"
    };
    const viewport = __q('.pdt-viewport');
    buildPixelDrift(gsap, viewport, config);
  }, []);

  return (
    <div ref={root} className="pdt-frame">
      <div className="pdt-viewport" style={{ '--pdt-viewport-width': '100%', '--pdt-viewport-height': '100%', '--pdt-radius': '0px' }} aria-label="Pixel Drift particle text">
        <div className="pdt-stage"></div>
      </div>
    </div>
  );
}