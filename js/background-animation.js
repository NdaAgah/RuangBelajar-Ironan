/**
 * USR Positronic & Neural Background Canvas Module
 * Theme: U.S. Robotics (Neon Cyberpunk Interface)
 */

let animationId = null;
let mode = 'neural'; // Mode aktif: 'neural' atau 'positronic'
let width = 0;
let height = 0;
let particles = [];
let waveOffset = 0;

// Warna Sesuai Variabel Neon CSS USR Design System
const COLOR_NEON_CYAN = 'rgba(0, 240, 255, ';
const COLOR_NEON_RED  = 'rgba(255, 0, 85, ';

/**
 * Inisialisasi Canvas Animasi Latar Belakang USR
 * @param {string} canvasId - ID elemen canvas pada HTML
 * @param {'neural'|'positronic'} initialMode - Mode animasi awal
 * @returns {object} Kontrol API untuk mengubah mode atau menghentikan animasi
 */
export function initIRobotTheme(canvasId, initialMode = 'neural') {
    const canvas = document.getElementById(canvasId);
    if (!canvas) {
        console.warn(`[USR Canvas] Elemen #${canvasId} tidak ditemukan.`);
        return null;
    }

    const ctx = canvas.getContext('2d');
    mode = initialMode;

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        initParticles();
    }

    window.removeEventListener('resize', resize);
    window.addEventListener('resize', resize);
    resize();

    // Reset loop jika sudah berjalan sebelumnya
    if (animationId) cancelAnimationFrame(animationId);

    function render() {
        ctx.clearRect(0, 0, width, height);

        // Latar belakang disesuaikan dengan var(--usr-bg) #0A0E17
        ctx.fillStyle = '#0A0E17';
        ctx.fillRect(0, 0, width, height);

        if (mode === 'neural') {
            drawNeuralNetwork(ctx);
        } else if (mode === 'positronic') {
            drawPositronicWaves(ctx);
        }

        animationId = requestAnimationFrame(render);
    }

    render();

    // Mengembalikan objek kontrol untuk interaksi dinamis dari main.js
    return {
        setMode: (newMode) => {
            if (['neural', 'positronic'].includes(newMode)) {
                mode = newMode;
            }
        },
        stop: stopAnimation
    };
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
            // 5% kemungkinan node peringatan VIKI
            isAlert: Math.random() < 0.05 
        });
    }
}

function drawNeuralNetwork(ctx) {
    for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        // Pantulan tepi layar
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Draw node
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.isAlert ? COLOR_NEON_RED + '0.9)' : COLOR_NEON_CYAN + '0.8)';
        ctx.fill();

        // Hubungkan simpul jaringan
        for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dx = p.x - p2.x;
            const dy = p.y - p2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 130) {
                ctx.beginPath();
                const alpha = (1 - dist / 130) * 0.35;
                ctx.strokeStyle = (p.isAlert || p2.isAlert) 
                    ? COLOR_NEON_RED + alpha + ')' 
                    : COLOR_NEON_CYAN + alpha + ')';
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
        
        // Garis tengah sebagai aksen VIKI Red
        const isRedLine = i === 2;
        ctx.strokeStyle = isRedLine ? COLOR_NEON_RED + '0.5)' : COLOR_NEON_CYAN + '0.3)';

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

// Hentikan animasi canvas
export function stopAnimation() {
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
}