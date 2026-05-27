// STATE MANAGEMENT & LOGIC - IT ASSET STOCKMANAGER PRO

// Local Storage Keys
const STORAGE_KEY_STOCK = 'it_assets_stock_pro';
const STORAGE_KEY_HISTORY = 'it_assets_history_pro';

// Category to Asset Type Mapping
const CATEGORY_MAP = {
    "Tecnología e Informática": ["Notebook", "Desktop", "Monitor", "Televisor", "Proyector", "Tablet", "Celular"],
    "Componentes y Accesorios": ["Vincha", "Mouse", "Teclado", "SSD", "Memoria RAM", "Fuente de poder", "Chromecast"],
    "Redes y Conectividad": ["Access Point", "Fichero (Control de Acceso)", "Fichero (Ingresos/Fichador)"],
    "Mobiliario e Infraestructura": ["Mobiliario", "Silla", "Box", "Aire acondicionado", "Grupo electrógeno", "Matafuegos"],
    "Electrodomésticos": ["Máquina de Café", "Heladera", "Dispenser de Agua"],
    "Herramientas": ["Herramientas"]
};

// Rich Demo Data (Diverse Categories, Ownerships, Expirations and Locations)
const DEFAULT_ASSETS = [
    {
        id: 'ast-1',
        category: 'Tecnología e Informática',
        itemType: 'Notebook',
        brandModel: 'Lenovo V330',
        serialNumber: 'MP16X8A9',
        status: 'Disponible',
        purchaseDate: '2025-02-10',
        expiryDate: '2028-02-10',
        purchasePrice: '480',
        ownershipType: 'N/A',
        assignedTo: '',
        employeeId: '',
        assignmentLocation: '',
        assignmentDate: '',
        returnDate: '',
        signedDeliveryPaper: true,
        dateAdded: '2026-05-10',
        notes: 'Equipo base. Cargador y funda original.'
    },
    {
        id: 'ast-2',
        category: 'Tecnología e Informática',
        itemType: 'Notebook',
        brandModel: 'Lenovo V330',
        serialNumber: 'MP18B7C2',
        status: 'Asignado',
        purchaseDate: '2025-02-10',
        expiryDate: '2028-02-10',
        purchasePrice: '480',
        ownershipType: 'N/A',
        assignedTo: 'Carlos Giménez',
        employeeId: 'LEG-8831',
        assignmentLocation: 'Home Office',
        assignmentDate: '2026-05-12',
        returnDate: '2026-05-20', // Overdue (Today is May 27, 2026)
        signedDeliveryPaper: false, // Pending!
        dateAdded: '2026-05-12',
        notes: 'Entregado con mochila. Tiene detalle estético menor en bisagra.'
    },
    {
        id: 'ast-3',
        category: 'Tecnología e Informática',
        itemType: 'Notebook',
        brandModel: 'Lenovo ThinkPad L14',
        serialNumber: 'PF39X0A1',
        status: 'Asignado',
        purchaseDate: '2025-06-15',
        expiryDate: '2029-06-15',
        purchasePrice: '850',
        ownershipType: 'N/A',
        assignedTo: 'Sofía Rodríguez',
        employeeId: 'LEG-9012',
        assignmentLocation: 'Call Center / Home Office',
        assignmentDate: '2026-05-15',
        returnDate: '2026-05-27', // Due Today (Today is May 27, 2026)
        signedDeliveryPaper: true,
        dateAdded: '2026-05-15',
        notes: 'Uso en desarrollo. Licencias corporativas cargadas.'
    },
    {
        id: 'ast-4',
        category: 'Electrodomésticos',
        itemType: 'Dispenser de Agua',
        brandModel: 'Ivess Termocompresor',
        serialNumber: 'DISP-IV-002',
        status: 'Disponible',
        purchaseDate: '2026-01-05',
        expiryDate: '2028-01-05',
        purchasePrice: '30',
        ownershipType: 'Alquilado', // Leased
        assignedTo: '',
        employeeId: '',
        assignmentLocation: '',
        assignmentDate: '',
        returnDate: '',
        signedDeliveryPaper: true,
        dateAdded: '2026-05-05',
        notes: 'Contrato de comodato trimestral con IVESS.'
    },
    {
        id: 'ast-5',
        category: 'Mobiliario e Infraestructura',
        itemType: 'Aire acondicionado',
        brandModel: 'BGH Silent Air 4500 frigorías',
        serialNumber: 'AC-BGH-504',
        status: 'Disponible',
        purchaseDate: '2024-11-20',
        expiryDate: '2030-11-20',
        purchasePrice: '720',
        ownershipType: 'N/A',
        assignedTo: '',
        employeeId: '',
        assignmentLocation: 'Call Center', // Assigned to room location
        assignmentDate: '',
        returnDate: '',
        signedDeliveryPaper: true,
        dateAdded: '2026-05-01',
        notes: 'Instalado en Sala de Operaciones Principal.'
    },
    {
        id: 'ast-6',
        category: 'Componentes y Accesorios',
        itemType: 'SSD',
        brandModel: 'Kingston A400 480GB',
        serialNumber: 'SSD-KG-480-12',
        status: 'Disponible',
        purchaseDate: '2026-04-10',
        expiryDate: '2031-04-10',
        purchasePrice: '45',
        ownershipType: 'N/A',
        assignedTo: '',
        employeeId: '',
        assignmentLocation: '',
        assignmentDate: '',
        returnDate: '',
        signedDeliveryPaper: true,
        dateAdded: '2026-05-20',
        notes: 'En stock de soporte para recambios de hardware.'
    },
    {
        id: 'ast-7',
        category: 'Mobiliario e Infraestructura',
        itemType: 'Matafuegos',
        brandModel: 'Georgia Co2 5kg',
        serialNumber: 'MF-GEO-994',
        status: 'Disponible',
        purchaseDate: '2025-06-25',
        expiryDate: '2026-06-25', // Next month! (triggers warning)
        purchasePrice: '90',
        ownershipType: 'N/A',
        assignedTo: '',
        employeeId: '',
        assignmentLocation: '',
        assignmentDate: '',
        returnDate: '',
        signedDeliveryPaper: true,
        dateAdded: '2026-05-02',
        notes: 'Próxima recarga requerida antes de caducidad.'
    },
    {
        id: 'ast-8',
        category: 'Tecnología e Informática',
        itemType: 'Celular',
        brandModel: 'Samsung Galaxy A54',
        serialNumber: 'IMEI-3589410-09',
        status: 'Asignado',
        purchaseDate: '2025-08-01',
        expiryDate: '2028-08-01',
        purchasePrice: '380',
        ownershipType: 'N/A',
        assignedTo: 'Carlos Giménez',
        employeeId: 'LEG-8831',
        assignmentLocation: 'Home Office',
        assignmentDate: '2026-05-12',
        returnDate: '2026-11-12',
        signedDeliveryPaper: true,
        dateAdded: '2026-05-12',
        notes: 'Línea corporativa asignada.'
    }
];

const DEFAULT_HISTORY = [
    {
        id: 'h-1',
        notebookId: 'ast-1',
        brandModel: 'Lenovo V330',
        serialNumber: 'MP16X8A9',
        action: 'Ingreso',
        details: 'Registro de notebook en stock disponible.',
        timestamp: '2026-05-10 09:30:15',
        status: 'Disponible'
    },
    {
        id: 'h-2',
        notebookId: 'ast-2',
        brandModel: 'Lenovo V330',
        serialNumber: 'MP18B7C2',
        action: 'Asignación',
        details: 'Asignado a Carlos Giménez (Legajo: LEG-8831) en Home Office. Firma Pendiente.',
        timestamp: '2026-05-12 14:15:22',
        status: 'Asignado'
    },
    {
        id: 'h-3',
        notebookId: 'ast-4',
        brandModel: 'Ivess Termocompresor',
        serialNumber: 'DISP-IV-002',
        action: 'Ingreso',
        details: 'Ingreso de dispenser de agua en carácter de Alquilado/Comodato.',
        timestamp: '2026-05-05 10:00:00',
        status: 'Disponible'
    },
    {
        id: 'h-4',
        notebookId: 'ast-7',
        brandModel: 'Georgia Co2 5kg',
        action: 'Ingreso',
        serialNumber: 'MF-GEO-994',
        details: 'Ingreso de matafuegos con caducidad de oblea anual.',
        timestamp: '2026-05-02 11:20:00',
        status: 'Disponible'
    }
];

// App State
let assets = [];
let historyLog = [];
let currentSearchQuery = '';

// Toast Notification Container
let toastContainerElement = null;

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    // Setup toast container
    toastContainerElement = document.createElement('div');
    toastContainerElement.className = 'toast-container';
    document.body.appendChild(toastContainerElement);

    // Request desktop notifications permission
    initNotifications();

    // Load data from LocalStorage or Load Defaults
    const localStock = localStorage.getItem(STORAGE_KEY_STOCK);
    const localHistory = localStorage.getItem(STORAGE_KEY_HISTORY);

    if (localStock) {
        assets = JSON.parse(localStock);
    } else {
        assets = [...DEFAULT_ASSETS];
        localStorage.setItem(STORAGE_KEY_STOCK, JSON.stringify(assets));
    }

    if (localHistory) {
        historyLog = JSON.parse(localHistory);
    } else {
        historyLog = [...DEFAULT_HISTORY];
        localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(historyLog));
    }

    // Initialize UI Elements
    initClock();
    populateCategoryDropdowns();
    refreshUI();
    
    // Set periodic notifications check (every 1 hour = 3,600,000 milliseconds)
    setInterval(checkUnsignedPapersAndNotify, 3600000);
    
    // Set periodic overdue notifications check (every 2 hours = 7,200,000 milliseconds)
    setInterval(checkOverdueAssignmentsAndNotify, 7200000);

    // Initial check after a short delay
    setTimeout(() => {
        checkUnsignedPapersAndNotify();
        checkOverdueAssignmentsAndNotify();
    }, 2000);

    // Click outside notification dropdown to close it
    document.addEventListener('click', (e) => {
        const menu = document.getElementById('notification-dropdown-menu');
        const btn = document.getElementById('notification-bell-btn');
        if (menu && btn && !menu.classList.contains('hidden-section')) {
            if (!menu.contains(e.target) && !btn.contains(e.target)) {
                menu.classList.add('hidden-section');
            }
        }
    });
});

// Real-time Clock in Header
function initClock() {
    const timeDisplay = document.getElementById('time-display');
    const updateTime = () => {
        const now = new Date();
        const timeStr = now.toLocaleTimeString('es-AR', { hour12: false });
        timeDisplay.textContent = timeStr;
    };
    updateTime();
    setInterval(updateTime, 1000);
}

// Browser notifications permission check
function initNotifications() {
    if ("Notification" in window) {
        if (Notification.permission !== "granted" && Notification.permission !== "denied") {
            Notification.requestPermission();
        }
    }
}

// Switch Tab Navigation
window.switchTab = function(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));

    const targetTab = document.getElementById(`tab-${tabId}`);
    if (targetTab) targetTab.classList.add('active');

    const targetBtn = document.getElementById(`btn-nav-${tabId}`);
    if (targetBtn) targetBtn.classList.add('active');

    if (tabId === 'inventory') {
        applyFilters();
    } else if (tabId === 'history') {
        renderHistory();
    } else if (tabId === 'dashboard') {
        renderDashboard();
    }
};

// Populate filtering dropdowns
function populateCategoryDropdowns() {
    const filterItemType = document.getElementById('filter-item-type');
    if (!filterItemType) return;
    
    handleCategoryFilterChange();
}

window.handleCategoryFilterChange = function() {
    const filterCat = document.getElementById('filter-category').value;
    const filterType = document.getElementById('filter-item-type');
    
    filterType.innerHTML = '<option value="all">Todos los tipos</option>';
    
    if (filterCat === 'all') {
        // Collect all distinct types currently in stock
        const allTypes = [...new Set(assets.map(a => a.itemType))].sort();
        allTypes.forEach(type => {
            const option = document.createElement('option');
            option.value = type;
            option.textContent = type;
            filterType.appendChild(option);
        });
    } else {
        const types = CATEGORY_MAP[filterCat] || [];
        types.forEach(type => {
            const option = document.createElement('option');
            option.value = type;
            option.textContent = type;
            filterType.appendChild(option);
        });
    }
    
    applyFilters();
};

window.applyFilters = function() {
    renderInventoryTable();
};

// Global State Save
function refreshUI() {
    saveToLocalStorage();
    renderDashboard();
    renderInventoryTable();
    renderHistory();
    renderNotificationsDropdown();
    lucide.createIcons();
}

function saveToLocalStorage() {
    localStorage.setItem(STORAGE_KEY_STOCK, JSON.stringify(assets));
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(historyLog));
}

// Toast popup utility
window.showToast = function(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let icon = 'info';
    if (type === 'success') icon = 'check-circle-2';
    if (type === 'error') icon = 'alert-triangle';
    if (type === 'warning') icon = 'alert-circle';

    toast.innerHTML = `
        <i data-lucide="${icon}"></i>
        <span>${message}</span>
    `;
    
    toastContainerElement.appendChild(toast);
    lucide.createIcons();
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(-10px)';
        setTimeout(() => toast.remove(), 300);
    }, 3500);
};

// Periodic Signature Audits and Native desktop alert triggers
window.checkUnsignedPapersAndNotify = function(manual = false) {
    const unsignedNotebooks = assets.filter(a => 
        a.status === 'Asignado' && 
        a.itemType === 'Notebook' && 
        a.signedDeliveryPaper === false
    );
    
    if (unsignedNotebooks.length > 0) {
        const msg = `Alerta: Hay ${unsignedNotebooks.length} notebooks asignadas con el papel de entrega PENDIENTE de firma.`;
        
        if (manual) {
            showToast(msg, 'error');
        } else {
            showToast(msg, 'warning');
        }

        // Native push Notification
        if ("Notification" in window) {
            if (Notification.permission === "granted") {
                new Notification("Control de Activos IT - Firmas Pendientes", {
                    body: `Atención: Se registran ${unsignedNotebooks.length} entregas de notebooks sin conformar firma.`,
                    tag: 'unsigned-alert',
                    requireInteraction: true
                });
            } else if (Notification.permission !== "denied") {
                Notification.requestPermission().then(permission => {
                    if (permission === "granted") {
                        new Notification("Control de Activos IT - Firmas Pendientes", {
                            body: `Atención: Se registran ${unsignedNotebooks.length} entregas de notebooks sin conformar firma.`
                        });
                    }
                });
            }
        }
    }
};

window.checkOverdueAssignmentsAndNotify = function(manual = false) {
    const overdue = assets.filter(a => a.status === 'Asignado' && isOverdue(a.returnDate));
    const todayDue = assets.filter(a => a.status === 'Asignado' && isDueToday(a.returnDate));

    if (overdue.length > 0) {
        const detailList = overdue.map(a => `${a.assignedTo} (Leg: ${a.employeeId}) con ${a.brandModel}`).join(', ');
        const msg = `CRÍTICO: Plazo Vencido. Se debe recuperar el equipo en posesión de: ${detailList}.`;
        
        if (manual) {
            showToast(msg, 'error');
        } else {
            showToast(msg, 'warning');
        }

        // Native push Notification
        if ("Notification" in window) {
            if (Notification.permission === "granted") {
                new Notification("ITAsset Pro - RECUPERO URGENTE DE EQUIPOS", {
                    body: `Atención: Plazo vencido. Se debe recuperar el equipo. En posesión de: ${detailList}.`,
                    tag: 'overdue-recupero-alert',
                    requireInteraction: true
                });
            }
        }
    } else {
        if (manual) {
            showToast("No hay devoluciones vencidas en este momento.", "success");
        }
    }

    if (todayDue.length > 0) {
        const detailList = todayDue.map(a => `${a.assignedTo} (Leg: ${a.employeeId}) con ${a.brandModel}`).join(', ');
        const msg = `Advertencia: Hoy se debe devolver el equipo asignado a: ${detailList}.`;
        
        // Show today due notice only once on load or manual, prevent toast clutter
        if (manual) {
            showToast(msg, 'success');
        } else {
            showToast(msg, 'warning');
        }

        if ("Notification" in window && Notification.permission === "granted") {
            new Notification("ITAsset Pro - Hoy vence devolución", {
                body: `Aviso: Hoy se debe devolver el equipo en posesión de: ${detailList}.`,
                tag: 'today-due-warning'
            });
        }
    }
};

// ----------------------------------------------------
// DASHBOARD LOGIC
// ----------------------------------------------------
function renderDashboard() {
    const total = assets.length;
    const available = assets.filter(a => a.status === 'Disponible').length;
    const assigned = assets.filter(a => a.status === 'Asignado').length;
    const maintenance = assets.filter(a => a.status === 'En Mantenimiento').length;
    
    // Count unsigned notebook deliveries
    const unsigned = assets.filter(a => 
        a.status === 'Asignado' && 
        a.itemType === 'Notebook' && 
        a.signedDeliveryPaper === false
    ).length;

    // Set KPIs
    document.getElementById('kpi-total').textContent = total;
    document.getElementById('kpi-available').textContent = available;
    document.getElementById('kpi-assigned').textContent = assigned;
    document.getElementById('kpi-unsigned').textContent = unsigned;

    const availablePct = total > 0 ? Math.round((available / total) * 100) : 0;
    const assignedPct = total > 0 ? Math.round((assigned / total) * 100) : 0;
    const unsignedPct = assigned > 0 ? Math.round((unsigned / assigned) * 100) : 0;

    document.getElementById('kpi-available-pct').textContent = `${availablePct}% en stock`;
    document.getElementById('kpi-assigned-pct').textContent = `${assignedPct}% en uso`;
    document.getElementById('kpi-unsigned-pct').textContent = `${unsignedPct}% de asignados`;

    // Render Critical alerts (obsolescences & signatures)
    renderManagementAlerts();

    // Render Category distributions
    renderCategoryDistributionChart();

    // Render activity feed
    renderRecentActivities();
}

