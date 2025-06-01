const productRepo = require('../repositories/product.repository');
require('dotenv').config();

exports.addProduct = async (data, files) => {
    const existing = await productRepo.getAllProducts();
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

exports.getProducts = async () => {
    return await productRepo.getAllProducts();
};

exports.getProductById = async (id) => {
    const product = await productRepo.getProductById(id);
    if (!product) {
        throw new Error('Product not found');
    }
    return product;
};

exports.updateProduct = async (id, data, files) => {
    const existing = await productRepo.getProductById(id);
    if (!existing) {
        throw new Error('Product not found');
    }

    // Update main product image if present
    if (files?.productImage?.[0]) {
        const relativePath = files.productImage[0].path.replace(/\\/g, '/');
        data.productImage = `${process.env.BACKEND_URL}/${relativePath}`;
    }

    // Update additional product images if present
    if (files?.productImages) {
        data.productImages = files.productImages.map(file => {
            const relativePath = file.path.replace(/\\/g, '/');
            return `${process.env.BACKEND_URL}/${relativePath}`;
        });
    }

    // Parse variants if JSON string
    if (data.variants && typeof data.variants === 'string') {
        data.variants = JSON.parse(data.variants);
    }

    // Update variant images
    if (files?.variantImages) {
        const variantImages = files.variantImages.map(file => {
            const relativePath = file.path.replace(/\\/g, '/');
            return `${process.env.BACKEND_URL}/${relativePath}`;
        });

        if (Array.isArray(data.variants)) {
            data.variants = data.variants.map((variant, index) => ({
                ...variant,
                variantImage: variantImages[index] || '',
            }));
        }
    }

    return await productRepo.updateProductById(id, data);
};

exports.deleteProduct = async (id) => {
    const existing = await productRepo.getProductById(id);
    if (!existing) {
        throw new Error('Product not found');
    }

    return await productRepo.deleteProductById(id);
};
