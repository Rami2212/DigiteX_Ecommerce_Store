const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { isAdmin } = require('../middleware/role.middleware');
const upload = require('../middleware/upload.middleware');

// Multer config: handle multiple image fields
const productUpload = upload.fields([
    { name: 'productImage', maxCount: 1 },
    { name: 'productImages', maxCount: 10 },
    { name: 'variantImages', maxCount: 10 },
]);

// GET all products
router.get('/', productController.getProducts);

// GET product by ID
router.get('/:id', productController.getProductById);

// GET products by category
router.get('/category/:categoryId', productController.getProductsByCategory);

// CREATE product (admin only)
router.post(
    '/',
    authenticate,
    isAdmin,
    productUpload,
    productController.addProduct
);

// UPDATE product (admin only)
router.put(
    '/:id',
    authenticate,
    isAdmin,
    productUpload,
    productController.updateProduct
);

// DELETE product (admin only)
router.delete(
    '/:id',
    authenticate,
    isAdmin,
    productController.deleteProduct
);

module.exports = router;
