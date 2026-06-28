import { useEffect, useRef } from 'react';

/**
 * Three.js particle field hero canvas.
 * Creates a floating nebula of glowing particles in 3D space.
 * Falls back to a gradient when Three.js is unavailable.
 */
export default function ThreeHero() {
  const canvasRef = useRef(null);
  const animRef   = useRef(null);

  useEffect(() => {
    let scene, camera, renderer, particles, particleSystem;
    let width  = canvasRef.current.offsetWidth;
    let height = canvasRef.current.offsetHeight;

    async function init() {
      try {
        const THREE = await import('three');

        scene    = new THREE.Scene();
        camera   = new THREE.PerspectiveCamera(60, width / height, 0.1, 2000);
        camera.position.z = 300;

        renderer = new THREE.WebGLRenderer({
          canvas: canvasRef.current,
          alpha: true,
          antialias: false,
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(width, height);

        // ── Build particle geometry ──
        const count = 1800;
        const geo   = new THREE.BufferGeometry();
        const pos   = new Float32Array(count * 3);
        const col   = new Float32Array(count * 3);
        const sizes = new Float32Array(count);

        // Accent color palette: indigo + cyan + violet
        const palette = [
          [0.388, 0.400, 0.945], // indigo  #6366f1
          [0.133, 0.827, 0.933], // cyan    #22d3ee
          [0.545, 0.361, 0.961], // violet  #8b5cf6
          [0.506, 0.533, 0.980], // light indigo #818cf8
        ];

        for (let i = 0; i < count; i++) {
          const r = 150 + Math.random() * 200;
          const theta = Math.random() * Math.PI * 2;
          const phi   = Math.acos(2 * Math.random() - 1);

          pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
          pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
          pos[i * 3 + 2] = r * Math.cos(phi);

          const c = palette[Math.floor(Math.random() * palette.length)];
          col[i * 3]     = c[0];
          col[i * 3 + 1] = c[1];
          col[i * 3 + 2] = c[2];

          sizes[i] = 0.8 + Math.random() * 2.4;
        }

        geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        geo.setAttribute('color',    new THREE.BufferAttribute(col, 3));
        geo.setAttribute('size',     new THREE.BufferAttribute(sizes, 1));

        const mat = new THREE.PointsMaterial({
          size:            2.2,
          vertexColors:    true,
          transparent:     true,
          opacity:         0.75,
          sizeAttenuation: true,
          depthWrite:      false,
          blending:        THREE.AdditiveBlending,
        });

        particles     = geo;
        particleSystem = new THREE.Points(geo, mat);
        scene.add(particleSystem);

        // ── Subtle mouse parallax ──
        let mx = 0, my = 0;
        const onMove = (e) => {
          mx = (e.clientX / width  - 0.5) * 2;
          my = (e.clientY / height - 0.5) * 2;
        };
        window.addEventListener('pointermove', onMove, { passive: true });

        let t = 0;
        const animate = () => {
          animRef.current = requestAnimationFrame(animate);
          t += 0.0004;

          particleSystem.rotation.y = t + mx * 0.06;
          particleSystem.rotation.x = t * 0.4 + my * 0.04;

          renderer.render(scene, camera);
        };
        animate();

        const onResize = () => {
          width  = canvasRef.current?.offsetWidth  || window.innerWidth;
          height = canvasRef.current?.offsetHeight || window.innerHeight;
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          renderer.setSize(width, height);
        };
        window.addEventListener('resize', onResize);

        return () => {
          window.removeEventListener('pointermove', onMove);
          window.removeEventListener('resize', onResize);
        };
      } catch {
        // Three.js not available — canvas stays transparent, gradient bg shows through
      }
    }

    const cleanup = init();

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      cleanup.then?.(fn => fn?.());
      renderer?.dispose?.();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ mixBlendMode: 'screen' }}
      aria-hidden="true"
    />
  );
}
