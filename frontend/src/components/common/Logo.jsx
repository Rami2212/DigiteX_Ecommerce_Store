import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import logo from '../../assets/logo.png';

const Logo = ({ size = 'default', linkTo = '/', className = '' }) => {
  const sizeClasses = {
    small: 'h-12',
    default: 'h-18',
    large: 'h-24',
  };

  return (
    <Link to={linkTo} className={`flex items-center ${className}`}>
      <img
        src={logo}
        alt="DigiteX Logo"
        className={`${sizeClasses[size]} object-contain`}
      />
    </Link>
  );
};

Logo.propTypes = {
  size: PropTypes.oneOf(['small', 'default', 'large']),
  linkTo: PropTypes.string,
  className: PropTypes.string,
};

export default Logo;
