// js/app.js
import { initNeonGrid } from './modules/neonGrid.js';
import { initIRobotTheme, stopAnimation } from './modules/iRobotGrid.js';
import { fetchFromGAS, sendToGAS, writeLog } from './modules/apiService.js';

let currentTheme = 'neural'; // State awal

// Fungsi pengganti Tema (Boleh tetap di luar)
function toggleTheme() {
  stopAnimation();

  if (currentTheme === 'neural') {
    currentTheme = 'positronic';
    document.documentElement.style.setProperty('--cyber-cyan', '#ff1e3c');
  } else {
    currentTheme = 'neural';
    document.documentElement.style.setProperty('--cyber-cyan', '#00f3ff');
  }

  initIRobotTheme('neonCanvas', currentTheme);
  
  if (typeof writeLog === 'function') {
    writeLog(`> Tema dialihkan ke mode: ${currentTheme.toUpperCase()}`);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------
  // Inisialisasi Canvas Theme & Event Listener Switch Theme
  // --------------------------------------------------------------------
  initIRobotTheme('neonCanvas', currentTheme);

  // Dipindahkan ke DALAM DOMContentLoaded agar tombol ditemukan
  const toggleButtons = document.querySelectorAll('.btn-toggle-theme');
  toggleButtons.forEach(button => {
    button.addEventListener('click', toggleTheme);
  });

  // --------------------------------------------------------------------
  // URL Deployment Google Apps Script
  // --------------------------------------------------------------------
  const GAS_URL = "https://script.google.com/macros/s/AKfycbzu3Bcg-fBX0UcUD7Jb9YDkks-OdLmWayxsvJvrpxLbf4vEYG5vZuS-rK5MEwOx25S3gA/exec";

  // --------------------------------------------------------------------
  // A. Fungsionalitas Tes Sinyal API (Tombol Fetch GET)
  // --------------------------------------------------------------------
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
  const userForm = document.querySelector('form');
  
  async function checkConnection() {
    writeLog("Menghubungkan ke Google Sheets via GET...");
    const res = await fetchFromGAS(GAS_URL);
    
    if (res.status !== "ERROR") {
      writeLog(`Respon GET Berhasil! Data diterima.`);
    } else {
      writeLog(res.message, true);
    }
  }

  checkConnection();

  if (userForm) {
    userForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const namaInput = userForm.querySelector('input[placeholder*="Penulis"]');
      const emailInput = userForm.querySelector('input[type="email"]');
      const roleSelect = userForm.querySelector('select');

      const payload = {
        nama: namaInput ? namaInput.value : '',
        email: emailInput ? emailInput.value : '',
        role: roleSelect ? roleSelect.value : '',
        timestamp: new Date().toISOString()
      };

      const result = await sendToGAS(GAS_URL, payload);

      if (result && result.status !== "ERROR") {
        writeLog(" Registrasi berhasil disimpan di Sheets!");
        userForm.reset();
      } else {
        writeLog(" Gagal menyimpan data user.", true);
      }
    });
  }

  // -------------------------------------------------------------
  // C. Unregister Service Worker PWA (Pengembangan)
  // -------------------------------------------------------------
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (let registration of registrations) {
        registration.unregister();
        console.log('SW Unregistered:', registration);
      }
    });
  }
}); // Penutup DOMContentLoaded yang tepat
