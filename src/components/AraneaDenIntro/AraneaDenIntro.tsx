import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { AraneaDenIntroProps } from './types';
import styles from './AraneaDenIntro.module.css';

/**
 * AraneaDenIntro — High-Cinema Brand Intro (Reference-Driven)
 *
 * - Big, authoritative SVG logo using AD Transparent SVG.svg
 * - ZERO delay at start: anamorphic light sweep begins immediately at t=0
 * - 3-layer optical depth (bloom layer removed — caused CSS box-blur artifact):
 *   1. Base Logo: deep dark crimson sitting quietly in obsidian black
 *   2. Specular Highlight: sharp, polished illuminated crimson with drop-shadow glow
 *   3. Glint Core: delicate specular peak catching the serifs and arcs
 * - Micro-dolly focal drift (scale 0.992 -> 1.015)
 * - Swift, non-delayed cinematic pace (~2.55s total)
 */
export const AraneaDenIntro: React.FC<AraneaDenIntroProps> = ({
  onComplete,
  isReady = true,
  fallbackTimeoutMs = 3500
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const logoStageRef = useRef<HTMLDivElement>(null);
  const highlightLayerRef = useRef<HTMLImageElement>(null);
  const glintLayerRef = useRef<HTMLImageElement>(null);
  const [isExited, setIsExited] = useState(false);

  useEffect(() => {
    if (isExited) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const fallbackTimer = setTimeout(() => {
      if (!isExited) {
        setIsExited(true);
        if (onComplete) onComplete();
      }
    }, fallbackTimeoutMs);

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        // Reduced Motion: Simple, instant fade without kinetic sweeps
        const tlReduced = gsap.timeline({
          onComplete: () => {
            clearTimeout(fallbackTimer);
            setIsExited(true);
            if (onComplete) onComplete();
          }
        });

        tlReduced.set(logoStageRef.current, { opacity: 1 });
        tlReduced.to(logoStageRef.current, { opacity: 0, duration: 0.5, delay: 0.8 });
        tlReduced.to(overlayRef.current, { opacity: 0, duration: 0.5 }, '<');
        return;
      }

      // --- MASTER CINEMATIC TIMELINE (Instant Start, Anamorphic Sweep: ~2.55s) ---
      const tl = gsap.timeline({
        onComplete: () => {
          clearTimeout(fallbackTimer);
          setIsExited(true);
          if (onComplete) onComplete();
        }
      });

      const maskProxy = { progress: 0 };

      const updateMask = (progress: number) => {
        // Anamorphic diagonal beam trajectory
        const pos = -150 + progress * 400;
        const posStr = `${pos}% 0%`;

        if (highlightLayerRef.current) {
          highlightLayerRef.current.style.webkitMaskPosition = posStr;
          highlightLayerRef.current.style.maskPosition = posStr;
        }

        if (glintLayerRef.current) {
          const glintPos = -170 + progress * 440;
          const glintStr = `${glintPos}% 0%`;
          glintLayerRef.current.style.webkitMaskPosition = glintStr;
          glintLayerRef.current.style.maskPosition = glintStr;
        }
      };

      // 0. Initial State: Logo is immediately visible in dark crimson; zero startup delay
      gsap.set(logoStageRef.current, {
        opacity: 1,
        scale: 0.992,
        y: 0
      });

      const opticalLayers = [
        highlightLayerRef.current,
        glintLayerRef.current
      ].filter(Boolean);

      gsap.set(opticalLayers, { opacity: 1 });
      updateMask(0);

      // Micro camera dolly-in during the pass
      tl.to(logoStageRef.current, {
        scale: 1.015,
        duration: 2.1,
        ease: 'power1.out'
      }, 0.0);

      // 1. 0.0s – 1.85s: Anamorphic Light Sweep starts IMMEDIATELY without delay
      tl.to(maskProxy, {
        progress: 1,
        duration: 1.85,
        ease: 'power2.inOut',
        onUpdate: () => updateMask(maskProxy.progress)
      }, 0.0);

      // Settle optical layers cleanly to 0 once sweep clears
      tl.set(opticalLayers, { opacity: 0 }, 1.85);

      // 2. 1.85s – 2.10s: Brief cinematic hold in dark crimson stillness (250ms)

      // 3. 2.10s – 2.55s: Smooth dissolve exit into website (450ms)
      tl.to(logoStageRef.current, {
        opacity: 0,
        scale: 1.02,
        y: -4,
        duration: 0.45,
        ease: 'power2.inOut'
      }, 2.10);

      tl.to(overlayRef.current, {
        opacity: 0,
        duration: 0.45,
        ease: 'power2.inOut'
      }, 2.10);

    }, overlayRef);

    return () => {
      clearTimeout(fallbackTimer);
      ctx.revert();
    };
  }, [isReady, fallbackTimeoutMs, onComplete, isExited]);

  if (isExited) {
    return null;
  }

  return (
    <div
      ref={overlayRef}
      className={styles.introOverlay}
      role="status"
      aria-live="polite"
      aria-label="Aranea Den"
    >
      <div ref={logoStageRef} className={styles.logoStage}>
        {/* Layer 1: Dark base logo (deep dark crimson in obsidian black) */}
        <img
          src="/AD Transparent SVG.svg"
          alt="Aranea Den"
          className={`${styles.logoLayer} ${styles.logoBase}`}
          draggable={false}
        />

        {/* Layer 2: Sharp illuminated highlight (rich crimson illumination) */}
        <img
          ref={highlightLayerRef}
          src="/AD Transparent SVG.svg"
          alt=""
          aria-hidden="true"
          className={`${styles.logoLayer} ${styles.logoHighlight}`}
          draggable={false}
        />

        {/* Layer 3: Specular glint core (gleaming apex reflection) */}
        <img
          ref={glintLayerRef}
          src="/AD Transparent SVG.svg"
          alt=""
          aria-hidden="true"
          className={`${styles.logoLayer} ${styles.logoGlint}`}
          draggable={false}
        />
      </div>
    </div>
  );
};
