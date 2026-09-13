import { motion } from 'framer-motion';
import { useInView, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';

export function FadeIn({ children, delay = 0, direction = 'up', className = '' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  const directions = {
    up: { y: 40, x: 0 },
    down: { y: -40, x: 0 },
    left: { y: 0, x: 40 },
    right: { y: 0, x: -40 },
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...directions[direction] }}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, ...directions[direction] }}
      transition={{ duration: 0.6, delay, ease: [0.4, 0, 0.2, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerContainer({ children, className = '', staggerDelay = 0.1 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: 0.1
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className = '' }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function ScaleOnHover({ children, className = '' }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ── Scroll-driven primitives ─────────────────────────────────────────── */

// A single word in a RevealText line — brightens + lifts as the line scrolls in.
function RevealWord({ progress, range, accent, children }) {
  const opacity = useTransform(progress, range, [0.16, 1]);
  const y = useTransform(progress, range, [8, 0]);
  return (
    <motion.span style={{ opacity, y }} className="inline-block will-change-[opacity,transform]">
      {accent ? <span className="italic text-slate font-medium">{children}</span> : children}
    </motion.span>
  );
}

/**
 * Scroll-scrubbed text reveal. Words brighten one after another as the block
 * passes through the viewport. Wrap an accent word in {curly braces} to set it
 * in the slate accent. Respects prefers-reduced-motion.
 */
export function RevealText({ text, className = '', style }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'start 0.3'] });
  const words = text.split(' ');

  if (reduce) {
    return <p ref={ref} className={className} style={style}>{text.replace(/[{}]/g, '')}</p>;
  }

  return (
    <p ref={ref} className={className} style={style}>
      {words.map((w, i) => {
        const accent = w.startsWith('{') || w.endsWith('}');
        const clean = w.replace(/[{}]/g, '');
        const start = i / words.length;
        const end = Math.min(1, start + 2 / words.length);
        return (
          <span key={i}>
            <RevealWord progress={scrollYProgress} range={[start, end]} accent={accent}>{clean}</RevealWord>{' '}
          </span>
        );
      })}
    </p>
  );
}

/** Translate children vertically as the element scrolls through the viewport. */
export function Parallax({ children, className = '', distance = 80, style }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance]);
  return (
    <motion.div ref={ref} style={reduce ? style : { ...style, y }} className={className}>
      {children}
    </motion.div>
  );
}

/**
 * Image with an internal parallax drift. The <img> is scaled up and overflows a
 * clipped container, so the drift never reveals an edge. Reduced-motion safe.
 */
export function ParallaxImage({ src, alt = '', className = '', rounded = 'rounded-2xl', distance = 50, style, children }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [-distance, distance]);
  return (
    <div ref={ref} style={style} className={`relative overflow-hidden ${rounded} ${className}`}>
      <motion.img
        src={src} alt={alt} loading="lazy"
        style={reduce ? undefined : { y }}
        className="absolute inset-0 w-full h-full object-cover scale-[1.18] will-change-transform"
      />
      {children}
    </div>
  );
}

/**
 * Infinite horizontal marquee of words. Duplicated track for a seamless loop;
 * frozen under prefers-reduced-motion (handled in CSS via .marquee-track).
 */
export function Marquee({ items = [], className = '', sep = '·', speed = 32 }) {
  const run = (
    <span className="inline-flex items-center">
      {items.map((w, i) => (
        <span key={i} className="inline-flex items-center">
          <span className="px-[0.35em]">{w}</span>
          <span className="opacity-40">{sep}</span>
        </span>
      ))}
    </span>
  );
  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`}>
      <div className="marquee-track inline-flex" style={{ animationDuration: `${speed}s` }}>
        {run}{run}
      </div>
    </div>
  );
}

/**
 * Scroll-scrubbed zoom: the child scales up from `from`→`to` as the section
 * passes through view, while pinned in the centre. Reduced-motion → static full size.
 * Pass a tall `minHeight` (e.g. '220vh') so there's scroll distance to scrub.
 */
export function ScrollZoom({ children, behind = null, className = '', from = 0.42, to = 1, minHeight = '220vh' }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const scale = useTransform(scrollYProgress, [0, 0.82, 1], [from, to, to]);
  const radius = useTransform(scrollYProgress, [0, 0.82], [28, 0]);
  return (
    <div ref={ref} className={`relative ${className}`} style={{ minHeight }}>
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        {behind && <div className="absolute inset-0 flex items-center pointer-events-none select-none">{behind}</div>}
        <motion.div
          style={reduce ? undefined : { scale, borderRadius: radius, transformOrigin: 'center center' }}
          className="relative z-10 will-change-transform overflow-hidden"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
