import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSave, FiX, FiUser } from 'react-icons/fi';
import { useUser } from '../../../hooks/useUser';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';

const AddUserPage = () => {
  const navigate = useNavigate();
  const { createUser, isLoading } = useUser();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: 'user',
    profileImage: null
  });
  
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);

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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        profileImage: file
      }));
      
      // Create preview URL for the image
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      
      if (errors.profileImage) {
        setErrors(prev => ({ ...prev, profileImage: '' }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (formData.phone && !/^\+?[\d\s\-\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
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
      submitData.append('firstName', formData.firstName);
      submitData.append('lastName', formData.lastName);
      submitData.append('username', formData.username);
      submitData.append('email', formData.email);
      submitData.append('password', formData.password);
      submitData.append('role', formData.role);
      
      if (formData.phone.trim()) {
        submitData.append('phone', formData.phone);
      }
      
      // Append the profile image file if selected
      if (formData.profileImage) {
        submitData.append('profileImage', formData.profileImage);
      }
      
      await createUser(submitData);
      navigate('/admin/users');
    } catch (err) {
      console.error('Failed to add user:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Add New User</h1>
        <p className="mt-2 text-sm text-gray-700">
          Create a new user account in the system
        </p>
      </div>

      {/* Form */}
      <div className="bg-white shadow overflow-hidden rounded-lg">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Profile Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Image
            </label>
            
            <div className="mt-1 flex items-center space-x-6">
              <div className="flex-shrink-0">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Profile preview"
                    className="h-24 w-24 object-cover rounded-full"
                  />
                ) : (
                  <div className="h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center">
                    <FiUser className="h-8 w-8 text-gray-400" />
                  </div>
                )}
              </div>
              <label className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none">
                Upload Image
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
              Upload a profile picture (optional)
            </p>
          </div>

          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Input
                name="firstName"
                label="First Name"
                type="text"
                placeholder="Enter first name"
                value={formData.firstName}
                onChange={handleInputChange}
                error={errors.firstName}
                required
                disabled={isLoading}
              />
            </div>
            <div>
              <Input
                name="lastName"
                label="Last Name"
                type="text"
                placeholder="Enter last name"
                value={formData.lastName}
                onChange={handleInputChange}
                error={errors.lastName}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Account Information */}
          <div>
            <Input
              name="username"
              label="Username"
              type="text"
              placeholder="Enter username"
              value={formData.username}
              onChange={handleInputChange}
              error={errors.username}
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <Input
              name="email"
              label="Email Address"
              type="email"
              placeholder="Enter email address"
              value={formData.email}
              onChange={handleInputChange}
              error={errors.email}
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <Input
              name="phone"
              label="Phone Number"
              type="tel"
              placeholder="Enter phone number (optional)"
              value={formData.phone}
              onChange={handleInputChange}
              error={errors.phone}
              disabled={isLoading}
            />
          </div>

          {/* Password Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Input
                name="password"
                label="Password"
                type="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleInputChange}
                error={errors.password}
                required
                disabled={isLoading}
              />
            </div>
            <div>
              <Input
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                error={errors.confirmPassword}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              User Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              disabled={isLoading}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <p className="mt-1 text-xs text-gray-500">
              Select the role for this user
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/admin/users')}
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
              Create User
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserPage;