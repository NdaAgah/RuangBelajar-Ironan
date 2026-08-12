/* >>>>>
// IMPORT pustaka fungsi yang dibutuhkan dari MODULES dan COMPONENTS
<<<<< */
import { CONFIG } from './modules/config.js';
import { initNeonGrid } from './modules/neonGrid.js';
import { initIRobotTheme, stopAnimation } from './modules/iRobotGrid.js';
import { fetchFromGAS, sendToGAS, writeLog } from './modules/apiService.js';
import { logPanel, renderLogPanel } from './modules/components/logPanel.js';
import { registrasiForm, renderFormRegistrasi } from "./modules/components/registrasiForm.js";
import { dataSiswaTable } from ".modules/components/dataSiswaTable";
import { renderDataSiswaTable } from './modules/components/dataSiswaTable.js';

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

/* >>>>>
// Inisiasi halaman dan RENDER
<<<<< */
document.addEventListener('DOMContentLoaded', () => {
  initIRobotTheme('neonCanvas', currentTheme);
  const GAS_URL = CONFIG.GAS_URL;


  const mainContent = document.querySelector('.maint-content-area');
  const hudSidebar = document.querySelector('.hud-sidebar');
  const toggleButtons = document.querySelectorAll('.btn-toggle-theme');
    
  if (hudSidebar) {
    hudSidebar.innerHTML = renderLogPanel();
  }

  if (mainContet) {
    mainContent.innerHTML = renderFormRegistrasi() + renderDataSiswaTable();
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