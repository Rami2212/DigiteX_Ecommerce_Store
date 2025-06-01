import React from 'react';
import PropTypes from 'prop-types';

const Textarea = ({ 
  label, 
  name, 
  value, 
  onChange, 
  error, 
  required = false, 
  disabled = false, 
  rows = 4, 
  maxLength, 
  className = '', 
  placeholder = '',
  ...rest 
}) => {
  const baseClasses = `
    px-4 py-2 border rounded-md 
    focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent 
    transition-colors duration-200 
    bg-white text-gray-900 
    dark:bg-gray-800 dark:text-gray-100 w-full
  `;

  const errorClasses = error 
    ? 'border-red-500 focus:ring-red-500 dark:border-red-400 dark:focus:ring-red-400' 
    : 'border-gray-300 dark:border-gray-600';

  const disabledClasses = disabled 
    ? 'bg-gray-100 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400' 
    : '';

  const textareaClasses = `${baseClasses} ${errorClasses} ${disabledClasses} ${className}`;

  return (
    <div className="w-full mb-4">
      {label && (
        <label
          htmlFor={name}
          className="block mb-1 font-medium text-gray-700 dark:text-gray-300"
        >
          {label} {required && <span className="text-red-500">*</span>}
          {maxLength && (
            <span className="text-sm text-gray-500 ml-2">
              ({value?.length || 0}/{maxLength})
            </span>
          )}
        </label>
      )}
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        rows={rows}
        maxLength={maxLength}
        placeholder={placeholder}
        className={textareaClasses}
        {...rest}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};

Textarea.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  rows: PropTypes.number,
  maxLength: PropTypes.number,
  className: PropTypes.string,
  placeholder: PropTypes.string,
};

Textarea.defaultProps = {
  label: '',
  value: '',
  error: '',
  required: false,
  disabled: false,
  rows: 4,
  maxLength: undefined,
  className: '',
  placeholder: '',
};

export default Textarea;