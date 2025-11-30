import mongoose from 'mongoose';
const wishlistSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  products: [{ type: Number }]
});

module.exports = mongoose.model('Wishlist', wishlistSchema);