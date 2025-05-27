import { useDispatch, useSelector } from 'react-redux';
import {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  registerStart,
  registerSuccess,
  registerFailure,
  clearError,
  updateUserProfileStart,
  updateUserProfileSuccess,
  updateUserProfileFailure,
  changeEmailStart,
  changeEmailSuccess,
  changeEmailFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
} from '../redux/slices/authSlice';
import { authAPI } from '../lib/api/auth';
import { userAPI } from '../lib/api/user';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token, isLoading, error, isAuthenticated, isAdmin } = useSelector((state) => state.auth);

  const login = async (credentials) => {
    try {
      dispatch(loginStart());
      const data = await authAPI.login(credentials);
      dispatch(loginSuccess(data));
      toast.success('Login successful!');
      navigate('/user/dashboard');
      return data;
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Login failed';

      // If the error is because email is not verified
      if (error.response?.data?.isVerified === false) {
        toast.error('Email not verified. Please check your email for the verification code.');
        navigate('/auth/verify-email', { state: { email: credentials.identifier } });
      } else {
        toast.error(errorMessage);
        dispatch(loginFailure(errorMessage));
      }

      throw error;
    }
  };

  const adminLogin = async (credentials) => {
    try {
      dispatch(loginStart());
      const data = await authAPI.adminLogin(credentials);
      dispatch(loginSuccess(data));
      toast.success('Admin login successful!');
      navigate('/admin/dashboard');
      window.location.reload();
      return data;
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Admin login failed';
      toast.error(errorMessage);
      dispatch(loginFailure(errorMessage));
      throw error;
    }
  }

  const register = async (userData) => {
    try {
      dispatch(registerStart());
      const data = await authAPI.register(userData);
      dispatch(registerSuccess());
      toast.success('Registration successful! Please verify your email.');
      navigate('/auth/verify-email', { state: { email: userData.email } });
      return data;
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Registration failed';
      toast.error(errorMessage);
      dispatch(registerFailure(errorMessage));
      throw error;
    }
  };

  const verifyOtp = async (data) => {
    try {
      const response = await authAPI.verifyOtp(data);
      if(localStorage.getItem('purpose') === 'changeEmail') {
        toast.success('Email verification successful! Please enter new email.');
        navigate('/user/change-email');
        return;
      }
      toast.success('Email verification successful! Please login.');
      navigate('/auth/login');
      return response;
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Verification failed';
      toast.error(errorMessage);
      throw error;
    }
  };

  const resendOtp = async (email) => {
    try {
      const response = await authAPI.resendOtp(email);
      toast.success('Verification code resent!');
      return response;
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to resend verification code';
      toast.error(errorMessage);
      throw error;
    }
  };

  const sendOtp = async (email) => {
    try {
      const response = await authAPI.sendOtp(email);
      toast.success('Verification code sent!');
      return response;
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to resend verification code';
      toast.error(errorMessage);
      throw error;
    }
  };

  const forgotPassword = async (email) => {
    try {
      const response = await authAPI.forgotPassword(email);
      toast.success('Password reset link sent to your email!');
      return response;
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to send reset link';
      toast.error(errorMessage);
      throw error;
    }
  };

  const forgotPasswordLoggedIn = async (email) => {
    try {
      const response = await authAPI.forgotPasswordLoggedIn(email);
      toast.success('Password reset link sent to your email!');
      return response;
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to send reset link';
      toast.error(errorMessage);
      throw error;
    }
  };

  const resetPassword = async (token, password) => {
    try {
      const response = await authAPI.resetPassword(token, password);
      toast.success('Password reset successful! Please login.');
      dispatch(logout());
      navigate('/auth/login');
      return response;
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Password reset failed';
      toast.error(errorMessage);
      throw error;
    }
  };

  const logoutUser = () => {
    dispatch(logout());
    toast.info('Logged out successfully');
    navigate('/auth/login');
  };

  const clearAuthError = () => {
    dispatch(clearError());
  };

  const updateUserProfile = async (userData) => {
    try {
      dispatch(updateUserProfileStart());
      const data = await userAPI.updateUserProfile(userData);
      dispatch(updateUserProfileSuccess(data.user));
      toast.success('Profile updated successfully!');
      return data;
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Failed to update profile';
      if (error.response?.status === 404) {
        toast.error('User not found');
      } else {
        toast.error(errorMessage);
      }
      dispatch(updateUserProfileFailure(errorMessage));
      throw error;
    }
  };

  // Change email (for logged-in user)
    const changeEmail = async (emailData) => {
      try {
        dispatch(changeEmailStart());
        const data = await userAPI.changeEmail(emailData);
        dispatch(changeEmailSuccess());
        dispatch(logout());
        toast.success('Verification email sent to new address');
        return data;
      } catch (error) {
        const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Failed to change email';
        
        if (error.response?.status === 404) {
          toast.error('User not found');
        } else if (errorMessage.includes('Email already taken')) {
          toast.error('Email already taken');
        } else {
          toast.error(errorMessage);
        }
        
        dispatch(changeEmailFailure(errorMessage));
        throw error;
      }
    };

    // Delete own user account
      const deleteOwnUser = async (id) => {
        try {
          dispatch(deleteUserStart());
          await userAPI.deleteOwnUser(id);
          dispatch(deleteUserSuccess(id));
          dispatch(logout());
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

  return {
    user,
    token,
    isLoading,
    error,
    isAuthenticated,
    isAdmin,
    login,
    adminLogin,
    register,
    verifyOtp,
    resendOtp,
    sendOtp,
    forgotPassword,
    forgotPasswordLoggedIn,
    resetPassword,
    logout: logoutUser,
    clearAuthError,
    updateUserProfile,
    changeEmail,
    deleteOwnUser,
  };
};