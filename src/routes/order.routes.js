// src/routes/order.routes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { createOrder, getOrderById } = require('../controllers/order.controller');

// Créer une commande
router.post('/', protect, createOrder);

// Récupérer une commande par ID
router.get('/:id', protect, getOrderById);

module.exports = router;