function renderManagementAlerts() {
    const container = document.getElementById('dashboard-critical-alerts');
    container.innerHTML = '';

    const unsignedNotebooks = assets.filter(a => 
        a.status === 'Asignado' && 
        a.itemType === 'Notebook' && 
        a.signedDeliveryPaper === false
    );

    // Calculate assets near expiry (< 60 days)
    const today = new Date();
    const expiringAssets = assets.filter(a => {
        if (!a.expiryDate) return false;
        const expiry = new Date(a.expiryDate);
        const diffTime = expiry - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays >= 0 && diffDays <= 60; // Expiring soon
    });

    // Overdue and Due today assignments
    const overdueAssignments = assets.filter(a => a.status === 'Asignado' && isOverdue(a.returnDate));
    const todayAssignments = assets.filter(a => a.status === 'Asignado' && isDueToday(a.returnDate));

    if (unsignedNotebooks.length === 0 && expiringAssets.length === 0 && overdueAssignments.length === 0 && todayAssignments.length === 0) {
        return; // No alerts needed
    }

    const alertBox = document.createElement('div');
    alertBox.className = 'alerts-section-container';

    // Renders overdue assignments alerts
    overdueAssignments.forEach(a => {
        const item = document.createElement('div');
        item.className = 'alert-banner critical';
        item.innerHTML = `
            <div class="alert-banner-content">
                <i data-lucide="calendar-x" style="color:var(--danger); animation: alertPulse 2s infinite;"></i>
                <div>
                    <div class="alert-banner-title">PLAZO DE DEVOLUCIÓN VENCIDO - RECUPERACIÓN REQUERIDA</div>
                    <div class="alert-banner-desc">El asesor <strong>${a.assignedTo}</strong> (Legajo: <code>${a.employeeId}</code>) retiene el activo <strong>${a.brandModel} (${a.itemType}) S/N: ${a.serialNumber}</strong>. El plazo venció el: <strong>${a.returnDate}</strong>.</div>
                </div>
            </div>
            <div style="display:flex; gap:10px;">
                <button class="btn btn-secondary" style="padding:6px 12px; font-size:0.75rem;" onclick="quickReturnAsset('${a.id}')">
                    <i data-lucide="user-minus" style="width:13px; height:13px;"></i> Devolución Stock
                </button>
                <button class="btn btn-primary" style="padding:6px 12px; font-size:0.75rem; background:var(--danger-gradient); box-shadow:none;" onclick="checkOverdueAssignmentsAndNotify(true)">
                    Testear Alerta (2h)
                </button>
            </div>
        `;
        alertBox.appendChild(item);
    });

    // Renders unsigned alerts
    unsignedNotebooks.forEach(nb => {
        const item = document.createElement('div');
        item.className = 'alert-banner critical';
        item.innerHTML = `
            <div class="alert-banner-content">
                <i data-lucide="shield-alert"></i>
                <div>
                    <div class="alert-banner-title">Papel de Entrega Pendiente de Firma</div>
                    <div class="alert-banner-desc">El asesor <strong>${nb.assignedTo}</strong> (Legajo: <code>${nb.employeeId}</code>) aún no firmó la entrega de la notebook <strong>${nb.brandModel} (S/N: ${nb.serialNumber})</strong>.</div>
                </div>
            </div>
            <div style="display:flex; gap:10px;">
                <button class="btn btn-secondary" style="padding:6px 12px; font-size:0.75rem;" onclick="quickSignNotebook('${nb.id}')">
                    <i data-lucide="check" style="width:13px; height:13px;"></i> Registrar Firma
                </button>
                <button class="btn btn-primary" style="padding:6px 12px; font-size:0.75rem; background:var(--danger-gradient); box-shadow:none;" onclick="checkUnsignedPapersAndNotify(true)">
                    Testear Alerta
                </button>
            </div>
        `;
        alertBox.appendChild(item);
    });

    // Renders due today warning alerts
    todayAssignments.forEach(a => {
        const item = document.createElement('div');
        item.className = 'alert-banner warning-alert';
        item.innerHTML = `
            <div class="alert-banner-content">
                <i data-lucide="bell"></i>
                <div>
                    <div class="alert-banner-title">Plazo de Devolución Vence Hoy</div>
                    <div class="alert-banner-desc">Hoy <strong>${a.returnDate}</strong> se debe devolver el activo <strong>${a.brandModel} (${a.itemType} - S/N: ${a.serialNumber})</strong>. En posesión de <strong>${a.assignedTo}</strong> (Legajo: <code>${a.employeeId}</code>).</div>
                </div>
            </div>
            <button class="btn btn-secondary" style="padding:6px 12px; font-size:0.75rem;" onclick="quickReturnAsset('${a.id}')">
                Registrar Retorno
            </button>
        `;
        alertBox.appendChild(item);
    });

    // Renders expiration warnings
    expiringAssets.forEach(a => {
        const expiry = new Date(a.expiryDate);
        const diffTime = expiry - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        const item = document.createElement('div');
        item.className = 'alert-banner warning-alert';
        item.innerHTML = `
            <div class="alert-banner-content">
                <i data-lucide="alert-triangle"></i>
                <div>
                    <div class="alert-banner-title">Activo Próximo a Vencer / Caducar</div>
                    <div class="alert-banner-desc">El activo <strong>${a.brandModel} (${a.itemType} - S/N: ${a.serialNumber})</strong> caduca el <strong>${a.expiryDate}</strong> (en ${diffDays} días). Requiere recambio o revisión.</div>
                </div>
            </div>
            <button class="btn btn-secondary" style="padding:6px 12px; font-size:0.75rem;" onclick="openNotebookModal('${a.id}')">
                Actualizar Ficha
            </button>
        `;
        alertBox.appendChild(item);
    });

    container.appendChild(alertBox);
    lucide.createIcons();
}

function renderCategoryDistributionChart() {
    const container = document.getElementById('categories-list-chart');
    container.innerHTML = '';

    if (assets.length === 0) {
        container.innerHTML = '<div class="text-muted" style="text-align: center; padding: 20px;">No hay activos registrados.</div>';
        return;
    }

    const categoryCounts = {};
    assets.forEach(a => {
        categoryCounts[a.category] = (categoryCounts[a.category] || 0) + 1;
    });

    const sortedCats = Object.keys(categoryCounts).map(cat => {
        return { name: cat, count: categoryCounts[cat] };
    }).sort((a, b) => b.count - a.count);

    const maxCount = Math.max(...sortedCats.map(c => c.count));

    sortedCats.forEach(item => {
        const percentage = Math.round((item.count / maxCount) * 100);
        const row = document.createElement('div');
        row.className = 'chart-bar-row';
        row.innerHTML = `
            <div class="chart-bar-info">
                <span class="chart-bar-name">${item.name}</span>
                <span class="chart-bar-value">${item.count} ${item.count === 1 ? 'activo' : 'activos'}</span>
            </div>
            <div class="chart-bar-bg">
                <div class="chart-bar-fill" style="width: ${percentage}%"></div>
            </div>
        `;
        container.appendChild(row);
    });
}

function renderRecentActivities() {
    const container = document.getElementById('recent-activities-container');
    container.innerHTML = '';

    const recentLogs = [...historyLog].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 4);

    if (recentLogs.length === 0) {
        container.innerHTML = '<div class="text-muted" style="text-align: center; padding: 20px;">No hay historial de movimientos.</div>';
        return;
    }

    recentLogs.forEach(log => {
        const item = document.createElement('div');
        item.className = 'activity-item';

        let iconType = 'info';
        let actionClass = 'create';
        if (log.action === 'Asignación') { iconType = 'user-check'; actionClass = 'assign'; }
        else if (log.action === 'Devolución') { iconType = 'check-circle-2'; actionClass = 'return'; }
        else if (log.action === 'Mantenimiento') { iconType = 'wrench'; actionClass = 'maintenance'; }
        else if (log.action === 'Retiro') { iconType = 'trash-2'; actionClass = 'retire'; }
        else if (log.action === 'Ingreso') { iconType = 'plus-circle'; actionClass = 'create'; }
        else if (log.action === 'Firma Conformada') { iconType = 'file-signature'; actionClass = 'signed'; }

        const timeStr = formatDateFriendly(log.timestamp);

        item.innerHTML = `
            <div class="activity-icon ${actionClass}">
                <i data-lucide="${iconType}"></i>
            </div>
            <div class="activity-details">
                <span class="activity-text"><strong>${log.serialNumber}</strong> (${log.brandModel}) - ${log.details}</span>
                <span class="activity-time">${timeStr}</span>
            </div>
        `;
        container.appendChild(item);
    });
}

