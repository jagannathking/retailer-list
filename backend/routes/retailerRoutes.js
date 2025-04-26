const express = require('express');
const retailerController = require('../controllers/retailerController');
const { listRetailersSchema, getRetailerSchema, createRetailerSchema } = require('../validators/retailerValidator');
const validateRequest = require('../middlewares/validateRequest');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Define routes for the root path '/'
router.get(
    '/', // Path
    validateRequest({ query: listRetailersSchema }), // Middleware for query validation
    retailerController.listRetailers
);

router.post(
    '/', // Path
    authMiddleware, // Middleware for authentication
    validateRequest({ body: createRetailerSchema }), // Middleware for body validation
    retailerController.createRetailer 
);

// Define route for '/:id' path
router.get(
    '/:id', 
    validateRequest({ params: getRetailerSchema }), // Middleware for param validation
    retailerController.getRetailer
);

// Define route for '/:id/whatsapp' path
router.get(
    '/:id/whatsapp', // Path
    validateRequest({ params: getRetailerSchema }), // Middleware for param validation
    retailerController.getWhatsappLink // Handler
);

module.exports = router;