import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent, useReducedMotion } from 'framer-motion';
import { heroContent } from '../data/content';

/* ── Scroll-scrubbed construction sequence ─────────────────────────────────
   A decoded image sequence drawn to a canvas, NOT a scrubbed <video>.

   Video was tried first and has to be avoided here: seeking a decoder ~60x a
   second flushes its pipeline on every assignment, and any CSS filter on a
   full-screen video drops it off the hardware-overlay path onto a per-frame
   GPU shader. Together that pinned the GPU hard enough to hang the machine.

   A frame sequence has no decoder in the loop. Showing a frame is one
   drawImage, and — the important part — frames are only redrawn when the
   index actually changes, so most animation ticks cost nothing at all.

   Regenerate the frames from hero.mp4 (see README) if the source changes.  */

// Root-relative paths break once the app is deployed under a sub-path (e.g.
// GitHub Pages' /<repo>/), so route them through Vite's BASE_URL.
const FRAME_DIR = `${import.meta.env.BASE_URL}hero-frames`;
// Completed building — reduced-motion only. Two crops, matching the two frame
// sets: the landscape one cover-fits into a phone band as a meaningless middle
// slice of the facade.
const POSTER = `${import.meta.env.BASE_URL}hero-poster.jpg`;
const POSTER_M = `${import.meta.env.BASE_URL}hero-poster-m.jpg`;

// Holds the opening frame for the first slice of the track so the first
// impression lands before anything moves; the remainder maps linearly. Smaller
// than it once was, because extracting from t=0 gives back the source's full
// 0.75s establishing beat. Set to 0 for a pure linear mapping.
const LEAD_IN = 0.06;

const FOLLOW = 0.18;             // scrub damping: 1 = snap to scroll, lower = heavier
const SETTLE = 0.004;            // seconds — below this the loop parks
const CONCURRENCY = 6;

// Backing-store ceiling. The frames are 1920 wide and the desktop framing is
// baked into them, so there is nothing to gain above this and plenty of fill
// rate to lose.
const MAX_BACKING_WIDTH = 1920;

// Lets the scrims stay light: the type holds its own contrast instead of the
// whole image being darkened to make it readable. Paints on the glyphs only —
// not a filter, so it costs nothing on the compositor.
const TYPE_SHADOW = '0 1px 2px rgba(10,13,15,0.34), 0 2px 26px rgba(10,13,15,0.42)';

const frameUrl = (variant, i) =>
  `${FRAME_DIR}/${variant}/f_${String(i + 1).padStart(3, '0')}.webp`;

/* Cover-fit an image into the canvas. No zoom or shift: the desktop crop is
   baked into the frames at extraction time, so every delivered pixel is used
   rather than being magnified at runtime. */
function drawCover(ctx, img, cw, ch) {
  const s = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
  const w = img.naturalWidth * s;
  const h = img.naturalHeight * s;
  ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
}

/* Nearest frame to `t` in a sorted times array. Frames are sampled densely
   through the transformation and sparsely through the static hold, so the
   lookup is by time rather than by a uniform index. */
function frameAtTime(times, t) {
  let lo = 0;
  let hi = times.length - 1;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (times[mid] <= t) lo = mid; else hi = mid - 1;
  }
  return lo;
}

/* ── Typography ────────────────────────────────────────────────────────────
   Module scope on purpose: defined inside the component, React would remount
   it on every stage change and the crossfade would never run.               */

