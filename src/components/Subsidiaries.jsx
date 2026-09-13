import { useEffect, useRef, useState } from 'react';
import { useScroll, useMotionValueEvent, useReducedMotion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import SectionBadge from './ui/SectionBadge';
import { FadeIn } from './ui/Animations';
import { subsidiaries } from '../data/content';

/* ── Venture showcase ──────────────────────────────────────────────────────
   Scroll-driven tabs: the photograph sits large on the left, the venture names
   run as a list down the right. Scrolling moves through them one at a time —
   the active name grows, opens its description underneath, and pushes the names
   below it down; the image cross-fades to match.

   Positions are computed in JS and written as transforms rather than being left
   to layout. The list items are absolutely positioned, so opening a description
   never reflows its siblings — only that one item's own subtree. Sibling
   positions come from the cumulative-height maths in paint().

   Scroll is not mapped linearly onto the index: each step spends HOLD of its
   range parked on a venture, so it reads as one-at-a-time and the cross-fade
   stays brief rather than sitting at a muddy 50/50 blend.

   One rAF loop, transforms and opacity only. No filters — this page's frame
   budget got burned once already.                                           */

const LEAD = 0.45;
const HOLD = 0.3;        // share of each step parked on a venture (each end)
const ANCHOR = 0.16;     // where the active name sits, as a fraction of list height

/* Row metrics, in px. Collapsed = the name alone; DESC = the block that opens
   under the active one. Fixed rather than measured: the values only need to be
   close enough that nothing overlaps, and measuring 10 rows per frame is not
   worth it. */
const ROW = { desktop: { collapsed: 84, desc: 116 }, mobile: { collapsed: 62, desc: 132 } };

const clamp = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v);
const smoothstep = (x) => { const t = clamp(x, 0, 1); return t * t * (3 - 2 * t); };

/* Linear scroll -> dwelling index. Holds near each whole number, then moves. */
function dwell(raw) {
  const i = Math.floor(raw);
  const f = raw - i;
  return i + smoothstep((f - HOLD) / (1 - 2 * HOLD));
}

