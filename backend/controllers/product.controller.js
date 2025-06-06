const productService = require('../services/product.service');
const { addProductDto, updateProductDto } = require('../dtos/product.dto');

exports.addProduct = async (req, res) => {
    try {
        // Validate first, but allow raw data to pass through for processing
        const { error } = addProductDto.validate(req.body, { allowUnknown: true });
        if (error) return res.status(400).json({ error: error.details[0].message });

        const product = await productService.addProduct(req.body, req.files);
        return res.status(201).json({ message: 'Product added successfully', product });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message || 'Internal Server Error' });
    }
};

exports.getProducts = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const products = await productService.getProducts(parseInt(page), parseInt(limit));
        if (products.length === 0) {
            return res.status(200).json({ message: 'No products found', products: [] });
        }
        return res.status(200).json(products);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message || 'Internal Server Error' });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const product = await productService.getProductById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        return res.status(200).json(product);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message || 'Internal Server Error' });
    }
};

exports.getProductsByCategory = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const products = await productService.getProductsByCategory(req.params.categoryId, parseInt(page), parseInt(limit));
        if (products.length === 0) {
            return res.status(404).json({ message: 'No products found for this category' });
        }
        return res.status(200).json(products);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message || 'Internal Server Error' });
    }
}

exports.updateProduct = async (req, res) => {
    try {
        const { error } = updateProductDto.validate(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        const updated = await productService.updateProduct(req.params.id, req.body, req.files);
        return res.status(200).json({ message: 'Product updated', product: updated });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message || 'Internal Server Error' });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        await productService.deleteProduct(req.params.id);
        return res.status(200).json({ message: 'Product deleted' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message || 'Internal Server Error' });
    }
};
