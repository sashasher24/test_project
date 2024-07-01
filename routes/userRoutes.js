const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();

router.post('/add', userController.addUser);
router.delete('/', userController.deleteUser);
router.get('/', userController.showUsers);

module.exports = router;