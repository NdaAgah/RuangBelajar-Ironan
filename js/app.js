/* >>>>>
// IMPORT pustaka fungsi yang dibutuhkan dari MODULES dan COMPONENTS
<<<<< */
import { CONFIG } from './modules/config';
import { initNeonGrid } from './modules/neonGrid.js';
import { initIRobotTheme, stopAnimation } from './modules/iRobotGrid.js';
import { fetchFromGAS, sendToGAS, writeLog } from './modules/apiService.js';
import { renderLogPanel } from './modules/components/logPanel.js';
import { renderFormRegistrasi, initFormRegistrasiHandler } from "./modules/components/registrasiForm.js";
import { renderDataSiswaTable, initDataSiswaTable, loadUserData } from "./modules/components/dataSiswaTable";

/* >>>>>
// Deklarasi FUNGSI tombol pengalih TEMA
<<<<< */
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

// Helper untuk menumpuk log (tidak menimpa teks sebelumnya)
function debugLog(message) {
  const headerNav = document.querySelector('.header-nav-debug') || document.querySelector('header');
  if (headerNav) {
    // Menggunakan += agar log menumpuk secara berurutan
    headerNav.innerHTML += `<div style="font-size: 11px; color: #ff5555;">> ${message}</div>`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  debugLog('1. Check import: ' + typeof renderFormRegistrasi);

  try {
    const mainContent = document.querySelector('.main-content-area');
        
    debugLog('2. Memanggil renderFormRegistrasi()...');
    const htmlForm = renderFormRegistrasi(); 
    debugLog('3. Form HTML berhasil dibuat!');

    if (mainContent) {
      mainContent.innerHTML = htmlForm;
      debugLog('4. Injeksi HTML sukses!');
    }
  } catch (err) {
    // Menampilkan pesan error LENGKAP beserta baris penyebabnya (stack trace)
    debugLog(`CRITICAL ERROR: ${err.message}`);
    if (err.stack) {
      // Mengambil baris pertama dari stack trace
      const stackLine = err.stack.split('\n')[1] || '';
      debugLog(`AT: ${stackLine.trim()}`);
    }
  }
});

/* >>>>>
// Inisiasi halaman dan RENDER
<<<<< */
document.addEventListener('DOMContentLoaded', () => {
  initIRobotTheme('neonCanvas', currentTheme);
  writeLog(`> initRobotTheme berhasil`);
  const GAS_URL = CONFIG.GAS_URL;


  const mainContent = document.querySelector('.main-content-area');
  const hudSidebar = document.querySelector('.hud-sidebar');
  const toggleButtons = document.querySelectorAll('.btn-toggle-theme');

  if (hudSidebar) {
    hudSidebar.innerHTML = renderLogPanel();
    writeLog(`Sidebar Terisi`);
  }
  
  if (mainContent) {
    mainContent.innerHTML = renderFormRegistrasi() + renderDataSiswaTable();
    writeLog(`Main Content Terisi`);
  }
  
  initFormRegistrasiHandler();
  writeLog(`Handler aktif`);
  initDataSiswaTable();
 
  // 3. Tombol Refresh Manual
  const btnRefresh = document.getElementById('btnRefreshTable');
    if (btnRefresh) {
      btnRefresh.addEventListener('click', loadUserData);
    }
  toggleButtons.forEach(button => button.addEventListener('click', toggleTheme));
  
  checkConnection();

  // Service Worker Cleanup
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (let registration of registrations) registration.unregister();
    });
  }
});