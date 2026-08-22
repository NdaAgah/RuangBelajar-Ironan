// ./js/main.js

/**
* Core Application Architecture - USR System
* Mengatur Komunikasi Antar Modul, State, Audit Logging, dan Background Canvas.
*/

// FIX 1: Pastikan menyertakan `.js` dan sesuaikan jalur folder file Anda
import { initIRobotTheme } from "./background-animation.js";
import { renderVervalForm } from "./vervalUser.js";
import { renderRegisterForm } from "./regSiswa.js";
import { renderStudentCard } from "./userCard.js";
import { renderPlaylistModule } from "./playlistForm.js";
import { renderAiChatForm } from "./aiChatForm.js"

class USRCore {
    constructor() {
        this.config = {
            // webhost '/api/verval'
            // localhost 'https://ruangbelajar-ironan.vercel.app/api/verval 
            gasEndpointUrl: 'https://ruangbelajar-ironan.vercel.app/api/verval'
        };

        this.modules = new Map();
        this.activeModuleId = null;
        this.logCounter = 0;
                
        this.domWorkspace = document.getElementById('usrWorkspace');
        this.domNav = document.getElementById('usrNav');
        this.domLogStream = document.getElementById('usrLogStream');
        this.domLogCount = document.getElementById('logCount');

        // Element pendukung foldable log
        this.domLogPanel = document.getElementById('usrLogPanel');
        this.domLogHeader = document.getElementById('usrLogHeader');

        // Modal DOM Elements
        this.domModalOverlay = document.getElementById('usrModalOverlay');
        this.domModalTitle = document.getElementById('usrModalTitle');
        this.domModalBody = document.getElementById('usrModalBody');
        this.domModalClose = document.getElementById('usrModalClose');
        
        // Flag untuk status modal
        this.isModalClosable = true;

        this.forms = new Map(); // Tempat menyimpan registry form
        
        this.currentUser = JSON.parse(localStorage.getItem('siber_user')) || null;
        //this.currentUser = localStorage.getItem('siber_user') || null;
        //console.log(this.currentUser);
    }

    // Inisialisasi Aplikasi
    init() {
        this.setupLogToggle();
        this.setupModalEvents();
        this.log('INFO', 'USR Core Initialization started...');
        this.log('SEC', 'Enforcing CSP & Sanitization rules.');
    }

    // ==========================================
    // REUSABLE DYNAMIC MODAL ENGINE (UPDATED)
    // ==========================================
    setupModalEvents() {
        if (this.domModalClose) {
            this.domModalClose.addEventListener('click', () => {
                // Hanya tutup jika modal diizinkan ditutup
                if (this.isModalClosable) {
                    this.closeModal();
                }
            });
        }
        
        if (this.domModalOverlay) {
            this.domModalOverlay.addEventListener('click', (e) => {
                // HANYA tutup jika klik di overlay luar DAN isModalClosable = true
                if (e.target === this.domModalOverlay && this.isModalClosable) {
                    this.closeModal();
                }
            });
        }
    }

    // Tambahkan parameter isClosable (default: true)
    openModal(title, renderBodyFn, isClosable = true) {
        this.isModalClosable = isClosable;
        this.domModalTitle.textContent = title;
        this.domModalBody.innerHTML = ''; 

        // Sembunyikan atau tampilkan tombol 'X' sesuai parameter
        if (this.domModalClose) {
            this.domModalClose.style.display = isClosable ? 'block' : 'none';
        }

        const formContent = renderBodyFn(this);
        this.domModalBody.appendChild(formContent);

        this.domModalOverlay.classList.add('active');
        this.log('INFO', `Modal Opened: [${title}] (Closable: ${isClosable})`);
    }

    closeModal() {
        if (this.domModalOverlay) {
            this.domModalOverlay.classList.remove('active');
        }
    }

    // Fitur Toggle Log Panel
    setupLogToggle() {
        if (this.domLogHeader && this.domLogPanel) {
            // Auto collapse di layar mobile agar ruang kerja tidak tertutup log
            if (window.innerWidth <= 768) {
                this.domLogPanel.classList.add('collapsed');
            }
            this.domLogHeader.addEventListener('click', () => {
                this.domLogPanel.classList.toggle('collapsed');
            });
        }
    }

