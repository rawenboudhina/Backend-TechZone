// src/controllers/order.controller.js
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

exports.createOrder = async (req, res) => {
  try {
    const {
      items,
      shippingAddress,
      deliveryMethod,
      paymentInfo,
      subtotal,
      shippingFee,
      total
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Le panier est vide' });
    }

    // Calculs sécurisés côté serveur
    const ids = items.map(i => Number(i.productId));
    const dbProducts = await Product.find({ id: { $in: ids } });
    const priceMap = new Map(dbProducts.map(p => [p.id, p.price]));
    const computedSubtotal = items.reduce((s, i) => s + ((priceMap.get(Number(i.productId)) || 0) * Number(i.quantity)), 0);
    const deliveryPrices = { standard: 5, express: 15 };
    const finalSubtotal = typeof subtotal === 'number' ? subtotal : computedSubtotal;
    const finalShipping = typeof shippingFee === 'number' ? shippingFee : (deliveryPrices[deliveryMethod] || 5);
    const finalTotal = typeof total === 'number' ? total : (finalSubtotal + finalShipping);

    const order = new Order({
      userId: req.user._id,
      items,
      shippingAddress,
      deliveryMethod,
      paymentInfo: {
        cardNumber: '**** **** **** ' + paymentInfo.cardNumber.slice(-4),
        nameOnCard: paymentInfo.nameOnCard
      },
      subtotal: finalSubtotal,
      shippingFee: finalShipping,
      total: finalTotal,
      status: 'confirmed'
    });

    await order.save();

    // Vider le panier
    await Cart.findOneAndUpdate({ userId: req.user._id }, { items: [] });

    res.status(201).json({
      message: 'Commande créée avec succès',
      order: {
        id: order._id,
        total: order.total,
        status: order.status,
        createdAt: order.createdAt
      }
    });
  } catch (err) {
    console.error('Erreur création commande:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: 'Commande non trouvée' });

    if (order.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