// ----------------------------------------------------
// INVENTORY TABLE LOGIC
// ----------------------------------------------------
function renderInventoryTable() {
    const tbody = document.getElementById('inventory-tbody');
    if (!tbody) return;

    tbody.innerHTML = '';

    const filterCategoryVal = document.getElementById('filter-category').value;
    const filterItemTypeVal = document.getElementById('filter-item-type').value;
    const filterStatusVal = document.getElementById('filter-status').value;

    const filteredAssets = assets.filter(a => {
        const matchesSearch = currentSearchQuery === '' || 
            a.brandModel.toLowerCase().includes(currentSearchQuery.toLowerCase()) ||
            a.serialNumber.toLowerCase().includes(currentSearchQuery.toLowerCase()) ||
            a.itemType.toLowerCase().includes(currentSearchQuery.toLowerCase()) ||
            a.category.toLowerCase().includes(currentSearchQuery.toLowerCase()) ||
            (a.assignedTo && a.assignedTo.toLowerCase().includes(currentSearchQuery.toLowerCase())) ||
            (a.employeeId && a.employeeId.toLowerCase().includes(currentSearchQuery.toLowerCase())) ||
            (a.assignmentLocation && a.assignmentLocation.toLowerCase().includes(currentSearchQuery.toLowerCase()));

        const matchesCat = filterCategoryVal === 'all' || a.category === filterCategoryVal;
        const matchesType = filterItemTypeVal === 'all' || a.itemType === filterItemTypeVal;
        const matchesStatus = filterStatusVal === 'all' || a.status === filterStatusVal;

        return matchesSearch && matchesCat && matchesType && matchesStatus;
    });

    document.getElementById('filter-results-count').textContent = `Mostrando ${filteredAssets.length} de ${assets.length} activos`;

    if (filteredAssets.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 40px; color: var(--text-muted);">
                    No se encontraron activos con los filtros aplicados.
                </td>
            </tr>
        `;
        return;
    }

    // Sort by Category, then model
    filteredAssets.sort((a, b) => a.category.localeCompare(b.category) || a.brandModel.localeCompare(b.brandModel));

    filteredAssets.forEach(a => {
        const tr = document.createElement('tr');
        
        let badgeClass = 'disponible';
        if (a.status === 'Asignado') badgeClass = 'asignado';
        else if (a.status === 'En Mantenimiento') badgeClass = 'mantenimiento';
        else if (a.status === 'Retirado') badgeClass = 'retirado';

        // Ownership display for dispensers
        let typeDisplay = `<span style="font-size:0.75rem; color:var(--text-muted); block">${a.category}</span><br><strong>${a.itemType}</strong>`;
        if (a.itemType === 'Dispenser de Agua' && a.ownershipType) {
            typeDisplay += ` <span style="font-size:0.65rem; color:var(--info); font-weight:600;">(${a.ownershipType})</span>`;
        }

        // Location & Traceability column
        let traceHtml = '';
        if (a.purchasePrice) traceHtml += `<span>$${a.purchasePrice}</span>`;
        if (a.purchaseDate) traceHtml += `<br><span style="font-size:0.7rem; color:var(--text-muted);">Comp: ${a.purchaseDate}</span>`;
        if (a.expiryDate) {
            const isExpiring = isNearExpiry(a.expiryDate);
            const expColor = isExpiring ? 'color:var(--danger); font-weight:600;' : 'color:var(--text-muted);';
            traceHtml += `<br><span style="font-size:0.7rem; ${expColor}">Cad: ${a.expiryDate}</span>`;
        }
        if (!traceHtml) traceHtml = '<span style="color:var(--text-muted);">-</span>';

        // Assignment Column
        let assignHtml = '';
        if (a.status === 'Asignado') {
            assignHtml = `<strong>${a.assignedTo}</strong> <span style="font-size:0.75rem; color:var(--text-secondary);">(Leg: ${a.employeeId})</span>`;
            
            // Show location badge
            let locClass = 'call-center';
            if (a.assignmentLocation === 'Home Office') locClass = 'home-office';
            else if (a.assignmentLocation === 'Call Center / Home Office') locClass = 'hibrido';
            
            assignHtml += `<br><span class="badge-loc ${locClass}">${a.assignmentLocation}</span>`;

            // If it is a notebook, show delivery signature status
            if (a.itemType === 'Notebook') {
                if (a.signedDeliveryPaper) {
                    assignHtml += ` <span class="badge-sig firmado"><i data-lucide="check" style="width:10px; height:10px;"></i> Firmado</span>`;
                } else {
                    assignHtml += ` <span class="badge-sig pendiente"><i data-lucide="clock" style="width:10px; height:10px;"></i> PENDIENTE</span>`;
                }
            }

            // Return date status indicators
            if (a.returnDate) {
                if (isOverdue(a.returnDate)) {
                    assignHtml += ` <br><span style="color:var(--danger); font-size:0.75rem; font-weight:600; display:inline-flex; align-items:center; gap:3px; margin-top:4px;"><i data-lucide="calendar-off" style="width:12px; height:12px;"></i> VENCIDO (${a.returnDate})</span>`;
                } else if (isDueToday(a.returnDate)) {
                    assignHtml += ` <br><span style="color:var(--warning); font-size:0.75rem; font-weight:600; display:inline-flex; align-items:center; gap:3px; margin-top:4px;"><i data-lucide="bell" style="width:12px; height:12px;"></i> Devuelve Hoy</span>`;
                }
            }
        } else {
            assignHtml = '<span style="color:var(--text-muted);">Sin asignar</span>';
        }

        tr.innerHTML = `
            <td>${typeDisplay}</td>
            <td><span style="font-weight:600; color:#fff;">${a.brandModel}</span></td>
            <td><code style="background-color:rgba(255,255,255,0.06); padding:4px 8px; border-radius:4px; border: 1px solid rgba(255,255,255,0.08);">${a.serialNumber}</code></td>
            <td><span class="badge ${badgeClass}">${a.status}</span></td>
            <td>${assignHtml}</td>
            <td>${traceHtml}</td>
            <td>
                <div class="table-actions">
                    <button class="btn-action info" onclick="viewAssetDetails('${a.id}')" title="Ver detalles y auditoría">
                        <i data-lucide="eye" style="width:14px; height:14px;"></i>
                    </button>
                    ${a.status === 'Disponible' ? `
                        <button class="btn-action assign" onclick="openAssignModal('${a.id}')" title="Asignar activo">
                            <i data-lucide="user-plus" style="width:14px; height:14px;"></i>
                        </button>
                        <button class="btn-action edit" onclick="quickToggleMaintenance('${a.id}', 'to_maint')" title="Enviar a mantenimiento">
                            <i data-lucide="wrench" style="width:14px; height:14px;"></i>
                        </button>
                    ` : ''}
                    ${a.status === 'Asignado' ? `
                        ${(a.itemType === 'Notebook' && !a.signedDeliveryPaper) ? `
                            <button class="btn-action sig-btn" onclick="quickSignNotebook('${a.id}')" title="Registrar firma de entrega">
                                <i data-lucide="file-signature" style="width:14px; height:14px; color:var(--success);"></i>
                            </button>
                        ` : ''}
                        <button class="btn-action assign" onclick="quickReturnAsset('${a.id}')" title="Devolver a stock disponible">
                            <i data-lucide="user-minus" style="width:14px; height:14px;"></i>
                        </button>
                    ` : ''}
                    ${a.status === 'En Mantenimiento' ? `
                        <button class="btn-action assign" onclick="quickToggleMaintenance('${a.id}', 'from_maint')" title="Finalizar mantenimiento / Disponible">
                            <i data-lucide="check-square" style="width:14px; height:14px;"></i>
                        </button>
                    ` : ''}
                    <button class="btn-action edit" onclick="openNotebookModal('${a.id}')" title="Editar ficha completa">
                        <i data-lucide="edit-3" style="width:14px; height:14px;"></i>
                    </button>
                    <button class="btn-action delete" onclick="deleteAsset('${a.id}')" title="Eliminar del sistema">
                        <i data-lucide="trash-2" style="width:14px; height:14px;"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });

    lucide.createIcons();
}

window.handleSearch = function(query) {
    currentSearchQuery = query.trim();
    document.getElementById('global-search').value = query;
    
    const activeTab = document.querySelector('.tab-content.active');
    if (activeTab.id === 'tab-dashboard') {
        switchTab('inventory');
    } else if (activeTab.id === 'tab-inventory') {
        applyFilters();
    }
};

// Expiry date checker helper (< 60 days)
function isNearExpiry(expiryDateStr) {
    if (!expiryDateStr) return false;
    const today = new Date();
    const expiry = new Date(expiryDateStr);
    const diff = expiry - today;
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days >= 0 && days <= 60;
}

function isOverdue(returnDateStr) {
    if (!returnDateStr) return false;
    const today = new Date().toISOString().split('T')[0];
    return returnDateStr < today;
}

function isDueToday(returnDateStr) {
    if (!returnDateStr) return false;
    const today = new Date().toISOString().split('T')[0];
    return returnDateStr === today;
}

// ----------------------------------------------------
// HISTORY AUDIT LOG
// ----------------------------------------------------
function renderHistory() {
    const timeline = document.getElementById('history-timeline');
    if (!timeline) return;

    timeline.innerHTML = '';
    const historySearchVal = document.getElementById('history-search').value.trim().toLowerCase();

    const filteredLogs = historyLog.filter(log => {
        return historySearchVal === '' ||
            log.serialNumber.toLowerCase().includes(historySearchVal) ||
            log.brandModel.toLowerCase().includes(historySearchVal) ||
            log.action.toLowerCase().includes(historySearchVal) ||
            log.details.toLowerCase().includes(historySearchVal);
    });

    filteredLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    if (filteredLogs.length === 0) {
        timeline.innerHTML = '<div class="text-muted" style="text-align: center; padding: 20px;">No se encontraron registros de auditoría.</div>';
        return;
    }

    filteredLogs.forEach(log => {
        const item = document.createElement('div');
        item.className = 'timeline-item';

        let badgeStatus = 'Disponible';
        if (log.status) badgeStatus = log.status;
        else if (log.action === 'Asignación') badgeStatus = 'Asignado';
        else if (log.action === 'Mantenimiento') badgeStatus = 'Mantenimiento';
        else if (log.action === 'Retiro') badgeStatus = 'Retirado';

        item.innerHTML = `
            <div class="timeline-badge ${badgeStatus}"></div>
            <div class="timeline-card">
                <div class="timeline-header">
                    <span class="timeline-title"><strong>${log.action}</strong>: S/N ${log.serialNumber} (${log.brandModel})</span>
                    <span class="timeline-time">${log.timestamp}</span>
                </div>
                <div class="timeline-desc">${log.details}</div>
                ${log.notes ? `<div class="timeline-notes">Obs: ${log.notes}</div>` : ''}
            </div>
        `;
        timeline.appendChild(item);
    });
}

window.handleHistorySearch = function(value) {
    renderHistory();
};

window.clearHistoryLog = function() {
    if (confirm('¿Estás seguro de que deseas vaciar el historial de auditoría? Esta acción no se puede deshacer.')) {
        historyLog = [];
        showToast('Historial de auditoría borrado.', 'warning');
        refreshUI();
    }
};

// ----------------------------------------------------
// ADD / EDIT ASSET FORM LOGIC
// ----------------------------------------------------
window.handleModalCategoryChange = function(catVal) {
    const typeSelect = document.getElementById('asset-item-type');
    typeSelect.innerHTML = '<option value="">-- Seleccionar --</option>';

    if (!catVal) return;

    const types = CATEGORY_MAP[catVal] || [];
    types.forEach(t => {
        const option = document.createElement('option');
        option.value = t;
        option.textContent = t;
        typeSelect.appendChild(option);
    });
};

window.handleModalItemTypeChange = function(typeVal) {
    // Dispenser Ownership toggle
    const ownershipFields = document.getElementById('ownership-fields');
    const ownershipSelect = document.getElementById('asset-ownership');
    if (typeVal === 'Dispenser de Agua') {
        ownershipFields.classList.remove('hidden-section');
        ownershipSelect.required = true;
    } else {
        ownershipFields.classList.add('hidden-section');
        ownershipSelect.required = false;
        ownershipSelect.value = '';
    }

    // Signature control view toggle (show signature field for Notebooks specifically)
    const signatureGroup = document.getElementById('signature-form-group');
    if (typeVal === 'Notebook') {
        signatureGroup.classList.remove('hidden-section');
    } else {
        signatureGroup.classList.add('hidden-section');
        document.getElementById('notebook-signature').value = 'no';
    }
};

window.openNotebookModal = function(id = null) {
    const modal = document.getElementById('notebook-modal');
    const modalTitle = document.getElementById('modal-title');
    const form = document.getElementById('notebook-form');
    const serialInput = document.getElementById('notebook-serial');
    
    document.getElementById('serial-error').style.display = 'none';
    form.reset();
    document.getElementById('notebook-id').value = '';
    
    // Enable serial field
    serialInput.disabled = false;
    document.getElementById('asset-category').disabled = false;
    document.getElementById('asset-item-type').disabled = false;

    // Reset conditional panels
    document.getElementById('assignment-fields').classList.add('hidden-section');
    document.getElementById('ownership-fields').classList.add('hidden-section');
    document.getElementById('signature-form-group').classList.add('hidden-section');

    // Reset file upload state
    document.getElementById('asset-receipt').value = '';
    document.getElementById('asset-receipt-data').value = '';
    document.getElementById('asset-receipt-filename').value = '';
    document.getElementById('receipt-preview-container').classList.add('hidden-section');

    // Reset date fields
    document.getElementById('notebook-assignment-date').value = '';
    document.getElementById('notebook-return-date').value = '';

    if (id) {
        // Edit Mode
        modalTitle.textContent = 'Editar Activo';
        const asset = assets.find(a => a.id === id);
        if (asset) {
            document.getElementById('notebook-id').value = asset.id;
            
            // Set Category and load secondary dropdown options
            document.getElementById('asset-category').value = asset.category;
            handleModalCategoryChange(asset.category);
            
            // Set Asset Type and trigger its conditional views
            document.getElementById('asset-item-type').value = asset.itemType;
            handleModalItemTypeChange(asset.itemType);

            document.getElementById('notebook-model').value = asset.brandModel;
            document.getElementById('notebook-serial').value = asset.serialNumber;
            document.getElementById('notebook-status').value = asset.status;
            
            document.getElementById('asset-purchase-date').value = asset.purchaseDate || '';
            document.getElementById('asset-expiry-date').value = asset.expiryDate || '';
            document.getElementById('asset-purchase-price').value = asset.purchasePrice || '';
            
            if (asset.receiptData) {
                document.getElementById('asset-receipt-data').value = asset.receiptData;
                document.getElementById('asset-receipt-filename').value = asset.receiptFilename;
                document.getElementById('receipt-preview-name').textContent = asset.receiptFilename;
                document.getElementById('receipt-preview-container').classList.remove('hidden-section');
            }

            document.getElementById('notebook-notes').value = asset.notes || '';
            
            if (asset.itemType === 'Dispenser de Agua') {
                document.getElementById('asset-ownership').value = asset.ownershipType || 'Propio';
            }

            // Prevent identity change for existing hardware in inventory
            serialInput.disabled = true;
            document.getElementById('asset-category').disabled = true;
            document.getElementById('asset-item-type').disabled = true;

            // Trigger status conditional panel
            handleModalStatusChange(asset.status);

            if (asset.status === 'Asignado') {
                document.getElementById('notebook-employee').value = asset.assignedTo || '';
                document.getElementById('notebook-employee-id').value = asset.employeeId || '';
                document.getElementById('notebook-location').value = asset.assignmentLocation || 'Call Center';
                document.getElementById('notebook-assignment-date').value = asset.assignmentDate || '';
                document.getElementById('notebook-return-date').value = asset.returnDate || '';
                
                if (asset.itemType === 'Notebook') {
                    document.getElementById('notebook-signature').value = asset.signedDeliveryPaper ? 'si' : 'no';
                }
            }
        }
    } else {
        // Add Mode
        modalTitle.textContent = 'Añadir Activo de Inventario';
        document.getElementById('notebook-status').value = 'Disponible';
    }

    modal.classList.add('active');
};

window.closeNotebookModal = function() {
    document.getElementById('notebook-modal').classList.remove('active');
};

window.handleModalStatusChange = function(status) {
    const assignmentFields = document.getElementById('assignment-fields');
    const employeeInput = document.getElementById('notebook-employee');
    const employeeIdInput = document.getElementById('notebook-employee-id');
    const typeVal = document.getElementById('asset-item-type').value;
    const assignmentDateInput = document.getElementById('notebook-assignment-date');
    const returnDateInput = document.getElementById('notebook-return-date');

    if (status === 'Asignado') {
        assignmentFields.classList.remove('hidden-section');
        employeeInput.required = true;
        employeeIdInput.required = true;
        assignmentDateInput.required = true;
        returnDateInput.required = true;
        
        // Show/hide signature depending on type
        const signatureGroup = document.getElementById('signature-form-group');
        if (typeVal === 'Notebook') {
            signatureGroup.classList.remove('hidden-section');
        } else {
            signatureGroup.classList.add('hidden-section');
        }
    } else {
        assignmentFields.classList.add('hidden-section');
        employeeInput.required = false;
        employeeIdInput.required = false;
        assignmentDateInput.required = false;
        returnDateInput.required = false;
    }
};

window.saveNotebook = function(event) {
    event.preventDefault();

    const id = document.getElementById('notebook-id').value;
    const category = document.getElementById('asset-category').value;
    const itemType = document.getElementById('asset-item-type').value;
    const model = document.getElementById('notebook-model').value.trim();
    const serial = document.getElementById('notebook-serial').value.trim().toUpperCase();
    const status = document.getElementById('notebook-status').value;
    const notes = document.getElementById('notebook-notes').value.trim();
    
    const purchaseDate = document.getElementById('asset-purchase-date').value;
    const expiryDate = document.getElementById('asset-expiry-date').value;
    const purchasePrice = document.getElementById('asset-purchase-price').value;
    const ownershipType = itemType === 'Dispenser de Agua' ? document.getElementById('asset-ownership').value : 'N/A';

    const receiptData = document.getElementById('asset-receipt-data').value;
    const receiptFilename = document.getElementById('asset-receipt-filename').value;

    const employee = document.getElementById('notebook-employee').value.trim();
    const employeeId = document.getElementById('notebook-employee-id').value.trim();
    const location = document.getElementById('notebook-location').value;
    const signed = itemType === 'Notebook' ? (document.getElementById('notebook-signature').value === 'si') : true;
    const assignmentDate = document.getElementById('notebook-assignment-date').value;
    const returnDate = document.getElementById('notebook-return-date').value;

    // Checks
    if (!category || !itemType || !model || !serial || !purchaseDate || !expiryDate || !purchasePrice) {
        showToast('Por favor completa todos los campos obligatorios del activo.', 'error');
        return;
    }

    if (itemType === 'Dispenser de Agua' && !ownershipType) {
        showToast('Por favor selecciona el régimen de propiedad para el dispenser.', 'error');
        return;
    }

    if (status === 'Asignado' && (!employee || !employeeId || !assignmentDate || !returnDate)) {
        showToast('Por favor completa todos los campos obligatorios de la asignación.', 'error');
        return;
    }

    if (!id) {
        const serialExists = assets.some(a => a.serialNumber === serial);
        if (serialExists) {
            document.getElementById('serial-error').style.display = 'block';
            return;
        }
    }

    const timestamp = getFormattedTimestamp();

    if (id) {
        // Edit Mode
        const assetIndex = assets.findIndex(a => a.id === id);
        if (assetIndex !== -1) {
            const original = assets[assetIndex];
            let logDetails = [];
            let actionType = 'Edición';

            if (original.status !== status) {
                actionType = status === 'Asignado' ? 'Asignación' :
                             status === 'En Mantenimiento' ? 'Mantenimiento' :
                             status === 'Retirado' ? 'Retiro' : 'Devolución';

                if (status === 'Asignado') {
                    logDetails.push(`Asignado a ${employee} (Legajo: ${employeeId}) en ${location}. Firma: ${signed ? 'Sí' : 'No'}`);
                } else if (status === 'Disponible' && original.status === 'Asignado') {
                    logDetails.push(`Devolución de equipo. Retirado de ${original.assignedTo}`);
                } else {
                    logDetails.push(`Cambio de estado: de ${original.status} a ${status}`);
                }
            } else if (status === 'Asignado' && original.signedDeliveryPaper !== signed) {
                actionType = 'Firma Conformada';
                logDetails.push(signed ? 'Firma de papel de entrega conformada.' : 'Firma marcada como pendiente.');
            } else {
                logDetails.push('Edición de datos generales de ficha.');
            }

            // Update
            assets[assetIndex] = {
                ...original,
                brandModel: model,
                status: status,
                purchaseDate: purchaseDate,
                expiryDate: expiryDate,
                purchasePrice: purchasePrice,
                ownershipType: ownershipType,
                receiptData: receiptData,
                receiptFilename: receiptFilename,
                notes: notes,
                assignedTo: status === 'Asignado' ? employee : '',
                employeeId: status === 'Asignado' ? employeeId : '',
                assignmentLocation: status === 'Asignado' ? location : '',
                assignmentDate: status === 'Asignado' ? assignmentDate : '',
                returnDate: status === 'Asignado' ? returnDate : '',
                signedDeliveryPaper: status === 'Asignado' ? signed : true
            };

            // Log
            historyLog.push({
                id: 'h-' + Date.now(),
                notebookId: id,
                brandModel: model,
                serialNumber: original.serialNumber,
                action: actionType,
                details: logDetails.join('. '),
                timestamp: timestamp,
                status: status,
                notes: notes !== original.notes ? notes : ''
            });

            showToast(`Ficha de activo ${serial} guardada correctamente.`, 'success');
        }
    } else {
        // Add Mode
        const newId = 'ast-' + Date.now();
        const newAsset = {
            id: newId,
            category: category,
            itemType: itemType,
            brandModel: model,
            serialNumber: serial,
            status: status,
            purchaseDate: purchaseDate,
            expiryDate: expiryDate,
            purchasePrice: purchasePrice,
            ownershipType: ownershipType,
            receiptData: receiptData,
            receiptFilename: receiptFilename,
            assignedTo: status === 'Asignado' ? employee : '',
            employeeId: status === 'Asignado' ? employeeId : '',
            assignmentLocation: status === 'Asignado' ? location : '',
            assignmentDate: status === 'Asignado' ? assignmentDate : '',
            returnDate: status === 'Asignado' ? returnDate : '',
            signedDeliveryPaper: status === 'Asignado' ? signed : true,
            dateAdded: new Date().toISOString().split('T')[0],
            notes: notes
        };

        assets.push(newAsset);

        // Log
        historyLog.push({
            id: 'h-' + Date.now(),
            notebookId: newId,
            brandModel: model,
            serialNumber: serial,
            action: 'Ingreso',
            details: status === 'Asignado' ? 
                `Ingreso inicial como ASIGNADO a ${employee} (Legajo: ${employeeId}) en ${location}. Firma: ${signed ? 'Sí' : 'No'}.` : 
                `Ingreso al stock disponible.`,
            timestamp: timestamp,
            status: status,
            notes: notes
        });

        showToast(`Activo ${itemType} S/N ${serial} registrado con éxito.`, 'success');
    }

    closeNotebookModal();
    refreshUI();
};

