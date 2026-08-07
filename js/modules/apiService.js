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
