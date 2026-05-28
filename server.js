const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware configurations
app.use(cors());
// Set large limits for base64 PDF and image uploads (receipts)
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ limit: '15mb', extended: true }));

// Serve static frontend files from the workspace directory
app.use(express.static(__dirname));

// Database connection pool setup
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'it_asset_manager',
    port: parseInt(process.env.DB_PORT || '3306'),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Verify MySQL connection pool at startup
(async () => {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Conexión exitosa a la base de datos MySQL.');
        connection.release();
    } catch (err) {
        console.error('❌ Error crítico al conectar a la base de datos MySQL:', err.message);
        console.log('Por favor, asegúrate de que MySQL esté activo, de que creaste la base de datos con "schema.sql" y que las credenciales en ".env" sean correctas.');
    }
})();

// Helper to format ISO dates to YYYY-MM-DD safely
function formatDate(d) {
    if (!d) return '';
    try {
        const dateObj = new Date(d);
        if (isNaN(dateObj.getTime())) return '';
        const offset = dateObj.getTimezoneOffset();
        const localDate = new Date(dateObj.getTime() - (offset * 60 * 1000));
        return localDate.toISOString().split('T')[0];
    } catch (e) {
        return '';
    }
}

// Helper to format DATETIME to YYYY-MM-DD HH:mm:ss
function formatDateTime(dt) {
    if (!dt) return '';
    try {
        const dateObj = new Date(dt);
        if (isNaN(dateObj.getTime())) return '';
        const pad = (n) => n.toString().padStart(2, '0');
        const d = dateObj.getFullYear() + '-' + pad(dateObj.getMonth() + 1) + '-' + pad(dateObj.getDate());
        const t = pad(dateObj.getHours()) + ':' + pad(dateObj.getMinutes()) + ':' + pad(dateObj.getSeconds());
        return d + ' ' + t;
    } catch (e) {
        return dt;
    }
}

// Helper to translate MySQL database rows to frontend Asset models
function mapRowToAsset(row) {
    return {
        id: row.id,
        category: row.category,
        itemType: row.item_type,
        brandModel: row.brand_model,
        serialNumber: row.serial_number,
        status: row.status,
        purchaseDate: formatDate(row.purchase_date),
        expiryDate: formatDate(row.expiry_date),
        purchasePrice: row.purchase_price ? String(row.purchase_price) : '',
        ownershipType: row.ownership_type,
        receiptData: row.receipt_data || '',
        receiptFilename: row.receipt_filename || '',
        assignedTo: row.assigned_to || '',
        employeeId: row.employee_id || '',
        assignmentLocation: row.assignment_location || '',
        assignmentDate: formatDate(row.assignment_date),
        returnDate: formatDate(row.return_date),
        signedDeliveryPaper: row.signed_delivery_paper === 1,
        dateAdded: formatDate(row.date_added),
        notes: row.notes || ''
    };
}

// Helper to translate MySQL history rows to frontend History models
function mapRowToHistory(row) {
    return {
        id: row.id,
        notebookId: row.asset_id,
        brandModel: row.brand_model,
        serialNumber: row.serial_number,
        action: row.action,
        details: row.details,
        timestamp: formatDateTime(row.timestamp),
        status: row.status,
        notes: row.notes || ''
    };
}

// ====================================================
// ENDPOINTS - ACTIVOS
// ====================================================

// 1. GET: Listar todos los activos
app.get('/api/assets', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM assets');
        const mappedAssets = rows.map(mapRowToAsset);
        res.json(mappedAssets);
    } catch (err) {
        console.error('Error en GET /api/assets:', err);
        res.status(500).json({ error: 'Error al obtener los activos desde MySQL.' });
    }
});

// 2. GET: Obtener un activo específico por ID
app.get('/api/assets/:id', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM assets WHERE id = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Activo no encontrado.' });
        }
        res.json(mapRowToAsset(rows[0]));
    } catch (err) {
        console.error('Error en GET /api/assets/:id:', err);
        res.status(500).json({ error: 'Error al obtener el activo.' });
    }
});

