// src/routes/product.routes.js
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

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

module.exports = router;