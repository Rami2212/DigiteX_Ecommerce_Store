const categoryRepo = require('../repositories/category.repository');

exports.addCategory = async (data, file) => {
    const existing = await categoryRepo.getAllCategories();
    if (existing.some(c => c.name.toLowerCase() === data.name.toLowerCase())) {
        throw new Error('Category name already exists');
    }

    if (file) {
        data.categoryImage = file.path.replace(/\\/g, '/');
    }

    return await categoryRepo.createCategory(data);
};

exports.getCategories = async () => {
    return await categoryRepo.getAllCategories();
};

exports.updateCategory = async (id, data, file) => {
    const existing = await categoryRepo.getCategoryById(id);
    if (!existing) {
        throw new Error('Category not found');
    }

    if (file) {
        data.categoryImage = file.path.replace(/\\/g, '/');
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
