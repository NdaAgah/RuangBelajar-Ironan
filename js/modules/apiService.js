// Modul terpisah khusus untuk komunikasi API (GAS atau Backend lain)
export async function fetchRemoteData(endpointUrl) {
  try {
    const response = await fetch(endpointUrl);
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.warn("Koneksi remote gagal, menggunakan fallback data:", error);
    return { status: "OFFLINE_MODE", message: "Gagal terhubung ke remote server." };
  }
}
