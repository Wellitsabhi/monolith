import * as THREE from 'three';

export const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ∞∑∏√∫≈≠≤≥'.split('');

export function createDustTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');

  const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  gradient.addColorStop(0, 'rgba(0, 255, 136, 0.8)');
  gradient.addColorStop(0.15, 'rgba(0, 200, 100, 0.5)');
  gradient.addColorStop(0.3, 'rgba(0, 150, 80, 0.3)');
  gradient.addColorStop(0.5, 'rgba(0, 100, 60, 0.15)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 128, 128);

  const imageData = ctx.getImageData(0, 0, 128, 128);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 25;
    data[i] = Math.max(0, Math.min(255, data[i] + noise * 0.5));
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise * 0.7));
  }
  ctx.putImageData(imageData, 0, 0);

  return new THREE.CanvasTexture(canvas);
}

export function createDarkCloudTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  gradient.addColorStop(0, 'rgba(20, 40, 30, 0.95)');
  gradient.addColorStop(0.15, 'rgba(15, 35, 25, 0.8)');
  gradient.addColorStop(0.3, 'rgba(10, 30, 20, 0.6)');
  gradient.addColorStop(0.5, 'rgba(5, 20, 15, 0.35)');
  gradient.addColorStop(0.7, 'rgba(0, 15, 10, 0.15)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 256, 256);

  for (let i = 0; i < 12; i++) {
    const x = 64 + Math.random() * 128;
    const y = 64 + Math.random() * 128;
    const r = 25 + Math.random() * 50;

    const blobGrad = ctx.createRadialGradient(x, y, 0, x, y, r);
    blobGrad.addColorStop(0, 'rgba(30, 50, 40, 0.5)');
    blobGrad.addColorStop(0.5, 'rgba(15, 30, 22, 0.3)');
    blobGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = blobGrad;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const imageData = ctx.getImageData(0, 0, 256, 256);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 40;
    data[i] = Math.max(0, Math.min(255, data[i] + noise * 0.6));
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise * 0.8));
  }
  ctx.putImageData(imageData, 0, 0);

  return new THREE.CanvasTexture(canvas);
}

export function createSparkTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');

  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
  gradient.addColorStop(0.05, 'rgba(200, 255, 220, 0.95)');
  gradient.addColorStop(0.1, 'rgba(100, 255, 180, 0.8)');
  gradient.addColorStop(0.2, 'rgba(0, 255, 136, 0.5)');
  gradient.addColorStop(0.4, 'rgba(0, 200, 100, 0.2)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);

  const imageData = ctx.getImageData(0, 0, 64, 64);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] > 100) {
      const noise = (Math.random() - 0.5) * 15;
      data[i] = Math.max(0, Math.min(255, data[i] + noise));
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
    }
  }
  ctx.putImageData(imageData, 0, 0);

  return new THREE.CanvasTexture(canvas);
}

export function createSparkTrailTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 16;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');

  const gradient = ctx.createLinearGradient(0, 0, 0, 128);
  gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
  gradient.addColorStop(0.2, 'rgba(0, 200, 100, 0.3)');
  gradient.addColorStop(0.4, 'rgba(0, 255, 136, 0.7)');
  gradient.addColorStop(0.5, 'rgba(255, 255, 255, 1)');
  gradient.addColorStop(0.6, 'rgba(0, 255, 136, 0.7)');
  gradient.addColorStop(0.8, 'rgba(0, 200, 100, 0.3)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 16, 128);

  const hGradient = ctx.createLinearGradient(0, 0, 16, 0);
  hGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
  hGradient.addColorStop(0.3, 'rgba(255, 255, 255, 1)');
  hGradient.addColorStop(0.7, 'rgba(255, 255, 255, 1)');
  hGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.globalCompositeOperation = 'destination-in';
  ctx.fillStyle = hGradient;
  ctx.fillRect(0, 0, 16, 128);

  return new THREE.CanvasTexture(canvas);
}

