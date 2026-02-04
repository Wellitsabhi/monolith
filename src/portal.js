import * as THREE from 'three';
import {
  createDustTexture,
  createDarkCloudTexture,
  createSparkTexture,
  createSparkTrailTexture,
  createSmallCharTexture,
  createLightRayTexture,
  createCharacterTexture,
  createVortexTexture,
  createEnergyRingTexture,
  CHARACTERS,
} from '../functions/textures.js';

// Monolith is ~12 units tall, matrix should be 20% = ~2.4 units
export const MONOLITH_HEIGHT = 12;

export const PORTAL_CONFIG = {
  radius: 1.8,
  position: { x: 1.8, y: -4.5, z: 1.5 }, // Bottom-right of monolith
  darkCloudCount: 60,
  dustCount: 80,
  sparkCount: 50,
  sparkTrailCount: 30,
  textCount: 100,
  lightRayCount: 16,
  centerParticleCount: 20,
};

export const MATRIX_CONFIG = {
  columns: 4,
  charsPerColumn: 12,
  columnSpacing: 0.25,
  charHeight: 0.2,
  charSize: 0.15,
  // Position at slit (front center of monolith, upper portion)
  startZ: 1.35,
  startY: 2,
};

export const TUNNEL_CONFIG = {
  particleCount: 100,
};

