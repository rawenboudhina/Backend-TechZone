require('dotenv').config();                     // ← AJOUTÉE
const mongoose = require('mongoose');
const fetch = require('node-fetch').default;
console.log('Connexion à :', process.env.MONGODB_URI);
const Product = require('../models/product.model');
const allowedCategories = [
  'smartphones', 'laptops', 'womens-dresses', 'mens-shirts',
  'fragrances', 'home-decoration', 'sports-accessories', 'womens-jewellery'
];

const tunisianNames = ['Ahmed B.', 'Sarra M.', 'Yassine T.', 'Ines K.', 'Aymen J.', 'Nour C.'];

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connecté à MongoDB Atlas – Import en cours...');
    await Product.deleteMany({});

    const res = await fetch('https://dummyjson.com/products?limit=0');
    const { products } = await res.json();

    const filtered = products.filter(p => allowedCategories.includes(p.category));

    const finalProducts = filtered.map(p => {
      const reviews = [];
      const reviewCount = Math.floor(Math.random() * 6) + 3;
      for (let i = 0; i < reviewCount; i++) {
        const rating = [1, 2, 3, 4, 5][Math.floor(Math.random() * 5)];
        reviews.push({
          user: tunisianNames[Math.floor(Math.random() * tunisianNames.length)],
          rating,
          comment: "Super produit ! Très satisfait",
          date: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
          helpful: Math.floor(Math.random() * 20)
        });
      }

      const avgRating = reviews.length > 0 
        ? Math.round((reviews.reduce((a, r) => a + r.rating, 0) / reviews.length) * 10) / 10 
        : 4.5;

      return {
        ...p,
        image: p.thumbnail || p.images?.[0],
        rating: { rate: avgRating, count: reviews.length },
        reviews,
        specs: [
          p.brand && { key: 'Marque', value: p.brand },
          p.warrantyInformation && { key: 'Garantie', value: p.warrantyInformation },
          { key: 'Disponibilité', value: p.availabilityStatus || 'En stock' }
        ].filter(Boolean)
      };
    });

    await Product.insertMany(finalProducts);
    console.log(`${finalProducts.length} produits importés avec succès !`);
    process.exit();
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });