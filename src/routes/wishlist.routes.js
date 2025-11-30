// backend/routes/wishlist.routes.js
const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist
} = require('../controllers/wishlist.controller');

const router = express.Router();

// Toutes les routes wishlist sont protégées
router.use(protect);

// CES ROUTES SONT CELLES QUE TON FRONTEND UTILISE
router.get('/', getWishlist);           // GET  /api/wishlist
router.post('/add', addToWishlist);     // POST /api/wishlist/add
router.post('/remove', removeFromWishlist); // POST /api/wishlist/remove

module.exports = router;