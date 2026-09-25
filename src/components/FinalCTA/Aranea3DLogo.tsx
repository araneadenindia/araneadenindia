import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import styles from './Aranea3DLogo.module.css';

interface Aranea3DLogoProps {
  parentRef: React.RefObject<HTMLElement>;
  anchorRef?: React.RefObject<HTMLElement>;
}

export const Aranea3DLogo: React.FC<Aranea3DLogoProps> = ({ parentRef, anchorRef }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = parentRef.current;
    if (!canvas || !parent) return;

    let animationFrameId: number;
    let width = parent.clientWidth || window.innerWidth;
    let height = parent.clientHeight || 650;

    // 1. Scene, Camera, Renderer (React-managed canvas, zero DOM insertion/removal)
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.z = 7.2;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

    // 2. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.3);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2.2);
    dirLight.position.set(4, 5, 5);
    scene.add(dirLight);

    const crimsonPoint = new THREE.PointLight(0xdf2531, 3.2, 14);
    scene.add(crimsonPoint);

    // Master container
    const masterGroup = new THREE.Group();
    scene.add(masterGroup);

    // 3. Web & Logo Groups
    const webGroup = new THREE.Group();
    masterGroup.add(webGroup);

    const logoGroup = new THREE.Group();
    masterGroup.add(logoGroup);

    // Accurate calculation of logo position matching anchorRef (.visualCol)
    let logoBaseX = 3.6;
    let logoBaseY = 0.0;
    let webCenterX = 1.0;
    let webCenterY = 0.0;

    const updateLayout = () => {
      const anchor = anchorRef?.current;
      const isDesktop = width > 900;

      if (anchor && parent) {
        const anchorRect = anchor.getBoundingClientRect();
        const parentRect = parent.getBoundingClientRect();

        if (parentRect.width > 0 && parentRect.height > 0) {
          const centerX = (anchorRect.left + anchorRect.width / 2) - parentRect.left;
          const centerY = (anchorRect.top + anchorRect.height / 2) - parentRect.top;

          const ndcX = (centerX / parentRect.width) * 2 - 1;
          const ndcY = -((centerY / parentRect.height) * 2 - 1);

          // Exact closed-form perspective projection to plane z = 0.35
          const distZ = camera.position.z - 0.35;
          const halfH = distZ * Math.tan((camera.fov * Math.PI) / 360);
          const halfW = halfH * camera.aspect;

          logoBaseX = ndcX * halfW;
          logoBaseY = ndcY * halfH;
        }
      } else {
        logoBaseX = isDesktop ? 3.6 : 0;
        logoBaseY = isDesktop ? 0.0 : -2.0;
      }

      // The 3D spider web radiates organically from behind the 3D brandmark locus!
      webCenterX = logoBaseX;
      webCenterY = logoBaseY;

      webGroup.position.set(webCenterX, webCenterY, -0.05);
      logoGroup.position.set(logoBaseX, logoBaseY, 0.35);
      crimsonPoint.position.set(logoBaseX, logoBaseY, 1.8);
    };

    updateLayout();

    // ── 4. EXPANSIVE FULL-BACKGROUND 3D SPIDER WEB ──
    const spokeCount = 20;
    const minRadius = 0.65;
    const maxRadius = 18.0; // Fills entire widescreen section background

    // A. Radial Structural Spokes
    const spokePositions: number[] = [];
    for (let i = 0; i < spokeCount; i++) {
      const angle = (i / spokeCount) * Math.PI * 2;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);

      spokePositions.push(cos * minRadius, sin * minRadius, -0.05);

      const zOuter = -0.45 - Math.sin(i * 1.5) * 0.12;
      spokePositions.push(cos * maxRadius, sin * maxRadius, zOuter);
    }

    const spokeGeo = new THREE.BufferGeometry();
    spokeGeo.setAttribute('position', new THREE.Float32BufferAttribute(spokePositions, 3));
    const spokeMat = new THREE.LineBasicMaterial({
      color: 0xdf2531,
      transparent: true,
      opacity: 0.32,
    });
    const spokeLines = new THREE.LineSegments(spokeGeo, spokeMat);
    webGroup.add(spokeLines);

    // B. Concentric Polygon Spiral Strands
    const ringCount = 12;
    const spiralPositions: number[] = [];

    for (let r = 1; r <= ringCount; r++) {
      const ratio = r / ringCount;
      const baseR = minRadius + Math.pow(ratio, 1.18) * (maxRadius - minRadius);

      for (let i = 0; i < spokeCount; i++) {
        const a1 = (i / spokeCount) * Math.PI * 2;
        const a2 = ((i + 1) / spokeCount) * Math.PI * 2;

        const zDepth = -0.05 - Math.pow(ratio, 1.5) * 0.35;

        const x1 = Math.cos(a1) * baseR;
        const y1 = Math.sin(a1) * baseR;

        const x2 = Math.cos(a2) * baseR;
        const y2 = Math.sin(a2) * baseR;

        // Natural catenary sag toward center between spokes
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
      opacity: 0.25,
    });
    const spiralLines = new THREE.LineSegments(spiralGeo, spiralMat);
    webGroup.add(spiralLines);

    // C. Spider Web Junction Nodes
    const nodePositions: number[] = [];
    for (let r = 1; r <= ringCount; r++) {
      const ratio = r / ringCount;
      const baseR = minRadius + Math.pow(ratio, 1.18) * (maxRadius - minRadius);
      const zDepth = -0.05 - Math.pow(ratio, 1.5) * 0.35;

      for (let i = 0; i < spokeCount; i++) {
        const angle = (i / spokeCount) * Math.PI * 2;
        nodePositions.push(Math.cos(angle) * baseR, Math.sin(angle) * baseR, zDepth);
      }
    }

    const nodeGeo = new THREE.BufferGeometry();
    nodeGeo.setAttribute('position', new THREE.Float32BufferAttribute(nodePositions, 3));
    const nodeMat = new THREE.PointsMaterial({
      color: 0xdf2531,
      size: 0.035,
      transparent: true,
      opacity: 0.5,
    });
    const webNodes = new THREE.Points(nodeGeo, nodeMat);
    webGroup.add(webNodes);

    // ── 5. ARANEA DEN 3D LOGO GRAPHICS (Ultra-Sharp & Crystal Clear) ──
    const textureLoader = new THREE.TextureLoader();
    const logoTexture = textureLoader.load('/aranea-den-logo-clean.png');
    logoTexture.minFilter = THREE.LinearMipmapLinearFilter;
    logoTexture.magFilter = THREE.LinearFilter;
    logoTexture.generateMipmaps = true;
    logoTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();

    const isDesktop = width > 768;
    const logoWidth = isDesktop ? 3.3 : 2.4;
    const logoHeight = logoWidth / (1114 / 222); // Exact 5.018 aspect ratio
    const logoGeo = new THREE.PlaneGeometry(logoWidth, logoHeight);

    // Single crystal-clear brand layer with zero ghosting or blur
    const logoMat = new THREE.MeshStandardMaterial({
      map: logoTexture,
      transparent: true,
      depthWrite: false,
      roughness: 0.15,
      metalness: 0.25,
      emissive: 0xdf2531,
      emissiveIntensity: 0.22,
      side: THREE.FrontSide,
    });
    const logoMesh = new THREE.Mesh(logoGeo, logoMat);
    logoMesh.position.z = 0.05;
    logoGroup.add(logoMesh);

    // ── 6. STRICTLY SUBTLE CURSOR-TO-3D MOVEMENT ──
    let targetRotX = 0;
    let targetRotY = 0;
    let currRotX = 0;
    let currRotY = 0;

    let targetParallaxX = 0;
    let targetParallaxY = 0;
    let currParallaxX = 0;
    let currParallaxY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = parent.getBoundingClientRect();
      const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const normY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      // Strictly subtle rotation: maximum ±3.5 degrees (no squashing, stays upright)
      targetRotY = normX * 0.06;
      targetRotX = -normY * 0.045;

      // Subtle parallax shift
      targetParallaxX = normX * 0.15;
      targetParallaxY = normY * 0.1;
    };

    const handleMouseLeave = () => {
      targetRotX = 0;
      targetRotY = 0;
      targetParallaxX = 0;
      targetParallaxY = 0;
    };

    parent.addEventListener('mousemove', handleMouseMove);
    parent.addEventListener('mouseleave', handleMouseLeave);

    // ── 7. Animation Loop with Viewport Visibility Gating ──
    let clock = new THREE.Clock();
    let isElementVisible = false;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isElementVisible = entry.isIntersecting;
        if (isElementVisible) {
          clock.start();
        } else {
          clock.stop();
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(parent);

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (!isElementVisible) return;

      const elapsedTime = clock.getElapsedTime();

      // Gentle floating levitation on the logo
      const levitate = Math.sin(elapsedTime * 1.2) * 0.05;

      // Extremely smooth lerping
      currRotX += (targetRotX - currRotX) * 0.05;
      currRotY += (targetRotY - currRotY) * 0.05;
      currParallaxX += (targetParallaxX - currParallaxX) * 0.05;
      currParallaxY += (targetParallaxY - currParallaxY) * 0.05;

      // Apply subtle tilt to logo (stays straight and completely readable)
      logoGroup.rotation.x = currRotX;
      logoGroup.rotation.y = currRotY;
      logoGroup.position.x = logoBaseX + currParallaxX;
      logoGroup.position.y = logoBaseY + currParallaxY + levitate;

      // Subtle breathing pulse on web background
      webGroup.rotation.z = Math.sin(elapsedTime * 0.2) * 0.015;
      webGroup.position.x = webCenterX + currParallaxX * 0.3;
      webGroup.position.y = webCenterY + currParallaxY * 0.3;

      renderer.render(scene, camera);
    };

    animate();

    // ── 8. Resize Observer ──
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const newWidth = entry.contentRect.width;
        const newHeight = entry.contentRect.height;
        if (newWidth > 0 && newHeight > 0) {
          width = newWidth;
          height = newHeight;
          camera.aspect = newWidth / newHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(newWidth, newHeight);
          updateLayout();
        }
      }
    });
    resizeObserver.observe(parent);

    // Initial delayed layout check once DOM ref settles
    const timeoutId = setTimeout(updateLayout, 100);

    // Cleanup (Zero DOM manipulation, perfectly safe for React)
    return () => {
      clearTimeout(timeoutId);
      parent.removeEventListener('mousemove', handleMouseMove);
      parent.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      resizeObserver.disconnect();
      spokeGeo.dispose();
      spokeMat.dispose();
      spiralGeo.dispose();
      spiralMat.dispose();
      nodeGeo.dispose();
      nodeMat.dispose();
      logoGeo.dispose();
      logoMat.dispose();
      logoTexture.dispose();
      renderer.dispose();
    };
  }, [parentRef, anchorRef]);

  return (
    <div className={styles.canvasContainer} aria-hidden="true">
      <canvas ref={canvasRef} className={styles.canvas} />
    </div>
  );
};

export default Aranea3DLogo;
