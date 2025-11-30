const Product = require('../models/product.model');

const getAllProducts = async (req, res) => {
  const limit = parseInt(req.query.limit) || 30;
  const products = await Product.find({}).limit(limit);
  res.json(products);
};

const getProductById = async (req, res) => {
  const product = await Product.findOne({ id: Number(req.params.id) });
  if (!product) return res.status(404).json({ message: 'Produit non trouvé' });
  res.json(product);
};

const getByCategory = async (req, res) => {
  const { category } = req.params;
  const products = await Product.find({ category });
  res.json(products);
};

const searchProducts = async (req, res) => {
  const { q, category } = req.query;
  let query = {};

  if (category) {
    query = { category };
  } else if (q) {
    query = { title: { $regex: q, $options: 'i' } };
  }

  const products = await Product.find(query);
  res.json(products);
};

const getCategories = async (req, res) => {
  const categories = [
    { name: 'Smartphones', slug: 'smartphones', icon: 'phone', color: '#8b5cf6' },
    { name: 'Laptops', slug: 'laptops', icon: 'laptop', color: '#3b82f6' },
    { name: 'Mode Femme', slug: 'womens-dresses', icon: 'dress', color: '#ec4899' },
    { name: 'Mode Homme', slug: 'mens-shirts', icon: 'shirt', color: '#1e40af' },
    { name: 'Beauté', slug: 'fragrances', icon: 'perfume', color: '#f43f5e' },
    { name: 'Maison', slug: 'home-decoration', icon: 'home', color: '#10b981' },
    { name: 'Sport', slug: 'sports-accessories', icon: 'soccer', color: '#f97316' },
    { name: 'Bijoux', slug: 'womens-jewellery', icon: 'gem', color: '#a855f7' }
  ];
  res.json(categories);
};

module.exports = {
  getAllProducts,
  getProductById,
  getByCategory,
  searchProducts,
  getCategories
};