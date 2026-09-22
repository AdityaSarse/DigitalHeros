import React, { useState, useEffect, useRef } from 'react';

const CountUp = ({
  end = 0,
  duration = 1800,
  prefix = '',
  suffix = '',
  decimals = 0,
  className = '',
}) => {
  const [value, setValue] = useState(0);
  const elementRef = useRef(null);
  const startedRef = useRef(false);

  useEffect(() => {
    // Check reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setValue(end);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !startedRef.current) {
          startedRef.current = true;
          let startTime = null;

          const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            // Ease out cubic
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = easeOut * end;
            setValue(current);

            if (progress < 1) {
              requestAnimationFrame(step);
            } else {
              setValue(end);
            }
          };

          requestAnimationFrame(step);
        }
      },
      { threshold: 0.2 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [end, duration]);

  const formatted = decimals > 0 ? value.toFixed(decimals) : Math.floor(value);

  return (
    <span ref={elementRef} className={`tabular-nums ${className}`}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
};

export default CountUp;
