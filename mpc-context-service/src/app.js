// mpc-context-service/src/app.js
const express = require('express');
const contextRoutes = require('./routes/contextRoutes');
// const config = require('./config'); // If needed for app setup

const app = express();

// Middleware
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

// Basic Logging Middleware (optional, can be expanded)
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Mount routes
app.use('/api/context', contextRoutes); // All context routes will be prefixed with /api/context

// Simple health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP', message: 'MPC Context Service is running.' });
});

// Global error handler (basic)
// This should be defined AFTER all other app.use() and routes calls
app.use((err, req, res, next) => {
    console.error(err.stack);
    // TODO: Improve error handling to not send stack trace in production
    res.status(err.status || 500).json({
        message: err.message || 'An unexpected error occurred.',
        // error: process.env.NODE_ENV === 'development' ? err : {} // Only send error details in dev
    });
});

module.exports = app;
