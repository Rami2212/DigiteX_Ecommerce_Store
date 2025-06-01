const Product = require('../models/product.model');

exports.createProduct = async (data) => await Product.create(data);

exports.getAllProducts = async () => await Product.find();

exports.getProductById = async (id) => await Product.findById(id);

exports.updateProductById = async (id, data) =>
    await Product.findByIdAndUpdate(id, data, { new: true });

exports.deleteProductById = async (id) => await Product.findByIdAndDelete(id);
