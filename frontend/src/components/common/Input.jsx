import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const Input = forwardRef(({
  type = 'text',
  label,
  name,
  id,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  required = false,
  disabled = false,
  className = '',
  icon,
  iconPosition = 'left',
  fullWidth = true,
  ...rest
}, ref) => {
  const baseInputClasses = `
    px-4 py-2 border rounded-md 
    focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent 
    transition-colors duration-200 
    bg-white text-gray-900 
    dark:bg-gray-800 dark:text-gray-100
  `;

  const errorClasses = error 
    ? 'border-red-500 focus:ring-red-500 dark:border-red-400 dark:focus:ring-red-400' 
    : 'border-gray-300 dark:border-gray-600';

  const disabledClasses = disabled 
    ? 'bg-gray-100 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400' 
    : '';

  const widthClasses = fullWidth ? 'w-full' : '';
  const iconClasses = icon ? (iconPosition === 'left' ? 'pl-10' : 'pr-10') : '';

  const inputClasses = `${baseInputClasses} ${errorClasses} ${disabledClasses} ${widthClasses} ${iconClasses} ${className}`;

  return (
    <div className={`${fullWidth ? 'w-full' : ''} mb-4`}>
      {label && (
        <label
          htmlFor={id || name}
          className="block mb-1 font-medium text-gray-700 dark:text-gray-300"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="relative">
        {icon && iconPosition === 'left' && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500 dark:text-gray-400">
            {icon}
          </div>
        )}

        <input
          ref={ref}
          type={type}
          id={id || name}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          required={required}
          className={inputClasses}
          aria-invalid={error ? 'true' : 'false'}
          {...rest}
        />

        {icon && iconPosition === 'right' && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500 dark:text-gray-400">
            {icon}
          </div>
        )}
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
});

Input.propTypes = {
  type: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  id: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  error: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  icon: PropTypes.node,
  iconPosition: PropTypes.oneOf(['left', 'right']),
  fullWidth: PropTypes.bool,
};

Input.displayName = 'Input';

export default Input;
