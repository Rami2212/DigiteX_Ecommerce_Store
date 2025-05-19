const Category = require('../models/category.model');

exports.createCategory = async (data) => await Category.create(data);

exports.getAllCategories = async () => await Category.find();

exports.getCategoryById = async (id) => await Category.findById(id);

exports.updateCategoryById = async (id, data) => await Category.findByIdAndUpdate(id, data, { new: true });

exports.deleteCategoryById = async (id) => await Category.findByIdAndDelete(id);
