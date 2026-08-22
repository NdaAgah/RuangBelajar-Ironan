/* ==========================================================================
   MODULE: PLAYLIST DATA FETCH & INTERACTIVE RENDERER
   ========================================================================== */

/**
 * Mengambil data playlist dari Cache/API dan merender item video interaktif
 * @param {Object} core - Objek core aplikasi
 * @param {string|number} userKelas - Kelas siswa (misal: "5")
 * @param {HTMLElement} targetModal - Elemen DOM modal tempat pemutar video berada
 */
export async function fetchPlaylists(core, userKelas, targetModal) {
    // 1. Tentukan Endpoint secara Dinamis
    let endpoint = 'https://ruangbelajar-ironan.vercel.app/api/verval';
    if (core) {
        if (typeof core.getEndpoint === 'function') endpoint = core.getEndpoint();
        else if (core.config && core.config.endpoint) endpoint = core.config.endpoint;
    }

    // 2. Ambil Elemen DOM Spesifik di dalam Target Modal
    const statusText = targetModal ? targetModal.querySelector('#playlistStatus') : document.querySelector('#playlistStatus');
    const listGrid = targetModal ? targetModal.querySelector('#playlistContainer') : document.querySelector('#playlistContainer');
    const iframePlayer = targetModal ? targetModal.querySelector('#mainVideoPlayer') : null;
    const titleHeader = targetModal ? targetModal.querySelector('#currentVideoTitle') : null;

    if (!listGrid) return;

    // 3. Cek Data Cache di LocalStorage
    const cachedData = localStorage.getItem('siber_playlists');
    if (cachedData) {
        try {
            const parsedData = JSON.parse(cachedData);
            if (Array.isArray(parsedData) && parsedData.length > 0) {
                renderInteractivePlaylist(parsedData, statusText, listGrid, iframePlayer, titleHeader);
                return;
            }
        } catch (e) {
            localStorage.removeItem('siber_playlists');
        }
    }

    // 4. Request ke Backend jika Cache Kosong
    try {
        if (statusText) statusText.textContent = 'Memuat daftar materi...';

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'GET_PLAYLISTS', kelas: userKelas || '*'})
        });

        const result = await response.json();

        if (result.status === 'SUCCESS' && Array.isArray(result.data) && result.data.length > 0) {
            // Simpan ke Cache LocalStorage
            localStorage.setItem('siber_playlists', JSON.stringify(result.data));
            renderInteractivePlaylist(result.data, statusText, listGrid, iframePlayer, titleHeader);
        } else {
            if (statusText) {
                statusText.style.display = 'block';
                statusText.textContent = 'Tidak ada materi video untuk kelas ini.';
            }
        }
    } catch (err) {
        if (statusText) {
            statusText.style.display = 'block';
            statusText.textContent = 'Gagal memuat playlist materi.';
        }
    }
}

/**
 * Helper: Merender daftar video dan menghubungkan Event Listener Klik ke Video Player
 */
function renderInteractivePlaylist(dataArray, statusText, listGrid, iframePlayer, titleHeader) {
    if (statusText) statusText.style.display = 'none';

    // Grouping playlist berdasarkan judul/kategori
    const groupedPlaylists = dataArray.reduce((acc, item) => {
        const plName = item.kategori || 'Materi Pembelajaran';
        if (!acc[plName]) acc[plName] = [];
        acc[plName].push(item);
        return acc;
    }, {});

    // Render HTML Items
    listGrid.innerHTML = Object.keys(groupedPlaylists).map(plName => {
        const videos = groupedPlaylists[plName];
        return `
            <div class="playlist-group" style="margin-bottom: 15px;">
                <h5 class="playlist-header" style="color: var(--usr-neon-cyan); margin-bottom: 6px;">${plName}</h5>
                <div class="video-list" style="display: flex; flex-direction: column; gap: 6px;">
                    ${videos.map(video => {
                        // Membaca ID video langsung dari properti 'key' atau 'videoId'
                        const videoId = video.key || video.videoId || video.id || '';

                        return `
                            <div class="video-item-card usr-card" 
                                 data-videoid="${videoId}" 
                                 data-title="${video.judul || 'Video Pembelajaran'}"
                                 style="padding: 10px; cursor: pointer; border-left: 3px solid var(--usr-neon-green); transition: all 0.2s; background: rgba(255,255,255,0.03);">
                                <strong style="display: block; font-size: 0.9rem; color: #fff;">▶ ${video.judul || 'Video Pembelajaran'}</strong>
                                ${video.desk ? `<p style="font-size: 0.8rem; color: var(--usr-text-muted); margin: 4px 0 0 0;">${video.desk}</p>` : ''}
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }).join('');

    // Putar Video Pertama Secara Otomatis Saat Modal Dibuka
    if (dataArray.length > 0 && iframePlayer) {
        const firstVideo = dataArray[0];
        const firstVideoId = firstVideo.key || firstVideo.videoId || firstVideo.id;

        if (firstVideoId) {
            iframePlayer.src = `https://www.youtube.com/embed/${firstVideoId}?autoplay=0&rel=0`;
            if (titleHeader) titleHeader.textContent = `▶ ${firstVideo.judul}`;
        }
    }

    // Pasang Event Listener Klik pada Setiap Kartu Video
    const itemCards = listGrid.querySelectorAll('.video-item-card');
    itemCards.forEach(card => {
        card.addEventListener('click', () => {
            const vId = card.getAttribute('data-videoid');
            const vTitle = card.getAttribute('data-title');

            if (vId && iframePlayer) {
                // Efek visual: Ubah warna border item yang aktif
                itemCards.forEach(c => c.style.borderLeftColor = 'var(--usr-neon-green)');
                card.style.borderLeftColor = 'var(--usr-neon-cyan)';

                // Masukkan ID video langsung ke player iframe
                iframePlayer.src = `https://www.youtube.com/embed/${vId}?autoplay=1&rel=0   `;
                if (titleHeader) titleHeader.textContent = `▶ ${vTitle}`;
            }
        });
    });
}
