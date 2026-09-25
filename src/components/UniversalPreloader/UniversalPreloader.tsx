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
  const highlightLayerRef = useRef<HTMLImageElement>(null);
  const glintLayerRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!isActive) return;

    const canvas = canvasRef.current;
    const overlay = overlayRef.current;
    const brandStage = brandStageRef.current;
    if (!canvas || !overlay) return;

    let animationFrameId: number;
    const width = window.innerWidth;
    const height = window.innerHeight;

    // ── 1. THREE.JS 3D SPIDER WEB SCENE ──
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.z = 7.0;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

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

    // ── 2. RENDER LOOP ──
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      webGroup.rotation.z += 0.0014;
      renderer.render(scene, camera);
    };
    animate();

    // ── 3. MASTER GSAP CINEMATIC ORCHESTRATION ──
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const maskProxy = { progress: 0 };

    const updateAnamorphicMask = (progress: number) => {
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

    updateAnamorphicMask(0);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          if (onComplete) onComplete();
        },
      });

      if (prefersReducedMotion) {
        tl.to(overlay, { opacity: 0, duration: 0.4, delay: 0.5 });
        return;
      }

      if (mode === 'initial') {
        // ── FULL CINEMATIC INITIAL INTRO (~2.75s) ──
        // 0. Setup 3D perspective initial state
        if (brandStage) {
          gsap.set(brandStage, {
            transformPerspective: 950,
            rotationX: 24,
            rotationY: -16,
            scale: 0.90,
            opacity: 1,
          });
        }
        webGroup.scale.set(0.60, 0.60, 0.60);

        // 1. 3D Web Weaves Outward (~1.9s)
        tl.to(webGroup.scale, {
          x: 1.0,
          y: 1.0,
          z: 1.0,
          duration: 1.9,
          ease: 'power2.out',
        }, 0.0);

        // 2. 3D Brandmark settles smoothly to front alignment
        if (brandStage) {
          tl.to(brandStage, {
            rotationX: 0,
            rotationY: 0,
            scale: 1.0,
            duration: 1.8,
            ease: 'power3.out',
          }, 0.05);
        }

        // 3. Anamorphic Specular Glint sweeps across the logo face
        tl.to(maskProxy, {
          progress: 1,
          duration: 1.75,
          ease: 'power2.inOut',
          onUpdate: () => updateAnamorphicMask(maskProxy.progress),
        }, 0.2);

        // 4. Brief cinematic hold in rich dark crimson stillness (350ms)

        // 5. Silky Dissolve Exit (~0.5s)
        if (brandStage) {
          tl.to(brandStage, {
            scale: 1.04,
            opacity: 0,
            duration: 0.5,
            ease: 'power2.inOut',
          }, 2.25);
        }

        tl.to(overlay, {
          opacity: 0,
          duration: 0.5,
          ease: 'power2.inOut',
        }, 2.25);
      } else if (mode === 'ascend') {
        // ── WARP TO TOP / ELEVATION MODE (~0.70s) ──
        if (brandStage) {
          gsap.set(brandStage, {
            transformPerspective: 800,
            rotationX: 20,
            y: 35,
            scale: 0.92,
            opacity: 1,
          });
        }

        if (brandStage) {
          tl.to(brandStage, {
            y: -20,
            rotationX: -8,
            scale: 1.02,
            duration: 0.45,
            ease: 'power2.out',
          }, 0.0);
        }

        // Instant scroll reset behind the preloader
        tl.add(() => {
          if ((window as any).lenis) {
            (window as any).lenis.scrollTo(0, { immediate: true });
          }
          window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
        }, 0.35);

        tl.to(overlay, {
          opacity: 0,
          duration: 0.35,
          ease: 'power2.inOut',
        }, 0.45);
      } else {
        // ── ROUTE NAVIGATION MODE (~0.85s) ──
        if (brandStage) {
          gsap.set(brandStage, {
            transformPerspective: 800,
            rotationX: 12,
            rotationY: -8,
            scale: 0.95,
            opacity: 1,
          });
        }

        if (brandStage) {
          tl.to(brandStage, {
            rotationX: 0,
            rotationY: 0,
            scale: 1.0,
            duration: 0.45,
            ease: 'power2.out',
          }, 0.0);
        }

        tl.to(maskProxy, {
          progress: 1,
          duration: 0.45,
          ease: 'power2.inOut',
          onUpdate: () => updateAnamorphicMask(maskProxy.progress),
        }, 0.05);

        // Instant scroll reset to top while concealed
        tl.add(() => {
          if ((window as any).lenis) {
            (window as any).lenis.scrollTo(0, { immediate: true });
          }
          window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
        }, 0.4);

        tl.to(overlay, {
          opacity: 0,
          duration: 0.35,
          ease: 'power2.inOut',
        }, 0.5);
      }
    }, overlay);

    // Resize Handler
    const handleResize = () => {
      const newW = window.innerWidth;
      const newH = window.innerHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener('resize', handleResize);

    return () => {
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
  }, [isActive, mode, onComplete]);

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
      <div className={styles.ambientGlow} aria-hidden="true" />

      {/* 3. Central 3D Aranea Den Brandmark (Only Web & Logo, No Text, No Bars) */}
      <div ref={brandStageRef} className={styles.brandStage} aria-hidden="true">
        {/* Layer 1: Base Dark Crimson with Soft Aura */}
        <img
          src="/AD Transparent SVG.svg"
          alt="Aranea Den"
          className={`${styles.logoLayer} ${styles.logoBase}`}
          draggable={false}
        />

        {/* Layer 2: Illuminated Crimson Specular with Sweep Mask */}
        <img
          ref={highlightLayerRef}
          src="/AD Transparent SVG.svg"
          alt=""
          className={`${styles.logoLayer} ${styles.logoHighlight}`}
          draggable={false}
        />

        {/* Layer 3: Brilliant White Glint Apex */}
        <img
          ref={glintLayerRef}
          src="/AD Transparent SVG.svg"
          alt=""
          className={`${styles.logoLayer} ${styles.logoGlint}`}
          draggable={false}
        />
      </div>
    </div>
  );
};

export default UniversalPreloader;
