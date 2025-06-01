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
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
