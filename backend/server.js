require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = async () => {
  const conn = require('./config/db');
  await conn();
};

// Initialize server
const app = express();

// Database Connection
connectDB();

// Middlewares
app.use(cors({
  origin: '*', // For development flexibility
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/resume', require('./routes/resumeRoutes'));
app.use('/api/questions', require('./routes/questionRoutes'));
app.use('/api/interviews', require('./routes/interviewRoutes'));
app.use('/api/dsa', require('./routes/dsaRoutes'));

// Basic Health Check Route
app.get('/', (req, res) => {
  res.json({ message: 'AI Interview Prep API is running...' });
});

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Port configuration
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
