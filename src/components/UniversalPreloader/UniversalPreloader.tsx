import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import styles from './UniversalPreloader.module.css';

export interface UniversalPreloaderProps {
  /** Mode: 'initial' for first site load; 'route' for page transitions; 'ascend' for warp-to-top */
  mode?: 'initial' | 'route' | 'ascend';
  /** Whether the preloader is actively rendering */
  isActive: boolean;
  /** Callback invoked when the preloader animation finishes and page is ready */
  onComplete?: () => void;
}

export const UniversalPreloader: React.FC<UniversalPreloaderProps> = ({
  mode = 'initial',
  isActive,
  onComplete,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const brandStageRef = useRef<HTMLDivElement>(null);
  const ambientGlowRef = useRef<HTMLDivElement>(null);
  const highlightSweepRef = useRef<HTMLDivElement>(null);
  const glintSweepRef = useRef<HTMLDivElement>(null);

  // Keep latest onComplete reference without causing effect re-triggers
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Ensure initial intro only plays once per session
  const hasPlayedInitialRef = useRef(false);

  useEffect(() => {
    if (!isActive) return;

    // If initial mode has already completed once, trigger callback immediately and exit
    if (mode === 'initial' && hasPlayedInitialRef.current) {
      if (onCompleteRef.current) {
        onCompleteRef.current();
      }
      return;
    }

    const canvas = canvasRef.current;
    const overlay = overlayRef.current;
    const brandStage = brandStageRef.current;
    const ambientGlow = ambientGlowRef.current;
    if (!canvas || !overlay) return;

    let animationFrameId: number;
    let isRendering = true;
    const width = window.innerWidth;
    const height = window.innerHeight;
    const isMobile = width <= 768;

    // ── 1. THREE.JS 3D SPIDER WEB SCENE (Optimized GPU Pipeline) ──
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.z = 7.0;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: false,
        powerPreference: 'high-performance',
        stencil: false,
        depth: false,
      });
    } catch (err) {
      console.warn('Three.js WebGLRenderer could not be initialized:', err);
      // Gracefully finish if WebGL fails on older devices
      if (onCompleteRef.current) {
        onCompleteRef.current();
      }
      return;
    }

    renderer.setSize(width, height);
    // Mobile optimization: clamp DPR to 1.0 to eliminate fill-rate stutter; desktop up to 1.25
    renderer.setPixelRatio(isMobile ? 1.0 : Math.min(window.devicePixelRatio || 1, 1.25));

    // Master Web Group
    const webGroup = new THREE.Group();
    scene.add(webGroup);

    const spokeCount = 24;
    const ringCount = 14;
    const maxWebRadius = 11.5;
    const innerRadius = 0.85;

    // A. Radial Spokes
    const spokePositions: number[] = [];
    for (let i = 0; i < spokeCount; i++) {
      const angle = (i / spokeCount) * Math.PI * 2;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const zOuter = -0.6 + Math.sin(i * 1.8) * 0.22;

      spokePositions.push(cos * innerRadius, sin * innerRadius, 0.0);
      spokePositions.push(cos * maxWebRadius, sin * maxWebRadius, zOuter);
    }

    const spokeGeo = new THREE.BufferGeometry();
    spokeGeo.setAttribute('position', new THREE.Float32BufferAttribute(spokePositions, 3));
    const spokeMat = new THREE.LineBasicMaterial({
      color: 0xdf2531,
      transparent: true,
      opacity: 0.38,
    });
    const spokeLines = new THREE.LineSegments(spokeGeo, spokeMat);
    webGroup.add(spokeLines);

    // B. Concentric Spiral Polygon Strands
    const spiralPositions: number[] = [];
    for (let r = 1; r <= ringCount; r++) {
      const ratio = r / ringCount;
      const baseR = innerRadius + Math.pow(ratio, 1.15) * (maxWebRadius - innerRadius);

      for (let i = 0; i < spokeCount; i++) {
        const a1 = (i / spokeCount) * Math.PI * 2;
        const a2 = ((i + 1) / spokeCount) * Math.PI * 2;
        const zDepth = -0.05 - Math.pow(ratio, 1.4) * 0.48;

        const x1 = Math.cos(a1) * baseR;
        const y1 = Math.sin(a1) * baseR;
        const x2 = Math.cos(a2) * baseR;
        const y2 = Math.sin(a2) * baseR;

        // Natural catenary sag between spokes
        const midA = (a1 + a2) / 2;
        const sagR = baseR * 0.945;
        const xMid = Math.cos(midA) * sagR;
        const yMid = Math.sin(midA) * sagR;

        spiralPositions.push(x1, y1, zDepth);
        spiralPositions.push(xMid, yMid, zDepth + 0.02);
        spiralPositions.push(xMid, yMid, zDepth + 0.02);
        spiralPositions.push(x2, y2, zDepth);
      }
    }

    const spiralGeo = new THREE.BufferGeometry();
    spiralGeo.setAttribute('position', new THREE.Float32BufferAttribute(spiralPositions, 3));
    const spiralMat = new THREE.LineBasicMaterial({
      color: 0xdf2531,
      transparent: true,
      opacity: 0.28,
    });
    const spiralLines = new THREE.LineSegments(spiralGeo, spiralMat);
    webGroup.add(spiralLines);

    // C. Glowing Intersection Nodes
    const nodePositions: number[] = [];
    for (let r = 1; r <= ringCount; r++) {
      const ratio = r / ringCount;
      const baseR = innerRadius + Math.pow(ratio, 1.15) * (maxWebRadius - innerRadius);
      const zDepth = -0.05 - Math.pow(ratio, 1.4) * 0.48;

      for (let i = 0; i < spokeCount; i++) {
        const angle = (i / spokeCount) * Math.PI * 2;
        nodePositions.push(Math.cos(angle) * baseR, Math.sin(angle) * baseR, zDepth);
      }
    }

    const nodeGeo = new THREE.BufferGeometry();
    nodeGeo.setAttribute('position', new THREE.Float32BufferAttribute(nodePositions, 3));
    const nodeMat = new THREE.PointsMaterial({
      color: 0xff4d58,
      size: 0.05,
      transparent: true,
      opacity: 0.7,
    });
    const webNodes = new THREE.Points(nodeGeo, nodeMat);
    webGroup.add(webNodes);

    // ── 2. RENDER LOOP (Runs continuously until overlay completely exits) ──
    const animate = () => {
      if (!isRendering) return;
      animationFrameId = requestAnimationFrame(animate);
      webGroup.rotation.z += 0.0014;
      renderer.render(scene, camera);
    };
    animate();

    // ── 3. MASTER GSAP CINEMATIC ORCHESTRATION ──
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          isRendering = false;
          if (mode === 'initial') {
            hasPlayedInitialRef.current = true;
          }
          if (onCompleteRef.current) {
            onCompleteRef.current();
          }
        },
      });

      if (prefersReducedMotion) {
        tl.to(overlay, { opacity: 0, duration: 0.4, delay: 0.3 });
        return;
      }

      if (mode === 'initial') {
        // ── FULL CINEMATIC INITIAL INTRO (~2.75s) ──
        // Ensure starting states match CSS to eliminate initial jumps or flashes
        if (brandStage) {
          gsap.set(brandStage, {
            xPercent: -50,
            yPercent: -50,
            scale: 0.45,
            opacity: 0,
          });
        }
        gsap.set(canvas, { opacity: 0 });
        if (ambientGlow) {
          gsap.set(ambientGlow, { opacity: 0 });
        }
        webGroup.scale.set(0.45, 0.45, 0.45);

        // 1. 3D Web weaves and expands outward from center (~1.8s)
        tl.to(
          webGroup.scale,
          {
            x: 1.0,
            y: 1.0,
            z: 1.0,
            duration: 1.8,
            ease: 'power3.out',
          },
          0.0
        );

        // Smoothly fade in canvas & ambient glow (prevents abrupt web/background pop-in)
        tl.to(
          canvas,
          {
            opacity: 1,
            duration: 0.9,
            ease: 'power2.out',
          },
          0.0
        );

        if (ambientGlow) {
          tl.to(
            ambientGlow,
            {
              opacity: 1,
              duration: 1.0,
              ease: 'power2.out',
            },
            0.0
          );
        }

        // 2. Brandmark zooms in smoothly from depth with silky fade-in (~1.55s)
        if (brandStage) {
          tl.to(
            brandStage,
            {
              scale: 1.0,
              opacity: 1,
              duration: 1.55,
              ease: 'power3.out',
            },
            0.08
          );
        }

        // 3. Synchronized Anamorphic Light Ray Sweeps majestically across the FULL logo face
        // Travels steadily from off-screen left (-105%) across Spider Arc -> ARANEA -> DEN -> off-screen right (+185%)
        const sweepTargets = [highlightSweepRef.current, glintSweepRef.current].filter(Boolean);
        if (sweepTargets.length > 0) {
          gsap.set(sweepTargets, { xPercent: -105, rotation: 20, transformOrigin: '50% 50%' });
          tl.to(
            sweepTargets,
            { xPercent: 185, duration: 1.55, ease: 'sine.inOut' },
            0.55
          );
        }

        // 4. Brief cinematic hold in rich dark crimson stillness (~100ms)

        // 5. Complete Preloader Silky Dissolve Exit (~0.5s) at 2.25s
        // Keeps complete preloader everywhere intact until the unified exit
        if (brandStage) {
          tl.to(
            brandStage,
            {
              scale: 1.03,
              opacity: 0,
              duration: 0.5,
              ease: 'power2.inOut',
            },
            2.25
          );
        }

        tl.to(
          overlay,
          {
            opacity: 0,
            duration: 0.5,
            ease: 'power2.inOut',
          },
          2.25
        );
      } else if (mode === 'ascend') {
        // ── WARP TO TOP / ELEVATION MODE (~1.85s) ──
        if (brandStage) {
          gsap.set(brandStage, {
            xPercent: -50,
            yPercent: -50,
            scale: 0.75,
            y: 20,
            opacity: 0,
          });

          tl.to(
            brandStage,
            {
              y: 0,
              scale: 1.0,
              opacity: 1,
              duration: 0.7,
              ease: 'power3.out',
            },
            0.0
          );
        }

        gsap.set(canvas, { opacity: 0 });
        if (ambientGlow) gsap.set(ambientGlow, { opacity: 0 });
        tl.to([canvas, ambientGlow].filter(Boolean), { opacity: 1, duration: 0.6, ease: 'power2.out' }, 0.0);

        const sweepTargets = [highlightSweepRef.current, glintSweepRef.current].filter(Boolean);
        if (sweepTargets.length > 0) {
          gsap.set(sweepTargets, { xPercent: -105, rotation: 20, transformOrigin: '50% 50%' });
          tl.to(
            sweepTargets,
            { xPercent: 185, duration: 1.15, ease: 'sine.inOut' },
            0.3
          );
        }

        // Instant scroll reset behind the preloader
        tl.add(() => {
          if ((window as any).lenis) {
            (window as any).lenis.scrollTo(0, { immediate: true });
          }
          window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
        }, 0.35);

        if (brandStage) {
          tl.to(brandStage, { scale: 1.02, opacity: 0, duration: 0.4, ease: 'power2.inOut' }, 1.45);
        }

        tl.to(
          overlay,
          {
            opacity: 0,
            duration: 0.4,
            ease: 'power2.inOut',
          },
          1.45
        );
      } else {
        // ── ROUTE NAVIGATION MODE (~2.15s) ──
        // Keep complete preloader everywhere intact, with smooth cinematic pacing
        // Only slightly faster than initial (~2.15s vs 2.75s) so it feels majestic, dignified, and never rushed
        if (brandStage) {
          gsap.set(brandStage, {
            xPercent: -50,
            yPercent: -50,
            scale: 0.65,
            opacity: 0,
          });
        }
        gsap.set(canvas, { opacity: 0 });
        if (ambientGlow) gsap.set(ambientGlow, { opacity: 0 });
        webGroup.scale.set(0.65, 0.65, 0.65);

        // 1. 3D Web weaves and expands outward (~1.4s)
        tl.to(
          webGroup.scale,
          {
            x: 1.0,
            y: 1.0,
            z: 1.0,
            duration: 1.4,
            ease: 'power3.out',
          },
          0.0
        );

        // Smoothly fade in canvas & ambient glow without sudden pops
        tl.to(
          canvas,
          {
            opacity: 1,
            duration: 0.6,
            ease: 'power2.out',
          },
          0.0
        );

        if (ambientGlow) {
          tl.to(
            ambientGlow,
            {
              opacity: 1,
              duration: 0.7,
              ease: 'power2.out',
            },
            0.0
          );
        }

        // 2. Brandmark zooms in smoothly from depth with silky fade-in (~1.2s)
        if (brandStage) {
          tl.to(
            brandStage,
            {
              scale: 1.0,
              opacity: 1,
              duration: 1.2,
              ease: 'power3.out',
            },
            0.05
          );
        }

        // 3. Instant scroll reset to top while fully concealed behind preloader curtain
        tl.add(() => {
          if ((window as any).lenis) {
            (window as any).lenis.scrollTo(0, { immediate: true });
          }
          window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
        }, 0.35);

        // 4. Synchronized Anamorphic Light Ray Sweeps majestically across the FULL logo face
        // Travels steadily from off-screen left (-105%) across Spider Arc -> ARANEA -> DEN -> off-screen right (+185%)
        const sweepTargets = [highlightSweepRef.current, glintSweepRef.current].filter(Boolean);
        if (sweepTargets.length > 0) {
          gsap.set(sweepTargets, { xPercent: -105, rotation: 20, transformOrigin: '50% 50%' });
          tl.to(
            sweepTargets,
            { xPercent: 185, duration: 1.25, ease: 'sine.inOut' },
            0.40
          );
        }

        // 5. Complete Preloader Silky Dissolve Exit (~0.45s) at 1.70s
        if (brandStage) {
          tl.to(
            brandStage,
            {
              scale: 1.02,
              opacity: 0,
              duration: 0.45,
              ease: 'power2.inOut',
            },
            1.70
          );
        }

        tl.to(
          overlay,
          {
            opacity: 0,
            duration: 0.45,
            ease: 'power2.inOut',
          },
          1.70
        );
      }
    }, overlay);

    // Resize Handler with responsive DPR adjustment
    const handleResize = () => {
      const newW = window.innerWidth;
      const newH = window.innerHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
      const newIsMobile = newW <= 768;
      renderer.setPixelRatio(newIsMobile ? 1.0 : Math.min(window.devicePixelRatio || 1, 1.25));
    };
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      isRendering = false;
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      ctx.revert();
      spokeGeo.dispose();
      spokeMat.dispose();
      spiralGeo.dispose();
      spiralMat.dispose();
      nodeGeo.dispose();
      nodeMat.dispose();
      renderer.dispose();
    };
  }, [isActive, mode]);

  if (!isActive) return null;

  return (
    <div
      ref={overlayRef}
      className={styles.preloaderOverlay}
      role="status"
      aria-live="polite"
      aria-label="Aranea Den"
    >
      {/* 1. Three.js 3D Spider Web Canvas */}
      <canvas ref={canvasRef} className={styles.threeCanvas} />

      {/* 2. Ambient Crimson Volumetric Glow */}
      <div ref={ambientGlowRef} className={styles.ambientGlow} aria-hidden="true" />

      {/* 3. Central 3D Aranea Den Brandmark */}
      <div ref={brandStageRef} className={styles.brandStage} aria-hidden="true">
        {/* Soft atmospheric crimson aura */}
        <div className={styles.logoAura} />

        {/* Layer 1: Base Dark Crimson Logo */}
        <img
          src="/AD Transparent SVG.svg"
          alt="Aranea Den"
          className={styles.logoBase}
          draggable={false}
        />

        {/* Hardware-Accelerated Anamorphic Glint Mask Container */}
        <div className={styles.glintMaskContainer}>
          {/* Layer 2: Wide Volumetric Crimson Light Ray Flare */}
          <div ref={highlightSweepRef} className={styles.highlightSweep} />

          {/* Layer 3: Brilliant Specular Apex Light Ray Core */}
          <div ref={glintSweepRef} className={styles.glintSweep} />
        </div>
      </div>
    </div>
  );
};

export default UniversalPreloader;
