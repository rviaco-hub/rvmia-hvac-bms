// RVMIA HVAC BMS - Frontend Application
// Simulación de datos en tiempo real para demostración

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', () => {
    initDateTime();
    initNavigation();
    initCharts();
    initMonitoringData();
    initControlPanels();
    startRealTimeSimulation();
    initFormHandler();
});

// ========== UI HELPERS ==========
function initDateTime() {
    const updateDateTime = () => {
        const now = new Date();
        const formatted = now.toLocaleString('es-CO', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        const dateTimeSpan = document.getElementById('currentDateTime');
        if (dateTimeSpan) dateTimeSpan.textContent = formatted;
    };
    updateDateTime();
    setInterval(updateDateTime, 1000);
}

function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const views = document.querySelectorAll('.view');
    
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const viewName = item.getAttribute('data-view');
            
            // Update active nav
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            
            // Update active view
            views.forEach(view => view.classList.remove('active'));
            const activeView = document.getElementById(`${viewName}View`);
            if (activeView) activeView.classList.add('active');
            
            // Update page title
            const pageTitle = document.querySelector('.page-title');
            const viewTitles = {
                dashboard: 'Dashboard General',
                monitoring: 'Monitoreo en Tiempo Real',
                control: 'Panel de Control',
                trends: 'Tendencias Históricas',
                maintenance: 'Mantenimiento Predictivo',
                configuration: 'Configuración del Sistema'
            };
            if (pageTitle && viewTitles[viewName]) {
                pageTitle.textContent = viewTitles[viewName];
            }
        });
    });
}

// ========== CHARTS ==========
let trendChart, historicalChart;

