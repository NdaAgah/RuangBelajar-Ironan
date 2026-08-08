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

// Fungsi helper untuk menulis pesan bergaya terminal di kartu log UI
export function writeLog(message, isError = false) {
  const logOutput = document.getElementById('logOutput');
  if (!logOutput) return;

  const time = new Date().toLocaleTimeString();
  const prefix = isError ? '❌ [ERROR]' : '⚡ [INFO]';
  
  // Tambahkan baris log baru di paling atas
  logOutput.innerHTML = `[${time}] ${prefix} ${message}\n` + logOutput.innerHTML;
}

// Fungsi POST untuk Mengirim Data User
export async function sendToGAS(gasWebappUrl, payload) {
  writeLog("Mulai mengirim data ke GAS...");
  writeLog(`Payload: ${JSON.stringify(payload)}`);

  try {
    const response = await fetch(gasWebappUrl, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload)
    });

    writeLog(`Response HTTP Status: ${response.status}`);

    if (!response.ok) {
      throw new Error(`HTTP Status Error: ${response.status}`);
    }

    const data = await response.json();
    writeLog(`Respons Server: ${JSON.stringify(data)}`);
    return data;

  } catch (error) {
    writeLog(`Gagal Transmisi: ${error.message}`, true);
    return {
      status: "ERROR",
      message: error.message
    };
  }
}
