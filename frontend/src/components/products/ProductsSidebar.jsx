import React, { useState, useEffect, useMemo } from 'react';
import { 
  FiSearch, 
  FiX, 
  FiSliders,
  FiTrendingUp,
  FiFilter
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useCategory } from '../../hooks/useCategory';
import Button from '../common/Button';

const ProductsSidebar = ({ 
  products = [], 
  onFiltersChange, 
  isOpen, 
  onToggle,
  className = "" 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  const { categories, getCategories } = useCategory();

  useEffect(() => {
    getCategories();
  }, []);

  // Calculate price range from products
  const productPriceRange = useMemo(() => {
    if (!products || products.length === 0) return { min: 0, max: 10000 };
    
    const prices = products.map(p => p.salePrice || p.price || 0);
    return {
      min: Math.floor(Math.min(...prices)),
      max: Math.ceil(Math.max(...prices))
    };
  }, [products]);

  // Initialize price range when products change
  useEffect(() => {
    if (products && products.length > 0) {
      const range = productPriceRange;
      setPriceRange({
        min: range.min,
        max: range.max
      });
    }
  }, [productPriceRange]);

  // Generate search suggestions
  useEffect(() => {
    if (searchQuery.trim() && products.length > 0) {
      const query = searchQuery.toLowerCase();
      const suggestions = new Set();
      
      products.forEach(product => {
        // Add product name suggestions
        if (product.name?.toLowerCase().includes(query)) {
          suggestions.add(product.name);
        }
        
        // Add category suggestions
        if (product.category?.name?.toLowerCase().includes(query)) {
          suggestions.add(product.category.name);
        }
        
        // Add description word suggestions
        const words = product.shortDescription?.toLowerCase().split(' ') || [];
        words.forEach(word => {
          if (word.length > 3 && word.includes(query)) {
            suggestions.add(word);
          }
        });
      });
      
      setSearchSuggestions(Array.from(suggestions).slice(0, 5));
    } else {
      setSearchSuggestions([]);
    }
  }, [searchQuery, products]);

  // Send filters to parent component
  useEffect(() => {
    const filters = {
      searchQuery: searchQuery.trim(),
      selectedCategories,
      priceRange,
      sortBy,
      sortOrder
    };
    
    onFiltersChange(filters);
  }, [searchQuery, selectedCategories, priceRange, sortBy, sortOrder, onFiltersChange]);

  const handleCategoryToggle = (categoryId) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSearchSelect = (suggestion) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setPriceRange({
      min: productPriceRange.min,
      max: productPriceRange.max
    });
    setSortBy('name');
    setSortOrder('asc');
  };

  const hasActiveFilters = searchQuery || selectedCategories.length > 0 || 
    priceRange.min !== productPriceRange.min || 
    priceRange.max !== productPriceRange.max ||
    sortBy !== 'name' || sortOrder !== 'asc';

  const sidebarContent = (
    <div className="space-y-6">
      {/* Search with Suggestions */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Search Products
        </h3>
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder="Search products, categories..."
            className="w-full px-4 py-3 pl-12 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          
          {/* Search Suggestions */}
          <AnimatePresence>
            {showSuggestions && searchSuggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto"
              >
                {searchSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearchSelect(suggestion)}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 last:border-b-0"
                  >
                    <span className="flex items-center gap-2">
                      <FiSearch className="h-4 w-4 text-gray-400" />
                      {suggestion}
                    </span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Sort Options */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <FiTrendingUp className="h-5 w-5" />
          Sort By
        </h3>
        <select
          value={`${sortBy}-${sortOrder}`}
          onChange={(e) => {
            const [field, order] = e.target.value.split('-');
            setSortBy(field);
            setSortOrder(order);
          }}
          className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="name-asc">Name A-Z</option>
          <option value="name-desc">Name Z-A</option>
          <option value="price-asc">Price Low-High</option>
          <option value="price-desc">Price High-Low</option>
          <option value="rating-desc">Rating High-Low</option>
          <option value="newest-desc">Newest First</option>
          <option value="popularity-desc">Most Popular</option>
        </select>
      </div>

      {/* Category Filter */}
      {categories && categories.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Categories ({categories.length})
          </h3>
          <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
            {categories.map(category => (
              <label key={category._id} className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category._id)}
                  onChange={() => handleCategoryToggle(category._id)}
                  className="rounded border-gray-300 text-primary focus:ring-primary focus:ring-2"
                />
                <div className="ml-3 flex items-center gap-2">
                  {category.categoryImage && (
                    <img
                      src={category.categoryImage}
                      alt={category.name}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                  )}
                  <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                    {category.name}
                  </span>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Price Range Filter */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Price Range
        </h3>
        <div className="space-y-4">
          {/* Price Range Display */}
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>Rs. {priceRange.min}</span>
            <span>Rs. {priceRange.max}</span>
          </div>
          
          {/* Range Sliders */}
          <div className="relative">
            <input
              type="range"
              min={productPriceRange.min}
              max={productPriceRange.max}
              value={priceRange.min}
              onChange={(e) => setPriceRange(prev => ({ 
                ...prev, 
                min: Math.min(parseInt(e.target.value), prev.max - 100)
              }))}
              className="absolute w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-slider"
              style={{ zIndex: 1 }}
            />
            <input
              type="range"
              min={productPriceRange.min}
              max={productPriceRange.max}
              value={priceRange.max}
              onChange={(e) => setPriceRange(prev => ({ 
                ...prev, 
                max: Math.max(parseInt(e.target.value), prev.min + 100)
              }))}
              className="absolute w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-slider"
              style={{ zIndex: 2 }}
            />
            <div className="relative h-2 bg-gray-200 rounded-lg">
              <div 
                className="absolute h-2 bg-primary rounded-lg"
                style={{
                  left: `${((priceRange.min - productPriceRange.min) / (productPriceRange.max - productPriceRange.min)) * 100}%`,
                  width: `${((priceRange.max - priceRange.min) / (productPriceRange.max - productPriceRange.min)) * 100}%`
                }}
              />
            </div>
          </div>
          
          {/* Manual Price Input */}
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={priceRange.min}
              onChange={(e) => setPriceRange(prev => ({ 
                ...prev, 
                min: Math.max(productPriceRange.min, parseInt(e.target.value) || 0)
              }))}
              className="w-24 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Min"
            />
            <span className="text-gray-500">-</span>
            <input
              type="number"
              value={priceRange.max}
              onChange={(e) => setPriceRange(prev => ({ 
                ...prev, 
                max: Math.min(productPriceRange.max, parseInt(e.target.value) || 10000)
              }))}
              className="w-24 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Max"
            />
          </div>
        </div>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            onClick={clearFilters}
            variant="outline"
            className="w-full border-red-300 text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
            icon={<FiX className="h-4 w-4" />}
          >
            Clear All Filters
          </Button>
        </div>
      )}

      {/* Filter Summary */}
      <div className="text-xs text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-2">
          <FiFilter className="h-4 w-4" />
          <span>Active Filters:</span>
        </div>
        <div className="space-y-1">
          {searchQuery && <div>• Search: "{searchQuery}"</div>}
          {selectedCategories.length > 0 && (
            <div>• Categories: {selectedCategories.length} selected</div>
          )}
          {(priceRange.min !== productPriceRange.min || priceRange.max !== productPriceRange.max) && (
            <div>• Price: Rs.{priceRange.min} - Rs.{priceRange.max}</div>
          )}
          {(sortBy !== 'name' || sortOrder !== 'asc') && (
            <div>• Sort: {sortBy} ({sortOrder})</div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={`hidden lg:block w-80 ${className}`}>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sticky top-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <FiSliders className="h-5 w-5" />
              Filters
            </h2>
          </div>
          {sidebarContent}
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={onToggle}
          >
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className="w-80 h-full bg-white dark:bg-gray-800 shadow-xl overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <FiSliders className="h-5 w-5" />
                    Filters
                  </h2>
                  <button
                    onClick={onToggle}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <FiX className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
                {sidebarContent}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProductsSidebar;