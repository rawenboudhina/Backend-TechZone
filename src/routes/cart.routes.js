// routes/cart.routes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const {
  getCart,
  addToCart,
  updateCart,
  clearCart,
  removeFromCart
} = require('../controllers/cart.controller');

router.use(protect);

router.get('/', getCart);
router.post('/add', addToCart);
router.patch('/', updateCart);
router.delete('/clear', clearCart);
router.post('/remove', removeFromCart);  

module.exports = router;