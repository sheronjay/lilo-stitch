import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors({
    origin: '*', // Allow all origins for development
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// Database configuration
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

// Create connection pool
let pool;

async function initializeDatabase() {
    try {
        pool = mysql.createPool(dbConfig);
        console.log('Database connection pool created');

        // Test connection
        const connection = await pool.getConnection();
        console.log('Successfully connected to MySQL database');
        connection.release();
    } catch (error) {
        console.error('Error connecting to database:', error);
        process.exit(1);
    }
}

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Create a new message
app.post('/api/messages', async (req, res) => {
    try {
        const { message } = req.body;

        if (!message || message.trim().length === 0) {
            return res.status(400).json({ error: 'Message content is required' });
        }

        const uuid = uuidv4();
        const query = 'INSERT INTO messages (uuid, message) VALUES (?, ?)';

        await pool.execute(query, [uuid, message]);

        res.status(201).json({
            success: true,
            uuid: uuid,
            url: `${process.env.GAME_URL || 'http://localhost:3001'}?id=${uuid}`
        });
    } catch (error) {
        console.error('Error creating message:', error);
        res.status(500).json({ error: 'Failed to create message' });
    }
});

// Get a message by UUID
app.get('/api/messages/:uuid', async (req, res) => {
    try {
        const { uuid } = req.params;
        
        console.log(`Fetching message for UUID: ${uuid}`);

        if (!uuid) {
            return res.status(400).json({ error: 'UUID is required' });
        }

        const query = 'SELECT uuid, message, created_at FROM messages WHERE uuid = ?';
        const [rows] = await pool.execute(query, [uuid]);

        console.log(`Query result: ${rows.length} rows found`);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Message not found' });
        }

        console.log(`Returning message: ${rows[0].message.substring(0, 50)}...`);

        res.json({
            success: true,
            data: rows[0]
        });
    } catch (error) {
        console.error('Error fetching message:', error);
        res.status(500).json({ error: 'Failed to fetch message' });
    }
});

// Start server
async function startServer() {
    await initializeDatabase();

    app.listen(PORT, () => {
        console.log(`Backend API server running on port ${PORT}`);
        console.log(`Health check: http://localhost:${PORT}/health`);
    });
}

startServer();
