-- ====================================================
-- ESQUEMA DE BASE DE DATOS - IT ASSET STOCKMANAGER
-- ====================================================

CREATE DATABASE IF NOT EXISTS it_asset_manager;
USE it_asset_manager;

-- 1. Tabla de Activos de IT e Infraestructura
CREATE TABLE IF NOT EXISTS assets (
    id VARCHAR(50) PRIMARY KEY,
    category VARCHAR(100) NOT NULL,
    item_type VARCHAR(100) NOT NULL,
    brand_model VARCHAR(255) NOT NULL,
    serial_number VARCHAR(100) NOT NULL UNIQUE,
    status VARCHAR(50) NOT NULL DEFAULT 'Disponible',
    purchase_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    purchase_price DECIMAL(10, 2) NOT NULL,
    ownership_type VARCHAR(50) NOT NULL DEFAULT 'N/A',
    receipt_data LONGTEXT NULL, -- Almacena Base64 de comprobantes (Imagen / PDF)
    receipt_filename VARCHAR(255) NULL,
    assigned_to VARCHAR(255) NULL,
    employee_id VARCHAR(50) NULL,
    assignment_location VARCHAR(100) NULL,
    assignment_date DATE NULL,
    return_date DATE NULL,
    signed_delivery_paper BOOLEAN NOT NULL DEFAULT TRUE,
    date_added DATE NOT NULL,
    notes TEXT NULL,
    INDEX idx_serial (serial_number),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Tabla de Historial / Auditoría de Movimientos
CREATE TABLE IF NOT EXISTS history_log (
    id VARCHAR(50) PRIMARY KEY,
    asset_id VARCHAR(50) NULL,
    brand_model VARCHAR(255) NOT NULL,
    serial_number VARCHAR(100) NOT NULL,
    action VARCHAR(100) NOT NULL,
    details TEXT NOT NULL,
    timestamp DATETIME NOT NULL,
    status VARCHAR(50) NOT NULL,
    notes TEXT NULL,
    FOREIGN KEY (asset_id) REFERENCES assets(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ====================================================
-- INSERCIÓN DE DATOS DE DEMOSTRACIÓN (OPCIONAL)
-- ====================================================
-- Nota: Si las tablas ya contienen registros, ignore estas inserciones para evitar duplicados.

INSERT IGNORE INTO assets 
(id, category, item_type, brand_model, serial_number, status, purchase_date, expiry_date, purchase_price, ownership_type, receipt_data, receipt_filename, assigned_to, employee_id, assignment_location, assignment_date, return_date, signed_delivery_paper, date_added, notes) 
VALUES
('ast-1', 'Tecnología e Informática', 'Notebook', 'Lenovo V330', 'MP16X8A9', 'Disponible', '2025-02-10', '2028-02-10', 480.00, 'N/A', NULL, NULL, '', '', '', NULL, NULL, TRUE, '2026-05-10', 'Equipo base. Cargador y funda original.'),
('ast-2', 'Tecnología e Informática', 'Notebook', 'Lenovo V330', 'MP18B7C2', 'Asignado', '2025-02-10', '2028-02-10', 480.00, 'N/A', NULL, NULL, 'Carlos Giménez', 'LEG-8831', 'Home Office', '2026-05-12', '2026-05-20', FALSE, '2026-05-12', 'Entregado con mochila. Tiene detalle estético menor en bisagra.'),
('ast-3', 'Tecnología e Informática', 'Notebook', 'Lenovo ThinkPad L14', 'PF39X0A1', 'Asignado', '2025-06-15', '2029-06-15', 850.00, 'N/A', NULL, NULL, 'Sofía Rodríguez', 'LEG-9012', 'Call Center / Home Office', '2026-05-15', '2026-05-27', TRUE, '2026-05-15', 'Uso en desarrollo. Licencias corporativas cargadas.'),
('ast-4', 'Electrodomésticos', 'Dispenser de Agua', 'Ivess Termocompresor', 'DISP-IV-002', 'Disponible', '2026-01-05', '2028-01-05', 30.00, 'Alquilado', NULL, NULL, '', '', '', NULL, NULL, TRUE, '2026-05-05', 'Contrato de comodato trimestral con IVESS.'),
('ast-5', 'Mobiliario e Infraestructura', 'Aire acondicionado', 'BGH Silent Air 4500 frigorías', 'AC-BGH-504', 'Disponible', '2024-11-20', '2030-11-20', 720.00, 'N/A', NULL, NULL, '', '', '', NULL, NULL, TRUE, '2026-05-01', 'Instalado en Sala de Operaciones Principal.'),
('ast-6', 'Componentes y Accesorios', 'SSD', 'Kingston A400 480GB', 'SSD-KG-480-12', 'Disponible', '2026-04-10', '2031-04-10', 45.00, 'N/A', NULL, NULL, '', '', '', NULL, NULL, TRUE, '2026-05-20', 'En stock de soporte para recambios de hardware.'),
('ast-7', 'Mobiliario e Infraestructura', 'Matafuegos', 'Georgia Co2 5kg', 'MF-GEO-994', 'Disponible', '2025-06-25', '2026-06-25', 90.00, 'N/A', NULL, NULL, '', '', '', NULL, NULL, TRUE, '2026-05-02', 'Próxima recarga requerida antes de caducidad.'),
('ast-8', 'Tecnología e Informática', 'Celular', 'Samsung Galaxy A54', 'IMEI-3589410-09', 'Asignado', '2025-08-01', '2028-08-01', 380.00, 'N/A', NULL, NULL, 'Carlos Giménez', 'LEG-8831', 'Home Office', '2026-05-12', '2026-11-12', TRUE, '2026-05-12', 'Línea corporativa asignada.');

INSERT IGNORE INTO history_log 
(id, asset_id, brand_model, serial_number, action, details, timestamp, status, notes) 
VALUES
('h-1', 'ast-1', 'Lenovo V330', 'MP16X8A9', 'Ingreso', 'Registro de notebook en stock disponible.', '2026-05-10 09:30:15', 'Disponible', 'Cargador y funda original.'),
('h-2', 'ast-2', 'Lenovo V330', 'MP18B7C2', 'Asignación', 'Asignado a Carlos Giménez (Legajo: LEG-8831) en Home Office. Firma Pendiente.', '2026-05-12 14:15:22', 'Asignado', 'Entregado con mochila.'),
('h-3', 'ast-4', 'Ivess Termocompresor', 'DISP-IV-002', 'Ingreso', 'Ingreso de dispenser de agua en carácter de Alquilado/Comodato.', '2026-05-05 10:00:00', 'Disponible', 'Contrato comodato.'),
('h-4', 'ast-7', 'Georgia Co2 5kg', 'MF-GEO-994', 'Ingreso', 'Ingreso de matafuegos con caducidad de oblea anual.', '2026-05-02 11:20:00', 'Disponible', 'Oblea anual.');
