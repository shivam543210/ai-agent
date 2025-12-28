const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'AI Job Agent API',
      version: '1.0.0',
      description: 'API documentation for the AI Job Agent Backend',
      contact: {
        name: 'Developer',
      },
    },
    servers: [
      {
        url: 'http://localhost:8000',
        description: 'Local server',
      },
    ],
  },
  // Paths to files containing OpenAPI definitions
  apis: ['./src/server.js', './src/routes/*.js'], 
};

const specs = swaggerJsdoc(options);
module.exports = specs;
