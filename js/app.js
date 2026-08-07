import { initNeonGrid } from './modules/neonGrid.js';
import { fetchRemoteData } from './modules/apiService.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Jalankan Modul Animasi Canvas
  initNeonGrid('neonCanvas');

  // 2. Event Listener UI
  const btnFetch = document.getElementById('btnFetch');
  const dataOutput = document.getElementById('dataOutput');

  btnFetch.addEventListener('click', async () => {
    dataOutput.innerText = "> Mengirim sinyal request...";
    
    // Nanti URL ini bisa diganti dengan Web App URL dari GAS
    const fakeApiUrl = "https://jsonplaceholder.typicode.com/todos/1"; 
    const result = await fetchRemoteData(fakeApiUrl);
    
    dataOutput.innerText = `> RESPONSE:\n${JSON.stringify(result, null, 2)}`;
  });

  // 3. Registrasi Service Worker PWA
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('SW Registered:', reg.scope))
      .catch(err => console.error('SW Registration Failed:', err));
  }
});
