const express = require('express');
const router = express.Router();
const { getBusNameByPhone } = require('../controllers/bus_nameController'); 

router.get('/:phone', getBusNameByPhone);

module.exports = router;
