// mpc-context-service/src/routes/contextRoutes.js
const express = require('express');
const contextController = require('../controllers/contextController');

const router = express.Router();

// Route to log context
router.post('/log', contextController.logContext);

// Route to get context history for a sheet
router.get('/history/:sheetId', contextController.getContextHistory);

// TODO: Add more routes as needed (e.g., for specific queries)

module.exports = router;
