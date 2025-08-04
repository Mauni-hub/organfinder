const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'sree123', // Replace with your password if any
    database: 'organ_finder' // Corrected database name
});

db.connect((err) => {
    if (err) {
        console.error('MySQL connection failed:', err);
    } else {
        console.log(' MySQL Connected!');
    }
});

// API route to fetch hospitals with optional filters
app.get("/api/hospitals", (req, res) => {
    const { state, district, organ } = req.query;

    let sql = `
        SELECT h.id, h.name, h.state, h.district, h.location, h.address, h.contact, 
               oa.organ_name, oa.quantity
        FROM hospitals h
        LEFT JOIN organ_availability oa ON h.id = oa.hospital_id
        WHERE 1 = 1
    `;

    const params = [];

    // Filter by state if selected and not "All States"
    if (state && state !== 'All States') {
        sql += " AND h.state = ?";
        params.push(state);
    }
    // Filter by district if selected and not "All Districts"
    if (district && district !== 'All Districts') {
        sql += " AND h.district = ?";
        params.push(district);
    }
    // Filter by organ if selected. This works by filtering the final data on the frontend
    // after all hospitals for the selected state/district are retrieved.

    db.query(sql, params, (err, result) => {
        if (err) {
            console.error(" Error fetching data:", err);
            return res.status(500).send("Server error");
        }

        // Transform the flat database result into the nested structure the frontend expects
        const hospitalsMap = new Map();

        result.forEach(row => {
            if (!hospitalsMap.has(row.id)) {
                hospitalsMap.set(row.id, {
                    id: row.id,
                    name: row.name,
                    state: row.state,
                    district: row.district,
                    location: row.location,
                    address: row.address,
                    contact: row.contact,
                    organs: {}
                });
            }
            // Add organ availability to the corresponding hospital object
            if (row.organ_name && row.quantity !== null) {
                hospitalsMap.get(row.id).organs[row.organ_name] = row.quantity;
            }
        });

        const formattedHospitals = Array.from(hospitalsMap.values());
        res.json(formattedHospitals);
    });
});

// Start server
app.listen(port, () => {
    console.log(` Server running at http://localhost:${port}`);
});
