const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./db');

// Load environment variables
dotenv.config();

// Connect MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Static Frontend and Uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, '../../Frontend/HTML/public')));

// API Routes
app.use('/api/auth', require('./Routes/AuthRoutes'));
app.use('/api/drivers', require('./Routes/DriverRoutes'));
app.use('/api/operators', require('./Routes/OpratorRoutes'));
app.use('/api/jobs', require('./Routes/JobsRoutes'));
app.use('/api/applications', require('./Routes/ApplicationRoutes'));
app.use('/api/admin', require('./Routes/AdminRoutes'));

// Health Check API
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'RouteHire Express Backend API & MongoDB Database Running Smoothly',
    database: 'routehire',
    timestamp: new Date()
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[RouteHire Server Error]:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`=====================================================`);
  console.log(`🚀 RouteHire Express + MongoDB Server Running`);
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`=====================================================`);
});