import React, { useEffect, useRef, useState } from 'react';
import { useFinePointer, useReduced } from '../lib/hooks';

/**
 * A ring that trails the pointer. The native cursor is never hidden, so this is
 * purely additive. Over elements with data-cursor="Label" it grows and shows that label.
 */
export const CustomCursor: React.FC = () => {
  const fine = useFinePointer();
  const reduced = useReduced();
  const enabled = fine && !reduced;

  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<{ label: string; hover: boolean }>({ label: '', hover: false });

  useEffect(() => {
    if (!enabled) return;
    let raf = 0;
    let x = -100;
    let y = -100;
    let tx = -100;
    let ty = -100;
    let running = false;

    const tick = () => {
      x += (tx - x) * 0.2;
      y += (ty - y) * 0.2;
      if (ref.current) ref.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      if (Math.abs(tx - x) > 0.1 || Math.abs(ty - y) > 0.1) {
        raf = requestAnimationFrame(tick);
      } else {
        running = false;
      }
    };

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      if (!running) {
        running = true;
        raf = requestAnimationFrame(tick);
      }
    };

    const onOver = (e: PointerEvent) => {
      const el = e.target as HTMLElement | null;
      const labelled = el?.closest<HTMLElement>('[data-cursor]');
      const hover = Boolean(el?.closest('a, button, input, textarea, select, summary, [role="button"]'));
      const label = labelled?.dataset.cursor ?? '';
      setState((prev) => (prev.label === label && prev.hover === hover ? prev : { label, hover }));
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerover', onOver, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerover', onOver);
      cancelAnimationFrame(raf);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={ref}
      className={`cursor${state.hover ? ' is-hover' : ''}${state.label ? ' has-label' : ''}`}
      style={{ transform: 'translate3d(-100px, -100px, 0)' }}
      aria-hidden="true"
    >
      <span className="cursor__ring">
        <span className="cursor__label">{state.label}</span>
      </span>
    </div>
  );
};