window.deleteAsset = function(id) {
    const asset = assets.find(a => a.id === id);
    if (!asset) return;

    if (confirm(`¿Confirmas la eliminación del activo S/N ${asset.serialNumber} (${asset.brandModel})? Esta acción borrará permanentemente la ficha.`)) {
        assets = assets.filter(a => a.id !== id);

        // Log
        historyLog.push({
            id: 'h-' + Date.now(),
            notebookId: id,
            brandModel: asset.brandModel,
            serialNumber: asset.serialNumber,
            action: 'Retiro',
            details: `Eliminación manual del inventario. Estado previo: ${asset.status}`,
            timestamp: getFormattedTimestamp(),
            status: 'Retirado',
            notes: 'Ficha destruida por Administrador.'
        });

        showToast(`Activo S/N ${asset.serialNumber} eliminado del sistema.`, 'warning');
        refreshUI();
    }
};

// ----------------------------------------------------
// QUICK INTERACTIVE ACTIONS
// ----------------------------------------------------
window.openAssignModal = function(id) {
    const asset = assets.find(a => a.id === id);
    if (!asset) return;

    document.getElementById('assign-notebook-id').value = id;
    document.getElementById('assign-employee').value = '';
    document.getElementById('assign-employee-id').value = '';
    document.getElementById('assign-notes').value = '';
    
    // Set default dates
    document.getElementById('assign-date').value = new Date().toISOString().split('T')[0];
    document.getElementById('assign-return-date').value = '';
    
    // Toggle signature visibility
    const sigWrapper = document.getElementById('assign-signature-wrapper');
    if (asset.itemType === 'Notebook') {
        sigWrapper.classList.remove('hidden-section');
        document.getElementById('assign-signature').value = 'no';
    } else {
        sigWrapper.classList.add('hidden-section');
        document.getElementById('assign-signature').value = 'si';
    }

    const summaryBox = document.getElementById('assign-summary-box');
    summaryBox.innerHTML = `
        <p><strong>Tipo / Categoría:</strong> ${asset.category} - ${asset.itemType}</p>
        <p><strong>Modelo:</strong> ${asset.brandModel}</p>
        <p><strong>Número de Serie:</strong> <code>${asset.serialNumber}</code></p>
    `;

    document.getElementById('assign-modal').classList.add('active');
};

window.closeAssignModal = function() {
    document.getElementById('assign-modal').classList.remove('active');
};

window.confirmAssignment = function(event) {
    event.preventDefault();

    const id = document.getElementById('assign-notebook-id').value;
    const employee = document.getElementById('assign-employee').value.trim();
    const employeeId = document.getElementById('assign-employee-id').value.trim();
    const location = document.getElementById('assign-location').value;
    const signed = document.getElementById('assign-signature').value === 'si';
    const assignmentDate = document.getElementById('assign-date').value;
    const returnDate = document.getElementById('assign-return-date').value;
    const notes = document.getElementById('assign-notes').value.trim();

    if (!assignmentDate || !returnDate) {
        showToast('Por favor completa las fechas de entrega y devolución.', 'error');
        return;
    }

    const assetIndex = assets.findIndex(a => a.id === id);
    if (assetIndex !== -1) {
        const asset = assets[assetIndex];
        
        assets[assetIndex] = {
            ...asset,
            status: 'Asignado',
            assignedTo: employee,
            employeeId: employeeId,
            assignmentLocation: location,
            assignmentDate: assignmentDate,
            returnDate: returnDate,
            signedDeliveryPaper: signed,
            notes: notes ? (asset.notes ? asset.notes + ' | ' + notes : notes) : asset.notes
        };

        // Log
        historyLog.push({
            id: 'h-' + Date.now(),
            notebookId: id,
            brandModel: asset.brandModel,
            serialNumber: asset.serialNumber,
            action: 'Asignación',
            details: `Asignado a ${employee} (Legajo: ${employeeId}) en ${location}. Entrega: ${assignmentDate}, Devolución: ${returnDate}. Firma: ${signed ? 'Sí' : 'No'}.`,
            timestamp: getFormattedTimestamp(),
            status: 'Asignado',
            notes: notes
        });

        showToast(`Activo asignado a ${employee} correctamente.`, 'success');
        
        // Alert immediately if signature is missing
        if (asset.itemType === 'Notebook' && !signed) {
            checkUnsignedPapersAndNotify(true);
        }
    }

    closeAssignModal();
    refreshUI();
};

window.quickReturnAsset = function(id) {
    const assetIndex = assets.findIndex(a => a.id === id);
    if (assetIndex !== -1) {
        const asset = assets[assetIndex];
        const prevOwner = asset.assignedTo;

        if (confirm(`¿Confirmar devolución del activo S/N ${asset.serialNumber}? Se desvinculará de ${prevOwner} y pasará a Disponible.`)) {
            assets[assetIndex] = {
                ...asset,
                status: 'Disponible',
                assignedTo: '',
                employeeId: '',
                assignmentLocation: '',
                assignmentDate: '',
                returnDate: '',
                signedDeliveryPaper: true
            };

            // Log
            historyLog.push({
                id: 'h-' + Date.now(),
                notebookId: id,
                brandModel: asset.brandModel,
                serialNumber: asset.serialNumber,
                action: 'Devolución',
                details: `Retornado a stock disponible. Estaba asignado a ${prevOwner}.`,
                timestamp: getFormattedTimestamp(),
                status: 'Disponible'
            });

            showToast(`Activo retornado al stock disponible.`, 'success');
            refreshUI();
        }
    }
};

window.quickToggleMaintenance = function(id, direction) {
    const assetIndex = assets.findIndex(a => a.id === id);
    if (assetIndex !== -1) {
        const asset = assets[assetIndex];

        if (direction === 'to_maint') {
            assets[assetIndex] = {
                ...asset,
                status: 'En Mantenimiento',
                assignedTo: '',
                employeeId: '',
                assignmentLocation: '',
                assignmentDate: '',
                returnDate: '',
                signedDeliveryPaper: true
            };

            // Log
            historyLog.push({
                id: 'h-' + Date.now(),
                notebookId: id,
                brandModel: asset.brandModel,
                serialNumber: asset.serialNumber,
                action: 'Mantenimiento',
                details: `Enviado a servicio de reparación / mantenimiento.`,
                timestamp: getFormattedTimestamp(),
                status: 'En Mantenimiento'
            });

            showToast(`Activo S/N ${asset.serialNumber} enviado a mantenimiento.`, 'warning');
        } else if (direction === 'from_maint') {
            assets[assetIndex] = {
                ...asset,
                status: 'Disponible'
            };

            // Log
            historyLog.push({
                id: 'h-' + Date.now(),
                notebookId: id,
                brandModel: asset.brandModel,
                serialNumber: asset.serialNumber,
                action: 'Devolución',
                details: `Reincorporado desde taller técnico a stock disponible.`,
                timestamp: getFormattedTimestamp(),
                status: 'Disponible'
            });

            showToast(`Activo reincorporado a stock disponible.`, 'success');
        }

        refreshUI();
    }
};

window.quickSignNotebook = function(id) {
    const assetIndex = assets.findIndex(a => a.id === id);
    if (assetIndex !== -1) {
        const asset = assets[assetIndex];

        assets[assetIndex] = {
            ...asset,
            signedDeliveryPaper: true
        };

        // Log
        historyLog.push({
            id: 'h-' + Date.now(),
            notebookId: id,
            brandModel: asset.brandModel,
            serialNumber: asset.serialNumber,
            action: 'Firma Conformada',
            details: `Firma de papel de entrega conformada para el asesor ${asset.assignedTo}.`,
            timestamp: getFormattedTimestamp(),
            status: 'Asignado'
        });

        showToast(`Firma de entrega para ${asset.assignedTo} registrada correctamente.`, 'success');
        refreshUI();
    }
};

