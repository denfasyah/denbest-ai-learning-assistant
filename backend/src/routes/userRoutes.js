const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/profile', userController.getProfile);
router.patch('/profile', userController.updateProfile);
router.patch('/change-password', userController.changePassword);
router.patch('/change-email', userController.changeEmail);
router.get('/preferences', userController.getPreferences);
router.patch('/preferences', userController.updatePreferences);

module.exports = router;
