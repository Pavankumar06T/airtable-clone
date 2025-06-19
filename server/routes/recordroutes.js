const express = require('express');
const router = express.Router();
const Record = require('../models/Record');
const protect = require('../middleware/authmiddleware');

router.get('/:tableId', protect, async (req, res) => {
  try {
    const records = await Record.find({ 
      tableId: req.params.tableId,
      user: req.userId 
    });
    res.json(records);
  } catch (err) {
    console.error('Error fetching records:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:recordId', protect, async (req, res) => {
  try {
    const record = await Record.findOneAndDelete({
      _id: req.params.recordId,
      user: req.userId
    });
    
    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }
    
    res.json({ message: 'Record deleted successfully' });
  } catch (err) {
    console.error('Error deleting record:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;