const express = require('express');
const router = express.Router();
const Table = require('../models/Table');

router.post('/create', async (req, res) => {
  try {
    const { userId, tableName, fields } = req.body;
    const newTable = new Table({ userId, tableName, fields });
    await newTable.save();
    res.status(201).json({ message: 'Table created', table: newTable });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/user/:userId', async (req, res) => {
  try {
    const tables = await Table.find({ userId: req.params.userId });
    res.json(tables);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;