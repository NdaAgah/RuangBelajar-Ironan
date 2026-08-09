// ==========================================
// I, ROBOT THEME CANVAS ANIMATION MODULE
// ==========================================

let animationId = null;
let mode = 'neural'; // Pilihan mode: 'neural' atau 'positronic'
let width = 0;
let height = 0;
let particles = [];
let waveOffset = 0;

// Konsep Warna USR (U.S. Robotics)
const COLOR_ICE_BLUE = 'rgba(0, 210, 255, ';
const COLOR_USR_RED  = 'rgba(255, 30, 60, ';

/**
 * Inisialisasi Canvas Animasi Tema I, Robot
 * @param {string} canvasId - ID elemen canvas
 * @param {'neural'|'positronic'} selectedMode - Mode animasi pilihan
 */
export function initIRobotTheme(canvasId, selectedMode = 'neural') {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  mode = selectedMode;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initParticles();
  }

  window.removeEventListener('resize', resize);
  window.addEventListener('resize', resize);
  resize();

  // Jalankan Loop Animasi
  if (animationId) cancelAnimationFrame(animationId);

  function render() {
    ctx.clearRect(0, 0, width, height);

    // Latar belakang dark metallic slate ala USR
    ctx.fillStyle = '#080c14';
    ctx.fillRect(0, 0, width, height);

    if (mode === 'neural') {
      drawNeuralNetwork(ctx);
    } else if (mode === 'positronic') {
      drawPositronicWaves(ctx);
    }

    animationId = requestAnimationFrame(render);
  }

  render();
}

// -------------------------------------------------------------
// MODE 1: USR Central Core & Neural Network (Saraf Artifisial)
// -------------------------------------------------------------
function initParticles() {
  particles = [];
  const particleCount = Math.floor((width * height) / 18000); // Kepadatan adaptif

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      radius: Math.random() * 2 + 1,
      // 5% kemungkinan menjadi 'node merah' (Denyut Peringatan VIKI)
      isAlert: Math.random() < 0.05 
    });
  }
}

function drawNeuralNetwork(ctx) {
  // Update & Gambar Partikel Simpul
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;

    // Pantulan Pinggir Layar
    if (p.x < 0 || p.x > width) p.vx *= -1;
    if (p.y < 0 || p.y > height) p.vy *= -1;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fillStyle = p.isAlert ? COLOR_USR_RED + '0.8)' : COLOR_ICE_BLUE + '0.8)';
    ctx.fill();

    // Hubungkan antar Simpul (Jaringan Saraf)
    for (let j = i + 1; j < particles.length; j++) {
      const p2 = particles[j];
      const dx = p.x - p2.x;
      const dy = p.y - p2.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 130) {
        ctx.beginPath();
        const alpha = (1 - dist / 130) * 0.35;
        ctx.strokeStyle = (p.isAlert || p2.isAlert) 
          ? COLOR_USR_RED + alpha + ')' 
          : COLOR_ICE_BLUE + alpha + ')';
        ctx.lineWidth = 1;
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }
    }
  }
}

// -------------------------------------------------------------
// MODE 2: Positronic Brain Waves (Gelombang Otak Positronik)
// -------------------------------------------------------------
function drawPositronicWaves(ctx) {
  waveOffset += 0.015;
  const waveLines = 5;

  for (let i = 0; i < waveLines; i++) {
    ctx.beginPath();
    ctx.lineWidth = 1.5;
    
    // Baris ke-2 diberi aksen merah VIKI
    const isRedLine = i === 2;
    ctx.strokeStyle = isRedLine ? COLOR_USR_RED + '0.4)' : COLOR_ICE_BLUE + '0.25)';

    for (let x = 0; x < width; x += 10) {
      const y = Math.sin(x * 0.005 + waveOffset + i) * 40 + 
                Math.cos(x * 0.002 - waveOffset) * 20 + 
                (height / 2) + (i * 30 - 60);

      if (x === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();
  }
}
