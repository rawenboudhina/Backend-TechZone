// src/routes/product.routes.js
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect } = require('../middleware/auth.middleware');

router.get('/', async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : 0;
    const products = await Product.find({}).limit(limit);
    res.json(products);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/categories', (req, res) => {
  res.json([
    { name: "Smartphones", slug: "smartphones" },
    { name: "Laptops", slug: "laptops" },
    { name: "Mode Femme", slug: "womens-dresses" },
    { name: "Mode Homme", slug: "mens-shirts" },
    { name: "Beauté", slug: "fragrances" },
    { name: "Maison", slug: "home-decoration" },
    { name: "Sport", slug: "sports-accessories" },
    { name: "Bijoux", slug: "womens-jewellery" }
  ]);
});

router.get('/category/:category', async (req, res) => {
  const products = await Product.find({ category: req.params.category });
  res.json(products);
});

router.get('/:id', async (req, res) => {
  const product = await Product.findOne({ id: Number(req.params.id) });
  product ? res.json(product) : res.status(404).send();
});

router.post('/:id/reviews', protect, async (req, res) => {
  try {
    const productId = Number(req.params.id);
    const { rating, comment, title } = req.body || {};

    if (!Number.isInteger(rating) || rating < 1 || rating > 5 || !String(comment || '').trim()) {
      return res.status(400).json({ message: 'Données d\'avis invalides' });
    }

    const product = await Product.findOne({ id: productId });
    if (!product) return res.status(404).json({ message: 'Produit non trouvé' });

    const review = {
      userId: req.user._id,
      user: `${req.user.firstName} ${req.user.lastName}`.trim(),
      rating,
      comment: String(comment).trim(),
      title: String(title || '').trim(),
      date: new Date().toISOString().slice(0, 10),
      helpful: 0
    };

    product.reviews = Array.isArray(product.reviews) ? product.reviews : [];
    const existingIndex = product.reviews.findIndex(r => String(r.userId) === String(req.user._id));
    if (existingIndex > -1) {
      product.reviews[existingIndex] = review;
    } else {
      product.reviews.unshift(review);
    }

    const avg = product.reviews.length
      ? product.reviews.reduce((s, r) => s + (Number(r.rating) || 0), 0) / product.reviews.length
      : 0;
    product.rating = {
      rate: Math.round(avg * 10) / 10,
      count: product.reviews.length
    };

    await product.save();

    res.status(201).json({
      message: 'Avis enregistré',
      product: {
        id: product.id,
        rating: product.rating,
        reviews: product.reviews
      }
    });
  } catch (e) {
    console.error('Erreur ajout avis:', e);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.post('/reviews', protect, async (req, res) => {
  try {
    const { productId, rating, comment, title } = req.body || {};
    const pid = Number(productId);

    if (!Number.isInteger(pid)) {
      return res.status(400).json({ message: 'Produit invalide' });
    }
    if (!Number.isInteger(rating) || rating < 1 || rating > 5 || !String(comment || '').trim()) {
      return res.status(400).json({ message: 'Données d\'avis invalides' });
    }

    const product = await Product.findOne({ id: pid });
    if (!product) return res.status(404).json({ message: 'Produit non trouvé' });

    const review = {
      userId: req.user._id,
      user: `${req.user.firstName} ${req.user.lastName}`.trim(),
      rating,
      comment: String(comment).trim(),
      title: String(title || '').trim(),
      date: new Date().toISOString().slice(0, 10),
      helpful: 0
    };

    product.reviews = Array.isArray(product.reviews) ? product.reviews : [];
    const existingIndex = product.reviews.findIndex(r => String(r.userId) === String(req.user._id));
    if (existingIndex > -1) {
      product.reviews[existingIndex] = review;
    } else {
      product.reviews.unshift(review);
    }

    const avg = product.reviews.length
      ? product.reviews.reduce((s, r) => s + (Number(r.rating) || 0), 0) / product.reviews.length
      : 0;
    product.rating = {
      rate: Math.round(avg * 10) / 10,
      count: product.reviews.length
    };

    await product.save();

    res.status(201).json({
      message: 'Avis enregistré',
      product: {
        id: product.id,
        rating: product.rating,
        reviews: product.reviews
      }
    });
  } catch (e) {
    console.error('Erreur ajout avis:', e);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