export function createCharacterTexture(char, size = 'normal') {
  const isSmall = size === 'small';
  const canvasSize = isSmall ? 32 : 64;
  const fontSize = isSmall ? 16 : 28;

  const canvas = document.createElement('canvas');
  canvas.width = canvasSize;
  canvas.height = canvasSize;
  const ctx = canvas.getContext('2d');

  ctx.shadowBlur = isSmall ? 6 : 10;
  ctx.shadowColor = 'rgba(0, 255, 136, 0.9)';
  ctx.fillStyle = '#00ff88';
  ctx.font = `bold ${fontSize}px "Courier New", monospace`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  ctx.fillText(char, canvasSize / 2, canvasSize / 2);
  ctx.shadowBlur = isSmall ? 3 : 5;
  ctx.fillStyle = '#aaffcc';
  ctx.fillText(char, canvasSize / 2, canvasSize / 2);

  return new THREE.CanvasTexture(canvas);
}

export function createSmallCharTexture(char) {
  return createCharacterTexture(char, 'small');
}

export function createLightRayTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 16;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  const gradient = ctx.createLinearGradient(0, 0, 0, 256);
  gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
  gradient.addColorStop(0.2, 'rgba(0, 150, 80, 0.2)');
  gradient.addColorStop(0.4, 'rgba(0, 255, 136, 0.5)');
  gradient.addColorStop(0.5, 'rgba(200, 255, 220, 0.8)');
  gradient.addColorStop(0.6, 'rgba(0, 255, 136, 0.5)');
  gradient.addColorStop(0.8, 'rgba(0, 150, 80, 0.2)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 16, 256);

  const hGradient = ctx.createLinearGradient(0, 0, 16, 0);
  hGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
  hGradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.5)');
  hGradient.addColorStop(0.5, 'rgba(255, 255, 255, 1)');
  hGradient.addColorStop(0.8, 'rgba(255, 255, 255, 0.5)');
  hGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.globalCompositeOperation = 'destination-in';
  ctx.fillStyle = hGradient;
  ctx.fillRect(0, 0, 16, 256);

  return new THREE.CanvasTexture(canvas);
}

export function createVortexTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  const gradient = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
  gradient.addColorStop(0, 'rgba(0, 0, 0, 0.95)');
  gradient.addColorStop(0.2, 'rgba(0, 20, 15, 0.8)');
  gradient.addColorStop(0.4, 'rgba(0, 40, 30, 0.5)');
  gradient.addColorStop(0.6, 'rgba(0, 80, 50, 0.3)');
  gradient.addColorStop(0.8, 'rgba(0, 150, 90, 0.15)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 512, 512);

  ctx.globalCompositeOperation = 'lighter';
  for (let arm = 0; arm < 6; arm++) {
    const armAngle = (arm / 6) * Math.PI * 2;
    for (let r = 20; r < 250; r += 3) {
      const angle = armAngle + r * 0.025;
      const x = 256 + Math.cos(angle) * r;
      const y = 256 + Math.sin(angle) * r;
      const alpha = (1 - r / 250) * 0.25;
      ctx.fillStyle = `rgba(0, 255, 136, ${alpha})`;
      ctx.beginPath();
      ctx.arc(x, y, 2 + (r / 250) * 6, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  return new THREE.CanvasTexture(canvas);
}

export function createEnergyRingTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  ctx.beginPath();
  ctx.arc(128, 128, 100, 0, Math.PI * 2);
  ctx.lineWidth = 20;
  
  const grad = ctx.createRadialGradient(128, 128, 80, 128, 128, 120);
  grad.addColorStop(0, 'rgba(0, 255, 136, 0)');
  grad.addColorStop(0.3, 'rgba(0, 255, 136, 0.5)');
  grad.addColorStop(0.5, 'rgba(200, 255, 220, 0.9)');
  grad.addColorStop(0.7, 'rgba(0, 255, 136, 0.5)');
  grad.addColorStop(1, 'rgba(0, 255, 136, 0)');
  
  ctx.strokeStyle = grad;
  ctx.stroke();

  return new THREE.CanvasTexture(canvas);
}