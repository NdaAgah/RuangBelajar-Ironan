/* ==========================================================================
   FORM BUILDER FUNCTION: VERVAL SEKTOR SIBER (UPDATED & VALIDATED)
   ========================================================================== */

// Helper sederhana untuk membersihkan karakter berbahaya (mencegah XSS)
function sanitizeInput(str) {
    // PERBAIKAN: Menggunakan RegEx literal yang benar (tanpa tanda petik string)
    return str.replace(/[&<>"']/g, (match) => {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return map[match];
    });
}

export function renderVervalForm(core) {
    const form = document.createElement('form');
    form.innerHTML = `
        <div class="usr-form-group">
            <label class="usr-form-label">Nama Anggota</label>
            <input type="text" id="inputNama" class="usr-form-input" placeholder="Masukkan nama..." required autocomplete="off">
        </div>
        <div class="usr-form-group">
            <label class="usr-form-label">Sekolah / Asal</label>
            <input type="text" id="inputSekolah" class="usr-form-input" placeholder="Masukkan nama sekolah..." required autocomplete="off">
        </div>
        <div id="statusBox" class="usr-form-status" style="display: none;"></div>
        <button type="submit" id="btnSubmit" class="usr-form-submit">Verifikasi Data</button>
    `;

    // Handler Async Form Submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const GAS_ENDPOINT_URL = core.config.gasEndpointUrl;
        const submitBtn = form.querySelector('#btnSubmit');
        const statusBox = form.querySelector('#statusBox');
        
        // Ambil dan bersihkan nilai input
        const rawNama = form.querySelector('#inputNama').value.trim();
        const rawSekolah = form.querySelector('#inputSekolah').value.trim();
        const nama = sanitizeInput(rawNama);
        const sekolah = sanitizeInput(rawSekolah);

        // Validasi Client-Side
        if (nama.length < 3) {
            statusBox.style.display = 'block';
            statusBox.className = 'usr-form-status error';
            statusBox.textContent = '⚠️ Nama harus terdiri dari minimal 3 karakter!';
            return;
        }

        if (sekolah.length < 3) {
            statusBox.style.display = 'block';
            statusBox.className = 'usr-form-status error';
            statusBox.textContent = '⚠️ Nama sekolah/asal harus terdiri dari minimal 3 karakter!';
            return;
        }
        
        // Loading State UI
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.6';
        submitBtn.textContent = 'MENGHUBUNGKAN SERVER...';
        statusBox.style.display = 'none';

        core.log('INFO', `Connecting to GAS Server for [${nama}]...`);

        try {
            const response = await fetch(GAS_ENDPOINT_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain;charset=utf-8',
                },
                body: JSON.stringify({ 
                    action: 'VERVAL', 
                    nama, 
                    sekolah 
                }),
                redirect: 'follow'
            });

            const result = await response.json();

            // PERBAIKAN: Membaca user hanya saat respon status SUCCESS dan data tersedia
            if (result.status === 'SUCCESS' && result.data && result.data) {
                const user = result.data.user;

                statusBox.style.display = 'block';
                statusBox.className = 'usr-form-status success';
                statusBox.textContent = `✓ ${result.message}`;
                
                // Simpan data hasil respon ke Core State
                core.setUserData({
                    key: user.key,
                    nama: user.nama,
                    sekolah: user.sekolah,
                    tingkat: user.tingkat || '-',
                    kelas: user.kelas || '-',
                    status: 'VERIFIED'
                });

                setTimeout(() => {
                    core.closeModal();
                    core.loadModule('dashboard');
                }, 1500);

            } else if (result.status === 'FAILED') {
                core.log('SEC', `VERVAL REJECTED: ${result.message}`);
                
                statusBox.style.display = 'block'; 
                statusBox.className = 'usr-form-status error';
                statusBox.innerHTML = `
                    <p style="font-weight: bold; margin-bottom: 6px;">
                        ⚠️ AKSES DITOLAK: Data Tidak Ditemukan
                    </p>
                    <p style="font-size: 0.75rem; margin-bottom: 12px; color: var(--usr-text-muted);">
                        Identitas Anda belum terdaftar dalam direktori S.I.B.E.R. Silakan lakukan registrasi siswa baru.
                    </p>
                    <button type="button" id="btnTriggerReg" class="usr-form-submit" style="background: var(--usr-neon-amber, #f59e0b); color: #000; font-weight: 800; width: 100%;">
                        LANJUTKAN REGISTRASI SISWA
                    </button>
                `;

                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';
                submitBtn.textContent = 'Verifikasi Data';

                // Buka modal registrasi jika pengguna belum terdaftar
                statusBox.querySelector('#btnTriggerReg').addEventListener('click', () => {
                    const regFormFn = core.getForm('register');
                    if (regFormFn) {
                        core.openModal('REGISTRASI SISWA BARU', regFormFn, false);
                    } else {
                        alert('Modul registrasi belum terpasang!');
                    }
                });

            } else {
                statusBox.style.display = 'block';
                statusBox.className = 'usr-form-status error';
                statusBox.textContent = `✕ ${result.message || 'Verifikasi gagal'}`;
                core.log('SEC', `SERVER REJECTED: [${nama}] - ${result.message}`);
                
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';
                submitBtn.textContent = 'Verifikasi Data';
            }

        } catch (err) {
            statusBox.style.display = 'block';
            statusBox.className = 'usr-form-status error';
            statusBox.textContent = '✕ ERROR: Gagal terhubung ke Server GAS / Masalah Jaringan.';
            core.log('SEC', `NETWORK ERROR: ${err.message}`);
            
            submitBtn.disabled = false;
            submitBtn.style.opacity = '1';
            submitBtn.textContent = 'Verifikasi Data';
        }
    });

    return form;
}
