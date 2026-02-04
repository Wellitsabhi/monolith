import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

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

import '../style.css';

gsap.registerPlugin(ScrollTrigger);

// ============================================
// DOM ELEMENTS
// ============================================

const container = document.getElementById('app');
const canvas = document.getElementById('webgl');
const bgImage = document.getElementById('bg-image');
const scrollIndicator = document.getElementById('scroll-indicator');
const progressBar = document.getElementById('progress-fill');
const aboutSection = document.getElementById('about-section');

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
scene.add(portalGroup);

const portalEffects = createPortalEffects(portalGroup, textures);

// ============================================
// TUNNEL PARTICLES
// ============================================

const tunnelParticles = createTunnelParticles(scene, textures);

// ============================================
// ANIMATION STATE
// ============================================

let matrixScrolling = false;
let charsFlying = false;
let portalActive = false;
let tunnelRush = false;
let cameraFrozen = false;
let frozenCameraZ = 15;

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
  if (matrixScrolling && !charsFlying) {
    animateMatrixScroll(matrixChars, charTextures, delta);
  }

  // Portal animation
  animatePortalEffects(portalEffects, elapsed, delta, portalActive);

  // Tunnel animation
  animateTunnelParticles(tunnelParticles, delta, tunnelRush);

  renderer.render(scene, camera);
}

animate();

// ============================================
// SCROLL TIMELINE
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
      // Update progress bar
      progressBar.style.height = `${self.progress * 100}%`;
      
      // Hide scroll indicator
      scrollIndicator.style.opacity = self.progress < 0.02 ? 1 : 0;
    },
  },
});

// ============================================
// PHASE 1: Initial approach (0% - 10%)
// ============================================

tl.to(camera.position, {
  z: 15,
  duration: 1.5,
  ease: 'power1.inOut',
});

// ============================================
// PHASE 2: Slit glows, matrix appears (10% - 25%)
// ============================================

tl.to(slitGlow.material, {
  opacity: 0.7,
  duration: 0.8,
  ease: 'power2.out',
});

tl.call(() => {
  matrixScrolling = true;
  cameraFrozen = true;
  frozenCameraZ = camera.position.z;
});

// Matrix chars fade in
tl.to(
  matrixChars.map((c) => c.material),
  {
    opacity: 0.9,
    duration: 1.5,
    stagger: { each: 0.01, from: 'random' },
    ease: 'power1.out',
    onStart: () => {
      matrixChars.forEach((c) => {
        c.material.userData = { baseOpacity: 1 };
        c.visible = true;
      });
    },
  }
);

// ============================================
// PHASE 3: Matrix scrolls, slight bg dim (25% - 35%)
// ============================================

tl.to(bgImage, {
  opacity: 0.75,
  duration: 1.5,
  ease: 'power2.out',
});

// Hold for matrix scroll effect
tl.to({}, { duration: 1 });

// ============================================
// PHASE 4: Letters float outward from slit (35% - 45%)
// ============================================

tl.call(() => {
  charsFlying = true;
  matrixChars.forEach((c) => {
    c.userData.flyPhase = 1;
  });
});

// Float outward (toward camera)
tl.to(
  matrixChars.map((c) => c.position),
  {
    x: (i) => matrixChars[i].userData.floatPos.x,
    y: (i) => matrixChars[i].userData.floatPos.y,
    z: (i) => matrixChars[i].userData.floatPos.z,
    duration: 1.2,
    stagger: { each: 0.008, from: 'center' },
    ease: 'power2.out',
  }
);

// ============================================
// PHASE 5: Letters fly to portal position (45% - 55%)
// ============================================

tl.call(() => {
  matrixChars.forEach((c) => {
    c.userData.flyPhase = 2;
  });
});

// Calculate target positions relative to portal
tl.to(
  matrixChars.map((c) => c.position),
  {
    x: (i) => {
      const char = matrixChars[i];
      return portalGroup.position.x + char.userData.endPos.x - matrixGroup.position.x;
    },
    y: (i) => {
      const char = matrixChars[i];
      return portalGroup.position.y + char.userData.endPos.y - matrixGroup.position.y;
    },
    z: (i) => {
      const char = matrixChars[i];
      return portalGroup.position.z + char.userData.endPos.z - matrixGroup.position.z;
    },
    duration: 1.8,
    stagger: { each: 0.006, from: 'edges' },
    ease: 'power2.inOut',
  }
);

