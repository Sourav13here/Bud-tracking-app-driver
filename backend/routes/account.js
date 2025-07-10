const express = require('express');
const router = express.Router();
const { getDriverByPhone } = require('../controllers/accountController');

// Get driver details by phone number
router.get('/driver/:phone', getDriverByPhone);

module.exports = router;
