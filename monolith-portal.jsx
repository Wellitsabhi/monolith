const { useState, useEffect, useRef } = React;

// ============================================
// TEXTURE CREATORS - PBR REALISTIC GRAINY
// ============================================

function createDustTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");

  const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  gradient.addColorStop(0, "rgba(255, 255, 255, 0.7)");
  gradient.addColorStop(0.2, "rgba(200, 230, 220, 0.4)");
  gradient.addColorStop(0.5, "rgba(100, 150, 130, 0.2)");
  gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 128, 128);

  // Add grain noise for PBR feel
  const imageData = ctx.getImageData(0, 0, 128, 128);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 30;
    data[i] = Math.max(0, Math.min(255, data[i] + noise));
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
  }
  ctx.putImageData(imageData, 0, 0);

  return new THREE.CanvasTexture(canvas);
}

function createDarkCloudTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");

  // Dark thunderstorm cloud - minimal green tint
  const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  gradient.addColorStop(0, "rgba(40, 45, 50, 0.9)");
  gradient.addColorStop(0.2, "rgba(30, 35, 40, 0.7)");
  gradient.addColorStop(0.4, "rgba(25, 28, 32, 0.5)");
  gradient.addColorStop(0.6, "rgba(20, 22, 25, 0.3)");
  gradient.addColorStop(0.8, "rgba(15, 17, 20, 0.15)");
  gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 256, 256);

  // Add heavy grain for realistic smoke
  const imageData = ctx.getImageData(0, 0, 256, 256);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 50;
    data[i] = Math.max(0, Math.min(255, data[i] + noise));
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
  }
  ctx.putImageData(imageData, 0, 0);

  // Add some cloud-like blobs
  for (let i = 0; i < 8; i++) {
    const x = 64 + Math.random() * 128;
    const y = 64 + Math.random() * 128;
    const r = 20 + Math.random() * 40;

    const blobGrad = ctx.createRadialGradient(x, y, 0, x, y, r);
    blobGrad.addColorStop(0, "rgba(50, 55, 60, 0.4)");
    blobGrad.addColorStop(1, "rgba(0, 0, 0, 0)");

    ctx.fillStyle = blobGrad;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  return new THREE.CanvasTexture(canvas);
}

function createSparkTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");

  // Sharp bright center
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
  gradient.addColorStop(0.05, "rgba(255, 255, 255, 0.95)");
  gradient.addColorStop(0.1, "rgba(220, 255, 240, 0.8)");
  gradient.addColorStop(0.2, "rgba(150, 220, 200, 0.4)");
  gradient.addColorStop(0.4, "rgba(80, 150, 130, 0.15)");
  gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);

  // Add grain
  const imageData = ctx.getImageData(0, 0, 64, 64);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] > 50) {
      const noise = (Math.random() - 0.5) * 20;
      data[i] = Math.max(0, Math.min(255, data[i] + noise));
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
    }
  }
  ctx.putImageData(imageData, 0, 0);

  return new THREE.CanvasTexture(canvas);
}

function createSparkTrailTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 8;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");

  // Streak/trail shape
  const gradient = ctx.createLinearGradient(0, 0, 0, 64);
  gradient.addColorStop(0, "rgba(255, 255, 255, 0)");
  gradient.addColorStop(0.3, "rgba(200, 240, 230, 0.6)");
  gradient.addColorStop(0.5, "rgba(255, 255, 255, 1)");
  gradient.addColorStop(0.7, "rgba(200, 240, 230, 0.6)");
  gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 8, 64);

  // Horizontal fade
  const hGradient = ctx.createLinearGradient(0, 0, 8, 0);
  hGradient.addColorStop(0, "rgba(0, 0, 0, 0)");
  hGradient.addColorStop(0.3, "rgba(255, 255, 255, 1)");
  hGradient.addColorStop(0.7, "rgba(255, 255, 255, 1)");
  hGradient.addColorStop(1, "rgba(0, 0, 0, 0)");

  ctx.globalCompositeOperation = "destination-in";
  ctx.fillStyle = hGradient;
  ctx.fillRect(0, 0, 8, 64);

  return new THREE.CanvasTexture(canvas);
}

function createCharacterTexture(char) {
  const canvas = document.createElement("canvas");
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext("2d");

  ctx.shadowBlur = 8;
  ctx.shadowColor = "rgba(200, 255, 230, 0.9)";
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 20px Courier New";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(char, 16, 16);

  ctx.shadowBlur = 4;
  ctx.fillText(char, 16, 16);

  return new THREE.CanvasTexture(canvas);
}

function createSmallCharTexture(char) {
  const canvas = document.createElement("canvas");
  canvas.width = 16;
  canvas.height = 16;
  const ctx = canvas.getContext("2d");

  ctx.shadowBlur = 4;
  ctx.shadowColor = "rgba(200, 255, 230, 0.8)";
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 10px Courier New";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(char, 8, 8);

  return new THREE.CanvasTexture(canvas);
}

function createLightRayTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 8;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");

  const gradient = ctx.createLinearGradient(0, 0, 0, 128);
  gradient.addColorStop(0, "rgba(255, 255, 255, 0)");
  gradient.addColorStop(0.3, "rgba(200, 255, 230, 0.5)");
  gradient.addColorStop(0.5, "rgba(255, 255, 255, 0.8)");
  gradient.addColorStop(0.7, "rgba(200, 255, 230, 0.5)");
  gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 8, 128);

  return new THREE.CanvasTexture(canvas);
}

function createAboutTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 1920;
  canvas.height = 1080;
  const ctx = canvas.getContext("2d");

  const bgGrad = ctx.createLinearGradient(0, 0, 0, 1080);
  bgGrad.addColorStop(0, "#0a1f15");
  bgGrad.addColorStop(0.5, "#051210");
  bgGrad.addColorStop(1, "#020a08");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1920, 1080);

  ctx.strokeStyle = "rgba(61, 166, 122, 0.06)";
  ctx.lineWidth = 1;
  for (let i = 0; i < 1920; i += 60) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, 1080);
    ctx.stroke();
  }
  for (let i = 0; i < 1080; i += 60) {
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(1920, i);
    ctx.stroke();
  }

  ctx.shadowBlur = 50;
  ctx.shadowColor = "rgba(61, 166, 122, 0.8)";
  ctx.fillStyle = "#5fcf9f";
  ctx.font = "bold 72px Courier New";
  ctx.textAlign = "center";
  ctx.fillText("ABOUT THE MONOLITH", 960, 150);

  ctx.shadowBlur = 20;
  ctx.font = "24px Courier New";
  ctx.fillStyle = "rgba(95, 207, 159, 0.7)";
  ctx.fillText("Beyond the Portal • Another Dimension", 960, 200);

  ctx.shadowBlur = 15;
  const lineGrad = ctx.createLinearGradient(300, 0, 1620, 0);
  lineGrad.addColorStop(0, "transparent");
  lineGrad.addColorStop(0.2, "#3da67a");
  lineGrad.addColorStop(0.8, "#3da67a");
  lineGrad.addColorStop(1, "transparent");
  ctx.strokeStyle = lineGrad;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(300, 240);
  ctx.lineTo(1620, 240);
  ctx.stroke();

  ctx.shadowBlur = 0;
  ctx.textAlign = "left";
  ctx.fillStyle = "#aaccbb";
  ctx.font = "22px Courier New";

  const paragraphs = [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    "Ut enim ad minim veniam, quis nostrud exercitation ullamco.",
    "",
    "Duis aute irure dolor in reprehenderit in voluptate velit esse.",
    "Excepteur sint occaecat cupidatat non proident, sunt in culpa.",
  ];
  paragraphs.forEach((text, i) => {
    ctx.fillText(text, 200, 310 + i * 38);
  });

  function drawFeatureBox(x, y, title, lines) {
    ctx.shadowBlur = 15;
    ctx.shadowColor = "rgba(61, 166, 122, 0.4)";
    ctx.strokeStyle = "rgba(61, 166, 122, 0.5)";
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, 450, 200);

    ctx.fillStyle = "rgba(61, 166, 122, 0.08)";
    ctx.fillRect(x, y, 450, 200);

    ctx.shadowBlur = 25;
    ctx.fillStyle = "#5fcf9f";
    ctx.font = "bold 28px Courier New";
    ctx.fillText(title, x + 40, y + 60);

    ctx.shadowBlur = 0;
    ctx.fillStyle = "#8ab8a0";
    ctx.font = "18px Courier New";
    lines.forEach((line, i) => {
      ctx.fillText(line, x + 40, y + 110 + i * 30);
    });
  }

  drawFeatureBox(200, 550, "Dimension Alpha", [
    "The first realm beyond the portal.",
    "Reality bends to consciousness.",
    "Time flows differently here.",
  ]);

  drawFeatureBox(720, 550, "Quantum Matrix", [
    "The structure connecting all.",
    "Navigate infinite possibilities.",
    "Parallel realities converge.",
  ]);

  drawFeatureBox(1240, 550, "Energy Nexus", [
    "Pure dimensional energy flows.",
    "Harness the cosmic current.",
    "Become one with the void.",
  ]);

  ctx.shadowBlur = 30;
  ctx.shadowColor = "rgba(61, 166, 122, 0.5)";
  ctx.strokeStyle = "rgba(95, 207, 159, 0.6)";
  ctx.lineWidth = 3;
  ctx.strokeRect(200, 820, 1520, 140);

  const welcomeGrad = ctx.createLinearGradient(200, 820, 1720, 960);
  welcomeGrad.addColorStop(0, "rgba(61, 166, 122, 0.15)");
  welcomeGrad.addColorStop(1, "rgba(61, 166, 122, 0.03)");
  ctx.fillStyle = welcomeGrad;
  ctx.fillRect(200, 820, 1520, 140);

  ctx.shadowBlur = 40;
  ctx.fillStyle = "#5fcf9f";
  ctx.font = "bold 36px Courier New";
  ctx.textAlign = "center";
  ctx.fillText("Welcome to the Other Side", 960, 880);

  ctx.shadowBlur = 0;
  ctx.fillStyle = "#8ab8a0";
  ctx.font = "20px Courier New";
  ctx.fillText(
    "You have successfully traversed the dimensional portal. This is your destination.",
    960,
    925
  );

  return new THREE.CanvasTexture(canvas);
}

// ============================================
// CONSTANTS
// ============================================

const CHARACTERS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩαβγδεζηθικλμνξοπρστυφχψω∞∑∏√∫≈≠≤≥".split("");

const PORTAL_CONFIG = {
  radius: 180,
  position: { x: 120, y: -60, z: 50 },
  darkCloudCount: 80,
  dustCount: 120,
  sparkCount: 60,
  sparkTrailCount: 40,
  textCount: 200,
  lightRayCount: 24,
  centerParticleCount: 30,
};

const MATRIX_CONFIG = {
  columns: 4,
  charsPerColumn: 25,
  columnSpacing: 35,
  charHeight: 22,
  centerX: -50,
};

const TUNNEL_CONFIG = {
  particleCount: 150,
};

// ============================================
// MAIN COMPONENT
// ============================================

