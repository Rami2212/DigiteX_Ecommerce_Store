const cartRepo = require('../repositories/cart.repository');
const productRepo = require('../repositories/product.repository');

exports.getCart = async (userId) => {
    let cart = await cartRepo.getCartByUserId(userId);

    if (!cart) {
        cart = await cartRepo.createCart(userId);
    }
    return cart;
};

exports.addToCart = async (userId, data) => {
    const { productId, quantity, selectedVariant } = data;

    // Verify product exists
    const product = await productRepo.getProductById(productId);
    if (!product) {
        throw new Error('Product not found');
    }

    // Validate variant if provided
    if (selectedVariant?.color && product.variants.length > 0) {
        const variantExists = product.variants.some(v => v.color === selectedVariant.color);
        if (!variantExists) {
            throw new Error('Selected variant not available');
        }
    }

    // Get or create cart
    let cart = await cartRepo.getCartByUserId(userId);

    if (!cart) {
        cart = await cartRepo.createCart(userId);
    }

    // Calculate price (use salePrice if available, otherwise regular price)
    const itemPrice = product.salePrice || product.price;

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(item => {
        const productMatch = item.product._id.toString() === productId;
        if (!selectedVariant?.color) return productMatch;
        return productMatch && item.selectedVariant?.color === selectedVariant.color;
    });

    if (existingItemIndex > -1) {
        // Update existing item
        cart.items[existingItemIndex].quantity += quantity;
        cart.items[existingItemIndex].totalPrice = cart.items[existingItemIndex].quantity * itemPrice;
    } else {
        // Add new item
        const newItem = {
            product: productId,
            quantity,
            selectedVariant: selectedVariant || {},
            price: itemPrice,
            totalPrice: quantity * itemPrice,
        };
        cart.items.push(newItem);
    }

    return await cart.save();
};

exports.updateCartItem = async (userId, productId, variantColor, quantity) => {
    const cart = await cartRepo.getCartByUserId(userId);
    if (!cart) {
        throw new Error('Cart not found');
    }

    const itemIndex = cart.items.findIndex(item => {
        const productMatch = item.product._id.toString() === productId;
        if (!variantColor) return productMatch;
        return productMatch && item.selectedVariant?.color === variantColor;
    });

    if (itemIndex === -1) {
        throw new Error('Item not found in cart');
    }

    // Update quantity and total price
    cart.items[itemIndex].quantity = quantity;
    cart.items[itemIndex].totalPrice = quantity * cart.items[itemIndex].price;

    return await cart.save();
};

exports.removeFromCart = async (userId, productId, variantColor) => {
    const cart = await cartRepo.getCartByUserId(userId);
    if (!cart) {
        throw new Error('Cart not found');
    }

    const itemIndex = cart.items.findIndex(item => {
        const productMatch = item.product._id.toString() === productId;
        if (!variantColor) return productMatch;
        return productMatch && item.selectedVariant?.color === variantColor;
    });

    if (itemIndex === -1) {
        throw new Error('Item not found in cart');
    }

    cart.items.splice(itemIndex, 1);
    return await cart.save();
};

exports.clearCart = async (userId) => {
    const cart = await cartRepo.getCartByUserId(userId);
    if (!cart) {
        throw new Error('Cart not found');
    }

    cart.items = [];
    return await cart.save();
};

exports.getCartItemCount = async (userId) => {
    const cart = await cartRepo.getCartByUserId(userId);
    return cart ? cart.totalItems : 0;
};

exports.isItemInCart = async (userId, productId, variantColor) => {
    const cart = await cartRepo.getCartByUserId(userId);
    if (!cart) {
        return false;
    }

    const itemExists = cart.items.some(item => {
        const productMatch = item.product._id.toString() === productId;
        if (!variantColor) return productMatch;
        return productMatch && item.selectedVariant?.color === variantColor;
    });

    return itemExists;
};
