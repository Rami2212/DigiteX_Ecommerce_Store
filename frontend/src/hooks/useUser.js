import { useDispatch, useSelector } from 'react-redux';
import {
  getUsersStart,
  getUsersSuccess,
  getUsersFailure,
  getUserStart,
  getUserSuccess,
  getUserFailure,
  createUserStart,
  createUserSuccess,
  createUserFailure,
  updateUserByAdminStart,
  updateUserByAdminSuccess,
  updateUserByAdminFailure,
  updateUserProfileStart,
  updateUserProfileSuccess,
  updateUserProfileFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  changeEmailStart,
  changeEmailSuccess,
  changeEmailFailure,
  clearUserError,
  clearCurrentUser,
  resetUserState,
} from '../redux/slices/userSlice';
import { userAPI } from '../lib/api/user';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export const useUser = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users, currentUser, isLoading, error, totalUsers } = useSelector((state) => state.user);

  // Get all users (admin only)
  const getUsers = async () => {
    try {
      dispatch(getUsersStart());
      const data = await userAPI.getUsers();
      dispatch(getUsersSuccess(data));
      return data;
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Failed to fetch users';
      toast.error(errorMessage);
      dispatch(getUsersFailure(errorMessage));
      throw error;
    }
  };

  // Get single user by ID (admin only)
  const getUserById = async (id) => {
    try {
      dispatch(getUserStart());
      const data = await userAPI.getUserById(id);
      dispatch(getUserSuccess(data));
      return data;
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'User not found';
      if (error.response?.status === 404) {
        toast.error('User not found');
      } else {
        toast.error(errorMessage);
      }
      dispatch(getUserFailure(errorMessage));
      throw error;
    }
  };

  // Create new user (admin only)
  const createUser = async (userData) => {
    try {
      dispatch(createUserStart());
      const data = await userAPI.createUser(userData);
      dispatch(createUserSuccess(data));
      toast.success('User created successfully!');
      return data;
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Failed to create user';
      
      if (errorMessage.includes('Email already exists')) {
        toast.error('Email already exists');
      } else if (errorMessage.includes('Username already exists')) {
        toast.error('Username already exists');
      } else {
        toast.error(errorMessage);
      }
      
      dispatch(createUserFailure(errorMessage));
      throw error;
    }
  };

  // Update user by admin
  const updateUserByAdmin = async (id, userData) => {
    try {
      dispatch(updateUserByAdminStart());
      const data = await userAPI.updateUserByAdmin(id, userData);
      dispatch(updateUserByAdminSuccess(data));
      toast.success('User updated successfully!');
      return data;
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Failed to update user';
      if (error.response?.status === 404) {
        toast.error('User not found');
      } else {
        toast.error(errorMessage);
      }
      dispatch(updateUserByAdminFailure(errorMessage));
      throw error;
    }
  };


  // Delete user (admin only)
  const deleteUser = async (id) => {
    try {
      dispatch(deleteUserStart());
      await userAPI.deleteUser(id);
      dispatch(deleteUserSuccess(id));
      toast.success('User deleted successfully!');
      return { message: 'User deleted successfully' };
    } catch (error) {
      const errorMessage = error.response?.error || error.response?.message || 'Failed to delete user';
      if (error.response?.status === 404) {
        toast.error('User not found');
      } else {
        toast.error(errorMessage);
      }
      dispatch(deleteUserFailure(errorMessage));
      throw error;
    }
  };

  // Clear user error
  const clearError = () => {
    dispatch(clearUserError());
  };

  // Clear current user
  const clearUser = () => {
    dispatch(clearCurrentUser());
  };

  // Reset user state
  const resetState = () => {
    dispatch(resetUserState());
  };

  return {
    users,
    currentUser,
    isLoading,
    error,
    totalUsers,
    getUsers,
    getUserById,
    createUser,
    updateUserByAdmin,
    deleteUser,
    clearError,
    clearUser,
    resetState,
  };
};