    // Registrasi Modul Dinamis
    registerModule(id, title, renderFn) {
        if (this.modules.has(id)) {
            this.log('WARN', `Module ${id} already registered. Overwriting.`);
        }
        this.modules.set(id, { id, title, renderFn });
        this.renderNav();
                
        // Set modul pertama sebagai aktif secara otomatis
        if (!this.activeModuleId) {
            this.loadModule(id);
        }
        this.log('INFO', `Module Registered: [${id.toUpperCase()}] ${title}`);
    }

    // Memuat Modul ke Workspace
    loadModule(id) {
        const module = this.modules.get(id);
        if (!module) {
            this.log('SEC', `Attempted unauthorized or invalid module load: ${id}`);
            return;
        }

        this.activeModuleId = id;
        this.updateNavUI();

        // Clear workspace & render modul baru
        this.domWorkspace.innerHTML = '';
        try {
            const moduleNode = module.renderFn(this);
            this.domWorkspace.appendChild(moduleNode);
            this.log('INFO', `Module activated: ${module.title}`);
        } catch (err) {
            this.log('SEC', `Module Execution Error [${id}]: ${err.message}`);
            // FIX 2: Menggunakan module.title bukan title
            this.domWorkspace.innerHTML = `<div class="usr-card" style="border-left-color: var(--usr-danger)">
            <h3 class="usr-card-title">Module Error</h3>
            <p>Gagal memuat modul ${module.title}.</p> 
            </div>`;
        }
    }

    // Render Navigasi Header
    renderNav() {
        this.domNav.innerHTML = '';
        this.modules.forEach((mod) => {
            const btn = document.createElement('button');
            btn.className = `usr-nav-btn ${mod.id === this.activeModuleId ? 'active' : ''}`;
            btn.textContent = mod.title;
            btn.onclick = () => this.loadModule(mod.id);
            this.domNav.appendChild(btn);
        });
    }

    updateNavUI() {
        const buttons = this.domNav.querySelectorAll('.usr-nav-btn');
        let idx = 0;
        this.modules.forEach((mod) => {
            if (buttons[idx]) {
                if (mod.id === this.activeModuleId) {
                    buttons[idx].classList.add('active');
                } else {
                    buttons[idx].classList.remove('active');
                }
            }
            idx++;
        });
        
    }

    // Centralized Logging Engine
    log(type, message) {
        this.logCounter++;
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const time = `${hours}:${minutes}:${seconds}`;
                
        const entry = document.createElement('div');
        entry.className = 'log-entry';
                
        const timeSpan = document.createElement('span');
        timeSpan.className = 'log-time';
        timeSpan.textContent = `[${time}]`;

        const typeSpan = document.createElement('span');
        typeSpan.className = `log-type-${type}`;
        typeSpan.textContent = `[${type}]`;

        const msgSpan = document.createElement('span');
        msgSpan.textContent = message;

        entry.appendChild(timeSpan);
        entry.appendChild(typeSpan);
        entry.appendChild(msgSpan);

        this.domLogStream.appendChild(entry);
        this.domLogStream.scrollTop = this.domLogStream.scrollHeight;
        this.domLogCount.textContent = `Logs: ${this.logCounter}`;
    }

    generateStudentKey() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 5; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    // Method untuk mendaftarkan form
    registerForm(name, renderFn) {
        this.forms.set(name, renderFn);
        this.log('INFO', `Registrasi Modul [${name}] berhasil`);
    }

    // Method untuk mengambil form berdasarkan nama
    getForm(name) {
        this.log('INFO', `Load [${name}]`);
        return this.forms.get(name);
    }
    
    // Simpan data profil siswa ke State & LocalStorage
    setUserData(userData) {
        this.currentUser = userData;
        localStorage.setItem('siber_user', JSON.stringify(userData));
        this.log('INFO', `User State Updated: [${userData.nama}] (${userData.status})`);
    }
    
