/* ==========================================================================
   COMPONENT BUILDER: S.I.B.E.R CYBER STUDENT ID CARD
   ========================================================================== */
export function renderStudentCard(userData) {
    const card = document.createElement('div');
    card.className = 'usr-card siber-id-card';
    card.style.cssText = `
        border: 1px solid var(--usr-neon-cyan);
        background: linear-gradient(135deg, rgba(10, 25, 47, 0.95), rgba(5, 12, 24, 0.98));
        box-shadow: 0 0 20px rgba(0, 240, 255, 0.15);
        position: relative;
        overflow: hidden;
        max-width: 480px;
        margin: 0 auto;
    `;

    // Warna status badge
    const isVerified = userData.status === 'VERIFIED';
    const badgeColor = isVerified ? 'var(--usr-neon-cyan)' : 'var(--usr-neon-amber)';
    const badgeText = isVerified ? 'VERIFIED STUDENT' : 'NEW REGISTERED';

    card.innerHTML = `
        <!-- Watermark Background Cyber -->
        <div style="position: absolute; right: -20px; bottom: -20px; opacity: 0.05; font-size: 8rem; font-weight: 900; font-family: var(--font-mono); pointer-events: none; user-select: none;">
            SIBER
        </div>

        <!-- Header Kartu -->
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px dashed var(--usr-border); padding-bottom: 12px; margin-bottom: 16px;">
            <div>
                <span style="font-size: 0.65rem; color: var(--usr-text-muted); letter-spacing: 2px; display: block;">IDENTITAS DIGITAL SISWA</span>
                <strong style="color: var(--usr-neon-cyan); font-family: var(--font-mono); font-size: 1.1rem;">S.I.B.E.R CYBERGATE</strong>
            </div>
            <span style="border: 1px solid ${badgeColor}; color: ${badgeColor}; font-size: 0.65rem; padding: 4px 8px; border-radius: 2px; font-weight: bold; letter-spacing: 1px; font-family: var(--font-mono);">
                ● ${badgeText}
            </span>
        </div>

        <!-- Body Kartu: Grid Informasi -->
        <div style="display: grid; grid-template-columns: 80px 1fr; gap: 16px; align-items: center;">
            <!-- Avatar Placeholder / Chip Icon -->
            <div style="width: 80px; height: 90px; border: 1px solid var(--usr-border); background: rgba(0, 240, 255, 0.05); display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative;">
                <div style="font-size: 2rem;">👤</div>
                <div style="font-size: 0.55rem; color: var(--usr-neon-cyan); font-family: var(--font-mono); margin-top: 4px;">SEC-ID</div>
            </div>

            <!-- Detail Data Siswa -->
            <div style="display: flex; flex-direction: column; gap: 6px; font-size: 0.85rem;">
                <div>
                    <span style="font-size: 0.65rem; color: var(--usr-text-muted); display: block;">STUDENT KEY</span>
                    <strong style="color: var(--usr-neon-cyan); font-family: var(--font-mono); font-size: 1rem;">${userData.key || 'N/A'}</strong>
                </div>
                <div>
                    <span style="font-size: 0.65rem; color: var(--usr-text-muted); display: block;">NAMA LENGKAP</span>
                    <span style="color: #fff; font-weight: 600;">${userData.nama}</span>
                </div>
                <div>
                    <span style="font-size: 0.65rem; color: var(--usr-text-muted); display: block;">SEKOLAH / INSTANSI</span>
                    <span style="color: #fff;">${userData.sekolah}</span>
                </div>
                <div style="display: flex; gap: 16px;">
                    <div>
                        <span style="font-size: 0.65rem; color: var(--usr-text-muted); display: block;">TINGKAT</span>
                        <span style="color: #fff;">${userData.tingkat || '-'}</span>
                    </div>
                    <div>
                        <span style="font-size: 0.65rem; color: var(--usr-text-muted); display: block;">KELAS</span>
                        <span style="color: #fff;">${userData.kelas || '-'}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Footer Kartu: Barcode Visual -->
        <div style="margin-top: 16px; pt-12px; border-top: 1px solid rgba(255,255,255,0.05); display: flex; justify-content: space-between; align-items: flex-end;">
            <div style="font-family: var(--font-mono); font-size: 0.6rem; color: var(--usr-text-muted);">
                ISSUED: ${new Date().toLocaleDateString('id-ID')}
            </div>
            <!-- Barcode visual simulation -->
            <div style="font-family: var(--font-mono); font-size: 0.9rem; letter-spacing: 3px; color: var(--usr-neon-cyan); opacity: 0.7;">
                ||||| || | |||| |||
            </div>
        </div>
    `;

    return card;
}
