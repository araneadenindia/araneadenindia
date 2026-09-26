import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import adLogo from '../../assets/AD Transparent SVG.svg';
import styles from './CurtainOpener.module.css';

interface CurtainOpenerProps {
  onComplete?: () => void;
}

export const CurtainOpener: React.FC<CurtainOpenerProps> = ({ onComplete }) => {
  const [isRendered, setIsRendered] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const seamRef = useRef<HTMLDivElement>(null);
  const sealRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const left = leftRef.current;
    const right = rightRef.current;
    const seam = seamRef.current;
    const seal = sealRef.current;
    if (!left || !right) return;

    // Start fully closed
    gsap.set(left, { xPercent: 0 });
    gsap.set(right, { xPercent: 0 });
    gsap.set([seam, seal], { opacity: 1, scale: 1 });

    const tl = gsap.timeline({
      delay: 0.08,
      onComplete: () => {
        setIsRendered(false);
        onComplete?.();
      },
    });

    // Seam & seal quickly fade as curtains part
    tl.to(
      [seam, seal],
      {
        opacity: 0,
        scale: 0.88,
        duration: 0.35,
        ease: 'power2.in',
      },
      0.08
    );

    // Curtains slide open to reveal homepage
    tl.to(
      left,
      {
        xPercent: -100,
        duration: 1.15,
        ease: 'power3.inOut',
      },
      0.12
    );

    tl.to(
      right,
      {
        xPercent: 100,
        duration: 1.15,
        ease: 'power3.inOut',
      },
      0.12
    );

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  if (!isRendered) return null;

  return (
    <div ref={containerRef} className={styles.curtainContainer} aria-hidden="true">
      <div ref={leftRef} className={styles.curtainLeft}>
        <div className={styles.curtainTexture} />
        <div className={styles.curtainRib} />
      </div>
      <div ref={rightRef} className={styles.curtainRight}>
        <div className={styles.curtainTexture} />
        <div className={styles.curtainRib} />
      </div>
      <div ref={seamRef} className={styles.curtainSeam} />
      <div ref={sealRef} className={styles.curtainSeal}>
        <img src={adLogo} alt="" className={styles.sealLogo} />
      </div>
    </div>
  );
};

export default CurtainOpener;
