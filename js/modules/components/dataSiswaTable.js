/* >>>>>
// KOMPONEN TABEL DATA SISWA
// -------------------------
// 1. Fungsi render Table Data Siswa untuk injeksi html ke Area Kontainer Utama
// 2. Fungsi init handler Form Registrasi dijalankan melalui aksi tombol KIRIM DATA SISWA
<<<<< */

export function renderDataSiswaTable () {
    return
    `<section class="hud-card table-card">
        <div class="hud-card-header">
          <h3>// DATABASE USER (LIVE)</h3>
          <hr>
          <button id="btnRefreshTable" class="btn-secondary-sm">↻ REFRESH</button>
        </div>
        
        <div class="table-responsive">
          <table class="hud-table">
            <thead>
              <tr>
                <th>NAMA LENGKAP</th>
                <th>SEKOLAH/INSTANSI/LEMBAGA</th>
                <th>TINGKAT</th>
                <th>KELAS</th>
                <th>TIMESTAMP</th>
              </tr>
            </thead>
            <tbody id="userTableBody">
              <tr>
                <td colspan="5" class="text-center">>>>>> Mengambil Data...</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>`;
}

// 1. Deklarasikan Helper Render Tabel Pertama
function initDataSiswaTable(dataRows) {
    const tableBody = document.getElementById('userTableBody');
    if (!tableBody) return;

    if (!dataRows || dataRows.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center;">> Database kosong.</td></tr>`;
      return;
    }

    tableBody.innerHTML = dataRows.map(user => `
      <tr>
        <td><strong>${user.nama || '-'}</strong></td>
        <td>${user.sekolah || '-'}</td>
        <td><span class="badge">${user.tingkat || '-'}</span></td>
        <td><span>${user.kelas || '-'}</span></td>
        <td><small>${user.timestamp ? new Date(user.timestamp).toLocaleString('id-ID') : '-'}</small></td>
      </tr>
    `).join('');
}

// 2. Fungsi Load Data
async function loadUserData() {
    writeLog("Mengambil data user terbaru dari Sheets...");
    const res = await fetchFromGAS(GAS_URL);
    
    if (res && res.status !== "ERROR" && Array.isArray(res.data)) {
      renderUserTable(res.data);
      writeLog(`> SUCCESS: Tabel diperbarui (${res.data.length} baris).`);
    } else {
      writeLog(" Gagal memperbarui tabel.", true);
    }
}

// 3. Tombol Refresh Manual
const btnRefresh = document.getElementById('btnRefreshTable');
  if (btnRefresh) {
    btnRefresh.addEventListener('click', loadUserData);
  }

// 4. Inisialisasi Koneksi Awal
async function checkConnection() {
    writeLog("Menghubungkan ke Google Sheets via GET...");
    const res = await fetchFromGAS(GAS_URL);
    
    if (res && res.status !== "ERROR") {
      writeLog(`Respon GET Berhasil! Data diterima.`);
      if (Array.isArray(res.data)) {
        renderUserTable(res.data);
      }
    } else {
      writeLog(res ? res.message : "Koneksi terputus.", true);
    }
}