// ----------------------------------------------------
// DETAILED VIEW FOR SINGLE ASSET CARD
// ----------------------------------------------------
window.viewAssetDetails = function(id) {
    const asset = assets.find(a => a.id === id);
    if (!asset) return;

    const relatedLogs = historyLog
        .filter(log => log.notebookId === id)
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    let logsHtml = '';
    if (relatedLogs.length === 0) {
        logsHtml = '<p class="text-muted">No hay historial específico para este activo.</p>';
    } else {
        logsHtml = '<div style="max-height:160px; overflow-y:auto; padding-right:5px; display:flex; flex-direction:column; gap:8px;">';
        relatedLogs.forEach(log => {
            logsHtml += `
                <div style="background:rgba(255,255,255,0.02); padding:8px 12px; border-radius:6px; border:1px solid rgba(255,255,255,0.03); font-size:0.8rem;">
                    <div style="display:flex; justify-content:space-between; margin-bottom:4px; font-weight:600;">
                        <span>${log.action}</span>
                        <span style="color:var(--text-muted); font-size:0.75rem;">${log.timestamp}</span>
                    </div>
                    <div>${log.details}</div>
                </div>
            `;
        });
        logsHtml += '</div>';
    }

    const body = document.getElementById('notebook-details-view-body');
    
    // Format detail fields
    let categoryHtml = `
        <div class="details-item">
            <span class="details-label">Categoría</span>
            <span class="details-value">${asset.category}</span>
        </div>
        <div class="details-item">
            <span class="details-label">Tipo de Activo</span>
            <span class="details-value" style="font-weight:600; color:#fff;">${asset.itemType}</span>
        </div>
    `;

    let traceHtml = `
        <div class="details-item">
            <span class="details-label">Fecha de Compra</span>
            <span class="details-value">${asset.purchaseDate || 'No registrada'}</span>
        </div>
        <div class="details-item">
            <span class="details-label">Precio Referencia</span>
            <span class="details-value">${asset.purchasePrice ? `$${asset.purchasePrice}` : 'No registrado'}</span>
        </div>
        <div class="details-item">
            <span class="details-label">Fecha Caducidad / Vida Útil</span>
            <span class="details-value" style="${isNearExpiry(asset.expiryDate) ? 'color:var(--danger); font-weight:600;' : ''}">${asset.expiryDate || 'No caduca'}</span>
        </div>
        <div class="details-item">
            <span class="details-label">Régimen Propiedad</span>
            <span class="details-value">${asset.ownershipType && asset.ownershipType !== 'N/A' ? asset.ownershipType : 'Propio (Corporativo)'}</span>
        </div>
    `;

    let assignHtml = '';
    if (asset.status === 'Asignado') {
        assignHtml = `
            <div class="details-item">
                <span class="details-label">Empleado Asignado</span>
                <span class="details-value" style="color:var(--info); font-weight:600;">${asset.assignedTo}</span>
            </div>
            <div class="details-item">
                <span class="details-label">Número de Legajo</span>
                <span class="details-value"><code>${asset.employeeId}</code></span>
            </div>
            <div class="details-item">
                <span class="details-label">Ubicación / Modalidad</span>
                <span class="details-value">${asset.assignmentLocation}</span>
            </div>
            <div class="details-item">
                <span class="details-label">Fecha de Entrega</span>
                <span class="details-value">${asset.assignmentDate || '-'}</span>
            </div>
            <div class="details-item">
                <span class="details-label">Fecha de Devolución</span>
                <span class="details-value" style="${isOverdue(asset.returnDate) ? 'color:var(--danger); font-weight:600;' : ''}">${asset.returnDate || '-'}</span>
            </div>
        `;
        if (asset.itemType === 'Notebook') {
            assignHtml += `
                <div class="details-item">
                    <span class="details-label">Papel de Entrega Firmado</span>
                    <span class="details-value">
                        ${asset.signedDeliveryPaper ? 
                            '<span class="badge-sig firmado"><i data-lucide="check" style="width:10px; height:10px;"></i> Sí, firmado</span>' : 
                            '<span class="badge-sig pendiente"><i data-lucide="clock" style="width:10px; height:10px;"></i> No, firma PENDIENTE</span>'
                        }
                    </span>
                </div>
            `;
        } else {
            assignHtml += `<div class="details-item"></div>`;
        }
    }

    body.innerHTML = `
        <div class="details-grid">
            ${categoryHtml}
            <div class="details-item">
                <span class="details-label">Marca / Modelo</span>
                <span class="details-value" style="font-weight:600; color:#fff;">${asset.brandModel}</span>
            </div>
            <div class="details-item">
                <span class="details-label">Nº Serie / Código</span>
                <span class="details-value"><code>${asset.serialNumber}</code></span>
            </div>
            <div class="details-item">
                <span class="details-label">Estado de Stock</span>
                <span class="details-value">
                    <span class="badge ${asset.status === 'Disponible' ? 'disponible' : asset.status === 'Asignado' ? 'asignado' : asset.status === 'En Mantenimiento' ? 'mantenimiento' : 'retirado'}">
                        ${asset.status}
                    </span>
                </span>
            </div>
            <div class="details-item">
                <span class="details-label">Fecha Registro en Sistema</span>
                <span class="details-value">${asset.dateAdded}</span>
            </div>
            
            <div class="details-full" style="border-top:1px dashed var(--border-color); margin:5px 0;"></div>
            
            ${traceHtml}
            
            ${assignHtml ? `
                <div class="details-full" style="border-top:1px dashed var(--border-color); margin:5px 0;"></div>
                ${assignHtml}
            ` : ''}

            ${asset.receiptData ? `
                <div class="details-full" style="border-top:1px dashed var(--border-color); margin:5px 0;"></div>
                <div class="details-item details-full">
                    <span class="details-label">Comprobante de Compra</span>
                    <div style="display:flex; align-items:center; gap:10px; margin-top:5px;">
                        <button class="btn btn-secondary" onclick="viewReceipt('${asset.id}')" style="padding: 8px 14px; font-size:0.8rem; display:inline-flex; align-items:center; gap:6px;">
                            <i data-lucide="file-text" style="width:14px; height:14px; color:var(--info);"></i>
                            <span>Ver Recibo (${asset.receiptFilename || 'Documento'})</span>
                        </button>
                    </div>
                </div>
            ` : ''}

            <div class="details-item details-full">
                <span class="details-label">Observaciones y Notas Generales</span>
                <textarea readonly rows="2">${asset.notes || 'Sin observaciones registradas.'}</textarea>
            </div>
        </div>
        <div style="margin-top:15px; border-top: 1px solid var(--border-color); padding-top:12px;">
            <h4 style="font-size:0.8rem; font-weight:600; color:var(--primary); margin-bottom:8px; text-transform:uppercase; letter-spacing:0.5px;">Auditoría del Activo</h4>
            ${logsHtml}
        </div>
    `;

    document.getElementById('details-modal').classList.add('active');
    lucide.createIcons();
};

window.closeDetailsModal = function() {
    document.getElementById('details-modal').classList.remove('active');
};

