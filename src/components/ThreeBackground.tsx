import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useTheme } from '../context/ThemeContext';

export default function VaultVisualizer() {
  const mountRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const themeRef = useRef(theme);

  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Setup Scene
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.05);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 10;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    // 1. Inner Core (Solid, glowing sphere)
    const coreGeometry = new THREE.IcosahedronGeometry(2, 4);
    const coreMaterial = new THREE.MeshBasicMaterial({
      color: 0x220500,
      transparent: true,
      opacity: 0.9,
    });
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    group.add(core);

    // 2. The Digital Cage (Wireframe Icosahedron)
    const cageGeometry = new THREE.IcosahedronGeometry(4.5, 12);
    
    // Store original positions for distortion
    const positions = cageGeometry.attributes.position;
    const originalPositions = new Float32Array(positions.count * 3);
    for (let i = 0; i < positions.count * 3; i++) {
      originalPositions[i] = positions.array[i];
    }

    const cageMaterial = new THREE.MeshBasicMaterial({
      color: 0xff4500,
      wireframe: true,
      transparent: true,
      opacity: 0.15,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    
    const cage = new THREE.Mesh(cageGeometry, cageMaterial);
    group.add(cage);

    // 3. Ambient Floating Particles (Data streams)
    const particleCount = 2000;
    const pGeometry = new THREE.BufferGeometry();
    const pPositions = new Float32Array(particleCount * 3);
    const pVelocities = [];

    for (let i = 0; i < particleCount; i++) {
      pPositions[i * 3] = (Math.random() - 0.5) * 40;
      pPositions[i * 3 + 1] = (Math.random() - 0.5) * 40;
      pPositions[i * 3 + 2] = (Math.random() - 0.5) * 40 - 5;
      
      pVelocities.push({
        y: (Math.random() - 0.5) * 0.02,
        x: (Math.random() - 0.5) * 0.01,
      });
    }

    pGeometry.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
    const pMaterial = new THREE.PointsMaterial({
      color: 0xff6b00,
      size: 0.05,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(pGeometry, pMaterial);
    scene.add(particles);

    // Interaction State
    let mouseX = 0, mouseY = 0;
    let targetX = 0, targetY = 0;
    let scrollY = 0;
    
    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX - window.innerWidth / 2) * 0.001;
      mouseY = (e.clientY - window.innerHeight / 2) * 0.001;
    };
    
    const onScroll = () => {
      scrollY = window.scrollY;
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('scroll', onScroll);

    let rafId: number;
    let time = 0;

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      time += 0.005;

      // Smooth mouse follow
      targetX = mouseX * 0.5;
      targetY = mouseY * 0.5;
      
      group.rotation.y += 0.002;
      group.rotation.x += 0.001;
      
      // Mouse interaction rotation
      group.rotation.x += 0.05 * (targetY - group.rotation.x);
      group.rotation.y += 0.05 * (targetX - group.rotation.y);
      
      // Scroll moves the vault up slightly
      group.position.y = scrollY * 0.005;

      // Cage pulsing / distortion logic
      const posArray = cageGeometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < cageGeometry.attributes.position.count; i++) {
        const i3 = i * 3;
        const ox = originalPositions[i3];
        const oy = originalPositions[i3 + 1];
        const oz = originalPositions[i3 + 2];
        
        // Complex wave function for the cage breathing effect
        const wave = Math.sin(time * 2 + ox * 0.5) * Math.cos(time * 1.5 + oy * 0.5);
        const intensity = 0.2;

        posArray[i3] = ox + (ox * wave * intensity * (targetX + 0.5));
        posArray[i3 + 1] = oy + (oy * wave * intensity * (targetY + 0.5));
        posArray[i3 + 2] = oz + (oz * wave * intensity * 0.5);
      }
      cageGeometry.attributes.position.needsUpdate = true;
      
      // Particle flow logic
      const pPosArray = pGeometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        pPosArray[i3] += pVelocities[i].x;
        pPosArray[i3 + 1] += pVelocities[i].y;
        
        // Wrap around
        if (pPosArray[i3 + 1] > 20) pPosArray[i3 + 1] = -20;
        if (pPosArray[i3 + 1] < -20) pPosArray[i3 + 1] = 20;
        if (pPosArray[i3] > 20) pPosArray[i3] = -20;
        if (pPosArray[i3] < -20) pPosArray[i3] = 20;
      }
      pGeometry.attributes.position.needsUpdate = true;

      // Theme logic (Light mode dims the background)
      const currentIsDark = themeRef.current === 'dark';
      cageMaterial.opacity = currentIsDark ? 0.15 : 0.05;
      pMaterial.opacity = currentIsDark ? 0.4 : 0.1;
      scene.fog!.color.setHex(currentIsDark ? 0x000000 : 0xf5f5f7);

      renderer.render(scene, camera);
    };
    animate();

    const ro = new ResizeObserver(() => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
    ro.observe(document.body);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll', onScroll);
      if (renderer.domElement.parentNode === container) container.removeChild(renderer.domElement);
      coreGeometry.dispose();
      coreMaterial.dispose();
      cageGeometry.dispose();
      cageMaterial.dispose();
      pGeometry.dispose();
      pMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{ 
        width: '100vw', 
        height: '100vh', 
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: -1,
        pointerEvents: 'none' 
      }}
    />
  );
}
