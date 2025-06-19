const mongoose = require('mongoose');

const fieldSchema = new mongoose.Schema({
  label: { 
    type: String, 
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: [
      'text',
      'number',
      'date',
      'dropdown',
      'checkbox',
      'email',
      'phone',
      'url',
      'textarea',
      'rating'
    ]
  },
  options: {
    type: [String],
    validate: {
      validator: function(v) {
        return this.type !== 'dropdown' || v.length > 0;
      },
      message: 'Dropdown fields must have options'
    }
  },
  required: {
    type: Boolean,
    default: false
  }
}, { _id: false });

const recordSchema = new mongoose.Schema({
  values: { 
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    required: true 
  }
}, { timestamps: true });

const tableSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  name: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 100
  },
  description: { 
    type: String,
    trim: true,
    maxlength: 500 
  },
  fields: {
    type: [fieldSchema],
    validate: {
      validator: function(v) {
        return v.length > 0;
      },
      message: 'At least one field is required'
    }
  },
  records: [recordSchema]
}, { timestamps: true });

module.exports = mongoose.model('Table', tableSchema);