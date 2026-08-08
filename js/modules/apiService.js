// js/modules/apiService.js

export async function fetchFromGAS(gasWebappUrl) {
  try {
    // Memanggil Web App GAS via HTTP GET
    const response = await fetch(gasWebappUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP Error Status: ${response.status}`);
    }
    
    // Menerima data JSON dari doGet() GAS
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Gagal terhubung ke GAS:", error);
    return {
      status: "ERROR",
      message: "Gagal terhubung ke server remote GAS. Periksa jaringan atau URL Web App."
    };
  }
}

// Fungsi GET (yang sudah ada)
// export async function fetchFromGAS(gasWebappUrl) { ... }

// Fungsi POST Baru untuk Mengirim Data User
export async function sendToGAS(gasWebappUrl, payload) {
  try {
    const response = await fetch(gasWebappUrl, {
      method: "POST",
      // Penggunaan text/plain menghindari isu CORS Preflight di Google Apps Script
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`HTTP Error Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Gagal mengirim data ke GAS:", error);
    return {
      status: "ERROR",
      message: "Gagal terhubung ke backend server."
    };
  }
}
