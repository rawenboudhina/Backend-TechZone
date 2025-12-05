// swagger.js (à la racine, à côté de package.json)
const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.1.0',
    info: {
      title: 'TechZone API - Rawen',
      version: '1.0.0',
      description: 'Documentation générée automatiquement + Scalar UI',
    },
    servers: [{ url: 'http://localhost:5000' }],
  },
  apis: ['./src/routes/**/*.js'], // ← tous tes fichiers de routes
};

module.exports = swaggerJSDoc(options);