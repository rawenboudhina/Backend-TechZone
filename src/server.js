// src/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// Configuration CORS : autoriser uniquement ton frontend Angular
app.use(cors({
  origin: [
    'http://localhost:4200',  // Angular dev
    'http://localhost:3000',  // si tu sers le build Angular depuis un autre port
    // Ajoute ici ton domaine en prod plus tard, ex: 'https://techzone.com'
  ],
  credentials: true
}));

// Body parser (limité à 10mb pour éviter les abus)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Connexion MongoDB avec options modernes et retry
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connecté avec succès'))
  .catch(err => {
    console.error('Erreur connexion MongoDB:', err.message);
    process.exit(1);
  });

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/products', require('./routes/product.routes'));
app.use('/api/cart', require('./routes/cart.routes'));
app.use('/api/wishlist', require('./routes/wishlist.routes'));

// Route d'accueil (utile pour vérifier que le serveur tourne)
app.get('/', (req, res) => {
  res.send(`
    <h1>Techzone Backend fonctionne !</h1>
    <ul>
      <li>Produits : <a href="/api/products">/api/products</a></li>
      <li>Auth : POST /api/auth/register & /api/auth/login</li>
    </ul>
  `);
});

// Gestion des routes non trouvées (404)
app.use((req, res, next) => {
  res.status(404).json({ message: `Route ${req.originalUrl} non trouvée` });
});

// Middleware global de gestion d'erreurs
app.use((err, req, res, next) => {
  console.error('Erreur serveur:', err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Erreur interne du serveur',
  });
});

// Port et démarrage
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
  console.log(`API disponible sur http://localhost:${PORT}/api`);
});

module.exports = app; // Utile pour les tests avec Supertest plus tard