function initCharts() {
    // Trend Chart (24h)
    const ctx1 = document.getElementById('trendChart')?.getContext('2d');
    if (ctx1) {
        trendChart = new Chart(ctx1, {
            type: 'line',
            data: {
                labels: ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'],
                datasets: [
                    {
                        label: 'Temperatura Interior (°C)',
                        data: [22.1, 21.8, 21.5, 21.2, 21.8, 22.5, 23.2, 24.1, 24.3, 23.8, 23.0, 22.4],
                        borderColor: '#2c7da0',
                        backgroundColor: 'rgba(44, 125, 160, 0.1)',
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Consumo Energético (kW)',
                        data: [42, 38, 35, 34, 48, 72, 98, 112, 108, 86, 64, 52],
                        borderColor: '#f39c12',
                        backgroundColor: 'rgba(243, 156, 18, 0.1)',
                        tension: 0.4,
                        fill: true,
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { position: 'top', labels: { color: '#94a3b8' } },
                    tooltip: { mode: 'index', intersect: false }
                },
                scales: {
                    y: { title: { display: true, text: 'Temperatura (°C)', color: '#94a3b8' }, grid: { color: '#334155' } },
                    y1: { position: 'right', title: { display: true, text: 'Potencia (kW)', color: '#94a3b8' }, grid: { drawOnChartArea: false } },
                    x: { ticks: { color: '#94a3b8' }, grid: { color: '#334155' } }
                }
            }
        });
    }
    
    // Historical Chart (weekly/monthly)
    const ctx2 = document.getElementById('historicalChart')?.getContext('2d');
    if (ctx2) {
        historicalChart = new Chart(ctx2, {
            type: 'bar',
            data: {
                labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
                datasets: [
                    { label: 'Consumo (kWh)', data: [1250, 1320, 1280, 1410, 1580, 1320, 1180], backgroundColor: '#2c7da0', borderRadius: 8 },
                    { label: 'COP Promedio', data: [3.6, 3.7, 3.5, 3.4, 3.2, 3.5, 3.8], backgroundColor: '#61a5c2', borderRadius: 8, yAxisID: 'y1' }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: { legend: { labels: { color: '#94a3b8' } } },
                scales: {
                    y: { title: { display: true, text: 'Energía (kWh)', color: '#94a3b8' }, grid: { color: '#334155' } },
                    y1: { position: 'right', title: { display: true, text: 'COP', color: '#94a3b8' }, min: 2, max: 5, grid: { drawOnChartArea: false } },
                    x: { ticks: { color: '#94a3b8' }, grid: { color: '#334155' } }
                }
            }
        });
    }
}

// ========== MONITORING DATA ==========
function initMonitoringData() {
    const monitoringGrid = document.getElementById('monitoringGrid');
    if (!monitoringGrid) return;
    
    const sensors = [
        { name: 'VRF Norte', temp: 22.4, humidity: 52, co2: 412, status: 'normal' },
        { name: 'VRF Sur', temp: 23.1, humidity: 48, co2: 398, status: 'normal' },
        { name: 'Chiller Planta Baja', temp: 21.8, humidity: 45, co2: 423, status: 'warning' },
        { name: 'UTA Comercial', temp: 22.9, humidity: 55, co2: 487, status: 'normal' },
        { name: 'Cortinas Aire Acceso', temp: 24.2, humidity: 60, co2: 512, status: 'critical' },
        { name: 'Data Center', temp: 20.5, humidity: 42, co2: 365, status: 'normal' }
    ];
    
    monitoringGrid.innerHTML = sensors.map(sensor => `
        <div class="sensor-card">
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.75rem;">
                <strong><i class="fas fa-thermometer-half"></i> ${sensor.name}</strong>
                <span class="system-status-badge ${sensor.status === 'normal' ? 'online' : (sensor.status === 'warning' ? 'warning' : 'online')}" style="${sensor.status === 'critical' ? 'background: rgba(231,76,60,0.2); color:#e74c3c' : ''}">
                    ${sensor.status === 'normal' ? 'Óptimo' : (sensor.status === 'warning' ? 'Atención' : 'Crítico')}
                </span>
            </div>
            <div><small>Temperatura:</small> <strong>${sensor.temp}°C</strong></div>
            <div><small>Humedad:</small> <strong>${sensor.humidity}%</strong></div>
            <div><small>CO₂:</small> <strong>${sensor.co2} ppm</strong></div>
            <div class="progress-bar" style="margin-top: 0.5rem;"><div class="progress-fill" style="width: ${Math.random() * 100}%"></div></div>
        </div>
    `).join('');
}

function initControlPanels() {
    const controlPanelsDiv = document.getElementById('controlPanels');
    if (!controlPanelsDiv) return;
    
    const devices = [
        { name: 'VRF Zona Norte', type: 'vrf', currentTemp: 22, setpoint: 22, fanSpeed: 65 },
        { name: 'Chiller Data Center', type: 'chiller', currentTemp: 20.5, setpoint: 20, fanSpeed: 80 },
        { name: 'UTA Comercial con VFD', type: 'vfd', currentTemp: 23, setpoint: 22.5, fanSpeed: 45 }
    ];
    
    controlPanelsDiv.innerHTML = devices.map(device => `
        <div class="control-group">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                <div><i class="fas fa-microchip"></i> <strong>${device.name}</strong></div>
                <div class="system-status-badge online">Control Remoto</div>
            </div>
            <label>Temperatura Setpoint: <span id="tempValue-${device.name.replace(/\s/g, '')}">${device.setpoint}</span>°C</label>
            <input type="range" min="18" max="30" step="0.5" value="${device.setpoint}" class="temp-slider" data-device="${device.name}">
            <label>Velocidad Ventilador / VFD: <span id="fanValue-${device.name.replace(/\s/g, '')}">${device.fanSpeed}</span>%</label>
            <input type="range" min="0" max="100" step="5" value="${device.fanSpeed}" class="fan-slider" data-device="${device.name}">
            <div style="margin-top: 1rem;">
                <button class="btn-small" data-mode="cool">❄️ Modo Frío</button>
                <button class="btn-small" data-mode="heat">🔥 Modo Calor</button>
                <button class="btn-small" data-mode="auto">🔄 Auto</button>
            </div>
        </div>
    `).join('');
    
    // Event listeners for sliders
    document.querySelectorAll('.temp-slider').forEach(slider => {
        slider.addEventListener('input', (e) => {
            const deviceName = slider.getAttribute('data-device');
            const spanId = `tempValue-${deviceName.replace(/\s/g, '')}`;
            const span = document.getElementById(spanId);
            if (span) span.textContent = slider.value;
            showToast(`Setpoint de ${deviceName} ajustado a ${slider.value}°C`, 'info');
        });
    });
    
    document.querySelectorAll('.fan-slider').forEach(slider => {
        slider.addEventListener('input', (e) => {
            const deviceName = slider.getAttribute('data-device');
            const spanId = `fanValue-${deviceName.replace(/\s/g, '')}`;
            const span = document.getElementById(spanId);
            if (span) span.textContent = slider.value;
            showToast(`Velocidad/VFD de ${deviceName} ajustado a ${slider.value}%`, 'info');
        });
    });
}

// ========== REAL TIME SIMULATION ==========
function startRealTimeSimulation() {
    // Update sensor data every 5 seconds
    setInterval(() => {
        updateSensorReadings();
        updateSystemLoads();
    }, 5000);
    
    // Animate thermal map (simple representation)
    animateThermalMap();
}

function updateSensorReadings() {
    // Simulate slight variations in temperature readings
    const tempElements = document.querySelectorAll('.sensor-card strong');
    if (tempElements.length) {
        tempElements.forEach((el, idx) => {
            if (el.textContent.includes('°C') && idx % 3 === 0) {
                const currentTemp = parseFloat(el.textContent);
                const variation = (Math.random() - 0.5) * 0.4;
                const newTemp = (currentTemp + variation).toFixed(1);
                el.textContent = `${newTemp}°C`;
            }
        });
    }
}

function updateSystemLoads() {
    const loadSpans = document.querySelectorAll('.load');
    loadSpans.forEach(span => {
        const text = span.textContent;
        if (text.includes('Carga:')) {
            const newLoad = Math.floor(Math.random() * 40) + 40;
            span.textContent = text.replace(/Carga: \d+%/, `Carga: ${newLoad}%`);
        }
    });
}

function animateThermalMap() {
    const canvas = document.getElementById('thermalMapCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    function drawThermalMap() {
        if (!ctx) return;
        const w = canvas.clientWidth;
        const h = canvas.clientHeight;
        canvas.width = w;
        canvas.height = h;
        
        // Simulate heat map gradient
        const gradient = ctx.createLinearGradient(0, 0, w, h);
        gradient.addColorStop(0, '#2ecc71');
        gradient.addColorStop(0.3, '#f39c12');
        gradient.addColorStop(0.6, '#e67e22');
        gradient.addColorStop(1, '#e74c3c');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);
        
        // Draw zones
        ctx.fillStyle = 'rgba(255,255,255,0.1)';
        ctx.fillRect(w*0.2, h*0.2, w*0.25, h*0.6);
        ctx.fillRect(w*0.55, h*0.1, w*0.25, h*0.7);
        
        ctx.fillStyle = 'white';
        ctx.font = '12px Inter';
        ctx.fillText('Oficinas Norte', w*0.25, h*0.35);
        ctx.fillText('Data Center', w*0.65, h*0.25);
    }
    
    drawThermalMap();
    setInterval(drawThermalMap, 10000);
}

// ========== TOAST NOTIFICATIONS ==========
function showToast(message, type = 'info') {
    // Remove existing toast if any
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) existingToast.remove();
    
    const toast = document.createElement('div');
    toast.className = `toast-notification ${type}`;
    toast.innerHTML = `
        <i class="fas ${type === 'info' ? 'fa-info-circle' : (type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle')}"></i>
        <span>${message}</span>
    `;
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: ${type === 'info' ? '#2c7da0' : (type === 'success' ? '#2ecc71' : '#e74c3c')};
        color: white;
        padding: 12px 20px;
        border-radius: 12px;
        font-size: 0.85rem;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        gap: 10px;
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
}

