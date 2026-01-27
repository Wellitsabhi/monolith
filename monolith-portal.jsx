import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);

const MonolithPortal = () => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const text1Ref = useRef(null);
  const text2Ref = useRef(null);
  const line1Ref = useRef(null);
  const line2Ref = useRef(null);
  const sceneRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    // Three.js Scene Setup
    const canvas = canvasRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      canvas, 
      alpha: true, 
      antialias: true 
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    camera.position.z = 5;

    sceneRef.current = { scene, camera, renderer };

    // Portal Components
    const portalGroup = new THREE.Group();
    scene.add(portalGroup);

    // Main Portal Ring
    const ringGeometry = new THREE.TorusGeometry(2, 0.15, 16, 100);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ff88,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide
    });
    const mainRing = new THREE.Mesh(ringGeometry, ringMaterial);
    portalGroup.add(mainRing);

    // Inner glow disc
    const discGeometry = new THREE.CircleGeometry(1.8, 64);
    const discMaterial = new THREE.ShaderMaterial({
      transparent: true,
      side: THREE.DoubleSide,
      uniforms: {
        time: { value: 0 },
        opacity: { value: 0 }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform float opacity;
        varying vec2 vUv;
        
        void main() {
          vec2 center = vec2(0.5, 0.5);
          float dist = distance(vUv, center);
          
          // Inverted gradient for depth
          float gradient = smoothstep(0.5, 0.0, dist);
          
          // Pulsing effect
          float pulse = sin(time * 2.0) * 0.1 + 0.9;
          
          // Color mixing - white center to green edges
          vec3 innerColor = vec3(1.0, 1.0, 1.0);
          vec3 outerColor = vec3(0.0, 1.0, 0.6);
          vec3 color = mix(outerColor, innerColor, gradient);
          
          float alpha = gradient * pulse * opacity;
          gl_FragColor = vec4(color, alpha);
        }
      `
    });
    const innerDisc = new THREE.Mesh(discGeometry, discMaterial);
    innerDisc.position.z = -0.1;
    portalGroup.add(innerDisc);

    // Particle system for portal
    const particleCount = 3000;
    const particlesGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const radius = Math.random() * 2.5;
      const angle = Math.random() * Math.PI * 2;
      const elevation = (Math.random() - 0.5) * 0.5;

      positions[i3] = Math.cos(angle) * radius;
      positions[i3 + 1] = Math.sin(angle) * radius;
      positions[i3 + 2] = elevation;

      velocities[i3] = (Math.random() - 0.5) * 0.02;
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.02;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.01;

      sizes[i] = Math.random() * 3 + 1;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const particlesMaterial = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        time: { value: 0 },
        opacity: { value: 0 }
      },
      vertexShader: `
        attribute float size;
        uniform float time;
        varying float vAlpha;
        
        void main() {
          vAlpha = sin(time * 2.0 + position.x * 10.0) * 0.5 + 0.5;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform float opacity;
        varying float vAlpha;
        
        void main() {
          vec2 center = gl_PointCoord - vec2(0.5);
          float dist = length(center);
          if (dist > 0.5) discard;
          
          float alpha = (1.0 - dist * 2.0) * vAlpha * opacity;
          vec3 color = mix(vec3(0.0, 1.0, 0.6), vec3(1.0, 1.0, 1.0), vAlpha);
          gl_FragColor = vec4(color, alpha);
        }
      `
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    portalGroup.add(particles);

    // Energy wave rings
    const waveRings = [];
    for (let i = 0; i < 3; i++) {
      const waveRingGeometry = new THREE.TorusGeometry(2 + i * 0.3, 0.05, 8, 100);
      const waveRingMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ff88,
        transparent: true,
        opacity: 0
      });
      const waveRing = new THREE.Mesh(waveRingGeometry, waveRingMaterial);
      waveRings.push(waveRing);
      portalGroup.add(waveRing);
    }

    // Spark particles
    const sparkCount = 500;
    const sparksGeometry = new THREE.BufferGeometry();
    const sparkPositions = new Float32Array(sparkCount * 3);

    for (let i = 0; i < sparkCount; i++) {
      const i3 = i * 3;
      const angle = Math.random() * Math.PI * 2;
      const radius = 2 + Math.random() * 0.5;
      sparkPositions[i3] = Math.cos(angle) * radius;
      sparkPositions[i3 + 1] = Math.sin(angle) * radius;
      sparkPositions[i3 + 2] = (Math.random() - 0.5) * 0.2;
    }

    sparksGeometry.setAttribute('position', new THREE.BufferAttribute(sparkPositions, 3));

    const sparksMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.05,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending
    });

    const sparks = new THREE.Points(sparksGeometry, sparksMaterial);
    portalGroup.add(sparks);

    // Text particles from monolith
    const textParticleCount = 2000;
    const textGeometry = new THREE.BufferGeometry();
    const textPositions = new Float32Array(textParticleCount * 3);
    const textTargets = new Float32Array(textParticleCount * 3);

    for (let i = 0; i < textParticleCount; i++) {
      const i3 = i * 3;
      // Start position (monolith column)
      textPositions[i3] = 0;
      textPositions[i3 + 1] = (Math.random() - 0.5) * 8;
      textPositions[i3 + 2] = 0;

      // Target position (ring)
      const angle = (i / textParticleCount) * Math.PI * 2;
      textTargets[i3] = Math.cos(angle) * 2;
      textTargets[i3 + 1] = Math.sin(angle) * 2;
      textTargets[i3 + 2] = (Math.random() - 0.5) * 0.1;
    }

    textGeometry.setAttribute('position', new THREE.BufferAttribute(textPositions, 3));
    textGeometry.setAttribute('target', new THREE.BufferAttribute(textTargets, 3));

    const textParticleMaterial = new THREE.ShaderMaterial({
      transparent: true,
      blending: THREE.AdditiveBlending,
      uniforms: {
        progress: { value: 0 },
        opacity: { value: 0 },
        time: { value: 0 }
      },
      vertexShader: `
        attribute vec3 target;
        uniform float progress;
        uniform float time;
        varying float vAlpha;
        
        void main() {
          vec3 pos = mix(position, target, progress);
          vAlpha = progress;
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = 4.0 * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform float opacity;
        varying float vAlpha;
        
        void main() {
          vec2 center = gl_PointCoord - vec2(0.5);
          float dist = length(center);
          if (dist > 0.5) discard;
          
          float alpha = (1.0 - dist * 2.0) * vAlpha * opacity;
          vec3 color = vec3(0.0, 1.0, 0.7);
          gl_FragColor = vec4(color, alpha);
        }
      `
    });

    const textParticles = new THREE.Points(textGeometry, textParticleMaterial);
    portalGroup.add(textParticles);

    portalGroup.scale.set(0, 0, 0);

    // Animation loop
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.016;

      // Rotate main ring
      mainRing.rotation.z += 0.01;

      // Animate particles
      const positions = particles.geometry.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        positions[i3] += Math.sin(time + i) * 0.001;
        positions[i3 + 1] += Math.cos(time + i) * 0.001;
      }
      particles.geometry.attributes.position.needsUpdate = true;

      // Animate wave rings
      waveRings.forEach((ring, index) => {
        ring.rotation.z = -time * 0.5 + index * 0.5;
        const scale = 1 + Math.sin(time * 2 + index) * 0.1;
        ring.scale.set(scale, scale, scale);
      });

      // Update shader uniforms
      discMaterial.uniforms.time.value = time;
      particlesMaterial.uniforms.time.value = time;
      textParticleMaterial.uniforms.time.value = time;

      renderer.render(scene, camera);
    };
    animate();

    // GSAP ScrollTrigger Animations
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: '+=500%',
        scrub: 1,
        pin: true,
        onUpdate: (self) => {
          setScrollProgress(self.progress);
        }
      }
    });

    // Frame 0-1: Initial state to zoom on monolith
    tl.to('.image-container', {
      scale: 2.5,
      y: '30%',
      duration: 2,
      ease: 'power2.inOut'
    })
    // Text animations Frame 1 to Frame 2
    .to(text1Ref.current, {
      x: '40vw',
      y: '-25vh',
      duration: 2,
      ease: 'power2.inOut'
    }, '<')
    .to(text2Ref.current, {
      x: '-35vw',
      y: '15vh',
      duration: 2,
      ease: 'power2.inOut'
    }, '<')
    .to([line1Ref.current, line2Ref.current], {
      scaleX: 0,
      duration: 2,
      ease: 'power2.inOut'
    }, '<')
    
    // Frame 2 to Frame 3: Zoom into monolith bottom
    .to('.image-container', {
      scale: 8,
      y: '45%',
      duration: 2.5,
      ease: 'power2.inOut'
    })
    .to([text1Ref.current, text2Ref.current], {
      opacity: 0,
      duration: 1,
      ease: 'power2.in'
    }, '<')
    
    // Frame 3: Portal formation
    .to(portalGroup.scale, {
      x: 1,
      y: 1,
      z: 1,
      duration: 2,
      ease: 'power2.out'
    }, '-=1')
    .to([ringMaterial, discMaterial.uniforms.opacity, particlesMaterial.uniforms.opacity], {
      opacity: 1,
      value: 1,
      duration: 2,
      ease: 'power2.out'
    }, '<')
    .to(waveRings.map(r => r.material), {
      opacity: 0.3,
      duration: 2,
      stagger: 0.2,
      ease: 'power2.out'
    }, '<')
    .to(sparksMaterial, {
      opacity: 0.8,
      duration: 1.5,
      ease: 'power2.out'
    }, '<')
    .to(textParticleMaterial.uniforms.progress, {
      value: 1,
      duration: 3,
      ease: 'power2.inOut'
    }, '<')
    .to(textParticleMaterial.uniforms.opacity, {
      value: 1,
      duration: 2,
      ease: 'power2.out'
    }, '<');

    // Handle resize
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={containerRef} style={{ height: '100vh', overflow: 'hidden', position: 'relative' }}>
      {/* Background Images */}
      <div className="image-container" style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        transformOrigin: 'center 40%',
      }}>
        <img 
          src="/mnt/user-data/uploads/1769498780797_image.png" 
          alt="Monolith"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center 40%'
          }}
        />
      </div>

      {/* Text Elements */}
      <div
        ref={text1Ref}
        style={{
          position: 'absolute',
          bottom: '15%',
          left: '10%',
          color: '#00ff88',
          fontSize: 'clamp(14px, 2vw, 24px)',
          fontFamily: 'monospace',
          textShadow: '0 0 20px rgba(0, 255, 136, 0.8)',
          maxWidth: '300px',
          zIndex: 10
        }}
      >
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor.
      </div>

      <div style={{ position: 'absolute', bottom: '10%', left: 0, right: 0, zIndex: 10 }}>
        <div
          ref={line1Ref}
          style={{
            position: 'absolute',
            left: '10%',
            top: '50%',
            width: '35%',
            height: '1px',
            background: 'linear-gradient(to right, transparent, #00ff88)',
            transformOrigin: 'left center'
          }}
        />
        <div
          ref={text2Ref}
          style={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            color: '#00ff88',
            fontSize: 'clamp(16px, 2.5vw, 28px)',
            fontFamily: 'monospace',
            textShadow: '0 0 30px rgba(0, 255, 136, 0.9)',
            whiteSpace: 'nowrap',
            textAlign: 'center'
          }}
        >
          Vivamus sagittis lacus vel augue
        </div>
        <div
          ref={line2Ref}
          style={{
            position: 'absolute',
            right: '10%',
            top: '50%',
            width: '35%',
            height: '1px',
            background: 'linear-gradient(to left, transparent, #00ff88)',
            transformOrigin: 'right center'
          }}
        />
      </div>

      {/* Three.js Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 20,
          opacity: scrollProgress > 0.6 ? 1 : 0,
          transition: 'opacity 0.5s'
        }}
      />

      {/* Vignette overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'radial-gradient(circle at center, transparent 20%, rgba(0, 20, 10, 0.8) 100%)',
        pointerEvents: 'none',
        zIndex: 5
      }} />

      {/* Scroll indicator */}
      {scrollProgress < 0.1 && (
        <div style={{
          position: 'absolute',
          bottom: '5%',
          right: '5%',
          color: '#00ff88',
          fontSize: '14px',
          fontFamily: 'monospace',
          textShadow: '0 0 10px rgba(0, 255, 136, 0.8)',
          zIndex: 30,
          animation: 'pulse 2s infinite'
        }}>
          SCROLL TO EXPLORE
          <style>{`
            @keyframes pulse {
              0%, 100% { opacity: 0.5; }
              50% { opacity: 1; }
            }
          `}</style>
        </div>
      )}
    </div>
  );
};

export default MonolithPortal;
