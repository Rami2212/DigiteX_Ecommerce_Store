import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiSave, FiX } from 'react-icons/fi';
import { useCategory } from '../../../hooks/useCategory';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';

const EditCategoryPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { getCategoryById, updateCategory, isLoading } = useCategory();
  
  const [formData, setFormData] = useState({
    name: '',
    subCategories: [''],
    categoryImage: null
  });
  
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Fetch category data when component mounts
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const categoryData = await getCategoryById(id);
        console.log(categoryData)
        // Set form data with fetched category
        setFormData({
          name: categoryData.name,
          subCategories: categoryData.subCategories.length > 0 
            ? categoryData.subCategories 
            : [''],
          categoryImage: categoryData.categoryImage || null // Store reference to existing image
        });
        
        // Set image preview if available
        if (categoryData.categoryImage) {
          setImagePreview(categoryData.categoryImage);
        }
        
      } catch (err) {
        console.error('Failed to fetch category:', err);
      } finally {
        setIsInitialLoading(false);
      }
    };

    if (id) {
      fetchCategory();
    }
  }, [id, getCategoryById]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubCategoryChange = (index, value) => {
    const updatedSubCategories = [...formData.subCategories];
    updatedSubCategories[index] = value;
    
    setFormData(prev => ({
      ...prev,
      subCategories: updatedSubCategories
    }));
  };

  const addSubCategory = () => {
    setFormData(prev => ({
      ...prev,
      subCategories: [...prev.subCategories, '']
    }));
  };

  const removeSubCategory = (index) => {
    const updatedSubCategories = [...formData.subCategories];
    updatedSubCategories.splice(index, 1);
    
    setFormData(prev => ({
      ...prev,
      subCategories: updatedSubCategories
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        categoryImage: file
      }));
      
      // Create preview URL for the image
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      
      if (errors.categoryImage) {
        setErrors(prev => ({ ...prev, categoryImage: '' }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Category name is required';
    }

    // Filter out empty subCategories
    const validSubCategories = formData.subCategories.filter(sub => sub.trim() !== '');
    if (validSubCategories.length === 0) {
      newErrors.subCategories = 'At least one subcategory is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      // Create FormData object for multipart/form-data submission
      const submitData = new FormData();
      submitData.append('name', formData.name);
      
      // Filter out empty subCategories
      const validSubCategories = formData.subCategories.filter(sub => sub.trim() !== '');
      
      // Append each subcategory
      validSubCategories.forEach(subCategory => {
        submitData.append('subCategories', subCategory);
      });
      
      // Handle category image
      if (formData.categoryImage instanceof File) {
        // If it's a new File object (user selected a new image)
        submitData.append('categoryImage', formData.categoryImage);
      } else if (formData.categoryImage) {
        // If it's the existing image URL/path, send it as is
        submitData.append('categoryImage', formData.categoryImage);
      }
      
      await updateCategory(id, submitData);
      navigate('/admin/categories');
    } catch (err) {
      console.error('Failed to update category:', err);
    }
  };

  if (isInitialLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Edit Category</h1>
        <p className="mt-2 text-sm text-gray-700">
          Update the details for this category
        </p>
      </div>

      {/* Form */}
      <div className="bg-white shadow overflow-hidden rounded-lg">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <Input
              name="name"
              label="Category Name"
              type="text"
              placeholder="Enter category name"
              value={formData.name}
              onChange={handleInputChange}
              error={errors.name}
              required
              disabled={isLoading}
            />
          </div>

          {/* Subcategories Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subcategories
              {errors.subCategories && (
                <span className="text-red-500 ml-2 text-xs">{errors.subCategories}</span>
              )}
            </label>
            
            {formData.subCategories.map((subCategory, index) => (
              <div key={index} className="flex items-center mb-2">
                <Input
                  name={`subCategory-${index}`}
                  type="text"
                  placeholder="Enter subcategory"
                  value={subCategory}
                  onChange={(e) => handleSubCategoryChange(index, e.target.value)}
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button 
                  type="button"
                  variant="secondary"
                  onClick={() => removeSubCategory(index)}
                  className="ml-2"
                  disabled={formData.subCategories.length <= 1}
                >
                  Remove
                </Button>
              </div>
            ))}
            
            <Button
              type="button"
              variant="secondary"
              onClick={addSubCategory}
              className="mt-2"
              disabled={isLoading}
            >
              Add Subcategory
            </Button>
          </div>

          {/* Category Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category Image
            </label>
            
            <div className="mt-1 flex items-center space-x-6">
              <div className="flex-shrink-0">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Category preview"
                    className="h-24 w-24 object-cover rounded-md"
                  />
                ) : (
                  <div className="h-24 w-24 rounded-md bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-400">No image</span>
                  </div>
                )}
              </div>
              <label className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none">
                {imagePreview ? 'Change Image' : 'Upload Image'}
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={isLoading}
                />
              </label>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              {imagePreview 
                ? 'Current image will be kept if no new image is selected' 
                : 'Upload a high-quality image for the category'}
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/admin/categories')}
              icon={<FiX className="h-4 w-4" />}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              icon={<FiSave className="h-4 w-4" />}
              isLoading={isLoading}
              disabled={isLoading}
            >
              Update Category
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCategoryPage;