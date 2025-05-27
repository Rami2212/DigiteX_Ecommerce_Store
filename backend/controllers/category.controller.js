const categoryService = require('../services/category.service');
const { addCategoryDto, updateCategoryDto } = require('../dtos/category.dto');

exports.addCategory = async (req, res) => {
    try {
        const { error } = addCategoryDto.validate(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        const category = await categoryService.addCategory(req.body, req.file);
        return res.status(201).json({ message: 'Category added successfully', category });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message || 'Internal Server Error' });
    }
};

exports.getCategories = async (req, res) => {
    try {
        const categories = await categoryService.getCategories();
        if (categories.length === 0) {
            return res.status(200).json({ message: 'No categories found', categories: [] });
        }
        return res.status(200).json(categories);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message || 'Internal Server Error' });
    }
};

exports.getCategoryById = async (req, res) => {
    try {
        const category = await categoryService.getCategoryById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        return res.status(200).json(category);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message || 'Internal Server Error' });
    }
}

exports.updateCategory = async (req, res) => {
    try {
        const { error } = updateCategoryDto.validate(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        const updated = await categoryService.updateCategory(req.params.id, req.body, req.file);
        return res.status(200).json({ message: 'Category updated', category: updated });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message || 'Internal Server Error' });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        await categoryService.deleteCategory(req.params.id);
        return res.status(200).json({ message: 'Category deleted' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message || 'Internal Server Error' });
    }
};