const MonolithPortal = () => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const textBottomLeftRef = useRef(null);
  const textBottomCenterRef = useRef(null);
  const line1Ref = useRef(null);
  const line2Ref = useRef(null);
  const bgImageRef = useRef(null);

  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    // LENIS SMOOTH SCROLL
    const lenis = new Lenis({
      duration: 1.8,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.6,
    });

    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    // THREE.JS SETUP
    const canvas = canvasRef.current;
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      1,
      10000
    );
    camera.position.z = 1000;
    scene.add(camera);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // TEXTURES
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

    // PORTAL GROUP
    const portalGroup = new THREE.Group();
    portalGroup.position.set(
      PORTAL_CONFIG.position.x,
      PORTAL_CONFIG.position.y,
      PORTAL_CONFIG.position.z
    );
    scene.add(portalGroup);

    // DARK THUNDERSTORM CLOUDS
    const darkClouds = [];
    for (let i = 0; i < PORTAL_CONFIG.darkCloudCount; i++) {
      const size = 60 + Math.random() * 100;
      const geo = new THREE.PlaneBufferGeometry(size, size);
      const mat = new THREE.MeshBasicMaterial({
        map: darkCloudTexture,
        transparent: true,
        opacity: 0,
        blending: THREE.NormalBlending,
        depthWrite: false,
      });

      const cloud = new THREE.Mesh(geo, mat);
      const angle = Math.random() * Math.PI * 2;
      const radiusVar =
        PORTAL_CONFIG.radius * 0.5 +
        Math.random() * PORTAL_CONFIG.radius * 0.7;
      const zVar = (Math.random() - 0.5) * 80;

      cloud.position.set(
        Math.cos(angle) * radiusVar,
        Math.sin(angle) * radiusVar,
        zVar
      );
      cloud.rotation.z = Math.random() * Math.PI * 2;

      cloud.userData = {
        type: "darkCloud",
        angle: angle,
        radius: radiusVar,
        baseZ: zVar,
        orbitSpeed: 0.15 + Math.random() * 0.2,
        wobbleSpeed: 0.5 + Math.random() * 1,
        wobbleAmount: 15 + Math.random() * 25,
        phase: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.5,
      };

      darkClouds.push(cloud);
      portalGroup.add(cloud);
    }

    // PORTAL DUST PARTICLES
    const portalParticles = [];
    for (let i = 0; i < PORTAL_CONFIG.dustCount; i++) {
      const size = 10 + Math.random() * 25;
      const geo = new THREE.PlaneBufferGeometry(size, size);
      const mat = new THREE.MeshBasicMaterial({
        map: dustTexture,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      const particle = new THREE.Mesh(geo, mat);
      const angle = Math.random() * Math.PI * 2;
      const radiusVar = PORTAL_CONFIG.radius + (Math.random() - 0.5) * 60;
      const zVar = (Math.random() - 0.5) * 50;

      particle.position.set(
        Math.cos(angle) * radiusVar,
        Math.sin(angle) * radiusVar,
        zVar
      );
      particle.rotation.z = Math.random() * Math.PI * 2;

      particle.userData = {
        type: "dust",
        angle: angle,
        radius: radiusVar,
        baseZ: zVar,
        orbitSpeed: 0.3 + Math.random() * 0.4,
        wobbleSpeed: 1 + Math.random() * 2,
        wobbleAmount: 10 + Math.random() * 20,
        phase: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 2,
      };

      portalParticles.push(particle);
      portalGroup.add(particle);
    }

    // SHARP SPARKS
    const sparks = [];
    for (let i = 0; i < PORTAL_CONFIG.sparkCount; i++) {
      const size = 4 + Math.random() * 8;
      const geo = new THREE.PlaneBufferGeometry(size, size);
      const mat = new THREE.MeshBasicMaterial({
        map: sparkTexture,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      const spark = new THREE.Mesh(geo, mat);
      const angle = Math.random() * Math.PI * 2;
      const radiusVar = PORTAL_CONFIG.radius + (Math.random() - 0.5) * 80;

      spark.position.set(
        Math.cos(angle) * radiusVar,
        Math.sin(angle) * radiusVar,
        (Math.random() - 0.5) * 40
      );

      spark.userData = {
        type: "spark",
        angle: angle,
        radius: radiusVar,
        orbitSpeed: 0.6 + Math.random() * 0.8,
        flickerSpeed: 8 + Math.random() * 15,
        phase: Math.random() * Math.PI * 2,
      };

      sparks.push(spark);
      portalGroup.add(spark);
    }

    // SPARK TRAILS
    const sparkTrails = [];
    for (let i = 0; i < PORTAL_CONFIG.sparkTrailCount; i++) {
      const length = 20 + Math.random() * 40;
      const geo = new THREE.PlaneBufferGeometry(3, length);
      const mat = new THREE.MeshBasicMaterial({
        map: sparkTrailTexture,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      const trail = new THREE.Mesh(geo, mat);
      const angle = Math.random() * Math.PI * 2;
      const radiusVar = PORTAL_CONFIG.radius + (Math.random() - 0.5) * 60;

      trail.position.set(
        Math.cos(angle) * radiusVar,
        Math.sin(angle) * radiusVar,
        (Math.random() - 0.5) * 30
      );
      trail.rotation.z = angle + Math.PI / 2;

      trail.userData = {
        type: "trail",
        angle: angle,
        radius: radiusVar,
        orbitSpeed: 0.7 + Math.random() * 0.5,
        flickerSpeed: 6 + Math.random() * 10,
        phase: Math.random() * Math.PI * 2,
        length: length,
      };

      sparkTrails.push(trail);
      portalGroup.add(trail);
    }

    // TEXT PARTICLES IN PORTAL (Increased, smaller)
    const portalTextParticles = [];
    for (let i = 0; i < PORTAL_CONFIG.textCount; i++) {
      const char = CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
      const geo = new THREE.PlaneBufferGeometry(8, 8);
      const mat = new THREE.MeshBasicMaterial({
        map: smallCharTextures[char],
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      const particle = new THREE.Mesh(geo, mat);
      const angle = Math.random() * Math.PI * 2;
      const radiusVar =
        PORTAL_CONFIG.radius * 0.3 +
        Math.random() * PORTAL_CONFIG.radius * 0.9;

      particle.position.set(
        Math.cos(angle) * radiusVar,
        Math.sin(angle) * radiusVar,
        (Math.random() - 0.5) * 60
      );

      particle.userData = {
        type: "text",
        angle: angle,
        radius: radiusVar,
        orbitSpeed: 0.3 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2,
        wobbleSpeed: 2 + Math.random() * 3,
        wobbleAmount: 5 + Math.random() * 15,
      };

      portalTextParticles.push(particle);
      portalGroup.add(particle);
    }

    // LIGHT RAYS
    const lightRays = [];
    for (let i = 0; i < PORTAL_CONFIG.lightRayCount; i++) {
      const length = 80 + Math.random() * 120;
      const geo = new THREE.PlaneBufferGeometry(3 + Math.random() * 4, length);
      const mat = new THREE.MeshBasicMaterial({
        map: lightRayTexture,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      const ray = new THREE.Mesh(geo, mat);
      const angle =
        (i / PORTAL_CONFIG.lightRayCount) * Math.PI * 2 + Math.random() * 0.2;

      ray.position.set(0, 0, -25);
      ray.rotation.z = angle + Math.PI / 2;

      ray.userData = {
        baseAngle: angle,
        length: length,
        pulseSpeed: 2 + Math.random() * 2,
        phase: Math.random() * Math.PI * 2,
      };

      lightRays.push(ray);
      portalGroup.add(ray);
    }

    // CENTER GLOW PARTICLES
    const centerParticles = [];
    for (let i = 0; i < PORTAL_CONFIG.centerParticleCount; i++) {
      const size = 15 + Math.random() * 30;
      const geo = new THREE.PlaneBufferGeometry(size, size);
      const mat = new THREE.MeshBasicMaterial({
        map: dustTexture,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      const particle = new THREE.Mesh(geo, mat);
      const dist = Math.random() * 80;
      const angle = Math.random() * Math.PI * 2;

      particle.position.set(
        Math.cos(angle) * dist,
        Math.sin(angle) * dist,
        -35 + Math.random() * 20
      );

      particle.userData = {
        angle: angle,
        dist: dist,
        driftSpeed: 0.4 + Math.random() * 0.4,
        pulseSpeed: 1 + Math.random() * 2,
        phase: Math.random() * Math.PI * 2,
      };

      centerParticles.push(particle);
      portalGroup.add(particle);
    }

    // TUNNEL PARTICLES
    const tunnelParticles = [];
    for (let i = 0; i < TUNNEL_CONFIG.particleCount; i++) {
      const size = 5 + Math.random() * 15;
      const geo = new THREE.PlaneBufferGeometry(size, size);
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
      const radius = 50 + Math.random() * 200;
      const zPos = -500 - Math.random() * 1500;

      particle.position.set(
        Math.cos(angle) * radius,
        Math.sin(angle) * radius,
        zPos
      );

      particle.userData = {
        baseAngle: angle,
        baseRadius: radius,
        baseZ: zPos,
        speed: 800 + Math.random() * 600,
        spiralSpeed: 1 + Math.random() * 2,
      };

      tunnelParticles.push(particle);
      scene.add(particle);
    }

    // MATRIX LETTERS
    const columnHeight = MATRIX_CONFIG.charsPerColumn * MATRIX_CONFIG.charHeight;
    const matrixGroup = new THREE.Group();
    matrixGroup.position.set(MATRIX_CONFIG.centerX, 0, 150);
    scene.add(matrixGroup);

    const allMatrixChars = [];
    for (let col = 0; col < MATRIX_CONFIG.columns; col++) {
      const colX =
        (col - (MATRIX_CONFIG.columns - 1) / 2) * MATRIX_CONFIG.columnSpacing;
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

        const charGeo = new THREE.PlaneBufferGeometry(18, 18);
        const charMesh = new THREE.Mesh(charGeo, charMat);

        const startY =
          (i - MATRIX_CONFIG.charsPerColumn / 2) * MATRIX_CONFIG.charHeight;
        charMesh.position.set(colX, startY, 0);

        const endAngle = Math.random() * Math.PI * 2;
        const endRadius = PORTAL_CONFIG.radius + (Math.random() - 0.5) * 60;

        charMesh.userData = {
          column: col,
          index: i,
          direction: direction,
          speed: 60 + Math.random() * 40,
          baseY: startY,
          colX: colX,
          normalizedPos: i / MATRIX_CONFIG.charsPerColumn,
          endAngle: endAngle,
          endRadius: endRadius,
          endPos: new THREE.Vector3(
            Math.cos(endAngle) * endRadius,
            Math.sin(endAngle) * endRadius,
            (Math.random() - 0.5) * 40
          ),
          flyDelay: Math.random() * 0.8,
          char: char,
        };

        allMatrixChars.push(charMesh);
        matrixGroup.add(charMesh);
      }
    }

    // ABOUT SECTION
    const aboutTexture = createAboutTexture();
    const vFov = (camera.fov * Math.PI) / 180;
    const targetDistance = 800;
    const planeHeight = 2 * Math.tan(vFov / 2) * targetDistance;
    const planeWidth = planeHeight * (window.innerWidth / window.innerHeight);

    const aboutGeometry = new THREE.PlaneBufferGeometry(planeWidth, planeHeight);
    const aboutMaterial = new THREE.MeshBasicMaterial({
      map: aboutTexture,
      transparent: true,
      opacity: 0,
    });

    const aboutMesh = new THREE.Mesh(aboutGeometry, aboutMaterial);
    aboutMesh.position.set(
      portalGroup.position.x,
      portalGroup.position.y,
      -2000
    );
    scene.add(aboutMesh);

    const finalAboutZ = portalGroup.position.z + 150;
    const finalCamZ = finalAboutZ + targetDistance;

    // ANIMATION STATE
    let matrixScrolling = false;
    let charsFlying = false;
    let portalActive = false;
    let tunnelRush = false;
    let dispersing = false;

    // ANIMATION LOOP
    const clock = new THREE.Clock();
    let animationId;

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Matrix scrolling
      if (matrixScrolling && !charsFlying) {
        allMatrixChars.forEach((char) => {
          const data = char.userData;
          char.position.y += data.direction * data.speed * delta;

          const halfHeight = columnHeight / 2;

          if (data.direction > 0 && char.position.y > halfHeight) {
            char.position.y = -halfHeight;
            const newChar =
              CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
            char.material.map = charTextures[newChar];
          } else if (data.direction < 0 && char.position.y < -halfHeight) {
            char.position.y = halfHeight;
            const newChar =
              CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
            char.material.map = charTextures[newChar];
          }

          const normalizedY = (char.position.y + halfHeight) / columnHeight;
          const edgeFade = Math.sin(normalizedY * Math.PI);
          const targetOpacity = Math.pow(edgeFade, 0.6) * 0.85;

          if (char.material.userData.baseOpacity !== undefined) {
            char.material.opacity =
              targetOpacity * char.material.userData.baseOpacity;
          }
        });
      }

      // Portal animation
      if (portalActive) {
        darkClouds.forEach((cloud) => {
          const data = cloud.userData;
          data.angle += delta * data.orbitSpeed;

          const wobble =
            Math.sin(elapsed * data.wobbleSpeed + data.phase) *
            data.wobbleAmount;
          const r = data.radius + wobble * 0.2;

          cloud.position.x = Math.cos(data.angle) * r;
          cloud.position.y = Math.sin(data.angle) * r;
          cloud.position.z =
            data.baseZ +
            Math.sin(elapsed * data.wobbleSpeed * 0.3 + data.phase) * 10;
          cloud.rotation.z += delta * data.rotationSpeed;
        });

        portalParticles.forEach((particle) => {
          const data = particle.userData;
          data.angle += delta * data.orbitSpeed;

          const wobble =
            Math.sin(elapsed * data.wobbleSpeed + data.phase) *
            data.wobbleAmount;
          const r = data.radius + wobble * 0.3;

          particle.position.x = Math.cos(data.angle) * r;
          particle.position.y = Math.sin(data.angle) * r;
          particle.position.z =
            data.baseZ +
            Math.sin(elapsed * data.wobbleSpeed * 0.5 + data.phase) * 15;
          particle.rotation.z += delta * data.rotationSpeed;
        });

        sparks.forEach((spark) => {
          const data = spark.userData;
          data.angle += delta * data.orbitSpeed;

          const r =
            data.radius +
            Math.sin(elapsed * data.flickerSpeed + data.phase) * 10;
          spark.position.x = Math.cos(data.angle) * r;
          spark.position.y = Math.sin(data.angle) * r;

          const baseOp = spark.material.userData?.baseOpacity || 0.9;
          spark.material.opacity =
            baseOp *
            (0.4 +
              0.6 *
                Math.abs(
                  Math.sin(elapsed * data.flickerSpeed + data.phase)
                ));
        });

        sparkTrails.forEach((trail) => {
          const data = trail.userData;
          data.angle += delta * data.orbitSpeed;

          trail.position.x = Math.cos(data.angle) * data.radius;
          trail.position.y = Math.sin(data.angle) * data.radius;
          trail.rotation.z = data.angle + Math.PI / 2;

          const baseOp = trail.material.userData?.baseOpacity || 0.7;
          trail.material.opacity =
            baseOp *
            (0.5 + 0.5 * Math.sin(elapsed * data.flickerSpeed + data.phase));
        });

        portalTextParticles.forEach((particle) => {
          const data = particle.userData;
          data.angle += delta * data.orbitSpeed;

          const wobble =
            Math.sin(elapsed * data.wobbleSpeed + data.phase) *
            data.wobbleAmount;
          const r = data.radius + wobble * 0.2;

          particle.position.x = Math.cos(data.angle) * r;
          particle.position.y = Math.sin(data.angle) * r;
        });

        lightRays.forEach((ray) => {
          const data = ray.userData;
          const pulse =
            0.5 + 0.5 * Math.sin(elapsed * data.pulseSpeed + data.phase);
          ray.scale.y = pulse;
          ray.material.opacity =
            (ray.material.userData?.baseOpacity || 0.5) * pulse;
        });

        centerParticles.forEach((particle) => {
          const data = particle.userData;
          data.angle += delta * data.driftSpeed;
          particle.position.x = Math.cos(data.angle) * data.dist;
          particle.position.y = Math.sin(data.angle) * data.dist;

          const pulse =
            0.6 + 0.4 * Math.sin(elapsed * data.pulseSpeed + data.phase);
          particle.material.opacity =
            (particle.material.userData?.baseOpacity || 0.4) * pulse;
        });
      }

      // Tunnel rush
      if (tunnelRush) {
        tunnelParticles.forEach((particle) => {
          const data = particle.userData;

          particle.position.z += data.speed * delta;
          data.baseAngle += delta * data.spiralSpeed;
          particle.position.x = Math.cos(data.baseAngle) * data.baseRadius;
          particle.position.y = Math.sin(data.baseAngle) * data.baseRadius;

          if (particle.position.z > 500) {
            particle.position.z = -1500 - Math.random() * 500;
            data.baseAngle = Math.random() * Math.PI * 2;
            data.baseRadius = 50 + Math.random() * 200;
          }

          const dist = Math.abs(particle.position.z);
          const fadeIn = Math.min(1, (1500 - dist) / 500);
          const fadeOut = Math.min(1, dist / 200);
          particle.material.opacity =
            (particle.material.userData?.baseOpacity || 0.7) * fadeIn * fadeOut;
        });
      }

      // Dispersing
      if (dispersing) {
        darkClouds.forEach((cloud) => {
          const speed = 150 + Math.random() * 80;
          cloud.position.x += cloud.position.x * 0.008 * speed * delta;
          cloud.position.y += cloud.position.y * 0.008 * speed * delta;
          cloud.position.z += (Math.random() - 0.3) * speed * delta;
        });

        portalParticles.forEach((particle) => {
          const speed = 200 + Math.random() * 100;
          particle.position.x += particle.position.x * 0.01 * speed * delta;
          particle.position.y += particle.position.y * 0.01 * speed * delta;
          particle.position.z += (Math.random() - 0.3) * speed * delta;
        });

        sparks.forEach((spark) => {
          const speed = 250 + Math.random() * 100;
          spark.position.x += spark.position.x * 0.012 * speed * delta;
          spark.position.y += spark.position.y * 0.012 * speed * delta;
        });

        sparkTrails.forEach((trail) => {
          const speed = 220 + Math.random() * 100;
          trail.position.x += trail.position.x * 0.011 * speed * delta;
          trail.position.y += trail.position.y * 0.011 * speed * delta;
        });

        portalTextParticles.forEach((particle) => {
          const speed = 180 + Math.random() * 100;
          particle.position.x += particle.position.x * 0.01 * speed * delta;
          particle.position.y += particle.position.y * 0.01 * speed * delta;
        });

        centerParticles.forEach((particle) => {
          particle.position.z += 150 * delta;
        });

        lightRays.forEach((ray) => {
          ray.scale.y *= 0.94;
        });
      }

      renderer.render(scene, camera);
    };

    animate();

    // GSAP SCROLL TIMELINE
    gsap.registerPlugin(ScrollTrigger);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=900%",
        scrub: 1.5,
        pin: true,
        anticipatePin: 1,
        onUpdate: (self) => setScrollProgress(self.progress),
      },
    });

    // PHASE 1: Initial parallax
    tl.to(bgImageRef.current, {
      scale: 1.08,
      duration: 1.5,
      ease: "power1.inOut",
    });

    // PHASE 2: Zoom to man
    tl.to(bgImageRef.current, {
      scale: 2.0,
      y: "-22%",
      x: "6%",
      duration: 3,
      ease: "power2.inOut",
    });

    tl.to(
      textBottomLeftRef.current,
      { x: "40vw", y: "-15vh", opacity: 0.7, duration: 3, ease: "power2.inOut" },
      "<"
    );

    tl.to(
      textBottomCenterRef.current,
      { x: "-30vw", y: "3vh", opacity: 0.7, duration: 3, ease: "power2.inOut" },
      "<"
    );

    tl.to(
      [line1Ref.current, line2Ref.current],
      { scaleX: 0, opacity: 0, duration: 2, ease: "power2.inOut" },
      "<0.5"
    );

    // PHASE 3: Letters fade in
    tl.to([textBottomLeftRef.current, textBottomCenterRef.current], {
      opacity: 0,
      duration: 1,
      ease: "power2.out",
    });

    tl.call(() => {
      matrixScrolling = true;
    });

    tl.to(allMatrixChars.map((c) => c.material), {
      opacity: 0.85,
      duration: 2.5,
      stagger: { each: 0.02, from: "random" },
      ease: "power1.out",
      onStart: () => {
        allMatrixChars.forEach((c) => {
          c.material.userData = { baseOpacity: 1 };
        });
      },
    });

    tl.to(camera.position, { z: 850, duration: 2.5, ease: "power2.out" }, "<");

    // PHASE 4: Matrix scrolls
    tl.to(bgImageRef.current, { scale: 2.2, duration: 2, ease: "power1.inOut" });
    tl.to(camera.position, { z: 700, duration: 2, ease: "power1.inOut" }, "<");
    tl.to({}, { duration: 0.5 });

    // PHASE 5: Letters fly to portal
    tl.call(() => {
      charsFlying = true;
    });

    tl.to(allMatrixChars.map((c) => c.userData), {
      speed: 150,
      duration: 0.5,
      ease: "power2.in",
    });

    tl.to(allMatrixChars.map((c) => c.position), {
      x: (i) => {
        const char = allMatrixChars[i];
        const offsetX = portalGroup.position.x - matrixGroup.position.x;
        return char.userData.endPos.x + offsetX;
      },
      y: (i) => {
        const char = allMatrixChars[i];
        const offsetY = portalGroup.position.y - matrixGroup.position.y;
        return char.userData.endPos.y + offsetY;
      },
      z: (i) => {
        const char = allMatrixChars[i];
        return (
          char.userData.endPos.z +
          (portalGroup.position.z - matrixGroup.position.z)
        );
      },
      duration: 2.5,
      stagger: { each: 0.008, from: "center" },
      ease: "power2.out",
    });

    tl.to(
      bgImageRef.current,
      { opacity: 0, scale: 2.5, duration: 2, ease: "power2.out" },
      "<0.5"
    );

    // PHASE 6: Portal forms
    tl.call(() => {
      portalActive = true;
    });

    tl.to(darkClouds.map((c) => c.material), {
      opacity: 0.7,
      duration: 1.5,
      stagger: 0.01,
      ease: "power2.out",
      onStart: () => {
        darkClouds.forEach((c) => {
          c.material.userData = { baseOpacity: 0.7 };
        });
      },
    });

    tl.to(
      portalParticles.map((p) => p.material),
      {
        opacity: 0.5,
        duration: 1.2,
        stagger: 0.008,
        ease: "power2.out",
        onStart: () => {
          portalParticles.forEach((p) => {
            p.material.userData = { baseOpacity: 0.5 };
          });
        },
      },
      "<0.3"
    );

    tl.to(
      sparks.map((s) => s.material),
      {
        opacity: 0.9,
        duration: 1,
        stagger: 0.01,
        ease: "power2.out",
        onStart: () => {
          sparks.forEach((s) => {
            s.material.userData = { baseOpacity: 0.9 };
          });
        },
      },
      "<0.2"
    );

    tl.to(
      sparkTrails.map((t) => t.material),
      {
        opacity: 0.7,
        duration: 1,
        stagger: 0.015,
        ease: "power2.out",
        onStart: () => {
          sparkTrails.forEach((t) => {
            t.material.userData = { baseOpacity: 0.7 };
          });
        },
      },
      "<0.1"
    );

    tl.to(
      portalTextParticles.map((p) => p.material),
      {
        opacity: 0.6,
        duration: 1.2,
        stagger: 0.005,
        ease: "power2.out",
        onStart: () => {
          portalTextParticles.forEach((p) => {
            p.material.userData = { baseOpacity: 0.6 };
          });
        },
      },
      "<0.2"
    );

    tl.to(
      lightRays.map((r) => r.material),
      {
        opacity: 0.5,
        duration: 1.5,
        stagger: 0.03,
        ease: "power2.out",
        onStart: () => {
          lightRays.forEach((r) => {
            r.material.userData = { baseOpacity: 0.5 };
          });
        },
      },
      "<"
    );

    tl.to(
      centerParticles.map((p) => p.material),
      {
        opacity: 0.4,
        duration: 1.5,
        stagger: 0.02,
        ease: "power2.out",
        onStart: () => {
          centerParticles.forEach((p) => {
            p.material.userData = { baseOpacity: 0.4 };
          });
        },
      },
      "<"
    );

    tl.to(
      allMatrixChars.map((c) => c.material),
      { opacity: 0, duration: 1, ease: "power2.out" },
      "<0.5"
    );

    // PHASE 7: Camera approaches portal
    tl.to(camera.position, {
      x: portalGroup.position.x * 0.4,
      y: portalGroup.position.y * 0.4,
      z: 450,
      duration: 3,
      ease: "power1.inOut",
    });

    tl.to(
      darkClouds.map((c) => c.material),
      { opacity: 0.85, duration: 3, ease: "power1.in" },
      "<"
    );

    tl.to(
      sparks.map((s) => s.material),
      { opacity: 1, duration: 3, ease: "power1.in" },
      "<"
    );

    tl.to(
      lightRays.map((r) => r.material),
      { opacity: 0.7, duration: 3, ease: "power1.in" },
      "<"
    );

    // PHASE 8: Enter portal
    tl.call(() => {
      tunnelRush = true;
    });

    tl.to(tunnelParticles.map((p) => p.material), {
      opacity: 0.7,
      duration: 0.5,
      ease: "power2.out",
      onStart: () => {
        tunnelParticles.forEach((p) => {
          p.material.userData = { baseOpacity: 0.7 };
        });
      },
    });

    tl.to(camera.position, {
      x: portalGroup.position.x,
      y: portalGroup.position.y,
      z: portalGroup.position.z + 50,
      duration: 2,
      ease: "power2.in",
    });

    tl.to(portalGroup.position, { z: 800, duration: 2, ease: "power2.in" }, "<");

    // PHASE 9: Through portal - COMPLETE FADE OUT
    tl.call(() => {
      dispersing = true;
      tunnelRush = false;
    });

    tl.to(darkClouds.map((c) => c.material), {
      opacity: 0,
      duration: 1.5,
      ease: "power2.out",
    });

    tl.to(
      portalParticles.map((p) => p.material),
      { opacity: 0, duration: 1.5, ease: "power2.out" },
      "<"
    );

    tl.to(
      sparks.map((s) => s.material),
      { opacity: 0, duration: 1.2, ease: "power2.out" },
      "<"
    );

    tl.to(
      sparkTrails.map((t) => t.material),
      { opacity: 0, duration: 1.2, ease: "power2.out" },
      "<"
    );

    tl.to(
      portalTextParticles.map((p) => p.material),
      { opacity: 0, duration: 1.5, ease: "power2.out" },
      "<"
    );

    tl.to(
      lightRays.map((r) => r.material),
      { opacity: 0, duration: 1, ease: "power2.out" },
      "<"
    );

    tl.to(
      centerParticles.map((p) => p.material),
      { opacity: 0, duration: 1, ease: "power2.out" },
      "<"
    );

    tl.to(
      tunnelParticles.map((p) => p.material),
      { opacity: 0, duration: 1.5, ease: "power2.out" },
      "<"
    );

    tl.to(aboutMaterial, { opacity: 1, duration: 2, ease: "power2.out" }, "<0.3");

    tl.to(aboutMesh.position, { z: -400, duration: 2, ease: "power2.out" }, "<");

    tl.to(
      camera.position,
      {
        x: portalGroup.position.x,
        y: portalGroup.position.y,
        z: 600,
        duration: 2,
        ease: "power2.out",
      },
      "<"
    );

    // PHASE 10: About section settles - HIDE ALL PORTAL ELEMENTS COMPLETELY
    tl.call(() => {
      // Stop all animations
      portalActive = false;
      dispersing = false;
      tunnelRush = false;

      // Hide portal group entirely
      portalGroup.visible = false;

      // Hide all individual elements
      darkClouds.forEach((c) => {
        c.visible = false;
      });
      portalParticles.forEach((p) => {
        p.visible = false;
      });
      sparks.forEach((s) => {
        s.visible = false;
      });
      sparkTrails.forEach((t) => {
        t.visible = false;
      });
      portalTextParticles.forEach((p) => {
        p.visible = false;
      });
      lightRays.forEach((r) => {
        r.visible = false;
      });
      centerParticles.forEach((p) => {
        p.visible = false;
      });
      tunnelParticles.forEach((p) => {
        p.visible = false;
      });
      allMatrixChars.forEach((c) => {
        c.visible = false;
      });
    });

    tl.to(camera.position, {
      x: aboutMesh.position.x,
      y: aboutMesh.position.y,
      z: finalCamZ,
      duration: 2.5,
      ease: "power1.out",
    });

    tl.to(
      aboutMesh.position,
      { z: finalAboutZ, duration: 2.5, ease: "power1.out" },
      "<"
    );

    // RESIZE HANDLER
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);

      const newHeight = 2 * Math.tan(vFov / 2) * targetDistance;
      const newWidth = newHeight * (window.innerWidth / window.innerHeight);
      aboutMesh.geometry.dispose();
      aboutMesh.geometry = new THREE.PlaneBufferGeometry(newWidth, newHeight);
    };

    window.addEventListener("resize", handleResize);

    // CLEANUP
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
      lenis.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
      renderer.dispose();
    };
  }, []);

  // RENDER
  const vignetteOpacity =
    scrollProgress < 0.6 ? 1 : 1 - (scrollProgress - 0.6) / 0.2;

  return (
    <div
      ref={containerRef}
      style={{
        height: "100vh",
        width: "100vw",
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#000",
      }}
    >
      <div
        ref={bgImageRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          transformOrigin: "center 78%",
          willChange: "transform, opacity",
        }}
      >
        <img
          src="monolith.jpg"
          alt="Monolith"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center 70%",
          }}
        />
      </div>

      <div
        ref={textBottomLeftRef}
        style={{
          position: "absolute",
          bottom: "12%",
          left: "6%",
          color: "#c8e6d8",
          fontSize: "clamp(11px, 1.3vw, 16px)",
          fontFamily: "'Courier New', monospace",
          textShadow: "0 0 20px rgba(61, 166, 122, 0.6)",
          maxWidth: "320px",
          lineHeight: 1.7,
          zIndex: 10,
          willChange: "transform, opacity",
        }}
      >
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
        tempor incididunt ut labore.
      </div>

      <div
        style={{
          position: "absolute",
          bottom: "8%",
          left: 0,
          right: 0,
          zIndex: 10,
        }}
      >
        <div
          ref={line1Ref}
          style={{
            position: "absolute",
            left: "6%",
            top: "50%",
            width: "40%",
            height: "1px",
            background:
              "linear-gradient(to right, transparent, rgba(61, 166, 122, 0.7))",
            transformOrigin: "left center",
            boxShadow: "0 0 8px rgba(61, 166, 122, 0.5)",
          }}
        />

        <div
          ref={textBottomCenterRef}
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            color: "#5fcf9f",
            fontSize: "clamp(12px, 1.8vw, 22px)",
            fontFamily: "'Courier New', monospace",
            textShadow: "0 0 25px rgba(61, 166, 122, 0.8)",
            whiteSpace: "nowrap",
            fontWeight: "bold",
            letterSpacing: "3px",
            willChange: "transform, opacity",
          }}
        >
          VIVAMUS SAGITTIS LACUS
        </div>

        <div
          ref={line2Ref}
          style={{
            position: "absolute",
            right: "6%",
            top: "50%",
            width: "40%",
            height: "1px",
            background:
              "linear-gradient(to left, transparent, rgba(61, 166, 122, 0.7))",
            transformOrigin: "right center",
            boxShadow: "0 0 8px rgba(61, 166, 122, 0.5)",
          }}
        />
      </div>

      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 20,
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background:
            "radial-gradient(ellipse at center 65%, transparent 20%, rgba(5, 15, 10, 0.8) 100%)",
          pointerEvents: "none",
          zIndex: 15,
          opacity: vignetteOpacity,
          transition: "opacity 0.5s ease-out",
        }}
      />

      {scrollProgress < 0.03 && (
        <div
          style={{
            position: "absolute",
            bottom: "3%",
            right: "4%",
            color: "#5fcf9f",
            fontSize: "12px",
            fontFamily: "'Courier New', monospace",
            textShadow: "0 0 12px rgba(61, 166, 122, 0.8)",
            zIndex: 30,
            animation: "pulseIndicator 2s ease-in-out infinite",
            letterSpacing: "2px",
          }}
        >
          ▼ SCROLL TO ENTER ▼
        </div>
      )}

      <div
        style={{
          position: "fixed",
          top: "50%",
          right: "12px",
          transform: "translateY(-50%)",
          width: "2px",
          height: "60px",
          background: "rgba(61, 166, 122, 0.15)",
          borderRadius: "1px",
          zIndex: 100,
        }}
      >
        <div
          style={{
            width: "100%",
            height: `${scrollProgress * 100}%`,
            background: "linear-gradient(to bottom, #3da67a, #5fcf9f)",
            borderRadius: "1px",
            boxShadow: "0 0 6px rgba(61, 166, 122, 0.8)",
            transition: "height 0.15s ease-out",
          }}
        />
      </div>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<MonolithPortal />);