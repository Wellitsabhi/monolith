import * as THREE from 'three';

/**
 * Creates the monolith geometry - a tall angular wedge/prism shape
 * matching the reference image: two angled faces meeting at a sharp front edge
 */
export function createMonolithGeometry() {
  // Dimensions based on the image proportions
  const height = 12;
  const baseWidth = 2.8;
  const baseDepth = 2.2;
  const topWidth = 2.0;
  const topDepth = 1.6;
  
  // The monolith is a tapered prism with a sharp front edge
  // Cross-section is roughly triangular/wedge shaped
  
  const vertices = new Float32Array([
    // Front edge (the sharp vertical line) - slightly offset for the slit
    -0.05, -height/2, baseDepth * 0.6,   // 0 - bottom front left
     0.05, -height/2, baseDepth * 0.6,   // 1 - bottom front right
    -0.03, height/2, topDepth * 0.6,     // 2 - top front left
     0.03, height/2, topDepth * 0.6,     // 3 - top front right
    
    // Left face back edge
    -baseWidth/2, -height/2, -baseDepth/2,  // 4 - bottom back left
    -topWidth/2, height/2, -topDepth/2,     // 5 - top back left
    
    // Right face back edge
    baseWidth/2, -height/2, -baseDepth/2,   // 6 - bottom back right
    topWidth/2, height/2, -topDepth/2,      // 7 - top back right
  ]);
  
  // Create indexed geometry for better normal calculation
  const geometry = new THREE.BufferGeometry();
  
  // Define the faces using indices
  const indices = [
    // Left face (0, 4, 5, 2)
    0, 4, 5,
    0, 5, 2,
    
    // Right face (1, 6, 7, 3) - reversed winding
    1, 7, 6,
    1, 3, 7,
    
    // Back face (4, 6, 7, 5)
    4, 6, 7,
    4, 7, 5,
    
    // Front slit faces (tiny gap between 0,2 and 1,3)
    0, 1, 3,
    0, 3, 2,
    
    // Bottom face
    0, 6, 4,
    0, 1, 6,
    
    // Top face
    2, 5, 7,
    2, 7, 3,
  ];
  
  geometry.setIndex(indices);
  geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
  geometry.computeVertexNormals();
  
  return geometry;
}

/**
 * Creates a more detailed monolith using ExtrudeGeometry for smoother results
 */
export function createMonolithGeometryV2() {
  const height = 12;
  
  // Define the cross-section shape (wedge/angular)
  const shape = new THREE.Shape();
  
  // Wedge cross-section - sharp front edge, angled sides
  const frontZ = 1.3;
  const backZ = -1.1;
  const sideX = 1.4;
  const slitGap = 0.04; // Small gap for the front slit
  
  // Start from front-left of slit
  shape.moveTo(-slitGap, frontZ);
  shape.lineTo(-sideX, backZ);        // to back-left
  shape.lineTo(sideX, backZ);         // to back-right
  shape.lineTo(slitGap, frontZ);      // to front-right of slit
  shape.lineTo(-slitGap, frontZ);     // close (creates the slit)
  
  const extrudeSettings = {
    depth: height,
    bevelEnabled: true,
    bevelThickness: 0.02,
    bevelSize: 0.02,
    bevelSegments: 2,
  };
  
  const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  
  // Rotate so Y is up (extrude goes along Z by default)
  geometry.rotateX(-Math.PI / 2);
  geometry.translate(0, -height/2, 0);
  
  return geometry;
}

/**
 * Creates the monolith material - dark metallic with subtle reflection
 */
export function createMonolithMaterial() {
  return new THREE.MeshStandardMaterial({
    color: 0x0a0f0d,
    metalness: 0.85,
    roughness: 0.25,
    envMapIntensity: 1.2,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 1,
  });
}

/**
 * Creates the complete monolith mesh with proper positioning
 */
export function createMonolith(envMap = null) {
  const geometry = createMonolithGeometryV2();
  const material = createMonolithMaterial();
  
  if (envMap) {
    material.envMap = envMap;
  }
  
  const monolith = new THREE.Mesh(geometry, material);
  
  // Position to match the image composition
  monolith.position.set(0, 0, 0);
  monolith.castShadow = true;
  monolith.receiveShadow = true;
  
  return monolith;
}

/**
 * Creates the slit glow effect - a thin emissive line on the front edge
 */
export function createSlitGlow() {
  const geometry = new THREE.PlaneGeometry(0.08, 11.5);
  const material = new THREE.MeshBasicMaterial({
    color: 0x00ff88,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
  });
  
  const slit = new THREE.Mesh(geometry, material);
  slit.position.set(0, 0, 1.32); // Just in front of the monolith front edge
  
  return slit;
}

/**
 * Creates ambient environment for reflections
 */
export function createEnvironment(scene) {
  // Ambient light for base illumination
  const ambient = new THREE.AmbientLight(0x1a2f25, 0.4);
  scene.add(ambient);
  
  // Main light from above/behind (simulating the ring glow)
  const ringLight = new THREE.PointLight(0x88ffcc, 1.5, 50);
  ringLight.position.set(0, 15, -5);
  scene.add(ringLight);
  
  // Subtle fill light from front
  const fillLight = new THREE.DirectionalLight(0x3da67a, 0.3);
  fillLight.position.set(0, 5, 20);
  scene.add(fillLight);
  
  // Ground reflection light
  const groundLight = new THREE.DirectionalLight(0x1a3a2a, 0.2);
  groundLight.position.set(0, -10, 0);
  scene.add(groundLight);
  
  // Create a simple environment map for reflections
  const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256);
  cubeRenderTarget.texture.type = THREE.HalfFloatType;
  
  // Create gradient environment
  const envScene = new THREE.Scene();
  const envGeo = new THREE.SphereGeometry(100, 32, 32);
  const envMat = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    uniforms: {
      topColor: { value: new THREE.Color(0x0a1a15) },
      bottomColor: { value: new THREE.Color(0x050a08) },
      glowColor: { value: new THREE.Color(0x3da67a) },
    },
    vertexShader: `
      varying vec3 vWorldPosition;
      void main() {
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPosition.xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 topColor;
      uniform vec3 bottomColor;
      uniform vec3 glowColor;
      varying vec3 vWorldPosition;
      void main() {
        float h = normalize(vWorldPosition).y;
        vec3 color = mix(bottomColor, topColor, h * 0.5 + 0.5);
        // Add subtle glow in upper region
        float glowFactor = smoothstep(0.3, 0.8, h) * 0.3;
        color = mix(color, glowColor, glowFactor);
        gl_FragColor = vec4(color, 1.0);
      }
    `,
  });
  
  const envMesh = new THREE.Mesh(envGeo, envMat);
  envScene.add(envMesh);
  
  return { ambient, ringLight, fillLight, envScene, cubeRenderTarget };
}