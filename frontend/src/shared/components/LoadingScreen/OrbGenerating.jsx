import { useLayoutEffect, useRef } from 'react';

const CSS = String.raw`
/* The orb's stage is transparent so it inherits whatever sits behind it.
   A standalone file has nothing behind it, and a browser's white default
   would hide the white label, so the export supplies the dark canvas. */

.og-export-host{width:100%;height}
.og-root{display:contents}
.og-frame{display:grid;place-items:center;width:100%;height:100%;overflow:hidden;background:var(--og-stage)}
.og-loader{position:relative;display:flex;align-items:center;justify-content:center;width:var(--og-size);height:var(--og-size);font-family:'Inter',system-ui,-apple-system,'Segoe UI',sans-serif;font-size:calc(var(--og-text-size) * var(--og-unit) * 16px);font-weight:300;letter-spacing:var(--og-tracking);color:var(--og-text);border-radius:50%;background-color:transparent;user-select:none}
.og-word{position:relative;z-index:1;display:inline-flex;align-items:center;justify-content:center;white-space:nowrap}
.og-orb{position:absolute;top:0;left:0;z-index:0;width:100%;aspect-ratio:1/1;border-radius:50%;background-color:transparent;transform:rotate(90deg);box-shadow:0 calc(10px * var(--og-unit) * var(--og-depth)) calc(20px * var(--og-unit) * var(--og-depth)) 0 var(--og-highlight) inset,0 calc(20px * var(--og-unit) * var(--og-depth)) calc(30px * var(--og-unit) * var(--og-depth)) 0 var(--og-halo) inset,0 calc(60px * var(--og-unit) * var(--og-depth)) calc(60px * var(--og-unit) * var(--og-depth)) 0 var(--og-core) inset;animation:og-rotate var(--og-duration) linear infinite}
.og-letter{display:inline-block;opacity:var(--og-rest);transform:translateY(0);animation:og-letter var(--og-duration) infinite;animation-delay:calc(var(--i) * var(--og-stagger))}
.og-loader[data-playback='pause'] .og-orb,.og-loader[data-playback='pause'] .og-letter{animation-play-state:paused}
@keyframes og-rotate{
0%{transform:rotate(90deg);box-shadow:0 calc(10px * var(--og-unit) * var(--og-depth)) calc(20px * var(--og-unit) * var(--og-depth)) 0 var(--og-highlight) inset,0 calc(20px * var(--og-unit) * var(--og-depth)) calc(30px * var(--og-unit) * var(--og-depth)) 0 var(--og-halo) inset,0 calc(60px * var(--og-unit) * var(--og-depth)) calc(60px * var(--og-unit) * var(--og-depth)) 0 var(--og-core) inset}
50%{transform:rotate(270deg);box-shadow:0 calc(10px * var(--og-unit) * var(--og-depth)) calc(20px * var(--og-unit) * var(--og-depth)) 0 var(--og-highlight) inset,0 calc(20px * var(--og-unit) * var(--og-depth)) calc(10px * var(--og-unit) * var(--og-depth)) 0 var(--og-halo-alt) inset,0 calc(40px * var(--og-unit) * var(--og-depth)) calc(60px * var(--og-unit) * var(--og-depth)) 0 var(--og-core-alt) inset}
100%{transform:rotate(450deg);box-shadow:0 calc(10px * var(--og-unit) * var(--og-depth)) calc(20px * var(--og-unit) * var(--og-depth)) 0 var(--og-highlight) inset,0 calc(20px * var(--og-unit) * var(--og-depth)) calc(30px * var(--og-unit) * var(--og-depth)) 0 var(--og-halo) inset,0 calc(60px * var(--og-unit) * var(--og-depth)) calc(60px * var(--og-unit) * var(--og-depth)) 0 var(--og-core) inset}
}
@keyframes og-letter{
0%,100%{opacity:var(--og-rest);transform:translateY(0)}
20%{opacity:1;transform:scale(var(--og-pop))}
40%{opacity:calc(var(--og-rest) + (1 - var(--og-rest)) * .5);transform:translateY(0)}
}
@media(prefers-reduced-motion:reduce){.og-orb,.og-letter{animation:none}.og-letter{opacity:1}}
`;

export const OrbGenerating = () => {
  const root = useRef(null);

  useLayoutEffect(() => {
    if (!document.querySelector('style[data-orb-generating]')) {
      const tag = document.createElement('style');
      tag.setAttribute('data-orb-generating', '');
      tag.textContent = CSS;
      document.head.append(tag);
    }
    const node = root.current;
    const __q = (sel) => (node.matches(sel) ? node : node.querySelector(sel));

  }, []);

  return (
    <div ref={root} className="og-export-host">
      <div className="og-frame" style={{ '--og-stage': '#fbf7f3', '--og-size': '196px', '--og-unit': '1.0888888888888888', '--og-depth': '1', '--og-highlight': '#ffffff', '--og-halo': '#653f49', '--og-core': '#653f49', '--og-halo-alt': '#f4e8ea', '--og-core-alt': '#7a4e59', '--og-text': '#2f2a2c', '--og-text-size': '1.2', '--og-tracking': '0px', '--og-rest': '0.4', '--og-duration': '2000ms', '--og-stagger': '100ms', '--og-pop': '1.15' }}>
        <div className="og-loader" role="status" aria-live="polite" aria-label="Generating" data-playback="play">
          <span className="og-word">
            <span className="og-letter" style={{ '--i': '0' }} aria-hidden="true">
              G
            </span>
            <span className="og-letter" style={{ '--i': '1' }} aria-hidden="true">
              e
            </span>
            <span className="og-letter" style={{ '--i': '2' }} aria-hidden="true">
              n
            </span>
            <span className="og-letter" style={{ '--i': '3' }} aria-hidden="true">
              e
            </span>
            <span className="og-letter" style={{ '--i': '4' }} aria-hidden="true">
              r
            </span>
            <span className="og-letter" style={{ '--i': '5' }} aria-hidden="true">
              a
            </span>
            <span className="og-letter" style={{ '--i': '6' }} aria-hidden="true">
              t
            </span>
            <span className="og-letter" style={{ '--i': '7' }} aria-hidden="true">
              i
            </span>
            <span className="og-letter" style={{ '--i': '8' }} aria-hidden="true">
              n
            </span>
            <span className="og-letter" style={{ '--i': '9' }} aria-hidden="true">
              g
            </span>
          </span>
          <span className="og-orb" aria-hidden="true"></span>
        </div>
      </div>
    </div>
  );
}
