import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import { loginSuccess } from '../../redux/slices/authSlice';

const AuthSuccess = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      const user = {
        id: decoded.id,
        email: decoded.email,
        username: decoded.username,
        firstName: decoded.firstName,
        lastName: decoded.lastName,
        profileImage: decoded.profileImage,
        role: decoded.role,
      };

      dispatch(loginSuccess({ token, user }));
      navigate('/');
    } else {
      navigate('/auth/login');
    }
  }, [token, dispatch, navigate]);

  return <p>Logging you in with Google...</p>;
};

export default AuthSuccess;
