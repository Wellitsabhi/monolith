import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import React from 'react';
import { createRoot } from 'react-dom/client';

import { createMonolith, createSlitGlow, createEnvironment } from './monolith.js';
import {
  createDustTexture,
  createDarkCloudTexture,
  createSparkTexture,
  createSparkTrailTexture,
  createSmallCharTexture,
  createLightRayTexture,
  createCharacterTexture,
  CHARACTERS,
} from '../functions/textures.js';
import {
  createPortalEffects,
  createMatrixChars,
  createTunnelParticles,
  animatePortalEffects,
  animateTunnelParticles,
  animateMatrixScroll,
  resetPortalEffects,
  resetMatrixChars,
  resetTunnelParticles,
  setAllVisible,
  PORTAL_CONFIG,
  MATRIX_CONFIG,
} from './portal.js';
import AboutPage from './about.jsx';

import '../style.css';

gsap.registerPlugin(ScrollTrigger);

const container = document.getElementById('app');
const canvas = document.getElementById('webgl');
const bgImage = document.getElementById('bg-image');
const scrollIndicator = document.getElementById('scroll-indicator');
const progressBar = document.getElementById('progress-fill');
const aboutSection = document.getElementById('about-section');

// ============================================
// MOUNT REACT ABOUT COMPONENT
// ============================================

const aboutRoot = createRoot(aboutSection);
aboutRoot.render(React.createElement(AboutPage));

// ============================================
// THREE.JS SETUP
// ============================================

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  50,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 0, 20);

