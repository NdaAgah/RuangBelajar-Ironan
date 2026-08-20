/* ==========================================================================
   FORM BUILDER FUNCTION: VERVAL SEKTOR SIBER (UPDATED & VALIDATED)
   ========================================================================== */

// Helper sederhana untuk membersihkan karakter berbahaya (mencegah XSS)
function sanitizeInput(str) {
    return str.replace('/[&<>"\']/g', (match) => {
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

export function renderRegisterForm(core) {
    const container = document.createElement('div');
    container.className = 'usr-form-container';
    const autoKey = core.generateStudentKey();
    
    container.innerHTML = `
        <div id="regStatus" class="usr-form-status"></div>

        <div class="usr-form-group">
            <label class="usr-form-label">S.I.B.E.R Student Key (Otomatis)</label>
            <input type="text" class="usr-form-input" value="${autoKey}" readonly 
                   style="background: rgba(0, 240, 255, 0.1); color: var(--usr-neon-cyan); font-weight: bold; font-family: var(--font-mono);" />
        </div>

        <div class="usr-form-group">
            <label class="usr-form-label">Nama Lengkap</label>
            <input type="text" id="regNama" class="usr-form-input" placeholder="Masukkan nama lengkap..." required />
        </div>

        <div class="usr-form-group">
            <label class="usr-form-label">Nama Sekolah / Instansi</label>
            <input type="text" id="regSekolah" class="usr-form-input" placeholder="Contoh: Sektor Biosfer" required />
        </div>

        <div class="usr-form-group">
            <label class="usr-form-label">Tingkat Pendidikan</label>
            <select id="regTingkat" class="usr-form-input" style="background-color: var(--usr-primary);">
                <option value="SD/MI">SD / MI</option>
                <option value="SMP/MTs">SMP / MTs</option>
                <option value="SMA/MA">SMA / MA</option>
                <option value="PT">PT (Perguruan Tinggi)</option>
                <option value="Kursus/Umum">Kursus / Umum</option>
            </select>
        </div>

        <div class="usr-form-group">
            <label class="usr-form-label">Kelas / Rombel</label>
            <select id="regKelas" class="usr-form-input" style="background-color: var(--usr-primary);">
                <option value="1">Kelas 1</option>
                <option value="2">Kelas 2</option>
                <option value="3">Kelas 3</option>
                <option value="4">Kelas 4</option>
                <option value="5">Kelas 5</option>
                <option value="6">Kelas 6</option>
                <option value="VII">Kelas VII</option>
                <option value="VIII">Kelas VIII</option>
                <option value="IX">Kelas IX</option>
                <option value="X">Kelas X</option>
                <option value="XI">Kelas XI</option>
                <option value="XII">Kelas XII</option>
                <option value="*">Umum</option>
            </select>
        </div>

        <div style="display: flex; gap: 10px; margin-top: 10px;">
            <button id="btnSubmitRegister" class="usr-form-submit" style="flex: 2;">KIRIM REGISTRASI</button>
            <button id="btnBackToVerval" class="usr-form-submit" style="flex: 1; background: transparent; border: 1px solid var(--usr-border); color: var(--usr-text-muted);">Coba Verval Lagi</button>
        </div>
    `;
    
    // Kembalikan ke form Verval jika salah input di awal
    container.querySelector('#btnBackToVerval').addEventListener('click', () => {
        core.openModal('VERVAL SEKTOR SIBER', core.getForm('verval'), false);
    });
    
    // Event Listener Submit Registrasi
    container.querySelector('#btnSubmitRegister').addEventListener('click', async () => {
        const GAS_ENDPOINT_URL = core.config.gasEndpointUrl;
        const submitBtn = container.querySelector('#btnSubmitRegister');
        const statusBox = container.querySelector('#regStatus'); // Deklarasikan di paling atas scope
        
        const payload = {
            key: autoKey,
            nama: container.querySelector('#regNama').value.trim(),
            sekolah: container.querySelector('#regSekolah').value.trim(),
            tingkat: container.querySelector('#regTingkat').value,
            kelas: container.querySelector('#regKelas').value.trim(),
            action: 'REGISTER'
        };

        // Validasi Kelengkapan Input
        if (!payload.nama || !payload.sekolah || !payload.kelas) {
            statusBox.style.display = 'block';
            statusBox.className = 'usr-form-status error';
            statusBox.textContent = 'Harap isi seluruh kolom formulir.';
            return;
        }
        
        // State UI Loading
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.6';
        submitBtn.textContent = 'MENGIRIM DATA...';
        statusBox.style.display = 'none';
        
        core.log('INFO', `Mengirim pendaftaran siswa baru: [${payload.nama}]...`);
        
        try {
            const response = await fetch(GAS_ENDPOINT_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain;charset=utf-8',
                },
                body: JSON.stringify(payload), // Mengirim seluruh payload registrasi
                redirect: 'follow'
            });
            
            const result = await response.json();
            
            // Respon Sukses
            if (result.status === 'SUCCESS') {
                statusBox.style.display = 'block';
                statusBox.className = 'usr-form-status success';
                statusBox.textContent = `✓ ${result.message}`;
                core.log('INFO', `SERVER RESPONSE: Registrasi [${payload.nama}] Berhasil.`);
                
                // PERBAIKAN: Simpan data siswa ke Core State menggunakan parameter `core`
                if (result.data) {
                    core.setUserData({
                        key: result.data.key,
                        nama: result.data.nama,
                        sekolah: result.data.sekolah,
                        tingkat: result.data.tingkat || '-',
                        kelas: result.data.kelas || '-',
                        status: 'NEW REGISTERED'
                    });
                }
                
                setTimeout(() => {
                    core.closeModal();
                }, 1500);
                
            } else {
                // Respon Gagal dari GAS
                statusBox.style.display = 'block';
                statusBox.className = 'usr-form-status error';
                statusBox.textContent = `✕ ${result.message || 'Gagal mendaftar.'}`;
                core.log('SEC', `REGISTRATION REJECTED: ${result.message}`);
                
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';
                submitBtn.textContent = 'KIRIM REGISTRASI';
            }
            
        } catch (err) {
            // Network Error
            statusBox.style.display = 'block';
            statusBox.className = 'usr-form-status error';
            statusBox.textContent = '✕ ERROR: Gagal terhubung ke Server GAS / Masalah Jaringan.';
            core.log('SEC', `NETWORK ERROR: ${err.message}`);
            
            submitBtn.disabled = false;
            submitBtn.style.opacity = '1';
            submitBtn.textContent = 'KIRIM REGISTRASI';
        }
    });
    
    return container;
}