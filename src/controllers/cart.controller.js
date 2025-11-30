// controllers/cart.controller.js
const Cart = require('../models/Cart');
const Product = require('../models/Product');

exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user._id }).populate('items.productId');
    if (!cart) {
      cart = await Cart.create({ userId: req.user._id, items: [] });
    }

    const items = cart.items.map(item => ({
      productId: item.productId.id,  // ← renvoie l'ID numérique
      quantity: item.quantity
    }));

    res.json({ id: cart._id, userId: cart.userId, items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// controllers/cart.controller.js
exports.addToCart = async (req, res) => {
  const { productId, quantity = 1 } = req.body;

  try {
    const product = await Product.findOne({ id: Number(productId) });
    if (!product) return res.status(404).json({ message: 'Produit non trouvé' });

    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      cart = new Cart({ userId: req.user._id, items: [] });
    }

    const itemIndex = cart.items.findIndex(i => i.productId.equals(product._id));

    if (itemIndex > -1) {
      // ICI LA CORRECTION CRUCIALE
      if (quantity <= 0) {
        cart.items.splice(itemIndex, 1); // suppression si quantity = 0
      } else {
        cart.items[itemIndex].quantity = quantity; // ASSIGNATION, pas +=
      }
    } else if (quantity > 0) {
      cart.items.push({ productId: product._id, quantity });
    }
    // si quantity <= 0 et pas trouvé → rien à faire

    await cart.save();
    await cart.populate('items.productId');

    const items = cart.items.map(item => ({
      productId: item.productId.id,
      quantity: item.quantity
    }));

    res.json({ id: cart._id, userId: cart.userId, items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur ajout panier' });
  }
};
exports.updateCart = async (req, res) => {
  const { items } = req.body;

  try {
    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Panier non trouvé' });

    cart.items = [];
    for (const item of items) {
      const product = await Product.findOne({ id: Number(item.productId) });
      if (product) {
        cart.items.push({ productId: product._id, quantity: item.quantity });
      }
    }

    await cart.save();
    await cart.populate('items.productId');

    const responseItems = cart.items.map(item => ({
      productId: item.productId.id,
      quantity: item.quantity
    }));

    res.json({ id: cart._id, userId: cart.userId, items: responseItems });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur mise à jour panier' });
  }
};

exports.clearCart = async (req, res) => {
  try {
    await Cart.findOneAndUpdate({ userId: req.user._id }, { items: [] });
    res.json({ items: [] });
  } catch (err) {
    res.status(500).json({ message: 'Erreur vidage panier' });
  }

};
// controllers/cart.controller.js
exports.removeFromCart = async (req, res) => {
  const { productId } = req.body;
  try {
    const product = await Product.findOne({ id: Number(productId) });
    if (!product) return res.status(404).json({ message: 'Produit non trouvé' });

    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Panier non trouvé' });

    cart.items = cart.items.filter(item => !item.productId.equals(product._id));
    await cart.save();

    await cart.populate('items.productId');
    const items = cart.items.map(item => ({
      productId: item.productId.id,
      quantity: item.quantity
    }));

    res.json({ id: cart._id, userId: cart.userId, items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur suppression' });
  }
};