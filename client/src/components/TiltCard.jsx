import { useRef, useCallback } from 'react';

/**
 * TiltCard — 3D perspective tilt effect on mouse move.
 * Uses CSS transforms only (no state, no re-renders on mouse events).
 */
export default function TiltCard({
  children,
  className = '',
  intensity = 12,    // max tilt degrees
  glare     = true,  // show glare layer
  scale     = 1.02,  // hover scale
  as: Tag   = 'div',
}) {
  const cardRef  = useRef(null);
  const glareRef = useRef(null);

  const onMove = useCallback((e) => {
    const card = cardRef.current;
    if (!card) return;

    const rect   = card.getBoundingClientRect();
    const cx     = rect.left + rect.width  / 2;
    const cy     = rect.top  + rect.height / 2;
    const dx     = (e.clientX - cx) / (rect.width  / 2);
    const dy     = (e.clientY - cy) / (rect.height / 2);
    const rotX   = -dy * intensity;
    const rotY   =  dx * intensity;

    card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(${scale},${scale},${scale})`;
    card.style.transition = 'transform 0.08s ease-out';

    if (glare && glareRef.current) {
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);
      glareRef.current.style.opacity = '0.12';
      glareRef.current.style.transform = `rotate(${angle}deg)`;
    }
  }, [intensity, scale, glare]);

  const onLeave = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
    card.style.transition = 'transform 0.5s cubic-bezier(0.22,1,0.36,1)';
    if (glare && glareRef.current) {
      glareRef.current.style.opacity = '0';
    }
  }, [glare]);

  return (
    <Tag
      ref={cardRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`relative ${className}`}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {glare && (
        <div
          ref={glareRef}
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 'inherit',
            background: 'linear-gradient(105deg, rgba(255,255,255,0.15) 0%, transparent 60%)',
            pointerEvents: 'none',
            opacity: 0,
            zIndex: 10,
            transition: 'opacity 0.3s ease',
          }}
        />
      )}
      {children}
    </Tag>
  );
}
