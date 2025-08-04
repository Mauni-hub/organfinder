const express = require('express');
const router = express.Router();
const db = require('../db'); // or wherever you export your mysql connection

router.get('/hospitals', (req, res) => {
  const { district, organ } = req.query;

  if (!district || !organ) {
    return res.status(400).json({ message: 'District and organ are required' });
  }

  const sql = 'SELECT * FROM hospitals WHERE district = ? AND organ = ?';

  db.query(sql, [district, organ], (err, results) => {
    if (err) {
      console.error('DB Error:', err);
      return res.status(500).json({ message: 'Something went wrong' });
    }

    res.json(results);
  });
});

module.exports = router;
