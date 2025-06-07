const Product = require('../models/product.model');

exports.createProduct = async (data) => await Product.create(data);

exports.getAll = async () => await Product.find();

exports.getAllProducts = async (page = 1, limit = 10) => {
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
        Product.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),
        Product.countDocuments()
    ]);

    return {
        products,
        totalProducts: total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
    };
};

exports.getProductById = async (id) => await Product.findById(id);

exports.getProductsByCategory = async (categoryId, page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    const filter = { category: categoryId };

    const [products, total] = await Promise.all([
        Product.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),
        Product.countDocuments(filter)
    ]);

    return {
        products,
        totalProducts: total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
    };
};


exports.updateProductById = async (id, data) =>
    await Product.findByIdAndUpdate(id, data, { new: true });

exports.deleteProductById = async (id) => await Product.findByIdAndDelete(id);
