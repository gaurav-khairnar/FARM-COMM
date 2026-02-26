const express = require('express');
const { getMe, updateMe, updateUserRole, getDashboard } = require('../controllers/userController');
const { auth, requireRole } = require('../middleware/auth');

const router = express.Router();

router.get('/me', auth, getMe);
router.put('/me', auth, updateMe);
router.get('/dashboard', auth, getDashboard);
router.patch('/:id/role', auth, requireRole('admin'), updateUserRole);

module.exports = router;
