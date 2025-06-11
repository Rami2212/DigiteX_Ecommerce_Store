const productRepo = require('../repositories/product.repository');
const path = require("path");
const fs = require("fs");
require('dotenv').config();

const deleteOldImage = (imageUrl) => {
    if (!imageUrl) return;

    try {
        const baseUrl = process.env.BACKEND_URL;
        const relativePath = imageUrl.replace(baseUrl, '');

        const filePath = path.join(__dirname, '../', relativePath);

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log('Deleted image:', filePath);
        } else {
            console.log('File not found:', filePath);
        }
    } catch (err) {
        console.error('Error deleting image:', err);
    }
};

exports.addProduct = async (data, files) => {
    const existing = await productRepo.getAll();
    if (existing.some(p => p.name.toLowerCase() === data.name.toLowerCase())) {
        throw new Error('Product name already exists');
    }

    // Handle main product image
    if (files?.productImage?.[0]) {
        const relativePath = files.productImage[0].path.replace(/\\/g, '/');
        data.productImage = `${process.env.BACKEND_URL}/${relativePath}`;
    }

    // Handle additional product images
    if (files?.productImages) {
        data.productImages = files.productImages.map(file => {
            const relativePath = file.path.replace(/\\/g, '/');
            return `${process.env.BACKEND_URL}/${relativePath}`;
        });
    }

    // Fix 3: Better variants parsing and processing
    if (data.variants) {
        // Parse JSON string if needed
        if (typeof data.variants === 'string') {
            try {
                data.variants = JSON.parse(data.variants);
            } catch (e) {
                throw new Error('Invalid variants JSON format');
            }
        }

        // Ensure variants is an array
        if (!Array.isArray(data.variants)) {
            data.variants = [data.variants];
        }

        // Handle variant images
        if (files?.variantImages) {
            const variantImages = files.variantImages.map(file => {
                const relativePath = file.path.replace(/\\/g, '/');
                return `${process.env.BACKEND_URL}/${relativePath}`;
            });

            // Fix 4: Map variantImages correctly to variantImage field
            data.variants = data.variants.map((variant, index) => ({
                ...variant,
                variantImage: variantImages[index] || variant.variantImage || '', // Use variantImage field
            }));
        }

        // Fix 5: Ensure all variants have required fields
        data.variants = data.variants.map(variant => ({
            color: variant.color || '',
            variantImage: variant.variantImage || variant.image || '', // Handle both field names
        }));
    } else {
        data.variants = []; // Set empty array if no variants
    }

    return await productRepo.createProduct(data);
};

exports.getProducts = async (page = 1, limit = 10) => {
    return await productRepo.getAllProducts(page, limit);
};

exports.getProductById = async (id) => {
    const product = await productRepo.getProductById(id);

    if (!product) {
        throw new Error('Product not found');
    }

    // Increase product view count
    if (product) {
        product.views = (product.views || 0) + 1;
        await productRepo.updateProductById(id, { views: product.views });
    }

    return product;
};

exports.getProductsByCategory = async (categoryId, page = 1, limit = 10) => {
    const products = await productRepo.getProductsByCategory(categoryId, page = 1, limit = 10);
    if (products.length === 0) {
        throw new Error('No products found for this category');
    }
    return products;
};

exports.updateProduct = async (id, data, files) => {
    const existing = await productRepo.getProductById(id);
    if (!existing) {
        throw new Error('Product not found');
    }

    // Check for name uniqueness (excluding current product)
    if (data.name) {
        const allProducts = await productRepo.getAll();
        const nameExists = allProducts.some(p =>
            p._id.toString() !== id &&
            p.name.toLowerCase() === data.name.toLowerCase()
        );
        if (nameExists) {
            throw new Error('Product name already exists');
        }
    }

    // Update main product image if present
    if (files?.productImage?.[0]) {
        // Delete old image
        if (existing.productImage) deleteOldImage(existing.productImage);
        const relativePath = files.productImage[0].path.replace(/\\/g, '/');
        data.productImage = `${process.env.BACKEND_URL}/${relativePath}`;
    }

    // Update additional product images if present
    if (files?.productImages) {
        // Delete old images
        if (existing.productImages && Array.isArray(existing.productImages)) {
            existing.productImages.forEach(image => deleteOldImage(image));
        }
        data.productImages = files.productImages.map(file => {
            const relativePath = file.path.replace(/\\/g, '/');
            return `${process.env.BACKEND_URL}/${relativePath}`;
        });
    }

    // Handle variants update
    if (data.variants !== undefined) {
        // Parse variants if JSON string
        if (typeof data.variants === 'string') {
            try {
                data.variants = JSON.parse(data.variants);
            } catch (e) {
                throw new Error('Invalid variants JSON format');
            }
        }

        // Ensure variants is an array
        if (data.variants && !Array.isArray(data.variants)) {
            data.variants = [data.variants];
        }

        // Delete old variant images if variants are being replaced
        if (existing.variants && Array.isArray(existing.variants)) {
            existing.variants.forEach(variant => {
                if (variant.variantImage) deleteOldImage(variant.variantImage);
            });
        }

        // Handle new variant images
        if (files?.variantImages && data.variants) {
            const variantImages = files.variantImages.map(file => {
                const relativePath = file.path.replace(/\\/g, '/');
                return `${process.env.BACKEND_URL}/${relativePath}`;
            });

            data.variants = data.variants.map((variant, index) => ({
                ...variant,
                variantImage: variantImages[index] || variant.variantImage || variant.image || '',
            }));
        }

        // Validate and normalize variants
        if (data.variants && data.variants.length > 0) {
            data.variants = data.variants.map(variant => {
                if (!variant.color) {
                    throw new Error('Variant color is required');
                }
                return {
                    color: variant.color,
                    variantImage: variant.variantImage || variant.image || '',
                };
            });
        } else {
            data.variants = [];
        }
    }

    return await productRepo.updateProductById(id, data);
};

exports.deleteProduct = async (id) => {
    const existing = await productRepo.getProductById(id);
    if (!existing) {
        throw new Error('Product not found');
    }

    // delete all images associated with the product
    if (existing.productImage) deleteOldImage(existing.productImage);
    if (existing.productImages && Array.isArray(existing.productImages)) {
        existing.productImages.forEach(image => deleteOldImage(image));
    }
    if (existing.variants && Array.isArray(existing.variants)) {
        existing.variants.forEach(variant => {
            if (variant.variantImage) deleteOldImage(variant.variantImage);
        });
    }

    return await productRepo.deleteProductById(id);
};
