const express = require('express');
const { Pool } = require('pg'); // Use Pool from pg library
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000; // Use the port provided by Render

// Middleware
app.use(cors());
app.use(express.json());

// Connect to PostgreSQL using the DATABASE_URL environment variable
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// A simple test connection to ensure the database is accessible
pool.connect((err, client, done) => {
    if (err) {
        console.error('PostgreSQL connection failed:', err);
    } else {
        console.log('PostgreSQL Connected!');
        client.release();
    }
});

// API route to fetch hospitals with optional filters
app.get("/hospitals", async (req, res) => {
    const { state, district, organ } = req.query;

    let sql = `
        SELECT h.name, h.state, h.district, h.location, h.address, h.contact, 
               oa.organ_name, oa.quantity
        FROM hospitals h
        JOIN organ_availability oa ON h.id = oa.hospital_id
        WHERE 1 = 1
    `;

    const params = [];

    // The pg library uses $1, $2, etc. for parameterized queries
    if (state) {
        params.push(state);
        sql += ` AND h.state = $${params.length}`;
    }
    if (district) {
        params.push(district);
        sql += ` AND h.district = $${params.length}`;
    }
    if (organ) {
        params.push(organ);
        sql += ` AND oa.organ_name = $${params.length}`;
    }

    try {
        const result = await pool.query(sql, params);
        res.json(result.rows);
    } catch (err) {
        console.error('DB Error:', err);
        res.status(500).json({ message: 'Something went wrong' });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});