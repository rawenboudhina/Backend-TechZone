const Wishlist = require('../models/Wishlist');

exports.getWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ userId: req.user._id });
    if (!wishlist) {
      wishlist = await Wishlist.create({ userId: req.user._id, products: [] });
    }
    res.json(wishlist.products.map(p => p.toString()));
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.addToWishlist = async (req, res) => {
  const { productId } = req.body;

  try {
    let wishlist = await Wishlist.findOne({ userId: req.user._id });
    if (!wishlist) {
      wishlist = new Wishlist({ userId: req.user._id, products: [] });
    }

    if (!wishlist.products.includes(productId)) {
      wishlist.products.push(productId);
      await wishlist.save();
    }

    res.json(wishlist.products.map(p => p.toString()));
  } catch (err) {
    res.status(500).json({ message: 'Erreur ajout favori' });
  }
};

exports.removeFromWishlist = async (req, res) => {
  const { productId } = req.body;

  try {
    const wishlist = await Wishlist.findOne({ userId: req.user._id });
    if (!wishlist) return res.json([]);

    wishlist.products = wishlist.products.filter(p => p.toString() !== productId);
    await wishlist.save();

    res.json(wishlist.products.map(p => p.toString()));
  } catch (err) {
    res.status(500).json({ message: 'Erreur suppression favori' });
  }
};