const renderer = new THREE.WebGLRenderer({
  canvas,
  alpha: true,
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;

// ============================================
// LIGHTING
// ============================================

createEnvironment(scene);

// ============================================
// MONOLITH
// ============================================

const monolith = createMonolith();
monolith.position.set(0, -1, 0);
scene.add(monolith);

const slitGlow = createSlitGlow();
slitGlow.position.set(0, -1, 0);
scene.add(slitGlow);

// ============================================
// TEXTURES
// ============================================

const dustTexture = createDustTexture();
const darkCloudTexture = createDarkCloudTexture();
const sparkTexture = createSparkTexture();
const sparkTrailTexture = createSparkTrailTexture();
const lightRayTexture = createLightRayTexture();

const charTextures = {};
const smallCharTextures = {};
CHARACTERS.forEach((char) => {
  charTextures[char] = createCharacterTexture(char);
  smallCharTextures[char] = createSmallCharTexture(char);
});

const textures = {
  dustTexture,
  darkCloudTexture,
  sparkTexture,
  sparkTrailTexture,
  lightRayTexture,
  charTextures,
  smallCharTextures,
};

// ============================================
// MATRIX GROUP (emerges from slit)
// ============================================

const matrixGroup = new THREE.Group();
matrixGroup.position.set(0, 0, MATRIX_CONFIG.startZ);
scene.add(matrixGroup);

const matrixChars = createMatrixChars(matrixGroup, charTextures);

// ============================================
// PORTAL GROUP (bottom-right of monolith)
// ============================================

const portalGroup = new THREE.Group();
portalGroup.position.set(
  PORTAL_CONFIG.position.x,
  PORTAL_CONFIG.position.y,
  PORTAL_CONFIG.position.z
);
portalGroup.scale.set(0, 0, 0);
scene.add(portalGroup);

const portalEffects = createPortalEffects(portalGroup, textures);

// ============================================
// TUNNEL PARTICLES
// ============================================

const tunnelParticles = createTunnelParticles(scene, textures);

// ============================================
// ANIMATION STATE
// ============================================

let portalActive = false;
let tunnelRush = false;
let matrixScrolling = false;

const clock = new THREE.Clock();

// ============================================
// SMOOTH SCROLL
// ============================================

const lenis = new Lenis({
  duration: 1.8,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  wheelMultiplier: 0.6,
});

lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

// ============================================
// ANIMATION LOOP
// ============================================

function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();
  const elapsed = clock.getElapsedTime();

  // Matrix scrolling animation
  if (matrixScrolling) {
    animateMatrixScroll(matrixChars, charTextures, delta);
  }

  animatePortalEffects(portalEffects, elapsed, delta, portalActive);
  animateTunnelParticles(tunnelParticles, delta, tunnelRush);

  renderer.render(scene, camera);
}

animate();

// ============================================
// SCROLL TIMELINE - FULLY REVERSIBLE
// ============================================

const tl = gsap.timeline({
  scrollTrigger: {
    trigger: container,
    start: 'top top',
    end: '+=900%',
    scrub: 1.2,
    pin: true,
    anticipatePin: 1,
    onUpdate: (self) => {
      progressBar.style.height = `${self.progress * 100}%`;
      scrollIndicator.style.opacity = self.progress < 0.02 ? 1 : 0;
      
      // State management based on progress
      matrixScrolling = self.progress > 0.12 && self.progress < 0.35;
      portalActive = self.progress > 0.45 && self.progress < 0.88;
      tunnelRush = self.progress > 0.72 && self.progress < 0.88;
    },
  },
});

// PHASE 1: Initial approach
tl.to(camera.position, { z: 15, duration: 1.5, ease: 'none' });

// PHASE 2: Slit glows, matrix appears
tl.to(slitGlow.material, { opacity: 0.7, duration: 0.8, ease: 'none' });

tl.to(
  matrixChars.map((c) => c.material),
  { opacity: 0.9, duration: 1.5, stagger: { each: 0.008, from: 'random' }, ease: 'none' }
);

// PHASE 3: Background dims
tl.to(bgImage, { opacity: 0.75, duration: 1.5, ease: 'none' });
tl.to({}, { duration: 0.8 });

// PHASE 4: Letters float outward
tl.to(
  matrixChars.map((c) => c.position),
  {
    x: (i) => matrixChars[i].userData.floatPos.x,
    y: (i) => matrixChars[i].userData.floatPos.y,
    z: (i) => matrixChars[i].userData.floatPos.z,
    duration: 1,
    stagger: { each: 0.006, from: 'center' },
    ease: 'none',
  }
);

// PHASE 5: Letters fly to portal
tl.to(
  matrixChars.map((c) => c.position),
  {
    x: (i) => portalGroup.position.x + matrixChars[i].userData.endPos.x - matrixGroup.position.x,
    y: (i) => portalGroup.position.y + matrixChars[i].userData.endPos.y - matrixGroup.position.y,
    z: (i) => portalGroup.position.z + matrixChars[i].userData.endPos.z - matrixGroup.position.z,
    duration: 1.5,
    stagger: { each: 0.005, from: 'edges' },
    ease: 'none',
  }
);

tl.to(bgImage, { opacity: 0.3, duration: 1.2, ease: 'none' }, '<0.3');

// PHASE 6: Portal forms
tl.to(portalGroup.scale, { x: 1, y: 1, z: 1, duration: 0.8, ease: 'none' });

tl.to(portalEffects.vortex.material, { opacity: 0.8, duration: 0.8, ease: 'none' }, '<');

tl.to(
  portalEffects.darkClouds.map((c) => c.material),
  { opacity: 0.7, duration: 0.8, stagger: 0.004, ease: 'none' },
  '<0.1'
);

tl.to(
  portalEffects.portalParticles.map((p) => p.material),
  { opacity: 0.5, duration: 0.6, stagger: 0.003, ease: 'none' },
  '<0.1'
);

tl.to(
  portalEffects.sparks.map((s) => s.material),
  { opacity: 0.9, duration: 0.5, stagger: 0.004, ease: 'none' },
  '<0.1'
);

tl.to(
  portalEffects.sparkTrails.map((t) => t.material),
  { opacity: 0.7, duration: 0.5, stagger: 0.006, ease: 'none' },
  '<'
);

tl.to(
  portalEffects.portalTextParticles.map((p) => p.material),
  { opacity: 0.6, duration: 0.6, stagger: 0.002, ease: 'none' },
  '<0.1'
);

tl.to(
  portalEffects.lightRays.map((r) => r.material),
  { opacity: 0.5, duration: 0.8, stagger: 0.015, ease: 'none' },
  '<'
);

tl.to(
  portalEffects.centerParticles.map((p) => p.material),
  { opacity: 0.4, duration: 0.8, stagger: 0.01, ease: 'none' },
  '<'
);

// Fade matrix chars
tl.to(
  matrixChars.map((c) => c.material),
  { opacity: 0, duration: 0.6, ease: 'none' },
  '<0.2'
);

// PHASE 7: Camera approaches portal
tl.to(camera.position, {
  x: portalGroup.position.x * 0.6,
  y: portalGroup.position.y * 0.5,
  z: 8,
  duration: 1.8,
  ease: 'none',
});

tl.to([monolith.material, slitGlow.material], { opacity: 0, duration: 1.2, ease: 'none' }, '<0.4');
tl.to(bgImage, { opacity: 0, duration: 1.2, ease: 'none' }, '<');

tl.to(
  portalEffects.sparks.map((s) => s.material),
  { opacity: 1, duration: 1, ease: 'none' },
  '<'
);

tl.to(portalEffects.vortex.material, { opacity: 1, duration: 1, ease: 'none' }, '<');

// PHASE 8: Tunnel rush
tl.to(
  tunnelParticles.map((p) => p.material),
  { opacity: 0.7, duration: 0.4, ease: 'none' }
);

tl.to(camera.position, {
  x: portalGroup.position.x,
  y: portalGroup.position.y,
  z: portalGroup.position.z + 1,
  duration: 1.2,
  ease: 'none',
});

tl.to(portalGroup.position, { z: 15, duration: 1.2, ease: 'none' }, '<');

// PHASE 9: Effects fade out
tl.to(portalGroup.scale, { x: 0, y: 0, z: 0, duration: 0.8, ease: 'none' });

tl.to(portalEffects.vortex.material, { opacity: 0, duration: 0.8, ease: 'none' }, '<');

tl.to(
  [
    ...portalEffects.darkClouds.map((c) => c.material),
    ...portalEffects.portalParticles.map((p) => p.material),
    ...portalEffects.sparks.map((s) => s.material),
    ...portalEffects.sparkTrails.map((t) => t.material),
    ...portalEffects.portalTextParticles.map((p) => p.material),
    ...portalEffects.lightRays.map((r) => r.material),
    ...portalEffects.centerParticles.map((p) => p.material),
  ],
  { opacity: 0, duration: 0.8, ease: 'none' },
  '<'
);

tl.to(
  tunnelParticles.map((p) => p.material),
  { opacity: 0, duration: 0.8, ease: 'none' },
  '<0.2'
);

// PHASE 10: About section
tl.to(aboutSection, { opacity: 1, duration: 1.2, ease: 'none' });
tl.to(camera.position, { x: 0, y: 0, z: 10, duration: 1.2, ease: 'none' }, '<');

// Reset portal position at end for reverse
tl.set(portalGroup.position, { z: PORTAL_CONFIG.position.z });

// ============================================
// RESIZE HANDLER
// ============================================

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});