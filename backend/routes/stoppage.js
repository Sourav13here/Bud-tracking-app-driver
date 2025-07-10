const express = require('express');
const router = express.Router();
const stoppageController = require('../controllers/stoppageController');

// GET stoppages by driver's phone number
router.get('/stoppages/:phone', stoppageController.getStoppagesByPhone);

module.exports = router;
