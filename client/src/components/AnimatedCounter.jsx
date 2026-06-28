import { useEffect, useRef, useState } from 'react';

/**
 * AnimatedCounter — counts up to a target number when scrolled into view.
 * Uses IntersectionObserver (no window.scrollY polling).
 */
export default function AnimatedCounter({
  target,
  suffix = '',
  prefix = '',
  duration = 1800,
  decimals = 0,
  className = '',
}) {
  const [value, setValue]   = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;

    const start    = performance.now();
    const startVal = 0;
    const endVal   = target;

    const tick = (now) => {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased    = 1 - Math.pow(1 - progress, 3);
      const current  = startVal + (endVal - startVal) * eased;

      setValue(parseFloat(current.toFixed(decimals)));

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };

    requestAnimationFrame(tick);
  }, [started, target, duration, decimals]);

  return (
    <span ref={ref} className={className}>
      {prefix}{typeof value === 'number' ? value.toLocaleString('en', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) : value}{suffix}
    </span>
  );
}
