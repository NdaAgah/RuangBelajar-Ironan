/* eslint-disable no-undef */
/* ==========================================================================
   COMPONENT BUILDER: S.I.B.E.R CYBER STUDENT ID CARD
   ========================================================================== */

/**
 * Membuang dan merender komponen kartu identitas siswa.
 * @param {Object} userData - Data identitas pengguna dari LocalStorage
 * @param {Object|null} core - Sistem modul utama untuk mencatat log (opsional)
 * @returns {HTMLElement} Elemen HTML kartu identitas
 */
export function renderStudentCard(userData, core = null) {
    // 1. Buat elemen kontainer utama
    const card = document.createElement('div');
    card.className = 'usr-card siber-id-card';

    // 2. Amankan data dengan nilai bawaan (fallback)
    const isVerified = Boolean(userData && userData.status === 'VERIFIED');
    const badgeText = isVerified ? 'VERIFIED STUDENT' : 'NEW REGISTERED';

    const key = (userData && userData.key) ? userData.key : 'N/A';
    const nama = (userData && userData.nama) ? userData.nama : '-';
    const sekolah = (userData && userData.sekolah) ? userData.sekolah : '-';
    const tingkat = (userData && userData.tingkat) ? userData.tingkat : '-';
    const kelas = (userData && userData.kelas) ? userData.kelas : '-';

    // 3. Render struktur HTML
    card.innerHTML = `
    <div class="siber-id-card">
        <div class="siber-watermark">SIBER</div>

        <div class="siber-card-header">
            <div class="siber-header-left">
                <span class="siber-subtext">IDENTITAS DIGITAL SISWA</span>
                <strong class="siber-title">S.I.B.E.R CYBERGATE</strong>
            </div>  
            
            <div class="siber-header-right">
                <span class="siber-badge" style="text-align: right;">● ${badgeText}</span>
                <button type="button" id="btnResetData" class="siber-btn-logout">
                    <i class="fas fa-power-off"></i> RESET
                </button>
            </div>
        </div>

        <div class="siber-card-body">
            <div class="siber-avatar-box">
                <div class="siber-avatar-icon">👤</div>
                <div class="siber-avatar-label">SEC-ID</div>
            </div>

            <div class="siber-info-grid">
                <div class="siber-info-item">
                    <span class="siber-subtext">KEY</span>
                    <strong class="siber-key">:${key}</strong>
                </div>
                <div class="siber-info-item">
                    <span class="siber-subtext">NAMA</span>
                    <span class="siber-value">:&nbsp${nama}</span>
                </div>
                <div class="siber-info-item">
                    <span class="siber-subtext">SEKOLAH</span>
                    <span class="siber-value">:&nbsp${sekolah}</span>
                </div>
                <div class="siber-row-inline">
                    <div class="siber-info-item">
                        <span class="siber-subtext">TINGKAT</span>
                        <span class="siber-value">:&nbsp${tingkat}</span>
                    </div>
                    <div class="siber-info-item">
                        <span class="siber-subtext">KELAS</span>
                        <span class="siber-value">:&nbsp${kelas}</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="siber-card-footer">
            <div class="siber-issued">
                ISSUED: ${new Date().toLocaleDateString('id-ID')}
            </div>
            <div class="siber-barcode">||||| || | |||| |||</div>
        </div>
    </div>
    `;

    // 4. Hubungkan tombol Reset
    const resetBtn = card.querySelector('#btnResetData');

    if (resetBtn) {
        resetBtn.addEventListener('click', function () {
            if (confirm('S.I.B.E.R SYSTEM: Hapus identitas digital tersimpan?')) {
                if (core && typeof core.log === 'function') {
                    core.log('SEC', 'User digital identity cleared by operator.');
                }
                localStorage.removeItem('siber_user');
                window.location.reload();
            }
        });
    }

    return card;
}
