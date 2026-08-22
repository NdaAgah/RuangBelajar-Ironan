/* ==========================================================================
   MODULE: PLAYLIST FORM & CUSTOM VIDEO PLAYER MODAL
   ========================================================================== */

import { fetchPlaylists } from './modules/playlistModule.js';

/**
 * Membuat Komponen Modul Video Pembelajaran & Custom Player Modal
 * @param {Object} core - Objek modul core sistem
 * @param {Object} user - Data pengguna yang aktif
 * @returns {Object} - Mengembalikan elemen DOM { playlistCard, videoFab }
 */
export function renderPlaylistModule(core, user) {
    const currentUser = user || (core && typeof core.getUserData === 'function' ? core.getUserData() : null);

    // 1. Buat Kontainer Widget Dashboard Utama (Ringkas)
    const playlistCard = document.createElement('div');
    playlistCard.className = 'module-video-card';
    playlistCard.innerHTML = `
        <h3 class="usr-card-title">📚 Modul Video Pembelajaran</h3>
        <p style="color: var(--usr-text-muted); font-size: 0.9rem;">
            Klik tombol pemicu (🎬) untuk membuka layar pemutar video interaktif.
        </p>
    `;

    // 2. Buat Tombol Floating Action Button (FAB)
    const videoFab = document.createElement('button');
    videoFab.type = 'button';
    videoFab.className = 'siber-video-fab btn-floating-video';
    videoFab.id = 'btnOpenVideoModal';
    videoFab.title = 'Buka Modul Video';
    videoFab.innerHTML = `<span class="fab-icon">🎬</span>`;

    // 3. Event Listener: Buka Modal Player saat FAB Diklik
    videoFab.addEventListener('click', () => {
        if (core && typeof core.openModal === 'function') {
            core.openModal('🎬 PEMUTAR VIDEO PEMBELAJARAN', (modalCore) => {
                // Buat Wrapper Utama Modal dengan Layout Pemutar Video
                const modalWrapper = document.createElement('div');
                modalWrapper.className = 'video-modal-wrapper';
                modalWrapper.style.cssText = 'display: flex; flex-direction: column; gap: 15px; max-height: 80vh;';

                // BIFURKASI STRUCTURAL:
                // Bagian A: Player Fixed (Atas)
                // Bagian B: Scrollable Playlist (Bawah)
                modalWrapper.innerHTML = `
                    <!-- 1. Custom Player Box (Sticky / Fixed) -->
                    <div class="player-container" style="background: #000; border-radius: 8px; overflow: hidden; aspect-ratio: 16/9; width: 100%;">
                        <iframe id="mainVideoPlayer" 
                                style="width: 100%; height: 100%; border: none;" 
                                src="about:blank" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowfullscreen>
                        </iframe>
                    </div>
                    
                    <!-- Judul Video yang Sedang Aktif -->
                    <div class="active-video-info" style="padding: 0 5px;">
                        <h4 id="currentVideoTitle" style="color: var(--usr-neon-green); margin: 0; font-size: 1rem;">Pilih video dari daftar di bawah</h4>
                    </div>

                    <hr style="border: 0; border-top: 1px solid rgba(255,255,255,0.1); margin: 0;">

                    <!-- 2. Playlist Box (Scrollable) -->
                    <div class="playlist-scroll-area" style="overflow-y: auto; max-height: 250px; padding-right: 5px;">
                        <p id="playlistStatus" style="color: var(--usr-text-muted);">Memuat daftar materi...</p>
                        <div id="playlistContainer" class="playlist-grid"></div>
                    </div>
                `;

                const modalUserKelas = (currentUser && currentUser.kelas) ? currentUser.kelas : '';

                // Inisialisasi pengambilan data playlist ke dalam modalWrapper ini
                setTimeout(() => {
                    fetchPlaylists(core || modalCore, modalUserKelas, modalWrapper);
                }, 100);

                return modalWrapper;
            }, true);
        }
    });

    return { playlistCard, videoFab };
}
