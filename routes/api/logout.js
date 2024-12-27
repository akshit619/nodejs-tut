const express = require('express');
const router = express.Router();

const logoutController = require('../../controller/logoutController.js');

router.get('/', logoutController.handleLogout);

module.exports = router;