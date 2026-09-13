import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { companyInfo, navigation } from '../data/content';

// Gradient-fade header: no pill, no border — the bar reads directly on the page
// and a top-down scrim carries legibility.
//
// The scrim has to be theme-aware. A dark gradient is right over the hero and
// the showcase, but would sit as an ugly dark band across the top of the light
// sections, so those get a light gradient and ink type instead. Sections opt in
// by marking themselves data-nav-theme="dark"; the bar tests which one crosses
// its own centre line.
//
// The two gradients are crossfaded by opacity rather than swapped. CSS cannot
// interpolate between two gradient values, so changing `background` would snap;
// opacity transitions cleanly, and both the theme flip and the scrolled state
// ride the same mechanism.
const DARK_SCRIM = 'linear-gradient(to bottom, rgba(10,13,15,0.80) 0%, rgba(10,13,15,0.38) 42%, rgba(10,13,15,0) 100%)';
const LIGHT_SCRIM = 'linear-gradient(to bottom, rgba(245,247,248,0.98) 0%, rgba(245,247,248,0.66) 42%, rgba(245,247,248,0) 100%)';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [onDark, setOnDark] = useState(false);
  const [open, setOpen] = useState(false);
  const navRef = useRef(null);

  useEffect(() => {
    let frame = 0;

    const read = () => {
      frame = 0;
      setIsScrolled(window.scrollY > 40);

      const bar = navRef.current;
      if (!bar) return;
      const r = bar.getBoundingClientRect();
      const probe = r.top + r.height / 2;

      // getBoundingClientRect reflects ancestor transforms, so a scroll-scrubbed
      // element reports its *painted* box — the bar flips only once it has
      // actually grown under the bar.
      const dark = Array.from(document.querySelectorAll('[data-nav-theme="dark"]')).some((el) => {
        const b = el.getBoundingClientRect();
        return b.width > 0 && b.top <= probe && b.bottom >= probe;
      });
      setOnDark(dark);
    };

    const schedule = () => { if (!frame) frame = requestAnimationFrame(read); };

    read();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const depth = isScrolled ? 1 : 0.82;
  const ink = onDark ? 'text-white' : 'text-ink';
  const link = onDark ? 'text-white/75 hover:text-white' : 'text-ink/70 hover:text-ink';
  const rule = onDark ? 'bg-white/45' : 'bg-ink/25';
  const ring = onDark ? 'border-white/40 hover:border-white/80' : 'border-ink/25 hover:border-ink/60';

  return (
    <header className="fixed top-0 inset-x-0 z-50 pointer-events-none">
      {/* The fade itself — sits behind everything, never intercepts a click. */}
      <div aria-hidden className="absolute inset-x-0 top-0 h-[190px]">
        <div
          className="absolute inset-0 transition-opacity duration-500 ease-out"
          style={{ background: DARK_SCRIM, opacity: onDark ? depth : 0 }}
        />
        <div
          className="absolute inset-0 transition-opacity duration-500 ease-out"
          style={{ background: LIGHT_SCRIM, opacity: onDark ? 0 : depth }}
        />
      </div>

      <nav
        ref={navRef}
        className="relative pointer-events-auto max-w-[1720px] mx-auto px-6 lg:px-14 py-5 lg:py-7 flex items-center justify-between"
      >
        {/* Wordmark lockup — name over a ruled GROUP line */}
        <a href="#home" className={`transition-colors duration-500 ${ink}`} aria-label={`${companyInfo.fullName} home`}>
          <span className="block font-display text-[20px] lg:text-[27px] leading-none tracking-[0.2em]">
            {companyInfo.name}
          </span>
          <span className="flex items-center gap-2.5 mt-2" aria-hidden>
            <span className={`h-px flex-1 transition-colors duration-500 ${rule}`} />
            <span className="text-[10px] lg:text-[11.5px] leading-none tracking-[0.34em] opacity-80">GROUP</span>
            <span className={`h-px flex-1 transition-colors duration-500 ${rule}`} />
          </span>
        </a>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-12">
          <ul className="flex items-center gap-11">
            {navigation.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  className={`text-[16.5px] transition-colors duration-500 ${link}`}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="#contact"
            aria-label="Contact Theerthalaya Group"
            className={`group flex items-center justify-center w-[52px] h-[52px] rounded-full border transition-colors duration-500 ${ring} ${ink}`}
          >
            <ArrowUpRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>

        {/* Mobile toggle — negative margin keeps the 44px hit area off the layout */}
        <button
          type="button"
          className={`lg:hidden -m-2.5 p-2.5 flex items-center justify-center transition-colors duration-500 ${ink}`}
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile menu — needs its own solid surface now that there is no pill */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="pointer-events-auto lg:hidden mx-6 rounded-[20px] border p-5"
            style={{
              backdropFilter: 'blur(20px) saturate(150%)',
              WebkitBackdropFilter: 'blur(20px) saturate(150%)',
              background: onDark ? 'rgba(16,20,23,0.88)' : 'rgba(245,247,248,0.94)',
              borderColor: onDark ? 'rgba(255,255,255,0.13)' : 'rgba(20,24,27,0.07)',
              boxShadow: '0 12px 34px rgba(20,24,27,0.12)',
            }}
          >
            <div className="flex flex-col gap-1">
              {navigation.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className={`py-2.5 font-medium transition-colors ${onDark ? 'text-white/80 hover:text-white' : 'text-ink/80 hover:text-ink'}`}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
