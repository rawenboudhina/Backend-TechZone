// controllers/wishlist.controller.js
const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');

exports.getWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ userId: req.user._id });
    if (!wishlist) {
      wishlist = await Wishlist.create({ userId: req.user._id, products: [] });
    }

    const products = await Product.find({ _id: { $in: wishlist.products } });
    const numericIds = products.map(p => p.id); // p.id est le champ numérique que tu as ajouté

    res.json(numericIds);
  } catch (err) {
    console.error('Erreur getWishlist:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.addToWishlist = async (req, res) => {
  const { productId } = req.body; // ex: "7" ou 7

  try {
    // Cherche le produit par son ID NUMÉRIQUE (champ 'id' que tu as dans la DB)
    const product = await Product.findOne({ id: Number(productId) });

    if (!product) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }

    let wishlist = await Wishlist.findOne({ userId: req.user._id });
    if (!wishlist) {
      wishlist = new Wishlist({ userId: req.user._id, products: [] });
    }

    // Ajoute l'_id MongoDB du produit
    if (!wishlist.products.some(id => id.toString() === product._id.toString())) {
      wishlist.products.push(product._id);
      await wishlist.save();
    }

    // Renvoie les IDs numériques
    const products = await Product.find({ _id: { $in: wishlist.products } });
    const numericIds = products.map(p => p.id);

    res.json(numericIds);
  } catch (err) {
    console.error('Erreur addToWishlist:', err);
    res.status(500).json({ message: 'Erreur ajout favori' });
  }
};

exports.removeFromWishlist = async (req, res) => {
  const { productId } = req.body;

  try {
    const product = await Product.findOne({ id: Number(productId) });
    if (!product) return res.json([]);

    const wishlist = await Wishlist.findOne({ userId: req.user._id });
    if (!wishlist) return res.json([]);

    wishlist.products = wishlist.products.filter(id => !id.equals(product._id));
    await wishlist.save();

    const products = await Product.find({ _id: { $in: wishlist.products } });
    const numericIds = products.map(p => p.id);

    res.json(numericIds);
  } catch (err) {
    console.error('Erreur removeFromWishlist:', err);
    res.status(500).json({ message: 'Erreur suppression favori' });
  }
};
