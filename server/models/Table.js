const mongoose = require('mongoose');

const fieldSchema = new mongoose.Schema({
  name: String,
  type: String,
  value: mongoose.Schema.Types.Mixed
});

const tableSchema = new mongoose.Schema({
  userId: String,
  tableName: String,
  fields: [fieldSchema],
}, {
  timestamps: true,
});

module.exports = mongoose.model('Table', tableSchema);