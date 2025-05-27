const categoryRepo = require('../repositories/category.repository');
require('dotenv').config();

exports.addCategory = async (data, file) => {

    const existing = await categoryRepo.getAllCategories();
    if (existing.some(c => c.name.toLowerCase() === data.name.toLowerCase())) {
        throw new Error('Category name already exists');
    }

    if (file) {
        const relativePath = file.path.replace(/\\/g, '/');
        data.categoryImage = `${process.env.BACKEND_URL}/${relativePath}`;
    }

    return await categoryRepo.createCategory(data);
};

exports.getCategories = async () => {
    return await categoryRepo.getAllCategories();
};

exports.getCategoryById = async (id) => {
    const category = await categoryRepo.getCategoryById(id);
    if (!category) {
        throw new Error('Category not found');
    }
    return category;
}

exports.updateCategory = async (id, data, file) => {
    const existing = await categoryRepo.getCategoryById(id);
    if (!existing) {
        throw new Error('Category not found');
    }

    if (file) {
        const relativePath = file.path.replace(/\\/g, '/');
        data.categoryImage = `${process.env.BACKEND_URL}/${relativePath}`;
    }

    return await categoryRepo.updateCategoryById(id, data);
};

exports.deleteCategory = async (id) => {
    const existing = await categoryRepo.getCategoryById(id);
    if (!existing) {
        throw new Error('Category not found');
    }

    return await categoryRepo.deleteCategoryById(id);
};
