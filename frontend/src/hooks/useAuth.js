import { useDispatch, useSelector } from 'react-redux';
import { 
  loginStart, 
  loginSuccess, 
  loginFailure, 
  logout, 
  registerStart, 
  registerSuccess, 
  registerFailure,
  clearError
} from '../redux/slices/authSlice';
import { authAPI } from '../lib/api/auth';
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
      navigate('/');
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

  const resetPassword = async (token, password) => {
    try {
      const response = await authAPI.resetPassword(token, password);
      toast.success('Password reset successful! Please login.');
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
    forgotPassword,
    resetPassword,
    logout: logoutUser,
    clearAuthError,
  };
};