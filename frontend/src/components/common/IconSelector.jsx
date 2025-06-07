import React, { useState } from 'react';
import * as Icons from 'react-icons/fi';

const IconSelector = ({ label, selectedIcon, onIconSelect, error, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Get all available icons from react-icons/fi
  const availableIcons = Object.keys(Icons).filter(iconName => 
    iconName !== 'IconContext' && iconName.startsWith('Fi')
  );

  // Filter icons based on search term
  const filteredIcons = availableIcons.filter(iconName =>
    iconName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleIconClick = (iconName) => {
    onIconSelect(iconName);
    setIsOpen(false);
    setSearchTerm('');
  };

  const renderSelectedIcon = () => {
    if (!selectedIcon) return null;
    const IconComponent = Icons[selectedIcon];
    if (IconComponent) {
      return <IconComponent className="h-6 w-6 text-gray-600" />;
    }
    return null;
  };

  const renderIcon = (iconName) => {
    const IconComponent = Icons[iconName];
    if (IconComponent) {
      return <IconComponent className="h-5 w-5" />;
    }
    return null;
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {error && (
          <span className="text-red-500 ml-2 text-xs">{error}</span>
        )}
      </label>
      
      <div className="relative">
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`
            relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-pointer
            focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm
            ${disabled ? 'bg-gray-50 cursor-not-allowed' : 'hover:bg-gray-50'}
            ${error ? 'border-red-300' : 'border-gray-300'}
          `}
        >
          <span className="flex items-center">
            {selectedIcon ? (
              <>
                {renderSelectedIcon()}
                <span className="ml-3 block truncate">{selectedIcon}</span>
              </>
            ) : (
              <span className="block truncate text-gray-500">Select an icon</span>
            )}
          </span>
          <span className="ml-3 absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <Icons.FiChevronDown className="h-5 w-5 text-gray-400" />
          </span>
        </button>

        {isOpen && !disabled && (
          <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-96 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
            {/* Search input */}
            <div className="sticky top-0 z-10 bg-white px-3 py-2 border-b">
              <input
                type="text"
                placeholder="Search icons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            
            {/* Icons grid */}
            <div className="p-2">
              {filteredIcons.length > 0 ? (
                <div className="grid grid-cols-6 gap-2">
                  {filteredIcons.slice(0, 60).map((iconName) => (
                    <button
                      key={iconName}
                      type="button"
                      onClick={() => handleIconClick(iconName)}
                      className={`
                        flex flex-col items-center justify-center p-2 rounded-md hover:bg-gray-100 transition-colors
                        ${selectedIcon === iconName ? 'bg-indigo-100 ring-2 ring-indigo-500' : ''}
                      `}
                      title={iconName}
                    >
                      <div className="flex items-center justify-center h-6 w-6 mb-1">
                        {renderIcon(iconName)}
                      </div>
                      <span className="text-xs text-gray-600 truncate w-full text-center">
                        {iconName.replace('Fi', '')}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500 text-sm">
                  No icons found
                </div>
              )}
              
              {filteredIcons.length > 60 && (
                <div className="text-center py-2 text-gray-500 text-xs">
                  Showing first 60 results. Use search to narrow down.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Overlay to close dropdown when clicking outside */}
      {isOpen && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default IconSelector;