// js/app.js
import { initNeonGrid } from './modules/neonGrid.js';
import { fetchFromGAS } from './modules/apiService.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Inisialisasi Canvas Neon
  initNeonGrid('neonCanvas');

  // 2. Tempelkan URL Web App GAS Anda di sini
  const GAS_URL = "https://script.google.com/macros/s/AKfycbyJrosdFAScOfpdE1MW4EbEgLvF3pr3WL6V31MSNugdAYkSRXw6CrI9BI-7gbX72p26sQ/exec";

  const btnFetch = document.getElementById('btnFetch');
  const dataOutput = document.getElementById('dataOutput');

  // 3. Panggil API GAS saat tombol diklik
  btnFetch.addEventListener('click', async () => {
    dataOutput.innerText = "> MENSTRANSMISIKAN SINYAL KE GAS...";
    
    const result = await fetchFromGAS(GAS_URL);
    
    // Tampilkan hasil respon dari GAS ke UI PWA
    dataOutput.innerText = `> SINYAL DITERIMA:\n${JSON.stringify(result, null, 2)}`;
  });

  // 4. Service Worker PWA
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('SW Registered:', reg.scope))
      .catch(err => console.error('SW Registration Failed:', err));
  }
});
