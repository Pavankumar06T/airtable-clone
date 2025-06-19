const express = require('express');
const router = express.Router();
const Table = require('../models/Table');
const protect = require('../middleware/authmiddleware');

router.post('/', protect, async (req, res) => {
  try {
    const { name, description, fields } = req.body;

    if (!name || !fields || fields.length === 0) {
      return res.status(400).json({ message: 'Name and at least one field are required' });
    }

    const newTable = new Table({
      name,
      description,
      fields,
      user: req.userId,
    });

    const savedTable = await newTable.save();
    res.status(201).json(savedTable);
  } catch (err) {
    console.error('Error creating table:', err);
    res.status(500).json({ message: 'Error creating table' });
  }
});

router.get('/', protect, async (req, res) => {
  try {
    const tables = await Table.find({ user: req.userId }).select('-records');
    res.json(tables);
  } catch (err) {
    console.error('Error fetching tables:', err);
    res.status(500).json({ message: 'Error fetching tables' });
  }
});

router.get('/:tableId', protect, async (req, res) => {
  try {
    const table = await Table.findOne({ 
      _id: req.params.tableId, 
      user: req.userId 
    });
    
    if (!table) return res.status(404).json({ message: 'Table not found' });
    res.json(table);
  } catch (err) {
    console.error('Error fetching table:', err);
    res.status(500).json({ message: 'Error fetching table' });
  }
});

router.post('/:tableId/records', protect, async (req, res) => {
  try {
    const { values } = req.body;
    const table = await Table.findOne({ 
      _id: req.params.tableId, 
      user: req.userId 
    });
    
    if (!table) return res.status(404).json({ message: 'Table not found' });

    const missingFields = table.fields.filter(
      field => field.required && !values[field.label]
    );
    
    if (missingFields.length > 0) {
      return res.status(400).json({ 
        message: 'Missing required fields', 
        fields: missingFields.map(f => f.label) 
      });
    }

    table.records.push({ values });
    await table.save();

    res.status(201).json({ message: 'Record added successfully' });
  } catch (err) {
    console.error('Error adding record:', err);
    res.status(500).json({ message: 'Error adding record' });
  }
});

module.exports = router;