/**
 * FORM BUILDER FUNCTION: MODAL S.I.B.E.R CYBER ASSISTANT
 * Merender antarmuka percakapan AI di dalam Modal Engine.
 */
export function renderAiChatForm(core) {
    const container = document.createElement('div');
    container.className = 'usr-form';
    
    const user = core.getUserData() || { nama: 'Siswa' };

    container.innerHTML = `
        <div id="modalAiChatStream">
            <div style="color: var(--usr-neon-cyan); margin-bottom: 8px;">
                <strong>[S.I.B.E.R AI]:</strong> Halo ${user.nama}! Ada materi atau bantuan siber yang ingin kamu tanyakan hari ini?
            </div>
        </div>
        <div style="display: flex; gap: 8px;">
            <input type="text" id="modalAiInput" class="usr-form-input" placeholder="Ketik pertanyaanmu di sini..." style="flex: 1;" />
            <button type="button" id="modalBtnSendAi" class="usr-form-submit" style="width: auto; padding: 0 18px;">Kirim</button>
        </div>
    `;

    // Mengaktifkan Listener setelah DOM Modal terpasang
    setTimeout(() => {
        const inputField = container.querySelector('#modalAiInput');
        const btnSend = container.querySelector('#modalBtnSendAi');
        const chatStream = container.querySelector('#modalAiChatStream');

        const sendPrompt = async () => {
            const promptText = inputField.value.trim();
            if (!promptText) return;

            // Tampilkan pesan pengguna
            const userMsg = document.createElement('div');
            userMsg.style.marginBottom = '8px';
            userMsg.style.color = '#fff';
            userMsg.innerHTML = `<strong>[Kamu]:</strong> ${promptText}`;
            chatStream.appendChild(userMsg);

            inputField.value = '';
            btnSend.disabled = true;
            btnSend.textContent = '...';
            chatStream.scrollTop = chatStream.scrollHeight;

            try {
                const response = await fetch(core.config.gasEndpointUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                    body: JSON.stringify({ action: 'AI_CHAT', prompt: promptText }),
                    redirect: 'follow'
                });

                const result = await response.json();
                const aiMsg = document.createElement('div');
                aiMsg.style.marginBottom = '8px';
                aiMsg.style.color = 'var(--usr-neon-cyan)';

                if (result.status === 'SUCCESS') {
                    aiMsg.innerHTML = `<strong>[S.I.B.E.R AI]:</strong> ${result.reply}`;
                    core.log('INFO', `AI Response received.`);
                } else {
                    aiMsg.style.color = 'var(--usr-danger)';
                    aiMsg.innerHTML = `<strong>[ERROR]:</strong> ${result.message || 'Gagal merespon.'}`;
                }
                chatStream.appendChild(aiMsg);
            } catch (err) {
                const errorMsg = document.createElement('div');
                errorMsg.style.color = 'var(--usr-danger)';
                errorMsg.innerHTML = `<strong>[NETWORK ERROR]:</strong> Tidak dapat terhubung ke AI Server.`;
                chatStream.appendChild(errorMsg);
                core.log('SEC', `AI CHAT ERROR: ${err.message}`);
            } finally {
                btnSend.disabled = false;
                btnSend.textContent = 'Kirim';
                chatStream.scrollTop = chatStream.scrollHeight;
            }
        };

        btnSend.addEventListener('click', sendPrompt);
        inputField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendPrompt();
        });
    }, 50);

    return container;
}
