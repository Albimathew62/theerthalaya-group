import { motion, useInView, useSpring, useTransform } from 'framer-motion';
import { useRef, useEffect } from 'react';

export default function AnimatedCounter({ value, suffix = '', duration = 2 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const str = String(value);
  const numericValue = parseFloat(str.replace(/[^0-9.]/g, '')) || 0;
  const prefix = str.match(/^[^0-9.]*/)?.[0] || '';
  const hasDecimal = str.includes('.');

  const spring = useSpring(0, { stiffness: 50, damping: 20, duration: duration * 1000 });
  const display = useTransform(spring, (v) =>
    hasDecimal ? v.toFixed(1) : Math.round(v).toLocaleString('en-IN')
  );

  useEffect(() => { if (isInView) spring.set(numericValue); }, [isInView, numericValue, spring]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}<motion.span>{display}</motion.span>{suffix}
    </span>
  );
}
