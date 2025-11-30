const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist
} = require('../controllers/wishlist.controller');

const router = express.Router();

router.use(protect);

router.get('/:userId', getWishlist);
router.post('/:userId/add', addToWishlist);
router.post('/:userId/remove', removeFromWishlist);

module.exports = router;