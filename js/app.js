// js/app.js
import { initNeonGrid } from './modules/neonGrid.js';
import { initIRobotTheme, stopAnimation } from './modules/iRobotGrid.js';
import { fetchFromGAS, sendToGAS, writeLog } from './modules/apiService.js';

let currentTheme = 'neural';

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
  initIRobotTheme('neonCanvas', currentTheme);

  const toggleButtons = document.querySelectorAll('.btn-toggle-theme');
  toggleButtons.forEach(button => button.addEventListener('click', toggleTheme));

  const GAS_URL = "https://script.google.com/macros/s/AKfycbygddwORMDPiUu67o4ecRpHST5U5F72qce7pWy1VYJwbnmrpI0Z0trpwlW4JfywHm-5vw/exec";

  // 1. Deklarasikan Helper Render Tabel Pertama
  function renderUserTable(dataRows) {
    const tableBody = document.getElementById('userTableBody');
    if (!tableBody) return;

    if (!dataRows || dataRows.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="4" style="text-align:center;">> Database kosong.</td></tr>`;
      return;
    }

    tableBody.innerHTML = dataRows.map(user => `
      <tr>
        <td><strong>${user.nama || '-'}</strong></td>
        <td>${user.email || '-'}</td>
        <td><span class="badge">${user.role || '-'}</span></td>
        <td><small>${user.timestamp ? new Date(user.timestamp).toLocaleString('id-ID') : '-'}</small></td>
      </tr>
    `).join('');
  }

  // 2. Fungsi Load Data
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

  // 3. Tombol Refresh Manual
  const btnRefresh = document.getElementById('btnRefreshTable');
  if (btnRefresh) {
    btnRefresh.addEventListener('click', loadUserData);
  }

  // 4. Inisialisasi Koneksi Awal
  async function checkConnection() {
    writeLog("Menghubungkan ke Google Sheets via GET...");
    const res = await fetchFromGAS(GAS_URL);
    
    if (res && res.status !== "ERROR") {
      writeLog(`Respon GET Berhasil! Data diterima.`);
      if (Array.isArray(res.data)) {
        renderUserTable(res.data);
      }
    } else {
      writeLog(res ? res.message : "Koneksi terputus.", true);
    }
  }

  checkConnection();

  // 5. Submit Form Handler
  const userForm = document.getElementById('userForm');
  if (userForm) {
    userForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const namaInput = document.getElementById('inputNama');
      const emailInput = document.getElementById('inputEmail');
      const roleSelect = document.getElementById('selectRole');

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
        loadUserData(); // Auto reload tabel setelah input
      } else {
        writeLog(" Gagal menyimpan data user.", true);
      }
    });
  }

  // Service Worker Cleanup
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (let registration of registrations) registration.unregister();
    });
  }
});