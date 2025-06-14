const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authroutes');
const tableRoutes = require('./routes/tableroutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    // These options are no longer needed for Mongoose 6+
  })
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tables', tableRoutes);

// Root route (optional)
app.get('/', (req, res) => {
  res.send('Welcome to the Airtable Clone Backend API!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});