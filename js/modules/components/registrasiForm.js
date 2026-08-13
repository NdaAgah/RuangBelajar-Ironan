/* >>>>>
// KOMPONEN FORM REGISTRASI
// ------------------------
// 1. Fungsi render Form Registrasi untuk injeksi html ke Area Kontainer Utama
// 2. Fungsi init handler Form Registrasi dijalankan melalui aksi tombol KIRIM DATA SISWA
<<<<< */

export function renderFormRegistrasi() {
  return
  `<div class="form-card-floating">
      <h3>// REGISTRASI USER</h3>
      <form id="userForm" class="user-form">
        <div class="form-group">
          <label for="inputNama">NAMA LENGKAP</label>
          <input type="text" id="inputNama" placeholder="Contoh: Penulis Eksentrik" required />
        </div>
          
        <div class="form-group">
          <label for="tingkat">Tingkat</label>
          <select id="selectTingkat">
            <option value="SD / MI">SD / MI</option>
            <option value="SMP / MTs">SMP / MTs</option>
            <option value="SMA / MA">SMA / MA</option>
            <option value="Perguruan Tinggi">Perguruan Tinggi</option>
            <option value="Kursus / Umum">Kursus / Umum</option>
          </select>
        </div>

        <div class="form-group">
          <label for="inputSekolah">Sekolah / Instansi / Lembaga</label>
          <input type="text" id="inputSekolah" placeholder="SDN Harapan Mekar / Universitas Terbuka / Pribadi" required />
        </div>
          
        <div class="form-group">
          <label for="kelas">Kelas</label>
          <input type="text" id="inputKelas" placeholder="5 / Karyawan / Umum" required />
        </div>
          
        <button type="submit" id="btnSubmit" class="btn-primary">KIRIM DATA USER</button>
      </form>
    </div>  
  `;
}

export function initFormRegistrasiHandler(){
  const userForm = document.getElementById('userForm');
  if (userForm) {
    userForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const namaInput = document.getElementById('inputNama');
      const sekolahInput = document.getElementById('inputSekolah');
      const tingkatSelect = document.getElementById('selectTingkat');
      const kelasInput = document.getElementById('inputKelas');

      const payload = {
        nama: namaInput ? namaInput.value : '',
        sekolah: sekolahInput ? sekolahInput.value : '',
        tingkat: tingkatSelect ? selectTingkat.value : '',
        kelas: kelasInput ? inputKelas.value : '',
        timestamp: new Date().toISOString()
      };

      const result = await sendToGAS(GAS_URL, payload);

      if (result && result.status !== "ERROR") {
        writeLog(" Registrasi berhasil...!");
        userForm.reset();
        loadUserData(); // <-- Auto reload tabel setelah input
      } else {
        writeLog(" Registrasi Gagal.", true);
      }
    });
  }  
}