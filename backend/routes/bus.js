// routes/bus.js

const express = require('express');
const router = express.Router();
const busController = require('../controllers/busController');

// POST /api/bus/location
router.post('/location', busController.postBusLocation);

module.exports = router;