// ----------------------------------------------------
// IMPORT & EXPORT LOGIC
// ----------------------------------------------------
window.exportCSV = function() {
    if (assets.length === 0) {
        showToast('No hay datos para exportar.', 'warning');
        return;
    }

    let csvContent = '\uFEFF'; // UTF-8 BOM
    csvContent += 'Categoría,Tipo de Activo,Marca/Modelo,Número de Serie/ID,Estado,Empleado Asignado,Número Legajo,Modalidad,Fecha Entrega,Fecha Devolución,Firma Papel,Fecha Compra,Fecha Caducidad,Precio,Régimen Dispenser,Fecha Registro,Notas\r\n';

    assets.forEach(a => {
        const row = [
            `"${a.category}"`,
            `"${a.itemType}"`,
            `"${a.brandModel.replace(/"/g, '""')}"`,
            `"${a.serialNumber.replace(/"/g, '""')}"`,
            `"${a.status}"`,
            `"${(a.assignedTo || '').replace(/"/g, '""')}"`,
            `"${(a.employeeId || '').replace(/"/g, '""')}"`,
            `"${(a.assignmentLocation || '')}"`,
            `"${(a.assignmentDate || '')}"`,
            `"${(a.returnDate || '')}"`,
            `"${(a.itemType === 'Notebook' ? (a.signedDeliveryPaper ? 'Sí' : 'No') : 'N/A')}"`,
            `"${(a.purchaseDate || '')}"`,
            `"${(a.expiryDate || '')}"`,
            `"${(a.purchasePrice || '')}"`,
            `"${(a.itemType === 'Dispenser de Agua' ? a.ownershipType : 'N/A')}"`,
            `"${a.dateAdded}"`,
            `"${(a.notes || '').replace(/"/g, '""').replace(/\r?\n/g, ' ')}"`
        ];
        csvContent += row.join(',') + '\r\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    const dateStr = new Date().toISOString().split('T')[0];
    link.setAttribute('href', url);
    link.setAttribute('download', `inventario_activos_it_${dateStr}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Exportación CSV completada con éxito.', 'success');
};

window.exportData = function() {
    const dataToExport = {
        app: 'ITAssetStockManagerPro',
        exportDate: new Date().toISOString(),
        assets: assets,
        historyLog: historyLog
    };

    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    const dateStr = new Date().toISOString().split('T')[0];
    link.setAttribute('href', url);
    link.setAttribute('download', `backup_itassets_${dateStr}.json`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Copia de seguridad del sistema descargada.', 'success');
};

window.importData = function(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const imported = JSON.parse(e.target.result);
            
            // Check compatibility
            if ((imported.app !== 'ITAssetStockManagerPro' && imported.app !== 'ITStockManager') || !Array.isArray(imported.historyLog)) {
                showToast('Formato de archivo de respaldo inválido.', 'error');
                return;
            }

            // Normalise legacy objects
            let normalizedAssets = [];
            if (imported.notebooks) {
                // Legacy support
                normalizedAssets = imported.notebooks.map(nb => {
                    return {
                        id: nb.id,
                        category: 'Tecnología e Informática',
                        itemType: 'Notebook',
                        brandModel: nb.brandModel,
                        serialNumber: nb.serialNumber,
                        status: nb.status,
                        purchaseDate: '',
                        expiryDate: '',
                        purchasePrice: '',
                        ownershipType: 'N/A',
                        assignedTo: nb.assignedTo || '',
                        employeeId: nb.employeeId || '',
                        assignmentLocation: 'Call Center',
                        signedDeliveryPaper: true,
                        dateAdded: nb.dateAdded || new Date().toISOString().split('T')[0],
                        notes: nb.notes || ''
                    };
                });
            } else if (imported.assets) {
                normalizedAssets = imported.assets;
            }

            if (confirm(`Se importarán ${normalizedAssets.length} activos y ${imported.historyLog.length} registros del historial. ¿Deseas sobreescribir el stock actual?`)) {
                assets = normalizedAssets;
                historyLog = imported.historyLog;
                
                showToast('Importación del sistema completada.', 'success');
                refreshUI();
            }
        } catch (err) {
            showToast('Error al procesar el archivo JSON.', 'error');
        }
    };
    reader.readAsText(file);
    event.target.value = '';
};

// ----------------------------------------------------
// GENERAL UTILITIES
// ----------------------------------------------------
function getFormattedTimestamp() {
    const now = new Date();
    const pad = (n) => n.toString().padStart(2, '0');
    
    const date = now.getFullYear() + '-' + pad(now.getMonth() + 1) + '-' + pad(now.getDate());
    const time = pad(now.getHours()) + ':' + pad(now.getMinutes()) + ':' + pad(now.getSeconds());
    
    return date + ' ' + time;
}

function formatDateFriendly(timestampStr) {
    try {
        const parts = timestampStr.split(' ');
        const dateParts = parts[0].split('-');
        const timeParts = parts[1].split(':');
        
        const date = new Date(dateParts[0], dateParts[1] - 1, dateParts[2], timeParts[0], timeParts[1], timeParts[2]);
        const now = new Date();
        
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        
        if (diffMins < 1) return 'Hace unos instantes';
        if (diffMins < 60) return `Hace ${diffMins} min`;
        
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `Hace ${diffHours} h`;
        
        return `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
    } catch(e) {
        return timestampStr;
    }
}

// ----------------------------------------------------
// PURCHASE RECEIPT FILE UPLOADER & VIEWER
// ----------------------------------------------------
window.handleReceiptUpload = function(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 1024 * 1024) { // 1MB warning
        showToast('El archivo excede 1MB. Se guardará, pero se recomienda usar un archivo más ligero para optimizar el espacio local.', 'warning');
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        document.getElementById('asset-receipt-data').value = e.target.result;
        document.getElementById('asset-receipt-filename').value = file.name;
        
        // Show preview info
        document.getElementById('receipt-preview-name').textContent = file.name;
        document.getElementById('receipt-preview-container').classList.remove('hidden-section');
    };
    reader.readAsDataURL(file);
};

window.removeReceipt = function() {
    document.getElementById('asset-receipt').value = '';
    document.getElementById('asset-receipt-data').value = '';
    document.getElementById('asset-receipt-filename').value = '';
    document.getElementById('receipt-preview-container').classList.add('hidden-section');
};

window.viewReceipt = function(id) {
    const asset = assets.find(a => a.id === id);
    if (!asset || !asset.receiptData) return;
    
    // Create blob from Base64 to bypass browser data-uri blocks
    try {
        const base64Parts = asset.receiptData.split(',');
        const mime = base64Parts[0].match(/:(.*?);/)[1];
        const raw = window.atob(base64Parts[1]);
        const rawLength = raw.length;
        const uInt8Array = new Uint8Array(rawLength);
        
        for (let i = 0; i < rawLength; ++i) {
            uInt8Array[i] = raw.charCodeAt(i);
        }
        
        const blob = new Blob([uInt8Array], { type: mime });
        const blobUrl = URL.createObjectURL(blob);
        
        const newTab = window.open();
        if (newTab) {
            newTab.document.write(`
                <!DOCTYPE html>
                <html lang="es">
                <head>
                    <title>Comprobante de Compra - ${asset.brandModel}</title>
                    <style>
                        body { margin: 0; background: #0a0e17; display: flex; justify-content: center; align-items: center; height: 100vh; font-family: sans-serif; color: #fff; overflow:hidden;}
                        iframe, img { width: 100%; height: 100%; border: none; object-fit: contain; }
                        .no-preview { text-align: center; }
                        .no-preview a { color: #6366f1; text-decoration: none; font-weight: bold; border: 1px solid #6366f1; padding: 10px 20px; border-radius: 6px; display: inline-block; margin-top: 15px; }
                    </style>
                </head>
                <body>
                    ${mime.includes('pdf') 
                        ? `<iframe src="${blobUrl}"></iframe>`
                        : mime.includes('image')
                            ? `<img src="${blobUrl}" alt="Comprobante">`
                            : `<div class="no-preview">
                                <p>Este tipo de archivo no admite vista previa directa.</p>
                                <a href="${blobUrl}" download="${asset.receiptFilename || 'recibo'}">Descargar Archivo</a>
                               </div>`
                    }
                </body>
                </html>
            `);
        } else {
            // download fallback
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = asset.receiptFilename || 'recibo';
            link.click();
        }
    } catch(err) {
        showToast("Error al decodificar el archivo comprobante.", "error");
    }
};

// ====================================================
// NOTIFICATION DROPDOWN CONTROLLER & RENDERER
// ====================================================
window.toggleNotificationDropdown = function(event) {
    if (event) event.stopPropagation();
    const menu = document.getElementById('notification-dropdown-menu');
    if (menu) {
        menu.classList.toggle('hidden-section');
    }
};

window.renderNotificationsDropdown = function() {
    const listContainer = document.getElementById('notification-dropdown-list');
    const counter = document.getElementById('notification-counter');
    const headerCount = document.getElementById('notification-header-count');
    if (!listContainer) return;

    listContainer.innerHTML = '';

    // 1. Overdue Returns
    const overdueAssignments = assets.filter(a => a.status === 'Asignado' && isOverdue(a.returnDate));

    // 2. Unsigned Notebooks
    const unsignedNotebooks = assets.filter(a => 
        a.status === 'Asignado' && 
        a.itemType === 'Notebook' && 
        a.signedDeliveryPaper === false
    );

    // 3. Due Today Returns
    const todayAssignments = assets.filter(a => a.status === 'Asignado' && isDueToday(a.returnDate));

    // 4. Expiring Assets (under 60 days)
    const today = new Date();
    const expiringAssets = assets.filter(a => {
        if (!a.expiryDate) return false;
        const expiry = new Date(a.expiryDate);
        const diffTime = expiry - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays >= 0 && diffDays <= 60;
    });

    const totalAlerts = unsignedNotebooks.length + overdueAssignments.length + todayAssignments.length + expiringAssets.length;

    // Update Counter Badge
    if (totalAlerts > 0) {
        counter.textContent = totalAlerts;
        counter.classList.remove('hidden-section');
        counter.classList.add('pulse');
    } else {
        counter.textContent = '0';
        counter.classList.add('hidden-section');
        counter.classList.remove('pulse');
    }

    // Update Header Count Text
    headerCount.textContent = `${totalAlerts} ${totalAlerts === 1 ? 'pendiente' : 'pendientes'}`;

    if (totalAlerts === 0) {
        listContainer.innerHTML = `
            <div class="notification-empty-state">
                <div class="notification-empty-icon">
                    <i data-lucide="shield-check" style="width:20px; height:20px;"></i>
                </div>
                <span class="notification-empty-text">No hay alertas pendientes</span>
            </div>
        `;
        lucide.createIcons();
        return;
    }

    // Helper to add card to dropdown list
    const appendCard = (title, desc, icon, isCritical, actionBtnHtml = '') => {
        const card = document.createElement('div');
        card.className = `notification-item-card ${isCritical ? 'critical' : 'warning-alert'}`;
        card.innerHTML = `
            <div class="notification-item-card-header">
                <div class="notification-item-icon ${isCritical ? 'critical' : 'warning-alert'}">
                    <i data-lucide="${icon}" style="width:14px; height:14px;"></i>
                </div>
                <div class="notification-item-content">
                    <div class="notification-item-title">${title}</div>
                    <div class="notification-item-desc">${desc}</div>
                </div>
            </div>
            ${actionBtnHtml ? `<div class="notification-item-actions">${actionBtnHtml}</div>` : ''}
        `;
        listContainer.appendChild(card);
    };

    // Render Overdue Alerts (Critical)
    overdueAssignments.forEach(a => {
        const actionHtml = `
            <button class="btn btn-secondary btn-mini" onclick="quickReturnAsset('${a.id}')">
                <i data-lucide="user-minus" style="width:11px; height:11px;"></i> Devolver
            </button>
        `;
        appendCard(
            'Devolución Vencida',
            `El asesor <strong>${a.assignedTo}</strong> (Legajo: <code>${a.employeeId}</code>) retiene el activo <strong>${a.brandModel} (${a.itemType})</strong>. Plazo venció el <strong>${a.returnDate}</strong>.`,
            'calendar-x',
            true,
            actionHtml
        );
    });

    // Render Unsigned Notebooks (Critical)
    unsignedNotebooks.forEach(nb => {
        const actionHtml = `
            <button class="btn btn-secondary btn-mini" onclick="quickSignNotebook('${nb.id}')">
                <i data-lucide="file-signature" style="width:11px; height:11px; color:var(--success);"></i> Registrar Firma
            </button>
        `;
        appendCard(
            'Firma de Entrega Pendiente',
            `El asesor <strong>${nb.assignedTo}</strong> (Legajo: <code>${nb.employeeId}</code>) no firmó la entrega de la notebook <strong>${nb.brandModel}</strong>.`,
            'shield-alert',
            true,
            actionHtml
        );
    });

    // Render Due Today (Warning)
    todayAssignments.forEach(a => {
        const actionHtml = `
            <button class="btn btn-secondary btn-mini" onclick="quickReturnAsset('${a.id}')">
                <i data-lucide="user-minus" style="width:11px; height:11px;"></i> Devolver
            </button>
        `;
        appendCard(
            'Devolución para Hoy',
            `Hoy vence la devolución de <strong>${a.brandModel} (${a.itemType})</strong> en posesión de <strong>${a.assignedTo}</strong> (Legajo: <code>${a.employeeId}</code>).`,
            'bell',
            false,
            actionHtml
        );
    });

    // Render Expiring Assets (Warning)
    expiringAssets.forEach(a => {
        const actionHtml = `
            <button class="btn btn-secondary btn-mini" onclick="openNotebookModal('${a.id}')">
                <i data-lucide="edit-3" style="width:11px; height:11px;"></i> Actualizar Ficha
            </button>
        `;
        const expiry = new Date(a.expiryDate);
        const diffTime = expiry - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        appendCard(
            'Activo Próximo a Vencer',
            `El activo <strong>${a.brandModel} (${a.itemType})</strong> caduca el <strong>${a.expiryDate}</strong> (en ${diffDays} días).`,
            'alert-triangle',
            false,
            actionHtml
        );
    });

    lucide.createIcons();
};
