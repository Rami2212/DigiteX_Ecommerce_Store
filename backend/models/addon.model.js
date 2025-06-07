const mongoose = require('mongoose');

const addonSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    price: { type: String, required: true },
    icon: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Addon', addonSchema);