export function createPortalEffects(portalGroup, textures) {
  const { dustTexture, darkCloudTexture, sparkTexture, sparkTrailTexture, lightRayTexture, smallCharTextures } = textures;
  
  const effects = {
    darkClouds: [],
    portalParticles: [],
    sparks: [],
    sparkTrails: [],
    portalTextParticles: [],
    lightRays: [],
    centerParticles: [],
    vortex: null,
    energyRings: [],
  };

  // Vortex center
  const vortexTexture = createVortexTexture();
  const vortexGeo = new THREE.PlaneGeometry(PORTAL_CONFIG.radius * 2.5, PORTAL_CONFIG.radius * 2.5);
  const vortexMat = new THREE.MeshBasicMaterial({
    map: vortexTexture,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  effects.vortex = new THREE.Mesh(vortexGeo, vortexMat);
  effects.vortex.position.z = -0.3;
  portalGroup.add(effects.vortex);

  // Energy rings
  const ringTexture = createEnergyRingTexture();
  for (let i = 0; i < 3; i++) {
    const scale = 0.8 + i * 0.4;
    const ringGeo = new THREE.PlaneGeometry(PORTAL_CONFIG.radius * 2 * scale, PORTAL_CONFIG.radius * 2 * scale);
    const ringMat = new THREE.MeshBasicMaterial({
      map: ringTexture,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.z = -0.2 - i * 0.1;
    ring.userData = {
      rotationSpeed: 0.3 + i * 0.2,
      pulseSpeed: 1.5 + i * 0.5,
      phase: i * Math.PI / 3,
      baseScale: scale,
    };
    effects.energyRings.push(ring);
    portalGroup.add(ring);
  }

  // Dark clouds
  for (let i = 0; i < PORTAL_CONFIG.darkCloudCount; i++) {
    const size = 0.6 + Math.random() * 1.2;
    const geo = new THREE.PlaneGeometry(size, size);
    const mat = new THREE.MeshBasicMaterial({
      map: darkCloudTexture,
      transparent: true,
      opacity: 0,
      blending: THREE.NormalBlending,
      depthWrite: false,
    });

    const cloud = new THREE.Mesh(geo, mat);
    const angle = Math.random() * Math.PI * 2;
    const radiusVar = PORTAL_CONFIG.radius * 0.6 + Math.random() * PORTAL_CONFIG.radius * 0.6;
    const zVar = (Math.random() - 0.5) * 0.8;

    cloud.position.set(
      Math.cos(angle) * radiusVar,
      Math.sin(angle) * radiusVar,
      zVar
    );
    cloud.rotation.z = Math.random() * Math.PI * 2;

    cloud.userData = {
      angle,
      radius: radiusVar,
      baseZ: zVar,
      orbitSpeed: 0.2 + Math.random() * 0.25,
      wobbleSpeed: 0.6 + Math.random() * 0.8,
      wobbleAmount: 0.15 + Math.random() * 0.25,
      phase: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.4,
      initial: { angle, radius: radiusVar, z: zVar },
    };

    effects.darkClouds.push(cloud);
    portalGroup.add(cloud);
  }

  // Portal dust
  for (let i = 0; i < PORTAL_CONFIG.dustCount; i++) {
    const size = 0.1 + Math.random() * 0.25;
    const geo = new THREE.PlaneGeometry(size, size);
    const mat = new THREE.MeshBasicMaterial({
      map: dustTexture,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particle = new THREE.Mesh(geo, mat);
    const angle = Math.random() * Math.PI * 2;
    const radiusVar = PORTAL_CONFIG.radius * 0.8 + (Math.random() - 0.5) * 0.6;
    const zVar = (Math.random() - 0.5) * 0.5;

    particle.position.set(
      Math.cos(angle) * radiusVar,
      Math.sin(angle) * radiusVar,
      zVar
    );

    particle.userData = {
      angle,
      radius: radiusVar,
      baseZ: zVar,
      orbitSpeed: 0.4 + Math.random() * 0.5,
      wobbleSpeed: 1.2 + Math.random() * 1.5,
      wobbleAmount: 0.1 + Math.random() * 0.2,
      phase: Math.random() * Math.PI * 2,
      initial: { angle, radius: radiusVar, z: zVar },
    };

    effects.portalParticles.push(particle);
    portalGroup.add(particle);
  }

  // Sparks
  for (let i = 0; i < PORTAL_CONFIG.sparkCount; i++) {
    const size = 0.05 + Math.random() * 0.1;
    const geo = new THREE.PlaneGeometry(size, size);
    const mat = new THREE.MeshBasicMaterial({
      map: sparkTexture,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const spark = new THREE.Mesh(geo, mat);
    const angle = Math.random() * Math.PI * 2;
    const radiusVar = PORTAL_CONFIG.radius * 0.9 + (Math.random() - 0.5) * 0.8;
    const zVar = (Math.random() - 0.5) * 0.4;

    spark.position.set(
      Math.cos(angle) * radiusVar,
      Math.sin(angle) * radiusVar,
      zVar
    );

    spark.userData = {
      angle,
      radius: radiusVar,
      baseZ: zVar,
      orbitSpeed: 0.7 + Math.random() * 0.6,
      flickerSpeed: 10 + Math.random() * 12,
      phase: Math.random() * Math.PI * 2,
      initial: { angle, radius: radiusVar, z: zVar },
    };

    effects.sparks.push(spark);
    portalGroup.add(spark);
  }

  // Spark trails
  for (let i = 0; i < PORTAL_CONFIG.sparkTrailCount; i++) {
    const length = 0.2 + Math.random() * 0.4;
    const geo = new THREE.PlaneGeometry(0.04, length);
    const mat = new THREE.MeshBasicMaterial({
      map: sparkTrailTexture,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const trail = new THREE.Mesh(geo, mat);
    const angle = Math.random() * Math.PI * 2;
    const radiusVar = PORTAL_CONFIG.radius + (Math.random() - 0.5) * 0.5;
    const zVar = (Math.random() - 0.5) * 0.3;

    trail.position.set(
      Math.cos(angle) * radiusVar,
      Math.sin(angle) * radiusVar,
      zVar
    );
    trail.rotation.z = angle + Math.PI / 2;

    trail.userData = {
      angle,
      radius: radiusVar,
      baseZ: zVar,
      orbitSpeed: 0.8 + Math.random() * 0.4,
      flickerSpeed: 8 + Math.random() * 8,
      phase: Math.random() * Math.PI * 2,
      initial: { angle, radius: radiusVar, z: zVar, rotZ: angle + Math.PI / 2 },
    };

    effects.sparkTrails.push(trail);
    portalGroup.add(trail);
  }

  // Text particles in portal
  for (let i = 0; i < PORTAL_CONFIG.textCount; i++) {
    const char = CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
    const geo = new THREE.PlaneGeometry(0.1, 0.1);
    const mat = new THREE.MeshBasicMaterial({
      map: smallCharTextures[char],
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particle = new THREE.Mesh(geo, mat);
    const angle = Math.random() * Math.PI * 2;
    const radiusVar = PORTAL_CONFIG.radius * 0.4 + Math.random() * PORTAL_CONFIG.radius * 0.7;
    const zVar = (Math.random() - 0.5) * 0.6;

    particle.position.set(
      Math.cos(angle) * radiusVar,
      Math.sin(angle) * radiusVar,
      zVar
    );

    particle.userData = {
      angle,
      radius: radiusVar,
      baseZ: zVar,
      orbitSpeed: 0.35 + Math.random() * 0.4,
      wobbleSpeed: 2.5 + Math.random() * 2,
      wobbleAmount: 0.08 + Math.random() * 0.15,
      phase: Math.random() * Math.PI * 2,
      initial: { angle, radius: radiusVar, z: zVar },
    };

    effects.portalTextParticles.push(particle);
    portalGroup.add(particle);
  }

  // Light rays
  for (let i = 0; i < PORTAL_CONFIG.lightRayCount; i++) {
    const length = 0.8 + Math.random() * 1.2;
    const geo = new THREE.PlaneGeometry(0.04 + Math.random() * 0.04, length);
    const mat = new THREE.MeshBasicMaterial({
      map: lightRayTexture,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const ray = new THREE.Mesh(geo, mat);
    const angle = (i / PORTAL_CONFIG.lightRayCount) * Math.PI * 2;

    ray.position.set(0, 0, -0.15);
    ray.rotation.z = angle + Math.PI / 2;

    ray.userData = {
      baseAngle: angle,
      length,
      pulseSpeed: 2.5 + Math.random() * 1.5,
      phase: Math.random() * Math.PI * 2,
    };

    effects.lightRays.push(ray);
    portalGroup.add(ray);
  }

  // Center glow particles
  for (let i = 0; i < PORTAL_CONFIG.centerParticleCount; i++) {
    const size = 0.15 + Math.random() * 0.3;
    const geo = new THREE.PlaneGeometry(size, size);
    const mat = new THREE.MeshBasicMaterial({
      map: dustTexture,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particle = new THREE.Mesh(geo, mat);
    const dist = Math.random() * 0.8;
    const angle = Math.random() * Math.PI * 2;
    const zVar = -0.35 + Math.random() * 0.2;

    particle.position.set(
      Math.cos(angle) * dist,
      Math.sin(angle) * dist,
      zVar
    );

    particle.userData = {
      angle,
      dist,
      baseZ: zVar,
      driftSpeed: 0.5 + Math.random() * 0.4,
      pulseSpeed: 1.5 + Math.random() * 1.5,
      phase: Math.random() * Math.PI * 2,
      initial: { angle, dist, z: zVar },
    };

    effects.centerParticles.push(particle);
    portalGroup.add(particle);
  }

  return effects;
}

export function createMatrixChars(matrixGroup, charTextures) {
  const chars = [];
  const totalHeight = MATRIX_CONFIG.charsPerColumn * MATRIX_CONFIG.charHeight;

  for (let col = 0; col < MATRIX_CONFIG.columns; col++) {
    const colX = (col - (MATRIX_CONFIG.columns - 1) / 2) * MATRIX_CONFIG.columnSpacing;
    const direction = col % 2 === 0 ? 1 : -1;

    for (let i = 0; i < MATRIX_CONFIG.charsPerColumn; i++) {
      const char = CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];

      const charMat = new THREE.MeshBasicMaterial({
        map: charTextures[char],
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      const charGeo = new THREE.PlaneGeometry(MATRIX_CONFIG.charSize, MATRIX_CONFIG.charSize);
      const charMesh = new THREE.Mesh(charGeo, charMat);

      const startY = MATRIX_CONFIG.startY + (i - MATRIX_CONFIG.charsPerColumn / 2) * MATRIX_CONFIG.charHeight;
      charMesh.position.set(colX, startY, 0);

      // Target position in portal (bottom-right of monolith)
      const endAngle = Math.random() * Math.PI * 2;
      const endRadius = PORTAL_CONFIG.radius * 0.5 + Math.random() * PORTAL_CONFIG.radius * 0.6;

      charMesh.userData = {
        column: col,
        index: i,
        direction,
        speed: 0.8 + Math.random() * 0.5,
        baseY: startY,
        colX,
        char,
        endAngle,
        endRadius,
        // End position relative to portal
        endPos: new THREE.Vector3(
          Math.cos(endAngle) * endRadius,
          Math.sin(endAngle) * endRadius,
          (Math.random() - 0.5) * 0.4
        ),
        // Intermediate float position (outward from slit)
        floatPos: new THREE.Vector3(
          colX + (Math.random() - 0.5) * 0.5,
          startY + (Math.random() - 0.5) * 0.3,
          1.0 + Math.random() * 0.5
        ),
        flyPhase: 0, // 0: at slit, 1: floating, 2: at portal
        initial: { x: colX, y: startY, z: 0 },
      };

      chars.push(charMesh);
      matrixGroup.add(charMesh);
    }
  }

  return chars;
}

export function createTunnelParticles(scene, textures) {
  const { dustTexture, sparkTexture, darkCloudTexture } = textures;
  const particles = [];

  for (let i = 0; i < TUNNEL_CONFIG.particleCount; i++) {
    const size = 0.08 + Math.random() * 0.2;
    const geo = new THREE.PlaneGeometry(size, size);
    const textureChoice = Math.random();
    let tex;
    if (textureChoice < 0.4) tex = dustTexture;
    else if (textureChoice < 0.7) tex = sparkTexture;
    else tex = darkCloudTexture;

    const mat = new THREE.MeshBasicMaterial({
      map: tex,
      transparent: true,
      opacity: 0,
      blending: textureChoice > 0.7 ? THREE.NormalBlending : THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particle = new THREE.Mesh(geo, mat);
    const angle = Math.random() * Math.PI * 2;
    const radius = 0.8 + Math.random() * 3;
    const zPos = -8 - Math.random() * 20;

    particle.position.set(
      Math.cos(angle) * radius,
      Math.sin(angle) * radius,
      zPos
    );

    particle.userData = {
      baseAngle: angle,
      baseRadius: radius,
      baseZ: zPos,
      speed: 12 + Math.random() * 10,
      spiralSpeed: 1.2 + Math.random() * 1.5,
      initial: { angle, radius, z: zPos },
    };

    particles.push(particle);
    scene.add(particle);
  }

  return particles;
}

export function animatePortalEffects(effects, elapsed, delta, active) {
  if (!active) return;

  const { darkClouds, portalParticles, sparks, sparkTrails, portalTextParticles, lightRays, centerParticles, vortex, energyRings } = effects;

  // Vortex rotation
  if (vortex) {
    vortex.rotation.z -= delta * 0.3;
  }

  // Energy rings
  energyRings.forEach((ring) => {
    const data = ring.userData;
    ring.rotation.z += delta * data.rotationSpeed;
    const pulse = 0.9 + 0.1 * Math.sin(elapsed * data.pulseSpeed + data.phase);
    ring.scale.setScalar(pulse);
  });

  darkClouds.forEach((cloud) => {
    const data = cloud.userData;
    data.angle += delta * data.orbitSpeed;

    const wobble = Math.sin(elapsed * data.wobbleSpeed + data.phase) * data.wobbleAmount;
    const r = data.radius + wobble;

    cloud.position.x = Math.cos(data.angle) * r;
    cloud.position.y = Math.sin(data.angle) * r;
    cloud.position.z = data.baseZ + Math.sin(elapsed * data.wobbleSpeed * 0.4 + data.phase) * 0.1;
    cloud.rotation.z += delta * data.rotationSpeed;
  });

  portalParticles.forEach((particle) => {
    const data = particle.userData;
    data.angle += delta * data.orbitSpeed;

    const wobble = Math.sin(elapsed * data.wobbleSpeed + data.phase) * data.wobbleAmount;
    const r = data.radius + wobble;

    particle.position.x = Math.cos(data.angle) * r;
    particle.position.y = Math.sin(data.angle) * r;
    particle.position.z = data.baseZ + Math.sin(elapsed * data.wobbleSpeed * 0.5 + data.phase) * 0.15;
  });

  sparks.forEach((spark) => {
    const data = spark.userData;
    data.angle += delta * data.orbitSpeed;

    const r = data.radius + Math.sin(elapsed * data.flickerSpeed + data.phase) * 0.1;
    spark.position.x = Math.cos(data.angle) * r;
    spark.position.y = Math.sin(data.angle) * r;

    const baseOp = spark.material.userData?.baseOpacity || 0.9;
    spark.material.opacity = baseOp * (0.5 + 0.5 * Math.abs(Math.sin(elapsed * data.flickerSpeed + data.phase)));
  });

  sparkTrails.forEach((trail) => {
    const data = trail.userData;
    data.angle += delta * data.orbitSpeed;

    trail.position.x = Math.cos(data.angle) * data.radius;
    trail.position.y = Math.sin(data.angle) * data.radius;
    trail.rotation.z = data.angle + Math.PI / 2;

    const baseOp = trail.material.userData?.baseOpacity || 0.7;
    trail.material.opacity = baseOp * (0.6 + 0.4 * Math.sin(elapsed * data.flickerSpeed + data.phase));
  });

  portalTextParticles.forEach((particle) => {
    const data = particle.userData;
    data.angle += delta * data.orbitSpeed;

    const wobble = Math.sin(elapsed * data.wobbleSpeed + data.phase) * data.wobbleAmount;
    const r = data.radius + wobble;

    particle.position.x = Math.cos(data.angle) * r;
    particle.position.y = Math.sin(data.angle) * r;
  });

  lightRays.forEach((ray) => {
    const data = ray.userData;
    const pulse = 0.6 + 0.4 * Math.sin(elapsed * data.pulseSpeed + data.phase);
    ray.scale.y = pulse;
    ray.material.opacity = (ray.material.userData?.baseOpacity || 0.5) * pulse;
  });

  centerParticles.forEach((particle) => {
    const data = particle.userData;
    data.angle += delta * data.driftSpeed;
    particle.position.x = Math.cos(data.angle) * data.dist;
    particle.position.y = Math.sin(data.angle) * data.dist;

    const pulse = 0.7 + 0.3 * Math.sin(elapsed * data.pulseSpeed + data.phase);
    particle.material.opacity = (particle.material.userData?.baseOpacity || 0.4) * pulse;
  });
}

export function animateTunnelParticles(particles, delta, active) {
  if (!active) return;

  particles.forEach((particle) => {
    const data = particle.userData;

    particle.position.z += data.speed * delta;
    data.baseAngle += delta * data.spiralSpeed;
    particle.position.x = Math.cos(data.baseAngle) * data.baseRadius;
    particle.position.y = Math.sin(data.baseAngle) * data.baseRadius;

    if (particle.position.z > 8) {
      particle.position.z = -20 - Math.random() * 8;
      data.baseAngle = Math.random() * Math.PI * 2;
      data.baseRadius = 0.8 + Math.random() * 3;
    }

    const dist = Math.abs(particle.position.z);
    const fadeIn = Math.min(1, (20 - dist) / 8);
    const fadeOut = Math.min(1, dist / 3);
    particle.material.opacity = (particle.material.userData?.baseOpacity || 0.6) * fadeIn * fadeOut;
  });
}

export function animateMatrixScroll(chars, charTextures, delta) {
  const totalHeight = MATRIX_CONFIG.charsPerColumn * MATRIX_CONFIG.charHeight;
  const halfHeight = totalHeight / 2;

  chars.forEach((char) => {
    const data = char.userData;
    if (data.flyPhase > 0) return; // Don't scroll if flying

    char.position.y += data.direction * data.speed * delta;

    if (data.direction > 0 && char.position.y > data.baseY + halfHeight) {
      char.position.y = data.baseY - halfHeight;
      const newChar = CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
      char.material.map = charTextures[newChar];
    } else if (data.direction < 0 && char.position.y < data.baseY - halfHeight) {
      char.position.y = data.baseY + halfHeight;
      const newChar = CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
      char.material.map = charTextures[newChar];
    }

    // Edge fade
    const relativeY = char.position.y - data.baseY;
    const normalizedY = (relativeY + halfHeight) / totalHeight;
    const edgeFade = Math.sin(normalizedY * Math.PI);
    const targetOpacity = Math.pow(edgeFade, 0.5) * 0.9;

    if (char.material.userData?.baseOpacity !== undefined) {
      char.material.opacity = targetOpacity * char.material.userData.baseOpacity;
    }
  });
}

// Reset functions for bidirectional scroll
export function resetPortalEffects(effects) {
  const { darkClouds, portalParticles, sparks, sparkTrails, portalTextParticles, lightRays, centerParticles, vortex, energyRings } = effects;

  // Reset vortex
  if (vortex) {
    vortex.rotation.z = 0;
    vortex.material.opacity = 0;
  }

  // Reset energy rings
  energyRings.forEach((ring) => {
    ring.rotation.z = 0;
    ring.scale.setScalar(ring.userData.baseScale);
    ring.material.opacity = 0;
  });

  // Reset all particles to initial positions
  [...darkClouds, ...portalParticles, ...sparks, ...portalTextParticles, ...centerParticles].forEach((item) => {
    const data = item.userData;
    if (data.initial) {
      data.angle = data.initial.angle;
      data.radius = data.initial.radius;
      data.baseZ = data.initial.z;
      if (data.dist !== undefined) data.dist = data.initial.dist;
      item.position.set(
        Math.cos(data.angle) * (data.radius || data.dist),
        Math.sin(data.angle) * (data.radius || data.dist),
        data.baseZ
      );
    }
    item.material.opacity = 0;
    if (item.material.userData) item.material.userData.baseOpacity = undefined;
  });

  sparkTrails.forEach((trail) => {
    const data = trail.userData;
    if (data.initial) {
      data.angle = data.initial.angle;
      data.radius = data.initial.radius;
      data.baseZ = data.initial.z;
      trail.position.set(
        Math.cos(data.angle) * data.radius,
        Math.sin(data.angle) * data.radius,
        data.baseZ
      );
      trail.rotation.z = data.initial.rotZ;
    }
    trail.material.opacity = 0;
    if (trail.material.userData) trail.material.userData.baseOpacity = undefined;
  });

  lightRays.forEach((ray) => {
    ray.scale.y = 1;
    ray.material.opacity = 0;
    if (ray.material.userData) ray.material.userData.baseOpacity = undefined;
  });
}

export function resetMatrixChars(chars) {
  chars.forEach((char) => {
    const data = char.userData;
    data.flyPhase = 0;
    char.position.set(data.initial.x, data.initial.y, data.initial.z);
    char.material.opacity = 0;
    if (char.material.userData) char.material.userData.baseOpacity = undefined;
  });
}

export function resetTunnelParticles(particles) {
  particles.forEach((particle) => {
    const data = particle.userData;
    data.baseAngle = data.initial.angle;
    data.baseRadius = data.initial.radius;
    particle.position.set(
      Math.cos(data.baseAngle) * data.baseRadius,
      Math.sin(data.baseAngle) * data.baseRadius,
      data.initial.z
    );
    particle.material.opacity = 0;
    if (particle.material.userData) particle.material.userData.baseOpacity = undefined;
  });
}

export function setAllVisible(effects, matrixChars, tunnelParticles, visible) {
  const { darkClouds, portalParticles, sparks, sparkTrails, portalTextParticles, lightRays, centerParticles, vortex, energyRings } = effects;

  if (vortex) vortex.visible = visible;
  energyRings.forEach((r) => (r.visible = visible));
  darkClouds.forEach((c) => (c.visible = visible));
  portalParticles.forEach((p) => (p.visible = visible));
  sparks.forEach((s) => (s.visible = visible));
  sparkTrails.forEach((t) => (t.visible = visible));
  portalTextParticles.forEach((p) => (p.visible = visible));
  lightRays.forEach((r) => (r.visible = visible));
  centerParticles.forEach((p) => (p.visible = visible));
  matrixChars.forEach((c) => (c.visible = visible));
  tunnelParticles.forEach((p) => (p.visible = visible));
}