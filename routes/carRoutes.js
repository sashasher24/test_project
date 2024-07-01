const express = require('express');
const carController = require('../controllers/carController');
const router = express.Router();

router.post('/add', carController.addCar);
router.get('/', carController.showCars);

module.exports = router;