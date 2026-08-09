// js/app.js
import { initNeonGrid } from './modules/neonGrid.js';
import { initIRobotTheme, stopAnimation } from './modules/iRobotGrid.js';
import { fetchFromGAS, sendToGAS, writeLog } from './modules/apiService.js';

let currentTheme = 'neural'; // State awal

//const btnToggle = document.getElementById('btnToggleTheme');
//const themeLabel = document.getElementById('themeLabel');

/* ---------------------------------------------------------------------
| URL Deployment Google APss Script                                    |
......................................................................*/
const GAS_URL = "https://script.google.com/macros/s/AKfycbzu3Bcg-fBX0UcUD7Jb9YDkks-OdLmWayxsvJvrpxLbf4vEYG5vZuS-rK5MEwOx25S3gA/exec";

// Fungsi pengganti Tema
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

// Event Listener SEMUA tombol dengan class .btn-toggle-theme
const toggleButtons = document.querySelectorAll('.btn-toggle-theme');
toggleButtons.forEach(button => {
  button.addEventListener('click', toggleTheme);
});

document.addEventListener('DOMContentLoaded', () => {
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
    // 1. Dapatkan Elemen Form dan Input
    const userForm = document.querySelector('form');
    
    // 2. KONEKSI AWAIL (GET Data dari Google Sheets)
    async function checkConnection() {
      writeLog("Menghubungkan ke Google Sheets via GET...");
      const res = await fetchFromGAS(GAS_URL);
      
      if (res.status !== "ERROR") {
        writeLog(`Respon GET Berhasil! Data diterima.`);
      } else {
        writeLog(res.message, true);
      }
    }
  
    // Jalankan pemeriksaan GET saat aplikasi dimuat
    checkConnection();
  
    // 3. EVENT HANDLER (POST Data dari Form)
    if (userForm) {
      userForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Mencegah reload halaman
        
        // Ambil nilai dari input form
        const namaInput = userForm.querySelector('input[placeholder*="Penulis"]');
        const emailInput = userForm.querySelector('input[type="email"]');
        const roleSelect = userForm.querySelector('select');
  
        const payload = {
          nama: namaInput ? namaInput.value : '',
          email: emailInput ? emailInput.value : '',
          role: roleSelect ? roleSelect.value : '',
          timestamp: new Date().toISOString()
        };
  
        // Kirim payload ke GAS
        const result = await sendToGAS(GAS_URL, payload);
  
        if (result && result.status !== "ERROR") {
          writeLog(" Registrasi berhasil disimpan di Sheets!");
          userForm.reset(); // Bersihkan form
        } else {
          writeLog(" Gagal menyimpan data user.", true);
        }
      });
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
