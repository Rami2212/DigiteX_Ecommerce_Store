import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSave, FiX } from 'react-icons/fi';
import { useAddon } from '../../../hooks/useAddon';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import IconSelector from '../../../components/common/IconSelector';

const AddAddonPage = () => {
  const navigate = useNavigate();
  const { addAddon, isLoading } = useAddon();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '',
    price: ''
  });
  
  const [errors, setErrors] = useState({});

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

  const handleIconSelect = (iconName) => {
    setFormData(prev => ({
      ...prev,
      icon: iconName
    }));

    if (errors.icon) {
      setErrors(prev => ({ ...prev, icon: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Addon name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.icon) {
      newErrors.icon = 'Icon is required';
    }

    if (!formData.price) {
      newErrors.price = 'Price is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const submitData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        icon: formData.icon,
        price: formData.price,
      };
      
      await addAddon(submitData);
      navigate('/admin/addons');
    } catch (err) {
      console.error('Failed to add addon:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Add New Addon</h1>
        <p className="mt-2 text-sm text-gray-700">
          Create a new addon for your services
        </p>
      </div>

      {/* Form */}
      <div className="bg-white shadow overflow-hidden rounded-lg">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <Input
              name="name"
              label="Addon Name"
              type="text"
              placeholder="Enter addon name"
              value={formData.name}
              onChange={handleInputChange}
              error={errors.name}
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
              {errors.description && (
                <span className="text-red-500 ml-2 text-xs">{errors.description}</span>
              )}
            </label>
            <textarea
              name="description"
              rows={4}
              placeholder="Enter addon description"
              value={formData.description}
              onChange={handleInputChange}
              disabled={isLoading}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <IconSelector
              label="Icon"
              selectedIcon={formData.icon}
              onIconSelect={handleIconSelect}
              error={errors.icon}
              disabled={isLoading}
            />
          </div>

          <div>
            <Input
              name="price"
              label="Price (Rs.)"
              type="number"
              step="0.01"
              min="0"
              placeholder="Enter price"
              value={formData.price}
              onChange={handleInputChange}
              error={errors.price}
              required
              disabled={isLoading}
              className="dark:bg-white dark:text-gray-900"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/admin/addons')}
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
              Save Addon
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAddonPage;