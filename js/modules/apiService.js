// Modul terpisah khusus untuk komunikasi API (GAS atau Backend lain)
export async function fetchRemoteData(endpointUrl) {
  try {
    const response = await fetch(endpointUrl);
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.warn("Koneksi remote gagal, menggunakan fallback data:", error);
    return { status: "OFFLINE_MODE", message: "Gagal terhubung..." };
  }
}

// js/modules/apiService.js
export async function fetchFromGAS(gasWebappUrl) {
  try {
    const response = await fetch(gasWebappUrl);
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Gagal terhubung ke GAS:", error);
    return { status: "ERROR", message: "Koneksi terputus..." };
  }
}
