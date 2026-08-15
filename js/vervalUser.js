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
        statusBox.style.display = 'none';

        core.log('INFO',`GAS ${GAS_ENDPOINT_URL}`);
        core.log('INFO', `Connecting to GAS Server for [${nama}]...`);

        //2. Simulasi/Handling jika URL belum diisi
        /* if (GAS_ENDPOINT_URL === GAS_URL) {
            setTimeout(() => {
                statusBox.className = 'usr-form-status error';
                statusBox.textContent = '✕ ERROR: URL Endpoint GAS belum dikonfigurasi di main.js';
                core.log('SEC', 'CONFIG ERROR: GAS_ENDPOINT_URL missing.');
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';
                submitBtn.textContent = 'Verifikasi Data';
            }, 800);
            return;
        } */

        // 3. Kirim Request (POST) ke Google Apps Script Endpoint
        try {
            /* 
               CATATAN KEAMANAN & CORS:
               Menggunakan 'text/plain' mencegah browser mengirim 'OPTIONS' preflight request
               yang sering menyebabkan masalah CORS pada Google Apps Script.
            */
            const response = await fetch(GAS_ENDPOINT_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain;charset=utf-8',
                },
                body: JSON.stringify({ nama, sekolah }),
                redirect: 'follow' // Wajib untuk HTTP Redirection 302 dari GAS
            });

            const result = await response.json();

            // 4. Proses Respon dari GAS
            if (result.status === 'SUCCESS') {
                statusBox.className = 'usr-form-status success';
                statusBox.textContent = `✓ ${result.message}`;
                core.log('INFO', `SERVER RESPONSE: [${nama}] Terverifikasi oleh GAS Server.`);
                
                // Tutup modal secara otomatis
                setTimeout(() => {
                    core.closeModal();
                }, 1500);
            } else {
                statusBox.className = 'usr-form-status error';
                statusBox.textContent = `✕ ${result.message}`;
                core.log('SEC', `SERVER REJECTED: [${nama}] - ${result.message}`);
                
                // Reset tombol jika gagal
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';
                submitBtn.textContent = 'Verifikasi Data';
            }

        } catch (err) {
            // 5. Handling Error Koneksi / Network
            statusBox.className = 'usr-form-status error';
            statusBox.textContent = '✕ ERROR: Gagal terhubung ke Server GAS / Masalah Jaringan.';
            core.log('SEC', `NETWORK ERROR: ${err.message}`);
            
            submitBtn.disabled = false;
            submitBtn.style.opacity = '1';
            submitBtn.textContent = 'Verifikasi Data';
        }
    });

    /*
    // Handlers Validasi Case-Sensitive
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const nama = form.querySelector('#inputNama').value;
        const sekolah = form.querySelector('#inputSekolah').value;
        const statusBox = form.querySelector('#statusBox');

        // PENGUJIAN STRICT CASE-SENSITIVE
        if (nama === 'Tuan Penulis' && sekolah === 'Sektor Biosfer') {
            statusBox.className = 'usr-form-status success';
            statusBox.textContent = '✓ TERVERIFIKASI: Akses Sektor Siber Diberikan.';
            core.log('INFO', `VERVAL SUCCESS: [${nama}] dari [${sekolah}] Terverifikasi.`);
            
            // Otomatis tutup modal setelah 1.5 detik
            setTimeout(() => {
                core.closeModal();
            }, 1500);
        } else {
            statusBox.className = 'usr-form-status error';
            statusBox.textContent = '✕ GAGAL: Nama atau Sekolah tidak cocok (Case-Sensitive).';
            core.log('SEC', `VERVAL FAILED: Input [${nama} | ${sekolah}] Ditolak!`);
        }
    }); */

    return form;
}