export default function Subsidiaries() {
  const trackRef = useRef(null);
  const listRef = useRef(null);
  const rowRefs = useRef([]);
  const descRefs = useRef([]);
  const nameRefs = useRef([]);
  const panelRefs = useRef([]);
  const imgRefs = useRef([]);
  const rafRef = useRef(0);
  const tRef = useRef(0);
  const metricRef = useRef(ROW.desktop);

  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const total = subsidiaries.length;

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start start', 'end end'],
  });

  useEffect(() => {
    if (reduce) return undefined;
    const measure = () => {
      metricRef.current = window.matchMedia('(min-width: 1024px)').matches
        ? ROW.desktop : ROW.mobile;
      paint();
    };
    measure();
    window.addEventListener('resize', measure, { passive: true });
    return () => window.removeEventListener('resize', measure);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce]);

  const paint = () => {
    const list = listRef.current;
    if (!list) return;
    const { collapsed, desc } = metricRef.current;
    const t = tRef.current;

    // How open each row is: 1 when it is the active venture, 0 once the
    // neighbour has taken over.
    const open = [];
    for (let i = 0; i < total; i += 1) open[i] = clamp(1 - Math.abs(i - t), 0, 1);

    // Cumulative tops. Rows above the active one are closed, so the rows below
    // it shift by exactly one description height — no jitter as t moves.
    const tops = [];
    let y = 0;
    for (let i = 0; i < total; i += 1) {
      tops[i] = y;
      y += collapsed + desc * open[i];
    }

    // Slide the list so the active row sits at the anchor, interpolating
    // between whole rows so the travel is smooth rather than stepped.
    const k = clamp(Math.floor(t), 0, total - 1);
    const f = clamp(t - k, 0, 1);
    const anchorTop = tops[k] + (k + 1 < total ? (tops[k + 1] - tops[k]) * f : 0);
    const shift = ANCHOR * list.getBoundingClientRect().height - anchorTop;

    for (let i = 0; i < total; i += 1) {
      const row = rowRefs.current[i];
      if (!row) continue;
      const o = open[i];

      row.style.transform = `translate3d(0, ${(tops[i] + shift).toFixed(1)}px, 0)`;
      row.style.opacity = (0.4 + 0.6 * Math.max(o, 1 - Math.min(Math.abs(i - t), 1))).toFixed(3);

      const d = descRefs.current[i];
      if (d) {
        d.style.height = `${(desc * o).toFixed(1)}px`;
        d.style.opacity = smoothstep(o * 1.4).toFixed(3);
      }
      const n = nameRefs.current[i];
      if (n) n.style.transform = `scale(${(1 + 0.16 * o).toFixed(4)})`;

      const p = panelRefs.current[i];
      if (p) p.style.opacity = smoothstep(o).toFixed(3);

      const im = imgRefs.current[i];
      if (im) im.style.opacity = smoothstep(clamp((o - 0.18) / 0.82, 0, 1)).toFixed(3);
    }
  };

  const tick = () => {
    rafRef.current = 0;
    paint();
  };

  useMotionValueEvent(scrollYProgress, 'change', (prog) => {
    const clamped = clamp(prog, 0, 1);
    tRef.current = clamp(dwell(-LEAD + clamped * (total - 1 + 2 * LEAD)), 0, total - 1);
    setActive(clamp(Math.round(tRef.current), 0, total - 1));
    if (reduce) return;
    if (!rafRef.current) rafRef.current = requestAnimationFrame(tick);
  });

  useEffect(() => () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = 0;
  }, []);

  /* Reduced motion — the same ten ventures as a plain grid, no pinning. */
  if (reduce) {
    return (
      <section id="companies" className="py-24 lg:py-32 bg-paper">
        <div className="max-w-[1180px] mx-auto px-6 lg:px-10">
          <SectionBadge className="mb-4 block">Our ventures</SectionBadge>
          <h2 className="font-display leading-[0.95] tracking-tight mb-12" style={{ fontSize: 'clamp(38px,6.5vw,84px)' }}>
            Ten ventures,<br /><span className="text-slate">one vision.</span>
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {subsidiaries.map((v) => (
              <article key={v.id} className="rounded-[20px] border border-line overflow-hidden bg-white">
                <img src={v.image} alt={`${v.name}, ${v.category}`} loading="lazy" className="w-full aspect-[5/4] object-cover" />
                <div className="p-6">
                  <div className="text-[11px] tracking-[0.2em] uppercase text-slate font-medium mb-2">{v.category}</div>
                  <h3 className="font-display text-[22px] tracking-tight mb-2">{v.name}</h3>
                  <p className="text-muted text-[14px] leading-relaxed">{v.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="companies" ref={trackRef} className="relative h-[460vh] lg:h-[620vh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden bg-paper flex flex-col">

        {/* Heading */}
        <div className="shrink-0 max-w-[1600px] w-full mx-auto px-6 lg:px-14 pt-28 lg:pt-36 pb-4 lg:pb-8">
          <FadeIn>
            <div className="flex items-end justify-between gap-8">
              <div>
                <SectionBadge className="mb-2.5 block">Our ventures</SectionBadge>
                <h2 className="font-display leading-[0.94] tracking-tight" style={{ fontSize: 'clamp(26px,3.2vw,46px)' }}>
                  Ten ventures, <span className="text-slate">one vision.</span>
                </h2>
              </div>
              <div className="hidden sm:block font-display text-[15px] tracking-tight text-ink/45 pb-1">
                {String(active + 1).padStart(2, '0')}
                <span className="text-ink/25"> / {String(total).padStart(2, '0')}</span>
              </div>
            </div>
          </FadeIn>
        </div>

        <div className="flex-1 min-h-0 max-w-[1600px] w-full mx-auto px-6 lg:px-14 pb-8 lg:pb-12
                        flex flex-col lg:flex-row gap-6 lg:gap-14">

          {/* Image — left */}
          {/* Sources are 5:4. On mobile the box matches exactly, so nothing is
              cropped; on desktop the slot's aspect varies with viewport height
              (roughly 1.01 to 1.43), which is why 5:4 sits mid-range. */}
          <div className="relative lg:flex-[1.15] shrink-0 rounded-[20px] lg:rounded-[26px] overflow-hidden bg-ink
                          aspect-[5/4] lg:aspect-auto lg:h-full">
            {subsidiaries.map((s, i) => (
              <img
                key={s.id}
                ref={(el) => { imgRefs.current[i] = el; }}
                src={s.image}
                alt={`${s.name}, ${s.category}`}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover"
                style={{ opacity: i === 0 ? 1 : 0, willChange: 'opacity' }}
              />
            ))}
          </div>

          {/* Names — right */}
          <div ref={listRef} className="relative lg:flex-1 min-h-0 overflow-hidden">
            {subsidiaries.map((s, i) => (
              <div
                key={s.id}
                ref={(el) => { rowRefs.current[i] = el; }}
                className="absolute inset-x-0 top-0"
                style={{ willChange: 'transform, opacity' }}
              >
                {/* Panel behind the active row, as in the reference */}
                <div
                  ref={(el) => { panelRefs.current[i] = el; }}
                  aria-hidden
                  className="absolute -inset-x-4 -top-3 bottom-0 rounded-[18px] bg-white shadow-glass-sm"
                  style={{ opacity: 0 }}
                />

                <div className="relative pr-2">
                  <h3
                    ref={(el) => { nameRefs.current[i] = el; }}
                    className="font-display tracking-tight text-ink origin-left"
                    style={{ fontSize: 'clamp(20px,1.7vw,27px)', willChange: 'transform' }}
                  >
                    {s.name}
                    {s.shortName && (
                      <span className="ml-2 align-middle font-sans text-[12px] tracking-normal text-muted">
                        ({s.shortName})
                      </span>
                    )}
                  </h3>

                  <div
                    ref={(el) => { descRefs.current[i] = el; }}
                    className="overflow-hidden"
                    style={{ height: 0, opacity: 0 }}
                  >
                    <div className="pt-3 pb-1">
                      <div className="text-[10px] tracking-[0.24em] uppercase text-slate font-medium mb-2">
                        {s.category}
                      </div>
                      <p className="text-muted text-[13.5px] lg:text-[14.5px] leading-relaxed max-w-[46ch]">
                        {s.description}
                      </p>
                      {s.locations?.length > 0 && (
                        <p className="mt-2.5 inline-flex items-start gap-1.5 text-[12px] text-ink/55">
                          <MapPin className="w-3.5 h-3.5 mt-[2px] flex-shrink-0 text-slate" aria-hidden />
                          {s.locations.join(' · ')}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Progress rail */}
        <div className="shrink-0 max-w-[1600px] w-full mx-auto px-6 lg:px-14 pb-6 lg:pb-8">
          <div className="h-px w-full bg-ink/10 relative overflow-hidden">
            <span
              className="absolute inset-y-0 left-0 bg-slate transition-[width] duration-200 ease-out"
              style={{ width: `${((active + 1) / total) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
