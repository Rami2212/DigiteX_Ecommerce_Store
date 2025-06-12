import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSave, FiX, FiPlus, FiTrash2 } from 'react-icons/fi';
import { useProduct } from '../../../hooks/useProduct';
import { useCategory } from '../../../hooks/useCategory';
import { useAddon } from '../../../hooks/useAddon';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import Textarea from '../../../components/common/Textarea';
import Select from '../../../components/common/Select';

const AddProductPage = () => {
  const navigate = useNavigate();
  const { addProduct, isLoading } = useProduct();
  const { categories, getCategories } = useCategory();
  const { addons, getAddons } = useAddon();
  
  const [formData, setFormData] = useState({
    name: '',
    shortDescription: '',
    description: '',
    price: '',
    salePrice: '',
    category: '',
    addons: [],
    stock: 0,
    productImage: null,
    productImages: [],
    variants: [{ color: '', variantImage: null }]
  });
  
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState([]);
  const [variantImagePreviews, setVariantImagePreviews] = useState([null]);

  useEffect(() => {
    getCategories();
    getAddons();
  }, []);

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

  const handleAddonToggle = (addonId) => {
    setFormData(prev => ({
      ...prev,
      addons: prev.addons.includes(addonId)
        ? prev.addons.filter(id => id !== addonId)
        : [...prev.addons, addonId]
    }));
  };

  const handleVariantChange = (index, field, value) => {
    const updatedVariants = [...formData.variants];
    updatedVariants[index] = {
      ...updatedVariants[index],
      [field]: value
    };
    
    setFormData(prev => ({
      ...prev,
      variants: updatedVariants
    }));
  };

  const addVariant = () => {
    setFormData(prev => ({
      ...prev,
      variants: [...prev.variants, { color: '', variantImage: null }]
    }));
    setVariantImagePreviews(prev => [...prev, null]);
  };

  const removeVariant = (index) => {
    const updatedVariants = [...formData.variants];
    updatedVariants.splice(index, 1);
    
    const updatedPreviews = [...variantImagePreviews];
    updatedPreviews.splice(index, 1);
    
    setFormData(prev => ({
      ...prev,
      variants: updatedVariants
    }));
    setVariantImagePreviews(updatedPreviews);
  };

  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        productImage: file
      }));
      
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      
      if (errors.productImage) {
        setErrors(prev => ({ ...prev, productImage: '' }));
      }
    }
  };

  const handleAdditionalImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setFormData(prev => ({
        ...prev,
        productImages: files
      }));
      
      const previewUrls = files.map(file => URL.createObjectURL(file));
      setAdditionalImagePreviews(previewUrls);
    }
  };

  const handleVariantImageChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const updatedVariants = [...formData.variants];
      updatedVariants[index] = {
        ...updatedVariants[index],
        variantImage: file
      };
      
      setFormData(prev => ({
        ...prev,
        variants: updatedVariants
      }));
      
      const previewUrl = URL.createObjectURL(file);
      const updatedPreviews = [...variantImagePreviews];
      updatedPreviews[index] = previewUrl;
      setVariantImagePreviews(updatedPreviews);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!formData.shortDescription.trim()) {
      newErrors.shortDescription = 'Short description is required';
    } else if (formData.shortDescription.length > 200) {
      newErrors.shortDescription = 'Short description must be 200 characters or less';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Product description is required';
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Valid price is required';
    }

    if (formData.salePrice && parseFloat(formData.salePrice) <= 0) {
      newErrors.salePrice = 'Sale price must be a positive number';
    }

    if (formData.salePrice && formData.price && parseFloat(formData.salePrice) >= parseFloat(formData.price)) {
      newErrors.salePrice = 'Sale price must be less than regular price';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.productImage) {
      newErrors.productImage = 'Main product image is required';
    }

    // Validate variants
    const validVariants = formData.variants.filter(variant => variant.color.trim() !== '');
    if (validVariants.length === 0) {
      newErrors.variants = 'At least one variant with color is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('shortDescription', formData.shortDescription);
      submitData.append('description', formData.description);
      submitData.append('price', formData.price);
      if (formData.salePrice) {
        submitData.append('salePrice', formData.salePrice);
      }
      submitData.append('category', formData.category);
      
      // Append addons
      if (formData.addons.length > 0) {
        formData.addons.forEach(addonId => {
          submitData.append('addons[]', addonId);
        });
      }
      submitData.append('stock', formData.stock);
      
      // Append main product image
      if (formData.productImage) {
        submitData.append('productImage', formData.productImage);
      }
      
      // Append additional product images
      if (formData.productImages.length > 0) {
        formData.productImages.forEach(image => {
          submitData.append('productImages', image);
        });
      }
      
      // Filter valid variants and append variant images
      const validVariants = formData.variants.filter(variant => variant.color.trim() !== '');
      
      validVariants.forEach(variant => {
        if (variant.variantImage) {
          submitData.append('variantImages', variant.variantImage);
        }
      });
      
      // Append variants as JSON string
      const variantsData = validVariants.map(variant => ({
        color: variant.color,
        variantImage: variant.variantImage ? 'placeholder' : '' // Will be replaced by backend
      }));
      
      submitData.append('variants', JSON.stringify(variantsData));
      
      await addProduct(submitData);
      navigate('/admin/products');
    } catch (err) {
      console.error('Failed to add product:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Add New Product</h1>
        <p className="mt-2 text-sm text-gray-700">
          Create a new product for your inventory
        </p>
      </div>

      {/* Form */}
      <div className="bg-white shadow overflow-hidden rounded-lg">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <Input
                name="name"
                label="Product Name"
                type="text"
                placeholder="Enter product name"
                value={formData.name}
                onChange={handleInputChange}
                error={errors.name}
                required
                disabled={isLoading}
              />
            </div>
            
            <div>
              <Input
                name="price"
                label="Price"
                type="number"
                placeholder="0.00"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={handleInputChange}
                error={errors.price}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <Textarea
                name="shortDescription"
                label="Short Description"
                placeholder="Enter a brief product description"
                value={formData.shortDescription}
                onChange={handleInputChange}
                error={errors.shortDescription}
                required
                disabled={isLoading}
                rows={5}
                maxLength={200}
              />
            </div>
            
            <div>
              <Input
                name="salePrice"
                label="Sale Price (Optional)"
                type="number"
                placeholder="0.00"
                step="0.01"
                min="0"
                value={formData.salePrice}
                onChange={handleInputChange}
                error={errors.salePrice}
                disabled={isLoading}
              />

              <Input
                name="stock"
                label="Stock Quantity"
                type="number"
                placeholder="Enter stock quantity"
                min="0"
                value={formData.stock}
                onChange={handleInputChange}
                error={errors.stock}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <Textarea
              name="description"
              label="Full Description"
              placeholder="Enter detailed product description"
              value={formData.description}
              onChange={handleInputChange}
              error={errors.description}
              required
              disabled={isLoading}
              rows={4}
            />
          </div>

          <div>
            <Select
              name="category"
              label="Category"
              value={formData.category}
              onChange={handleInputChange}
              error={errors.category}
              required
              disabled={isLoading}
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </Select>
          </div>

          {/* Addons Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Product Addons (Optional)
            </label>
            
            {addons && addons.length > 0 ? (
              <div className="space-y-2">
                {addons.map(addon => (
                  <div
                    key={addon._id}
                    className="flex items-center p-3 border border-gray-200 rounded-md hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      id={`addon-${addon._id}`}
                      checked={formData.addons.includes(addon._id)}
                      onChange={() => handleAddonToggle(addon._id)}
                      disabled={isLoading}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor={`addon-${addon._id}`}
                      className="ml-3 flex-1 cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {addon.name}
                          </p>
                          {addon.description && (
                            <p className="text-sm text-gray-500">
                              {addon.description}
                            </p>
                          )}
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          ${addon.price}
                        </div>
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-gray-500 italic">
                No addons available. You can create addons from the addons management page.
              </div>
            )}
            
            {formData.addons.length > 0 && (
              <div className="mt-3 p-3 bg-blue-50 rounded-md">
                <p className="text-sm text-blue-800">
                  <strong>{formData.addons.length}</strong> addon{formData.addons.length > 1 ? 's' : ''} selected
                </p>
              </div>
            )}
          </div>

          {/* Main Product Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Main Product Image
              {errors.productImage && (
                <span className="text-red-500 ml-2 text-xs">{errors.productImage}</span>
              )}
            </label>
            
            <div className="mt-1 flex items-center space-x-6">
              <div className="flex-shrink-0">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Product preview"
                    className="h-24 w-24 object-cover rounded-md"
                  />
                ) : (
                  <div className="h-24 w-24 rounded-md bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-400">No image</span>
                  </div>
                )}
              </div>
              <label className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none">
                Upload Main Image
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleMainImageChange}
                  disabled={isLoading}
                />
              </label>
            </div>
          </div>

          {/* Additional Product Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Product Images (Optional)
            </label>
            
            <div className="mt-1">
              <label className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none">
                Upload Additional Images
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  multiple
                  onChange={handleAdditionalImagesChange}
                  disabled={isLoading}
                />
              </label>
              
              {additionalImagePreviews.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {additionalImagePreviews.map((preview, index) => (
                    <img
                      key={index}
                      src={preview}
                      alt={`Additional ${index + 1}`}
                      className="h-20 w-20 object-cover rounded-md"
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Product Variants */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Variants
              {errors.variants && (
                <span className="text-red-500 ml-2 text-xs">{errors.variants}</span>
              )}
            </label>
            
            {formData.variants.map((variant, index) => (
              <div key={index} className="border border-gray-200 rounded-md p-4 mb-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-medium text-gray-900">Variant {index + 1}</h4>
                  {formData.variants.length > 1 && (
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => removeVariant(index)}
                      icon={<FiTrash2 className="h-4 w-4" />}
                      disabled={isLoading}
                    >
                      Remove
                    </Button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <Input
                      name={`variant-color-${index}`}
                      label="Color"
                      type="text"
                      placeholder="Enter color"
                      value={variant.color}
                      onChange={(e) => handleVariantChange(index, 'color', e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Variant Image
                    </label>
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        {variantImagePreviews[index] ? (
                          <img
                            src={variantImagePreviews[index]}
                            alt={`Variant ${index + 1}`}
                            className="h-16 w-16 object-cover rounded-md"
                          />
                        ) : (
                          <div className="h-16 w-16 rounded-md bg-gray-100 flex items-center justify-center">
                            <span className="text-gray-400 text-xs">No image</span>
                          </div>
                        )}
                      </div>
                      <label className="cursor-pointer bg-white py-1 px-2 border border-gray-300 rounded-md shadow-sm text-xs leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none">
                        Upload
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => handleVariantImageChange(index, e)}
                          disabled={isLoading}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            <Button
              type="button"
              variant="secondary"
              onClick={addVariant}
              icon={<FiPlus className="h-4 w-4" />}
              disabled={isLoading}
            >
              Add Variant
            </Button>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/admin/products')}
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
              Save Product
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductPage;