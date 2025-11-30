// routes/auth.routes.js
const express = require('express');
const { register, login, getMe } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe); // Optionnel : pour récupérer l'utilisateur connecté

module.exports = router;