// 3. POST: Crear un nuevo activo (validando duplicados de S/N)
app.post('/api/assets', async (req, res) => {
    const a = req.body;
    try {
        // Validar número de serie único
        const [existing] = await pool.query('SELECT id FROM assets WHERE serial_number = ?', [a.serialNumber]);
        if (existing.length > 0) {
            return res.status(400).json({ error: 'El número de serie ya está registrado en el sistema.' });
        }

        const query = `
            INSERT INTO assets 
            (id, category, item_type, brand_model, serial_number, status, purchase_date, expiry_date, purchase_price, 
             ownership_type, receipt_data, receipt_filename, assigned_to, employee_id, assignment_location, 
             assignment_date, return_date, signed_delivery_paper, date_added, notes)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            a.id,
            a.category,
            a.itemType,
            a.brandModel,
            a.serialNumber,
            a.status,
            a.purchaseDate || null,
            a.expiryDate || null,
            a.purchasePrice ? parseFloat(a.purchasePrice) : 0,
            a.ownershipType || 'N/A',
            a.receiptData || null,
            a.receiptFilename || null,
            a.assignedTo || null,
            a.employeeId || null,
            a.assignmentLocation || null,
            a.assignmentDate || null,
            a.returnDate || null,
            a.signedDeliveryPaper ? 1 : 0,
            a.dateAdded || formatDate(new Date()),
            a.notes || null
        ];

        await pool.query(query, values);
        res.status(201).json({ message: 'Activo creado con éxito.', id: a.id });
    } catch (err) {
        console.error('Error en POST /api/assets:', err);
        res.status(500).json({ error: 'Error al registrar el activo en MySQL.' });
    }
});

// 4. PUT: Editar un activo por ID
app.put('/api/assets/:id', async (req, res) => {
    const a = req.body;
    const { id } = req.params;
    try {
        const query = `
            UPDATE assets SET 
            brand_model = ?, 
            status = ?, 
            purchase_date = ?, 
            expiry_date = ?, 
            purchase_price = ?, 
            ownership_type = ?, 
            receipt_data = ?, 
            receipt_filename = ?, 
            notes = ?, 
            assigned_to = ?, 
            employee_id = ?, 
            assignment_location = ?, 
            assignment_date = ?, 
            return_date = ?, 
            signed_delivery_paper = ?
            WHERE id = ?
        `;

        const values = [
            a.brandModel,
            a.status,
            a.purchaseDate || null,
            a.expiryDate || null,
            a.purchasePrice ? parseFloat(a.purchasePrice) : 0,
            a.ownershipType || 'N/A',
            a.receiptData || null,
            a.receiptFilename || null,
            a.notes || null,
            a.status === 'Asignado' ? a.assignedTo : null,
            a.status === 'Asignado' ? a.employeeId : null,
            a.status === 'Asignado' ? a.assignmentLocation : null,
            a.status === 'Asignado' ? a.assignmentDate : null,
            a.status === 'Asignado' ? a.returnDate : null,
            a.status === 'Asignado' ? (a.signedDeliveryPaper ? 1 : 0) : 1, // Default true if unassigned
            id
        ];

        const [result] = await pool.query(query, values);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Activo no encontrado para editar.' });
        }
        res.json({ message: 'Activo actualizado correctamente.' });
    } catch (err) {
        console.error('Error en PUT /api/assets/:id:', err);
        res.status(500).json({ error: 'Error al actualizar el activo en MySQL.' });
    }
});

// 5. DELETE: Eliminar un activo por ID
app.delete('/api/assets/:id', async (req, res) => {
    try {
        const [result] = await pool.query('DELETE FROM assets WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Activo no encontrado para eliminar.' });
        }
        res.json({ message: 'Activo eliminado correctamente del sistema.' });
    } catch (err) {
        console.error('Error en DELETE /api/assets/:id:', err);
        res.status(500).json({ error: 'Error al eliminar el activo de MySQL.' });
    }
});

// ====================================================
// ENDPOINTS - HISTORIAL / AUDITORÍA
// ====================================================

// 1. GET: Obtener todo el historial de auditoría
app.get('/api/history', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM history_log ORDER BY timestamp DESC');
        const mappedHistory = rows.map(mapRowToHistory);
        res.json(mappedHistory);
    } catch (err) {
        console.error('Error en GET /api/history:', err);
        res.status(500).json({ error: 'Error al obtener el historial desde MySQL.' });
    }
});

// 2. POST: Insertar un registro en el historial
app.post('/api/history', async (req, res) => {
    const h = req.body;
    try {
        const query = `
            INSERT INTO history_log 
            (id, asset_id, brand_model, serial_number, action, details, timestamp, status, notes)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            h.id,
            h.notebookId || null,
            h.brandModel,
            h.serialNumber,
            h.action,
            h.details,
            h.timestamp || new Date(),
            h.status,
            h.notes || null
        ];

        await pool.query(query, values);
        res.status(201).json({ message: 'Historial guardado con éxito.' });
    } catch (err) {
        console.error('Error en POST /api/history:', err);
        res.status(500).json({ error: 'Error al registrar el historial en MySQL.' });
    }
});

