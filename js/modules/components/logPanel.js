export function renderLogPanel(){
    return 
    `<div class="hud-header">
        <h3>KENDALI SISTEM</h3>
        <button id="btnToggleTheme" class="btn-toggle-theme btn-secondary-sm"><h5> ⚡ CORE ONLINE </h5></button>
          Test Sinyal GAS digantikan Fetch Database
        <button id="btnFetch" class="btn-secondary-sm"> 📡 </button>
    </div>
      
    <hr class="hud-divider" /> <!-- Garis pembatas -->

    <div class="hud-terminal">
        <small>// TERMINAL LOGS</small>
        <div id="dataOutput" class="log-content"></div>
        <div id="logOutput" class="log-content">
          >>> Sistem siap...
        </div>
    </div>`;
}