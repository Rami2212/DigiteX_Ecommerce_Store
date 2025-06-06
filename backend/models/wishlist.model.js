const mongoose = require('mongoose');

const wishlistItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    selectedVariant: {
        color: { type: String },
        variantImage: { type: String },
    },
    addedAt: {
        type: Date,
        default: Date.now,
    },
}, { _id: false });

const wishlistSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    items: [wishlistItemSchema],
    totalItems: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });

// Calculate total items before saving
wishlistSchema.pre('save', function(next) {
    this.totalItems = this.items.length;
    next();
});

module.exports = mongoose.model('Wishlist', wishlistSchema);