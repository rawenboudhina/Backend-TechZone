// src/routes/cart.routes.js
const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const {
  getCart,
  addToCart,
  removeFromCart,
  clearCart
} = require('../controllers/cart.controller');

const router = express.Router();

router.use(protect); // Toutes les routes protégées

router.get('/', getCart);
router.post('/', addToCart);
router.delete('/:productId', removeFromCart);
router.delete('/', clearCart);

module.exports = router;