const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const swaggerDefinition = require('../../docs/swaggerDef');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Serve static HTML documentation as a fallback
router.get('/static', (req, res) => {
  const htmlPath = path.join(__dirname, '../../docs/api-documentation.html');
  res.sendFile(htmlPath);
});

try {
  console.log('Loading Swagger documentation...');
  
  // Check that YAML files exist
  const docsPath = path.join(__dirname, '../../docs');
  console.log('Docs directory contents:', fs.readdirSync(docsPath));
  
  const specs = swaggerJsdoc({
    swaggerDefinition,
    apis: [
      path.join(__dirname, '../../docs/**/*.yml'), 
      path.join(__dirname, '../**/*.js')
    ],
  });
  
  console.log('Swagger specs loaded successfully');
  
  router.use('/', swaggerUi.serve);
  router.get(
    '/',
    (req, res, next) => {
      if (req.query.format === 'html') {
        res.redirect('/v1/docs/static');
      } else {
        swaggerUi.setup(specs, {
          explorer: true,
        })(req, res, next);
      }
    }
  );
} catch (error) {
  console.error('Error loading Swagger documentation:', error);
  
  // Provide a fallback route in case of errors
  router.get('/', (req, res) => {
    res.redirect('/v1/docs/static');
  });
}

module.exports = router;
