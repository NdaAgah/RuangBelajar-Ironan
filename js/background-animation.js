/* ==========================================================================
   MODULE: LIGHTWEIGHT RANDOM CONSTELLATION BACKGROUND (STATIC SVG)
   ========================================================================== */

/**
 * Data SVG Rasi Bintang Statis (Sangat Ringan, Bebas Beban RAM)
 */
const CONSTELLATIONS = [
    // 1. Rasi Orion
    {
        name: 'ORION',
        svg: `
            <svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg" class="constellation-svg">
                <!-- Garis Penghubung Bintang -->
                <g stroke="rgba(0, 243, 255, 0.25)" stroke-width="1.5" stroke-dasharray="4 2">
                    <line x1="350" y1="150" x2="450" y2="170" />
                    <line x1="350" y1="150" x2="330" y2="280" />
                    <line x1="450" y1="170" x2="470" y2="290" />
                    <!-- Sabuk Orion -->
                    <line x1="370" y1="300" x2="400" y2="305" />
                    <line x1="400" y1="305" x2="430" y2="310" />
                    <!-- Kaki -->
                    <line x1="370" y1="300" x2="340" y2="450" />
                    <line x1="430" y1="310" x2="460" y2="440" />
                    <line x1="340" y1="450" x2="460" y2="440" />
                </g>
                <!-- Bintang Utama -->
                <g fill="var(--usr-neon-cyan, #00f3ff)">
                    <circle cx="350" cy="150" r="5" class="star-node" />
                    <circle cx="450" cy="170" r="4" class="star-node" />
                    <circle cx="370" cy="300" r="3.5" />
                    <circle cx="400" cy="305" r="3.5" />
                    <circle cx="430" cy="310" r="3.5" />
                    <circle cx="340" cy="450" r="5" class="star-node" />
                    <circle cx="460" cy="440" r="4.5" />
                </g>
            </svg>
        `
    },
    // 2. Rasi Ursa Major (Beruang Besar)
    {
        name: 'URSA MAJOR',
        svg: `
            <svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg" class="constellation-svg">
                <g stroke="rgba(0, 255, 157, 0.25)" stroke-width="1.5" stroke-dasharray="3 3">
                    <line x1="150" y1="200" x2="230" y2="220" />
                    <line x1="230" y1="220" x2="290" y2="270" />
                    <line x1="290" y1="270" x2="370" y2="310" />
                    <line x1="370" y1="310" x2="360" y2="410" />
                    <line x1="360" y1="410" x2="490" y2="420" />
                    <line x1="490" y1="420" x2="480" y2="315" />
                    <line x1="480" y1="315" x2="370" y2="310" />
                </g>
                <g fill="var(--usr-neon-green, #00ff9d)">
                    <circle cx="150" cy="200" r="4" />
                    <circle cx="230" cy="220" r="4" />
                    <circle cx="290" cy="270" r="4" />
                    <circle cx="370" cy="310" r="4.5" class="star-node" />
                    <circle cx="360" cy="410" r="4" />
                    <circle cx="490" cy="420" r="5" class="star-node" />
                    <circle cx="480" cy="315" r="4" />
                </g>
            </svg>
        `
    },
    // 3. Rasi Cassiopeia
    {
        name: 'CASSIOPEIA',
        svg: `
            <svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg" class="constellation-svg">
                <g stroke="rgba(0, 243, 255, 0.3)" stroke-width="1.5">
                    <line x1="200" y1="350" x2="280" y2="220" />
                    <line x1="280" y1="220" x2="400" y2="280" />
                    <line x1="400" y1="280" x2="520" y2="180" />
                    <line x1="520" y1="180" x2="620" y2="260" />
                </g>
                <g fill="#00f3ff">
                    <circle cx="200" cy="350" r="4.5" />
                    <circle cx="280" cy="220" r="5" class="star-node" />
                    <circle cx="400" cy="280" r="4" />
                    <circle cx="520" cy="180" r="5.5" class="star-node" />
                    <circle cx="620" cy="260" r="4" />
                </g>
            </svg>
        `
    },
    
    // 4. Rasi Cygnus (Angsa)
    {
        name: 'CYGNUS',
        svg: `
            <svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg" class="constellation-svg">
                <g stroke="rgba(255, 0, 85, 0.25)" stroke-width="1.5" stroke-dasharray="4 2">
                    <line x1="400" y1="120" x2="400" y2="480" />
                    <line x1="220" y1="300" x2="580" y2="300" />
                </g>
                <g fill="var(--usr-neon-pink, #ff0055)">
                    <circle cx="400" cy="120" r="5" class="star-node" />
                    <circle cx="400" cy="220" r="3.5" />
                    <circle cx="400" cy="300" r="6" class="star-node" />
                    <circle cx="400" cy="400" r="3.5" />
                    <circle cx="400" cy="480" r="4" />
                    <circle cx="220" cy="300" r="4.5" />
                    <circle cx="310" cy="300" r="3.5" />
                    <circle cx="490" cy="300" r="3.5" />
                    <circle cx="580" cy="300" r="4.5" />
                </g>
            </svg>
        `
    },
    
    /* Tambahkan data berikut ke dalam array CONSTELLATIONS */

    // 5. Rasi Zodiak: SCORPIO
    {
        name: 'SCORPIO',
        svg: `
            <svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg" class="constellation-svg">
                <!-- Garis Penghubung -->
                <g stroke="rgba(0, 243, 255, 0.25)" stroke-width="1.5" stroke-dasharray="4 2">
                    <line x1="180" y1="200" x2="240" y2="230" />
                    <line x1="240" y1="230" x2="300" y2="270" />
                    <line x1="300" y1="270" x2="360" y2="320" />
                    <line x1="360" y1="320" x2="410" y2="390" />
                    <line x1="410" y1="390" x2="450" y2="440" />
                    <!-- Ekor / Sengat -->
                    <line x1="450" y1="440" x2="510" y2="450" />
                    <line x1="510" y1="450" x2="550" y2="410" />
                    <line x1="550" y1="410" x2="530" y2="370" />
                    <!-- Kepala / Capit -->
                    <line x1="180" y1="200" x2="150" y2="150" />
                    <line x1="180" y1="200" x2="200" y2="140" />
                </g>
                <!-- Bintang-Bintang -->
                <g fill="var(--usr-neon-cyan, #00f3ff)">
                    <circle cx="180" cy="200" r="4" />
                    <circle cx="240" cy="230" r="4" />
                    <!-- Bintang Antares (Jantung Scorpio / Paling Terang) -->
                    <circle cx="300" cy="270" r="6" class="star-node" /> 
                    <circle cx="360" cy="320" r="4" />
                    <circle cx="410" cy="390" r="4" />
                    <circle cx="450" cy="440" r="4.5" />
                    <circle cx="510" cy="450" r="4" />
                    <circle cx="550" cy="410" r="5" class="star-node" />
                    <circle cx="530" cy="370" r="4" />
                    <circle cx="150" cy="150" r="4.5" />
                    <circle cx="200" cy="140" r="4" />
                </g>
            </svg>
        `
    },
    
    // 6. Rasi Zodiak: LEO
    {
        name: 'LEO',
        svg: `
            <svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg" class="constellation-svg">
                <!-- Garis Penghubung -->
                <g stroke="rgba(255, 184, 0, 0.3)" stroke-width="1.5" stroke-dasharray="3 3">
                    <line x1="520" y1="180" x2="460" y2="150" />
                    <line x1="460" y1="150" x2="400" y2="190" />
                    <line x1="400" y1="190" x2="420" y2="250" />
                    <line x1="420" y1="250" x2="490" y2="270" />
                    <line x1="490" y1="270" x2="520" y2="180" />
                    <!-- Badan & Ekor -->
                    <line x1="420" y1="250" x2="300" y2="300" />
                    <line x1="300" y1="300" x2="220" y2="270" />
                    <line x1="220" y1="270" x2="250" y2="380" />
                    <line x1="250" y1="380" x2="350" y2="370" />
                    <line x1="350" y1="370" x2="420" y2="250" />
                </g>
                <!-- Bintang-Bintang -->
                <g fill="var(--usr-neon-amber, #ffb800)">
                    <circle cx="520" cy="180" r="4" />
                    <circle cx="460" cy="150" r="4" />
                    <circle cx="400" cy="190" r="4.5" />
                    <!-- Bintang Regulus (Bintang Utama Leo) -->
                    <circle cx="420" cy="250" r="6" class="star-node" /> 
                    <circle cx="490" cy="270" r="4" />
                    <circle cx="300" cy="300" r="4" />
                    <!-- Bintang Denebola (Ekor) -->
                    <circle cx="220" cy="270" r="5" class="star-node" /> 
                    <circle cx="250" cy="380" r="4" />
                    <circle cx="350" cy="370" r="4" />
                </g>
            </svg>
        `
    },
    /* === TAMBAHKAN 10 ZODIAK BERIKUT KE DALAM ARRAY CONSTELLATIONS === */

    // 1. ARIES
    {
        name: 'ARIES',
        svg: `
            <svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg" class="constellation-svg">
                <g stroke="rgba(0, 243, 255, 0.25)" stroke-width="1.5" stroke-dasharray="4 2">
                    <line x1="250" y1="220" x2="380" y2="260" />
                    <line x1="380" y1="260" x2="480" y2="330" />
                    <line x1="480" y1="330" x2="520" y2="380" />
                </g>
                <g fill="var(--usr-neon-cyan, #00f3ff)">
                    <circle cx="250" cy="220" r="4" />
                    <!-- Hamal (Bintang Utama Aries) -->
                    <circle cx="380" cy="260" r="6" class="star-node" />
                    <circle cx="480" cy="330" r="4.5" />
                    <circle cx="520" cy="380" r="4" />
                </g>
            </svg>
        `
    },
    // 2. TAURUS
    {
        name: 'TAURUS',
        svg: `
            <svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg" class="constellation-svg">
                <g stroke="rgba(255, 184, 0, 0.25)" stroke-width="1.5" stroke-dasharray="3 3">
                    <line x1="550" y1="180" x2="420" y2="260" />
                    <line x1="420" y1="260" x2="330" y2="300" />
                    <line x1="330" y1="300" x2="230" y2="280" />
                    <line x1="420" y1="260" x2="480" y2="350" />
                    <line x1="480" y1="350" x2="580" y2="380" />
                    <line x1="330" y1="300" x2="280" y2="380" />
                </g>
                <g fill="var(--usr-neon-amber, #ffb800)">
                    <circle cx="550" cy="180" r="4" />
                    <!-- Aldebaran (Mata Taurus) -->
                    <circle cx="420" cy="260" r="6.5" class="star-node" />
                    <circle cx="330" cy="300" r="4.5" />
                    <circle cx="230" cy="280" r="4" />
                    <circle cx="480" cy="350" r="4" />
                    <circle cx="580" cy="380" r="4" />
                    <circle cx="280" cy="380" r="4" />
                </g>
            </svg>
        `
    },
    // 3. GEMINI
    {
        name: 'GEMINI',
        svg: `
            <svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg" class="constellation-svg">
                <g stroke="rgba(0, 243, 255, 0.25)" stroke-width="1.5" stroke-dasharray="4 2">
                    <!-- Kembar Castor -->
                    <line x1="300" y1="150" x2="350" y2="240" />
                    <line x1="350" y1="240" x2="400" y2="340" />
                    <line x1="400" y1="340" x2="450" y2="440" />
                    <!-- Kembar Pollux -->
                    <line x1="380" y1="140" x2="430" y2="230" />
                    <line x1="430" y1="230" x2="480" y2="330" />
                    <line x1="480" y1="330" x2="530" y2="430" />
                    <!-- Garis Penghubung Tubuh -->
                    <line x1="300" y1="150" x2="380" y2="140" />
                    <line x1="350" y1="240" x2="430" y2="230" />
                </g>
                <g fill="var(--usr-neon-cyan, #00f3ff)">
                    <circle cx="300" cy="150" r="5.5" class="star-node" /> <!-- Castor -->
                    <circle cx="380" cy="140" r="6" class="star-node" /> <!-- Pollux -->
                    <circle cx="350" cy="240" r="4" />
                    <circle cx="430" cy="230" r="4" />
                    <circle cx="400" cy="340" r="4" />
                    <circle cx="480" cy="330" r="4" />
                    <circle cx="450" cy="440" r="4.5" />
                    <circle cx="530" cy="430" r="4.5" />
                </g>
            </svg>
        `
    },
    // 4. CANCER
    {
        name: 'CANCER',
        svg: `
            <svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg" class="constellation-svg">
                <g stroke="rgba(0, 255, 102, 0.25)" stroke-width="1.5" stroke-dasharray="3 3">
                    <line x1="400" y1="300" x2="320" y2="210" />
                    <line x1="400" y1="300" x2="480" y2="220" />
                    <line x1="400" y1="300" x2="410" y2="420" />
                    <line x1="410" y1="420" x2="350" y2="480" />
                </g>
                <g fill="var(--usr-neon-green, #00ff66)">
                    <circle cx="400" cy="300" r="5.5" class="star-node" />
                    <circle cx="320" cy="210" r="4" />
                    <circle cx="480" cy="220" r="4" />
                    <circle cx="410" cy="420" r="4.5" />
                    <circle cx="350" cy="480" r="4" />
                </g>
            </svg>
        `
    },
    // 5. VIRGO
    {
        name: 'VIRGO',
        svg: `
            <svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg" class="constellation-svg">
                <g stroke="rgba(0, 243, 255, 0.25)" stroke-width="1.5" stroke-dasharray="4 2">
                    <line x1="220" y1="200" x2="310" y2="240" />
                    <line x1="310" y1="240" x2="410" y2="290" />
                    <line x1="410" y1="290" x2="520" y2="310" />
                    <line x1="410" y1="290" x2="380" y2="410" /> <!-- Cabang ke Spica -->
                    <line x1="380" y1="410" x2="480" y2="450" />
                    <line x1="310" y1="240" x2="260" y2="340" />
                </g>
                <g fill="var(--usr-neon-cyan, #00f3ff)">
                    <circle cx="220" cy="200" r="4" />
                    <circle cx="310" cy="240" r="4" />
                    <circle cx="410" cy="290" r="4.5" />
                    <circle cx="520" cy="310" r="4" />
                    <!-- Spica (Bintang Utama Virgo) -->
                    <circle cx="380" cy="410" r="6.5" class="star-node" />
                    <circle cx="480" cy="450" r="4" />
                    <circle cx="260" cy="340" r="4" />
                </g>
            </svg>
        `
    },
    // 6. LIBRA
    {
        name: 'LIBRA',
        svg: `
            <svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg" class="constellation-svg">
                <g stroke="rgba(255, 0, 85, 0.25)" stroke-width="1.5" stroke-dasharray="4 2">
                    <line x1="300" y1="220" x2="480" y2="180" />
                    <line x1="480" y1="180" x2="520" y2="320" />
                    <line x1="520" y1="320" x2="350" y2="380" />
                    <line x1="350" y1="380" x2="300" y2="220" />
                    <line x1="350" y1="380" x2="260" y2="450" />
                </g>
                <g fill="var(--usr-neon-red, #ff0055)">
                    <circle cx="300" cy="220" r="5" class="star-node" />
                    <circle cx="480" cy="180" r="5" class="star-node" />
                    <circle cx="520" cy="320" r="4" />
                    <circle cx="350" cy="380" r="4.5" />
                    <circle cx="260" cy="450" r="4" />
                </g>
            </svg>
        `
    },
    // 7. SAGITTARIUS
    {
        name: 'SAGITTARIUS',
        svg: `
            <svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg" class="constellation-svg">
                <!-- Teapot Shape -->
                <g stroke="rgba(0, 243, 255, 0.25)" stroke-width="1.5" stroke-dasharray="3 3">
                    <line x1="320" y1="320" x2="400" y2="240" />
                    <line x1="400" y1="240" x2="480" y2="290" />
                    <line x1="480" y1="290" x2="420" y2="380" />
                    <line x1="420" y1="380" x2="320" y2="320" />
                    <!-- Gagang & Tutup -->
                    <line x1="400" y1="240" x2="420" y2="170" />
                    <line x1="420" y1="170" x2="480" y2="290" />
                    <line x1="480" y1="290" x2="560" y2="330" />
                    <line x1="560" y1="330" x2="520" y2="420" />
                    <line x1="520" y1="420" x2="420" y2="380" />
                </g>
                <g fill="var(--usr-neon-cyan, #00f3ff)">
                    <circle cx="320" cy="320" r="5" class="star-node" />
                    <circle cx="400" cy="240" r="4" />
                    <circle cx="480" cy="290" r="4.5" />
                    <circle cx="420" cy="380" r="4" />
                    <circle cx="420" cy="170" r="4" />
                    <circle cx="560" cy="330" r="5" class="star-node" />
                    <circle cx="520" cy="420" r="4" />
                </g>
            </svg>
        `
    },
    // 8. CAPRICORN
    {
        name: 'CAPRICORN',
        svg: `
            <svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg" class="constellation-svg">
                <g stroke="rgba(0, 255, 102, 0.25)" stroke-width="1.5" stroke-dasharray="4 2">
                    <line x1="220" y1="220" x2="320" y2="280" />
                    <line x1="320" y1="280" x2="480" y2="320" />
                    <line x1="480" y1="320" x2="580" y2="240" />
                    <line x1="580" y1="240" x2="520" y2="390" />
                    <line x1="520" y1="390" x2="360" y2="420" />
                    <line x1="360" y1="420" x2="220" y2="220" />
                </g>
                <g fill="var(--usr-neon-green, #00ff66)">
                    <circle cx="220" cy="220" r="5" class="star-node" />
                    <circle cx="320" cy="280" r="4" />
                    <circle cx="480" cy="320" r="4" />
                    <!-- Deneb Algedi -->
                    <circle cx="580" cy="240" r="5.5" class="star-node" />
                    <circle cx="520" cy="390" r="4" />
                    <circle cx="360" cy="420" r="4.5" />
                </g>
            </svg>
        `
    },
    // 9. AQUARIUS
    {
        name: 'AQUARIUS',
        svg: `
            <svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg" class="constellation-svg">
                <g stroke="rgba(0, 243, 255, 0.25)" stroke-width="1.5" stroke-dasharray="3 3">
                    <line x1="250" y1="180" x2="350" y2="220" />
                    <line x1="350" y1="220" x2="430" y2="280" />
                    <line x1="430" y1="280" x2="520" y2="240" />
                    <!-- Aliran Air -->
                    <line x1="430" y1="280" x2="400" y2="380" />
                    <line x1="400" y1="380" x2="450" y2="460" />
                    <line x1="350" y1="220" x2="300" y2="320" />
                    <line x1="300" y1="320" x2="320" y2="440" />
                </g>
                <g fill="var(--usr-neon-cyan, #00f3ff)">
                    <circle cx="250" cy="180" r="4" />
                    <!-- Sadalsuud -->
                    <circle cx="350" cy="220" r="5.5" class="star-node" />
                    <!-- Sadalmelik -->
                    <circle cx="430" cy="280" r="5.5" class="star-node" />
                    <circle cx="520" cy="240" r="4" />
                    <circle cx="400" cy="380" r="4" />
                    <circle cx="450" cy="460" r="4" />
                    <circle cx="300" cy="320" r="4" />
                    <circle cx="320" cy="440" r="4" />
                </g>
            </svg>
        `
    },
    // 10. PISCES
    {
        name: 'PISCES',
        svg: `
            <svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg" class="constellation-svg">
                <g stroke="rgba(255, 184, 0, 0.25)" stroke-width="1.5" stroke-dasharray="4 2">
                    <!-- Ikan Barat -->
                    <line x1="200" y1="200" x2="260" y2="170" />
                    <line x1="260" y1="170" x2="300" y2="220" />
                    <line x1="300" y1="220" x2="240" y2="250" />
                    <line x1="240" y1="250" x2="200" y2="200" />
                    <!-- Tali Penghubung V-Shape -->
                    <line x1="240" y1="250" x2="380" y2="380" />
                    <line x1="380" y1="380" x2="520" y2="320" />
                    <!-- Ikan Utara -->
                    <line x1="520" y1="320" x2="580" y2="260" />
                    <line x1="580" y1="260" x2="550" y2="200" />
                    <line x1="550" y1="200" x2="490" y2="240" />
                    <line x1="490" y1="240" x2="520" y2="320" />
                </g>
                <g fill="var(--usr-neon-amber, #ffb800)">
                    <circle cx="200" cy="200" r="4" />
                    <circle cx="260" cy="170" r="4" />
                    <circle cx="300" cy="220" r="4" />
                    <circle cx="240" cy="250" r="4.5" />
                    <!-- Alrescha (Titik Ikatan Tali) -->
                    <circle cx="380" cy="380" r="6" class="star-node" />
                    <circle cx="520" cy="320" r="4.5" />
                    <circle cx="580" cy="260" r="4" />
                    <circle cx="550" cy="200" r="4" />
                    <circle cx="490" cy="240" r="4" />
                </g>
            </svg>
        `
    }


];

/**
 * Memasang Background Rasi Bintang Acak ke DOM
 */
export function initBackgroundAnimation() {
    let bgContainer = document.getElementById('bg-constellation-container');
    
    // Buat kontainer jika belum ada di HTML
    if (!bgContainer) {
        bgContainer = document.createElement('div');
        bgContainer.id = 'bg-constellation-container';
        document.body.appendChild(bgContainer);
    }
    
    // Pilih Rasi Bintang Secara Acak
    const randomIndex = Math.floor(Math.random() * CONSTELLATIONS.length);
    const selected = CONSTELLATIONS[randomIndex];
    
    // Inject SVG ke DOM
    bgContainer.innerHTML = `
        <div class="constellation-wrapper">
            ${selected.svg}
            <span class="constellation-label">SECTOR: ${selected.name}</span>
        </div>
    `;
}