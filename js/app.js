// js/app.js
import { initNeonGrid } from './modules/neonGrid.js';
import { initIRobotTheme, stopAnimation } from './modules/iRobotGrid.js';
import { fetchFromGAS, sendToGAS, writeLog } from './modules/apiService.js';

let currentTheme = 'neural'; // State awal

//const btnToggle = document.getElementById('btnToggleTheme');
//const themeLabel = document.getElementById('themeLabel');

// Fungsi pengganti Tema
function toggleTheme() {
  stopAnimation();

  if (currentTheme === 'neural') {
    currentTheme = 'positronic';
    document.documentElement.style.setProperty('data-theme', 'positronic');
  } else {
    currentTheme = 'neural';
    document.documentElement.style.setProperty('data-theme', 'neural');
  }

  initIRobotTheme('neonCanvas', currentTheme);
  
  if (typeof writeLog === 'function') {
    writeLog(`> Tema dialihkan ke mode: ${currentTheme.toUpperCase()}`);
  }
}

// Event Listener SEMUA tombol dengan class .btnToggleTheme
const toggleButtons = document.querySelectorAll('.btnToggleTheme');
toggleButtons.forEach(button => {
  button.addEventListener('click', toggleTheme);
});

document.addEventListener('DOMContentLoaded', () => {
  // 1. Inisialisasi Canvas Neon
  //initNeonGrid('neonCanvas');
  // Ganti parameter kedua dengan 'neural' ATAU 'positronic'
  initIRobotTheme('neonCanvas', 'neural'); 
  //initIRobotTheme('neonCanvas', 'positronic'); 

  // Contoh jika ingin ganti ke Gelombang Otak Positronik:
  // initIRobotTheme('neonCanvas', 'positronic');

  // 2. URL Web App Google Apps Script Utama
  const GAS_URL = "https://script.google.com/macros/s/AKfycbzu3Bcg-fBX0UcUD7Jb9YDkks-OdLmWayxsvJvrpxLbf4vEYG5vZuS-rK5MEwOx25S3gA/exec";

  // -------------------------------------------------------------
  // A. Fungsionalitas Tes Sinyal API (Tombol Fetch GET)
  // -------------------------------------------------------------
  const btnFetch = document.getElementById('btnFetch');
  const dataOutput = document.getElementById('dataOutput');

  if (btnFetch && dataOutput) {
    btnFetch.addEventListener('click', async () => {
      dataOutput.innerText = "> MENSTRANSMISIKAN SINYAL KE GAS...";
      
      const result = await fetchFromGAS(GAS_URL);
      
      // Tampilkan hasil respon dari GAS ke UI PWA
      dataOutput.innerText = `> SINYAL DITERIMA:\n${JSON.stringify(result, null, 2)}`;
    });
  }

  // -------------------------------------------------------------
  // B. Fungsionalitas Form Entri User (POST ke Google Sheets)
  // -------------------------------------------------------------
  const userForm = document.getElementById('userForm');

  if (userForm) {
    userForm.addEventListener('submit', async (event) => {
      event.preventDefault(); // Mencegah reload halaman

      const payload = {
        nama: document.getElementById('inputNama').value,
        email: document.getElementById('inputEmail').value,
        role: document.getElementById('selectRole').value
      };

      writeLog("Form disubmit oleh pengguna.");
      
      // Kirim data ke Google Apps Script
      const result = await sendToGAS(GAS_URL, payload);

      if (result.status === "SUCCESS") {
        writeLog("BERHASIL: Data pengguna tercatat di spreadsheet!");
        userForm.reset(); // Kosongkan form
      } else {
        writeLog("GAGAL: Data tidak tersimpan di backend.", true);
      }
    });
  }

  // -------------------------------------------------------------
  // C. Inisialisasi Service Worker PWA
  // -------------------------------------------------------------
  /*if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('SW Registered:', reg.scope))
      .catch(err => console.error('SW Registration Failed:', err));
  }*/

  //--------------------------------------------------------------
  // D. Unregister semua Service Worker PWA yang terpasang
  //--------------------------------------------------------------
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (let registration of registrations) {
        registration.unregister();
        console.log('SW Unregistered:', registration);
      }
    });
  }
});