function HeroType({ stage, textY, supportOpacity, still }) {
  const [line1, line2] = heroContent.heading;

  return (
    <div className="relative lg:absolute lg:inset-0 z-20 h-full flex items-center pointer-events-none">
      <div className="w-full max-w-[1280px] mx-auto px-6 lg:px-10 py-6 lg:py-0">
        <motion.div style={still ? undefined : { y: textY }} className="lg:max-w-[46%]">
          {/* All four labels share one 16px slot; only the active one is lit. */}
          {!still && (
            <div className="relative h-4 mb-5 lg:mb-7 overflow-hidden">
              {heroContent.stages.map((s, i) => (
                <motion.span
                  key={s.label}
                  style={{ textShadow: TYPE_SHADOW }}
                  className="absolute inset-x-0 top-0 block text-[11px] leading-4 font-medium tracking-[0.28em] uppercase text-white/80"
                  initial={false}
                  animate={{ opacity: i === stage ? 1 : 0, y: i === stage ? 0 : 10 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                >
                  {s.label}
                </motion.span>
              ))}
            </div>
          )}

          <h1
            className="font-display uppercase text-white tracking-[-0.015em]"
            style={{ fontSize: 'clamp(40px, 6.6vw, 100px)', lineHeight: 0.92, textShadow: TYPE_SHADOW }}
          >
            {line1}
            <br />
            {line2}
          </h1>

          <motion.p
            style={still ? { textShadow: TYPE_SHADOW } : { opacity: supportOpacity, textShadow: TYPE_SHADOW }}
            className="mt-5 lg:mt-8 max-w-[40ch] text-white/80 text-[15px] sm:text-[16.5px] leading-relaxed"
          >
            {heroContent.support}
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}

/* Legibility scrims.

   Shaped to the type block rather than run across the frame. A left-to-right
   linear scrim cannot win here: the headline spans x 11%-49%, and the opening
   frame's sky behind it measures YAVG 190, so white sits at 1.84:1 — well under
   the 3:1 WCAG floor for large text. Strong enough to fix that as a linear ramp
   means dimming the building too (an earlier pass did exactly that). An ellipse
   centred on the type darkens where the words are and lets the building stay
   bright: ~5-7:1 across the headline, under 0.1 opacity past x 70%. */
// Peak tuned to land ~6:1 across the headline. A 0.70 peak measured 8-11:1,
// which is past AAA and starts reading as a dark blob over the sky.
const TYPE_SCRIM =
  'radial-gradient(52% 60% at 22% 50%, rgba(10,13,15,0.58) 0%, rgba(10,13,15,0.32) 50%, rgba(10,13,15,0) 100%)';

function Scrims() {
  return (
    <>
      {/* No top scrim here: the gradient-fade header carries its own, and the
          two stacked compounded to ~0.76 black across the top of the frame. */}
      <div
        className="absolute inset-0 pointer-events-none hidden lg:block"
        style={{ background: TYPE_SCRIM }}
      />
      {/* Mobile stacks type below the visual, so it only needs the hand-off. */}
      <div
        className="absolute inset-0 pointer-events-none lg:hidden"
        style={{ background: 'linear-gradient(to top, #14181B 0%, rgba(20,24,27,0) 30%)' }}
      />
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */

export default function Hero() {
  const trackRef = useRef(null);
  const canvasRef = useRef(null);
  const framesRef = useRef([]);
  const rafRef = useRef(0);
  const targetRef = useRef(0);   // float frame index the scroll wants
  const currentRef = useRef(0);  // float frame index actually shown (damped)
  const paintedRef = useRef(-1); // last index committed to the canvas

  const [variant, setVariant] = useState(null);
  const [manifest, setManifest] = useState(null);
  const [stage, setStage] = useState(0);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start start', 'end end'],
  });

  /* Pick the frame set once, at mount — not reactive to resize. */
  useEffect(() => {
    if (reduce) return;
    setVariant(window.matchMedia('(max-width: 1023px)').matches ? 'm' : 'd');
  }, [reduce]);

  const paint = useCallback((force = false) => {
    const canvas = canvasRef.current;
    if (!canvas || !manifest) return;

    // Nearest frame at or before the wanted one that has actually arrived.
    const want = frameAtTime(manifest.times, currentRef.current);
    const frames = framesRef.current;
    let idx = -1;
    for (let i = want; i >= 0; i -= 1) if (frames[i]) { idx = i; break; }
    if (idx < 0) {
      for (let i = want + 1; i < manifest.times.length; i += 1) if (frames[i]) { idx = i; break; }
    }
    if (idx < 0) return;
    if (idx === paintedRef.current && !force) return;   // nothing changed — free
    paintedRef.current = idx;

    const ctx = canvas.getContext('2d');
    drawCover(ctx, frames[idx], canvas.width, canvas.height);
  }, [manifest]);

  /* Damped follow toward the scroll target. Parks itself once settled. */
  const tick = useCallback(() => {
    rafRef.current = 0;
    const diff = targetRef.current - currentRef.current;

    if (Math.abs(diff) > SETTLE) {
      currentRef.current += diff * FOLLOW;
      rafRef.current = requestAnimationFrame(tick);
    } else {
      currentRef.current = targetRef.current;
    }
    paint();
  }, [paint]);

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    const clamped = p < 0 ? 0 : p > 1 ? 1 : p;

    // Plain loop rather than findLastIndex, for older Safari.
    let next = 0;
    for (let i = 0; i < heroContent.stages.length; i += 1) {
      if (clamped >= heroContent.stages[i].at) next = i;
    }
    setStage(next);

    if (reduce || !manifest) return;
    const after = clamped <= LEAD_IN ? 0 : (clamped - LEAD_IN) / (1 - LEAD_IN);
    targetRef.current = after * manifest.duration;
    if (!rafRef.current) rafRef.current = requestAnimationFrame(tick);
  });

  /* Sequential, concurrency-limited load. Frame 0 is fetched first and at high
     priority so something paints quickly; later frames fill in behind it and
     the scrub falls back to the nearest loaded frame meanwhile. */
  useEffect(() => {
    if (reduce) return undefined;
    let cancelled = false;
    fetch(`${FRAME_DIR}/manifest.json`)
      .then((r) => r.json())
      .then((m) => { if (!cancelled && Array.isArray(m?.times) && m.times.length) setManifest(m); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [reduce]);

  useEffect(() => {
    if (reduce || !variant || !manifest) return undefined;

    const count = manifest.times.length;
    let cancelled = false;
    let next = 0;
    framesRef.current = new Array(count);
    paintedRef.current = -1;

    const startOne = () => {
      if (cancelled || next >= count) return;
      const i = next;
      next += 1;

      const img = new Image();
      img.decoding = 'async';
      if (i === 0) img.fetchPriority = 'high';
      img.onload = () => {
        if (cancelled) return;
        framesRef.current[i] = img;
        if (i === 0) paint(true);
        startOne();
      };
      img.onerror = () => { if (!cancelled) startOne(); };
      img.src = frameUrl(variant, i);
    };

    for (let k = 0; k < CONCURRENCY; k += 1) startOne();
    return () => { cancelled = true; };
  }, [reduce, variant, manifest, paint]);

  /* Size the backing store to the element, capped so we never fill more pixels
     than the source frames can justify. */
  useEffect(() => {
    if (reduce || !variant) return undefined;
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.min(Math.round(rect.width * dpr), MAX_BACKING_WIDTH);
      const h = Math.round((w * rect.height) / rect.width);
      if (canvas.width === w && canvas.height === h) return;
      canvas.width = w;
      canvas.height = h;
      paint(true);
    };

    resize();
    window.addEventListener('resize', resize, { passive: true });
    return () => window.removeEventListener('resize', resize);
  }, [reduce, variant, paint]);

  /* Stop the loop on unmount. */
  useEffect(() => () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = 0;
  }, []);

  const textY = useTransform(scrollYProgress, [0, 1], [0, -48]);
  const supportOpacity = useTransform(scrollYProgress, [0.26, 0.44], [1, 0]);

  /* Reduced motion — the completed building, held still, no scroll track. */
  if (reduce) {
    return (
      <section id="home" className="relative h-[100svh] bg-ink flex flex-col lg:block" data-nav-theme="dark">
        <div className="relative h-[60%] lg:h-full lg:absolute lg:inset-0 overflow-hidden">
          <picture>
            <source media="(min-width: 1024px)" srcSet={POSTER} />
            <img
              src={POSTER_M}
              alt="A completed Theerthalaya Group residential building"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </picture>
          <Scrims />
        </div>
        <div className="relative flex-1 lg:h-full">
          <HeroType still />
        </div>
      </section>
    );
  }

  return (
    // The track is tall; the stage inside it is one viewport and pins to the top.
    <section id="home" ref={trackRef} className="relative h-[260vh] lg:h-[320vh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden bg-ink flex flex-col lg:block" data-nav-theme="dark">
        {/* Visual — full bleed on desktop, the upper band on mobile so the type
            below it is a composition of its own rather than a crop. */}
        <div className="relative h-[60%] lg:h-full lg:absolute lg:inset-0 overflow-hidden bg-ink">
          <canvas ref={canvasRef} aria-hidden className="absolute inset-0 w-full h-full" />
          <Scrims />
        </div>

        {/* Type — its own panel on mobile, overlaid on the left on desktop. */}
        <div className="relative flex-1 lg:h-full">
          <HeroType stage={stage} textY={textY} supportOpacity={supportOpacity} />
        </div>
      </div>
    </section>
  );
}
