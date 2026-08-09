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
  
  // Panggil di dalam alur checkConnection() atau tombol Refresh:
  async function loadUserData() {
    writeLog("Mengambil data user terbaru dari Sheets...");
    const res = await fetchFromGAS(GAS_URL);
    
    if (res && res.status !== "ERROR" && Array.isArray(res.data)) {
      renderUserTable(res.data);
      writeLog(`> SUCCESS: Tabel diperbarui (${res.data.length} baris).`);
    } else {
      writeLog(" Gagal memperbarui tabel.", true);
    }
  }

  async function checkConnection() {
    writeLog("Menghubungkan ke Google Sheets via GET...");
    const res = await fetchFromGAS(GAS_URL);
    
    if (res.status !== "ERROR") {
      writeLog(`Respon GET Berhasil! Data diterima.`);
    } else {
      writeLog(res.message, true);
    }
    
    // Mengambil data User
    loadUserData();
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
  // C. Fungsi untuk memetakan data array JSON ke tabel HTML
  // -------------------------------------------------------------

  function renderUserTable(dataRows) {
    const tableBody = document.getElementById('userTableBody');
    if (!tableBody) return;

    if (!dataRows || dataRows.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="4" class="text-center">> Database kosong.</td></tr>`;
      return;
    }

    // Susun elemen baris tabel secara dinamis
    tableBody.innerHTML = dataRows.map(user => {
      return `
        <tr>
          <td><strong>${user.nama || '-'}</strong></td>
          <td>${user.email || '-'}</td>
          <td><span class="badge">${user.role || '-'}</span></td>
          <td><small>${user.timestamp ? new Date(user.timestamp).toLocaleString('id-ID') : '-'}</small></td>
        </tr>
      `;
    }).join('');
  }

  // -------------------------------------------------------------
  // D. Unregister Service Worker PWA (Pengembangan)
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
