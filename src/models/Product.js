const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  title: String,
  price: Number,
  description: String,
  category: String,
  image: String,
  images: [String],
  thumbnail: String,
  rating: { rate: Number, count: Number },
  stock: Number,
  brand: String,
  discountPercentage: Number,
  reviews: [mongoose.Mixed],
  specs: [mongoose.Mixed]
});

module.exports = mongoose.model('Product', productSchema, 'products');