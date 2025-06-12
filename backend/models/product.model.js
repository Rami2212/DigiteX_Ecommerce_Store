const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
    color: { type: String, required: true },
    variantImage: { type: String, required: true },
}, { _id: false });

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    shortDescription: {
        type: String,
        required: true,
        maxlength: 200,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    salePrice: {
        type: Number,
    },
    productImage: {
        type: String,
        required: true,
    },
    productImages: [{
        type: String,
    }],
    variants: [variantSchema],
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    addons: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Addon',
    }],
    stock: {
        type: Number,
        default: 0,
    },
    views: {
        type: Number,
        default: 0,
    }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