// 3. DELETE: Vaciar todo el historial de auditoría
app.delete('/api/history', async (req, res) => {
    try {
        await pool.query('DELETE FROM history_log');
        res.json({ message: 'Historial de auditoría borrado con éxito.' });
    } catch (err) {
        console.error('Error en DELETE /api/history:', err);
        res.status(500).json({ error: 'Error al vaciar el historial de auditoría en MySQL.' });
    }
});

// 4. POST: Importación por lotes de respaldo completo (Transaccional)
app.post('/api/import', async (req, res) => {
    const { assets, historyLog } = req.body;
    if (!Array.isArray(assets) || !Array.isArray(historyLog)) {
        return res.status(400).json({ error: 'Datos de importación inválidos.' });
    }
    
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        
        // Deshabilitar temporalmente restricciones de clave foránea para el truncate
        await connection.query('SET FOREIGN_KEY_CHECKS = 0');
        await connection.query('TRUNCATE TABLE history_log');
        await connection.query('TRUNCATE TABLE assets');
        await connection.query('SET FOREIGN_KEY_CHECKS = 1');
        
        // Insertar Activos
        if (assets.length > 0) {
            const assetQuery = `
                INSERT INTO assets 
                (id, category, item_type, brand_model, serial_number, status, purchase_date, expiry_date, purchase_price, 
                 ownership_type, receipt_data, receipt_filename, assigned_to, employee_id, assignment_location, 
                 assignment_date, return_date, signed_delivery_paper, date_added, notes)
                VALUES ?
            `;
            
            const assetValues = assets.map(a => [
                a.id,
                a.category,
                a.itemType,
                a.brandModel,
                a.serialNumber,
                a.status,
                a.purchaseDate || null,
                a.expiryDate || null,
                a.purchasePrice ? parseFloat(a.purchasePrice) : 0,
                a.ownershipType || 'N/A',
                a.receiptData || null,
                a.receiptFilename || null,
                a.assignedTo || null,
                a.employeeId || null,
                a.assignmentLocation || null,
                a.assignmentDate || null,
                a.returnDate || null,
                a.signedDeliveryPaper ? 1 : 0,
                a.dateAdded || formatDate(new Date()),
                a.notes || null
            ]);
            
            await connection.query(assetQuery, [assetValues]);
        }
        
        // Insertar Historial
        if (historyLog.length > 0) {
            const historyQuery = `
                INSERT INTO history_log 
                (id, asset_id, brand_model, serial_number, action, details, timestamp, status, notes)
                VALUES ?
            `;
            
            const historyValues = historyLog.map(h => [
                h.id,
                h.notebookId || null,
                h.brandModel,
                h.serialNumber,
                h.action,
                h.details,
                h.timestamp || new Date(),
                h.status,
                h.notes || null
            ]);
            
            await connection.query(historyQuery, [historyValues]);
        }
        
        await connection.commit();
        res.json({ message: 'Datos importados con éxito en la base de datos MySQL.' });
    } catch (err) {
        await connection.rollback();
        console.error('Error en POST /api/import:', err);
        res.status(500).json({ error: 'Error al realizar la importación masiva en MySQL.' });
    } finally {
        connection.release();
    }
});

// Start Server Listen
app.listen(PORT, () => {
    console.log(`🚀 Servidor backend escuchando en http://localhost:${PORT}`);
});
