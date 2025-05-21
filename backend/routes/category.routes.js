const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { isAdmin } = require('../middleware/role.middleware');
const upload = require('../middleware/upload.middleware');

router.get('/', categoryController.getCategories);

router.get('/:id', categoryController.getCategoryById);

router.post(
    '/',
    authenticate,
    isAdmin,
    upload.single('categoryImage'),
    categoryController.addCategory
);

router.put(
    '/:id',
    authenticate,
    isAdmin,
    upload.single('categoryImage'),
    categoryController.updateCategory
);

router.delete('/:id', authenticate, isAdmin, categoryController.deleteCategory);

module.exports = router;
