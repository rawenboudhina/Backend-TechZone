// controllers/auth.controller.js
const User = require('../models/User')
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'ton-secret-ultra-securise-2025';
const JWT_EXPIRES_IN = '7d';

const signToken = (id) => jwt.sign({ id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, address, addresses } = req.body;

    if (!email || !password || !firstName || !lastName || !address) {
      return res.status(400).json({ message: 'Tous les champs sont obligatoires' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }

    const username = email.split('@')[0] + Math.floor(Math.random() * 9999);

    const user = await User.create({
      firstName, lastName, email, password, address, addresses: Array.isArray(addresses) ? addresses : [], username
    });

    const token = signToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        address: user.address,
        addresses: user.addresses,
      }
    });
  } catch (err) {
    console.error('Erreur register:', err);
    res.status(500).json({ message: 'Erreur serveur lors de l’inscription' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email et mot de passe requis' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Identifiants incorrects' });
    }

    const token = signToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        address: user.address,
        addresses: user.addresses,
      }
    });
  } catch (err) {
    console.error('Erreur login:', err);
    res.status(500).json({ message: 'Erreur serveur lors de la connexion' });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        address: user.address,
        addresses: user.addresses,
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.updateMe = async (req, res) => {
  try {
    const { firstName, lastName, address, addresses } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    if (typeof firstName === 'string') user.firstName = firstName;
    if (typeof lastName === 'string') user.lastName = lastName;
    if (typeof address === 'string') user.address = address;
    if (Array.isArray(addresses)) user.addresses = addresses.filter(a => typeof a === 'string' && a.trim());

    await user.save();

    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        address: user.address,
        addresses: user.addresses,
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
