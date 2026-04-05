const express = require('express');
const { seedDemo } = require('../controllers/adminController');

const router = express.Router();

router.post('/seed-demo', seedDemo);

module.exports = router;