// Dim background more as portal forms
tl.to(
  bgImage,
  {
    opacity: 0.4,
    duration: 1.5,
    ease: 'power2.out',
  },
  '<0.3'
);

// ============================================
// PHASE 6: Portal forms (55% - 65%)
// ============================================

tl.call(() => {
  portalActive = true;
  portalGroup.visible = true;
});

// Vortex
tl.to(portalEffects.vortex.material, {
  opacity: 0.8,
  duration: 1,
  ease: 'power2.out',
});

// Energy rings
tl.to(
  portalEffects.energyRings.map((r) => r.material),
  {
    opacity: 0.6,
    duration: 1,
    stagger: 0.1,
    ease: 'power2.out',
  },
  '<0.2'
);

// Dark clouds
tl.to(
  portalEffects.darkClouds.map((c) => c.material),
  {
    opacity: 0.7,
    duration: 1,
    stagger: 0.006,
    ease: 'power2.out',
    onStart: () => {
      portalEffects.darkClouds.forEach((c) => {
        c.material.userData = { baseOpacity: 0.7 };
      });
    },
  },
  '<0.1'
);

// Dust particles
tl.to(
  portalEffects.portalParticles.map((p) => p.material),
  {
    opacity: 0.5,
    duration: 0.8,
    stagger: 0.004,
    ease: 'power2.out',
    onStart: () => {
      portalEffects.portalParticles.forEach((p) => {
        p.material.userData = { baseOpacity: 0.5 };
      });
    },
  },
  '<0.1'
);

// Sparks
tl.to(
  portalEffects.sparks.map((s) => s.material),
  {
    opacity: 0.9,
    duration: 0.6,
    stagger: 0.006,
    ease: 'power2.out',
    onStart: () => {
      portalEffects.sparks.forEach((s) => {
        s.material.userData = { baseOpacity: 0.9 };
      });
    },
  },
  '<0.1'
);

// Spark trails
tl.to(
  portalEffects.sparkTrails.map((t) => t.material),
  {
    opacity: 0.7,
    duration: 0.6,
    stagger: 0.008,
    ease: 'power2.out',
    onStart: () => {
      portalEffects.sparkTrails.forEach((t) => {
        t.material.userData = { baseOpacity: 0.7 };
      });
    },
  },
  '<'
);

// Text particles
tl.to(
  portalEffects.portalTextParticles.map((p) => p.material),
  {
    opacity: 0.6,
    duration: 0.8,
    stagger: 0.003,
    ease: 'power2.out',
    onStart: () => {
      portalEffects.portalTextParticles.forEach((p) => {
        p.material.userData = { baseOpacity: 0.6 };
      });
    },
  },
  '<0.1'
);

// Light rays
tl.to(
  portalEffects.lightRays.map((r) => r.material),
  {
    opacity: 0.5,
    duration: 1,
    stagger: 0.02,
    ease: 'power2.out',
    onStart: () => {
      portalEffects.lightRays.forEach((r) => {
        r.material.userData = { baseOpacity: 0.5 };
      });
    },
  },
  '<'
);

// Center particles
tl.to(
  portalEffects.centerParticles.map((p) => p.material),
  {
    opacity: 0.4,
    duration: 1,
    stagger: 0.015,
    ease: 'power2.out',
    onStart: () => {
      portalEffects.centerParticles.forEach((p) => {
        p.material.userData = { baseOpacity: 0.4 };
      });
    },
  },
  '<'
);

// Fade out matrix chars as they merge into portal
tl.to(
  matrixChars.map((c) => c.material),
  {
    opacity: 0,
    duration: 0.8,
    ease: 'power2.out',
  },
  '<0.3'
);

// ============================================
// PHASE 7: Camera approaches portal (65% - 75%)
// ============================================

tl.call(() => {
  cameraFrozen = false;
});

tl.to(camera.position, {
  x: portalGroup.position.x * 0.6,
  y: portalGroup.position.y * 0.5,
  z: 8,
  duration: 2,
  ease: 'power1.inOut',
});

// Monolith fades
tl.to(
  [monolith.material, slitGlow.material],
  {
    opacity: 0,
    duration: 1.5,
    ease: 'power2.out',
  },
  '<0.5'
);

// Background fades completely
tl.to(
  bgImage,
  {
    opacity: 0,
    duration: 1.5,
    ease: 'power2.out',
  },
  '<'
);

