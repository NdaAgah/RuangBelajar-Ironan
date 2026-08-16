/* ==========================================================================
   FORM BUILDER FUNCTION: VERVAL SEKTOR SIBER
   ========================================================================== */
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
        <div id="statusBox" class="usr-form-status"></div>
        <button type="submit" id="btnSubmit" class="usr-form-submit">Verifikasi Data</button>
    `;

    // Handler Async Form Submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const GAS_ENDPOINT_URL = core.config.gasEndpointUrl;
        const submitBtn = form.querySelector('#btnSubmit');
        const statusBox = form.querySelector('#statusBox');
        const nama = form.querySelector('#inputNama').value.trim();
        const sekolah = form.querySelector('#inputSekolah').value.trim();

        // 1. Tampilan Loading State pada Tombol UI
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.6';
        submitBtn.textContent = 'MENGHUBUNGKAN SERVER...';
        statusBox.style.display = 'none'; // Sembunyikan sementara saat proses fetch

        core.log('INFO', `GAS ${GAS_ENDPOINT_URL}`);
        core.log('INFO', `Connecting to GAS Server for [${nama}]...`);

        // 2. Kirim Request (POST) ke Google Apps Script Endpoint
        try {
            const response = await fetch(GAS_ENDPOINT_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain;charset=utf-8',
                },
                body: JSON.stringify({ nama, sekolah }),
                redirect: 'follow'
            });

            const result = await response.json();

            // 3. Proses Respon dari GAS
            if (result.status === 'SUCCESS') {
                statusBox.style.display = 'block'; // PERBAIKAN: Tampilkan kembali statusBox
                statusBox.className = 'usr-form-status success';
                statusBox.textContent = `✓ ${result.message}`;
                core.log('INFO', `SERVER RESPONSE: [${nama}] Terverifikasi oleh GAS Server.`);
                
                setTimeout(() => {
                    core.closeModal();
                }, 1500);

            } else if (result.status === 'FAILED') {
                core.log('SEC', `VERVAL REJECTED: ${result.message}`);
                
                // PERBAIKAN 1: Buka kembali visibilitas statusBox dari inline style
                statusBox.style.display = 'block'; 
                statusBox.className = 'usr-form-status error';
                
                // PERBAIKAN 2: Tambahkan type="button" agar tidak memicu re-submit form
                statusBox.innerHTML = `
                    <p style="font-weight: bold; margin-bottom: 6px;">
                        ⚠️ AKSES DITOLAK: Data Tidak Ditemukan
                    </p>
                    <p style="font-size: 0.75rem; margin-bottom: 12px; color: var(--usr-text-muted);">
                        Identitas Anda belum terdaftar dalam direktori S.I.B.E.R. Silakan lakukan registrasi siswa baru untuk mendapatkan hak akses.
                    </p>
                    <button type="button" id="btnTriggerReg" class="usr-form-submit" style="background: var(--usr-neon-amber); color: #000; font-weight: 800; width: 100%;">
                        LANJUTKAN REGISTRASI SISWA
                    </button>
                `;

                // Reset tombol utama
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';
                submitBtn.textContent = 'Verifikasi Data';

                // Pasang event listener ke tombol registrasi
                statusBox.querySelector('#btnTriggerReg').addEventListener('click', () => {
                    core.openModal('REGISTRASI SISWA BARU', core.getForm('register'), false);
                });

            } else {
                statusBox.style.display = 'block'; // PERBAIKAN: Tampilkan kembali statusBox
                statusBox.className = 'usr-form-status error';
                statusBox.textContent = `✕ ${result.message}`;
                core.log('SEC', `SERVER REJECTED: [${nama}] - ${result.message}`);
                
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';
                submitBtn.textContent = 'Verifikasi Data';
            }

        } catch (err) {
            statusBox.style.display = 'block'; // PERBAIKAN: Tampilkan kembali statusBox
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