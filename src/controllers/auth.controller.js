// controllers/auth.controller.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'ton-secret-tres-securise-ici';
const JWT_EXPIRES_IN = '7d';

const signToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, address } = req.body;

    // Vérifier si l'email existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }

    // Générer un username à partir de l'email (ou tu peux le passer dans le body)
    const username = email.split('@')[0] + Math.floor(Math.random() * 10000);

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password,
      address,
      username,
    });

    // Créer la wishlist vide (optionnel, si tu l'utilises encore)
    // await Wishlist.create({ userId: newUser._id, products: [] });

    const token = signToken(newUser._id);

    // Ne pas renvoyer le mot de passe
    const userWithoutPassword = {
      id: newUser._id,
      email: newUser.email,
      username: newUser.username,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      address: newUser.address,
      token,
    };

    res.status(201).json(userWithoutPassword);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur lors de l’inscription' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Veuillez fournir email et mot de passe' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Email ou mot de passe invalide' });
    }

    const token = signToken(user._id);

    const userResponse = {
      id: user._id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      address: user.address,
      token,
    };

    res.status(200).json(userResponse);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur de connexion' });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    res.json({
      id: user._id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      address: user.address,
    });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};