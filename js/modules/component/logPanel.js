export function togBtn () {
  const logFooter = document.getElementById('logFooter');
  const toggleBtn = document.getElementById('toggleBtn');
  const toggleIcon = document.getElementById('toggleIcon');

  toggleBtn.addEventListener ('click', () => {
    // Toggle class 'closed'
    const isClosed = logFooter.classList.toggle('closed');
    
    // Ubah arah panah
    toggleIcon.textContent = isClosed ? '▲' : '▼';
  });
}