// Add animation keyframes if not exists
if (!document.querySelector('#toast-keyframes')) {
    const style = document.createElement('style');
    style.id = 'toast-keyframes';
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
}

function initFormHandler() {
    const form = document.getElementById('configForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            showToast('Configuración guardada correctamente', 'success');
        });
    }
}

// Chart period buttons (simulate)
document.querySelectorAll('.btn-small').forEach(btn => {
    if (btn.textContent === '24h' || btn.textContent === '7d' || btn.textContent === '30d') {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.btn-small').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            showToast(`Vista cambiada a ${this.textContent}`, 'info');
        });
    }
});

// Trend metric change (simulate)
const trendMetric = document.getElementById('trendMetric');
const trendPeriod = document.getElementById('trendPeriod');
if (trendMetric && trendPeriod && historicalChart) {
    const updateHistoricalChart = () => {
        const metric = trendMetric.value;
        const period = trendPeriod.value;
        
        if (metric === 'temp') {
            historicalChart.data.datasets[0].label = 'Temperatura Promedio (°C)';
            historicalChart.data.datasets[0].data = [21.5, 22.1, 22.8, 23.2, 23.5, 22.9, 22.0];
            historicalChart.data.datasets[0].backgroundColor = '#2c7da0';
        } else if (metric === 'power') {
            historicalChart.data.datasets[0].label = 'Consumo Energético (kWh)';
            historicalChart.data.datasets[0].data = [1250, 1320, 1280, 1410, 1580, 1320, 1180];
            historicalChart.data.datasets[0].backgroundColor = '#e67e22';
        } else if (metric === 'cop') {
            historicalChart.data.datasets[0].label = 'COP Promedio';
            historicalChart.data.datasets[0].data = [3.6, 3.7, 3.5, 3.4, 3.2, 3.5, 3.8];
            historicalChart.data.datasets[0].backgroundColor = '#2ecc71';
        }
        historicalChart.update();
    };
    
    trendMetric.addEventListener('change', updateHistoricalChart);
    trendPeriod.addEventListener('change', () => showToast(`Período cambiado a ${trendPeriod.options[trendPeriod.selectedIndex].text}`, 'info'));
}

// Export for console debugging
window.rvmia = {
    showToast,
    version: '1.0.0',
    status: 'Operational'
};

console.log('✅ RVMIA HVAC BMS Frontend Loaded', window.rvmia);