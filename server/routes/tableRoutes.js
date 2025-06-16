const express = require('express');
const router = express.Router();
const Table = require('../models/Table');

router.post('/', async (req, res) => {
  const { name, description } = req.body;

  try {
    const newTable = new Table({ name, description });
    await newTable.save();
    res.status(201).json({ message: 'Table created successfully' });
  } catch (err) {
    console.error("❌ Table creation failed:", err.message);
    res.status(500).json({ error: 'Failed to create table' });
  }
});

module.exports = router;