// Intensify portal
tl.to(
  portalEffects.sparks.map((s) => s.material),
  {
    opacity: 1,
    duration: 1.5,
    ease: 'power1.in',
  },
  '<'
);

// ============================================
// PHASE 8: Enter portal - tunnel rush (75% - 85%)
// ============================================

tl.call(() => {
  tunnelRush = true;
  tunnelParticles.forEach((p) => (p.visible = true));
});

tl.to(
  tunnelParticles.map((p) => p.material),
  {
    opacity: 0.7,
    duration: 0.4,
    ease: 'power2.out',
    onStart: () => {
      tunnelParticles.forEach((p) => {
        p.material.userData = { baseOpacity: 0.7 };
      });
    },
  }
);

tl.to(camera.position, {
  x: portalGroup.position.x,
  y: portalGroup.position.y,
  z: portalGroup.position.z + 1,
  duration: 1.5,
  ease: 'power2.in',
});

tl.to(
  portalGroup.position,
  {
    z: 15,
    duration: 1.5,
    ease: 'power2.in',
  },
  '<'
);

// ============================================
// PHASE 9: Through portal - fade out effects (85% - 92%)
// ============================================

tl.call(() => {
  tunnelRush = false;
});

// Fade out all portal effects
const allPortalMaterials = [
  portalEffects.vortex.material,
  ...portalEffects.energyRings.map((r) => r.material),
  ...portalEffects.darkClouds.map((c) => c.material),
  ...portalEffects.portalParticles.map((p) => p.material),
  ...portalEffects.sparks.map((s) => s.material),
  ...portalEffects.sparkTrails.map((t) => t.material),
  ...portalEffects.portalTextParticles.map((p) => p.material),
  ...portalEffects.lightRays.map((r) => r.material),
  ...portalEffects.centerParticles.map((p) => p.material),
  ...tunnelParticles.map((p) => p.material),
];

tl.to(allPortalMaterials, {
  opacity: 0,
  duration: 1,
  ease: 'power2.out',
});

// ============================================
// PHASE 10: About section appears (92% - 100%)
// ============================================

tl.call(() => {
  portalActive = false;
  // Hide 3D elements
  portalGroup.visible = false;
  tunnelParticles.forEach((p) => (p.visible = false));
  matrixChars.forEach((c) => (c.visible = false));
  monolith.visible = false;
  slitGlow.visible = false;
});

tl.to(aboutSection, {
  opacity: 1,
  duration: 1.5,
  ease: 'power2.out',
});

tl.to(camera.position, {
  x: 0,
  y: 0,
  z: 10,
  duration: 1.5,
  ease: 'power2.out',
}, '<');

// ============================================
// BIDIRECTIONAL SCROLL HANDLING
// ============================================

let lastProgress = 0;

ScrollTrigger.create({
  trigger: container,
  start: 'top top',
  end: '+=900%',
  onUpdate: (self) => {
    const progress = self.progress;
    const direction = progress > lastProgress ? 1 : -1;
    lastProgress = progress;

    if (direction === -1) {
      // Scrolling backward

      // If we go back before about section
      if (progress < 0.92) {
        aboutSection.style.opacity = 0;
        portalGroup.visible = true;
        monolith.visible = true;
        slitGlow.visible = true;
        portalActive = true;
      }

      // If we go back before tunnel
      if (progress < 0.75) {
        tunnelParticles.forEach((p) => (p.visible = true));
        tunnelRush = true;
      }

      // If we go back before portal fade intensify
      if (progress < 0.65) {
        tunnelRush = false;
      }

      // If we go back before portal formation
      if (progress < 0.55) {
        matrixChars.forEach((c) => (c.visible = true));
      }

      // If we go back before letters fly to portal
      if (progress < 0.45) {
        charsFlying = true;
      }

      // If we go back before letters float out
      if (progress < 0.35) {
        charsFlying = false;
        matrixScrolling = true;
      }

      // If we go back to very beginning
      if (progress < 0.1) {
        matrixScrolling = false;
        portalActive = false;
        
        // Reset everything
        resetPortalEffects(portalEffects);
        resetMatrixChars(matrixChars);
        resetTunnelParticles(tunnelParticles);
        
        // Reset monolith
        monolith.material.opacity = 1;
        slitGlow.material.opacity = 0;
        
        // Reset camera
        cameraFrozen = false;
      }
    }
  },
});

// ============================================
// RESIZE HANDLER
// ============================================

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});