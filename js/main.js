/**
* Core Application Architecture - USR System
* Mengatur Komunikasi Antar Modul, State, Audit Logging, dan Background Canvas.
*/

// FIX 1: Pastikan menyertakan `.js` dan sesuaikan jalur folder file Anda
import { initIRobotTheme } from "./modues/background-animation.js";
import { renderVervalForm } from "./modules/vervalUser.js";

class USRCore {
    constructor() {
        this.config = {
            // Rubah ke '/api/verval'
            gasEndpointUrl: '/api/verval'
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
}

// 1. Inisialisasi Core Engine
const App = new USRCore();
/* ==========================================================================
   AUTO-EXECUTE / AUTORUN ON LOAD
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    App.init();
    App.log('INFO', 'Auto-launching VERVAL Modal on system startup...');
    App.openModal('VERVAL SEKTOR SIBER', renderVervalForm, true);

    // 2. Inisialisasi Canvas Background Animasi
    const bgCanvas = initIRobotTheme('neuralPositronic', 'neural');

    /* ==========================================================================
    REGISTRASI MODUL
    ========================================================================== */

    // Modul 1: System Dashboard
    // Modul Dashboard dengan Tombol Pemicu Modal
    /*
    App.registerModule('verval', 'Verval', (core) => {
        if (bgCanvas) bgCanvas.setMode('neural');

        const container = document.createElement('div');
        container.className = 'usr-card';
        container.innerHTML = `
            <h2 class="usr-card-title">VERVAL SEKTOR SIBER</h2>
            <p style="margin-bottom: 16px; color: var(--usr-text-muted);">
                Klik tombol di bawah untuk membuka form verifikasi keanggotaan Sektor Siber.
            </p>
            <button id="btnOpenVerval" class="usr-nav-btn" style="background: var(--usr-neon-cyan); color: #000; font-weight: bold;">
                Buka Form VERVAL
            </button>
        `;

        container.querySelector('#btnOpenVerval').addEventListener('click', () => {
            core.openModal('VERVAL SEKTOR SIBER', renderVervalForm, false);
        });

        return container;
    });*/

    App.registerModule('dashboard', 'Dashboard', (core) => {
        if (bgCanvas) bgCanvas.setMode('neural');

        const container = document.createElement('div');
        container.className = 'usr-card';
        container.innerHTML = `
            <h2 class="usr-card-title">Three Laws Compliance Monitor</h2>
            <p style="margin-bottom: 12px; color: var(--usr-text-muted);">
                Sistem dalam kondisi normal. Seluruh unit terhubung ke server pusat USR.
            </p>
            <button id="btnDiagnostic" class="usr-nav-btn">
                Jalankan Diagnostik
            </button>
        `;

        container.querySelector('#btnDiagnostic').addEventListener('click', () => {
            core.log('INFO', 'Running Diagnostic Routine...');
            core.log('INFO', 'Diagnostic Complete: Integrity 100%.');
        });

        return container;
    });

    // Modul 2: Security Audit
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
});