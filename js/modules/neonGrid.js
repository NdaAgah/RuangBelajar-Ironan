// Modul khusus untuk mengurus animasi efek garis/wireframe di canvas
export function initNeonGrid(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  
  function resize() {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  let offset = 0;

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set gaya garis neon
    ctx.strokeStyle = 'rgba(0, 243, 255, 0.4)';
    ctx.lineWidth = 1;
    ctx.shadowBlur = 8;
    ctx.shadowColor = '#00f3ff';

    const gridSize = 20;

    // Garis Vertikal
    for (let x = 0; x < canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }

    // Garis Horizontal Bergerak (Efek Scanning)
    offset = (offset + 0.5) % gridSize;
    for (let y = offset; y < canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    requestAnimationFrame(draw);
  }

  draw();
}