    // Ambil data profil
    getUserData() {
        return this.currentUser;
    }
}

// 1. Inisialisasi Core Engine
const App = new USRCore();

/* ==========================================================================
   AUTO-EXECUTE / AUTORUN ON LOAD
   ========================================================================== */
document.addEventListener('DOMContentLoaded', async () => {
    // 1. Inisialisasi Canvas Background
    const bgCanvas = initIRobotTheme('neuralPositronic', 'neural');

    // 2. Register Form
    App.registerForm('verval', renderVervalForm);
    App.registerForm('register', renderRegisterForm);
    App.registerForm('aiChat', renderAiChatForm);
    App.registerForm('video', renderPlaylistModule);
    
    // 3. Register Modul Dashboard (Kartu + Video + AI)
    // Register Modul Dashboard dengan Lazy Loading Playlist
    App.registerModule('dashboard', 'Dashboard', (core) => {
        if (bgCanvas) bgCanvas.setMode('neural');
        
        const container = document.createElement('div');
        const user = core.getUserData();
        
        if (user) {
            container.className = 'dashboard-layout';
            
            // 1. Render Kartu Identitas Siswa
            const cardNode = renderStudentCard(user);
            container.appendChild(cardNode);
            
            // 2. Render Modul Video Pembelajaran (Modular)
            const { playlistCard, videoFab } = renderPlaylistModule(core, user);
            container.appendChild(playlistCard);
            container.appendChild(videoFab);
            
            // 3. Tombol Pemicu Floating AI Chat (Versi Ringkas)
            const aiTriggerBox = document.createElement('button');
            aiTriggerBox.type = 'button';
            aiTriggerBox.className = 'siber-ai-fab';
            aiTriggerBox.id = 'btnOpenAiModal';
            aiTriggerBox.title = 'Buka S.I.B.E.R Cyber Assistant';
            aiTriggerBox.innerHTML = `
                <span class="fab-icon">🤖</span>
            `;
            
            // Event saat tombol diklik untuk membuka Modal Chat
            aiTriggerBox.addEventListener('click', () => {
                core.openModal('🤖 S.I.B.E.R CYBER ASSISTANT', core.getForm('aiChat'), true);
            });
            
            container.appendChild(aiTriggerBox);
            
        } else {
            container.className = 'usr-card';
            container.innerHTML = `
                <h2 class="usr-card-title">Akses Dibatasi</h2>
                <p style="color: var(--usr-text-muted);">Silakan verifikasi data terlebih dahulu.</p>
            `;
        }
                    
        return container;
    });
    
    // 4. Register Modul Keamanan
    App.registerModule('security', 'Keamanan', (core) => {
        if (bgCanvas) bgCanvas.setMode('positronic');
        
        const container = document.createElement('div');
        container.className = 'usr-card';
        container.style.borderLeftColor = 'var(--usr-danger)';
        container.innerHTML = `
            <h2 class="usr-card-title" style="color: var(--usr-danger);">Pengaturan Akses Keamanan</h2>
            <p style="margin-bottom: 12px;">Monitoring Protokol VIKI & Kontrol Otentikasi.</p>
            <button id="btnAlert" class="usr-nav-btn" style="border-color: var(--usr-danger); color: var(--usr-danger);">
                Simulasi Pelanggaran
            </button>
        `;
        
        container.querySelector('#btnAlert').addEventListener('click', () => {
            core.log('SEC', 'ALERT: Deteksi akses tidak dikenal pada Node 04!');
        });
        
        return container;
    });
    
    // 5. Boot System Utama (Aman & Stabil)
    try {
        if (typeof App.init === 'function') {
            await App.init();
        }
        
        const savedUserData = App.getUserData();

        if (savedUserData) {
            App.loadModule('dashboard');
        } else {
            App.log('INFO', 'Auto-launching VERVAL Modal on system startup...');
            App.openModal('VERVAL SEKTOR SIBER', App.getForm('verval'), false);
        }
    } catch (err) {
        App.log('App Init Error:', `[${err}]`);
    }
});
