import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  HiOutlineSearch, 
  HiViewGrid, 
  HiViewList,
  HiOutlineFilter
} from 'react-icons/hi';
import { useCategory } from '../../../hooks/useCategory';

const CategoriesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [filteredCategories, setFilteredCategories] = useState([]);
  
  const { categories, isLoading, getCategories } = useCategory();

  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    if (categories) {
      const filtered = categories.filter(category =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (category.description && category.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredCategories(filtered);
    }
  }, [categories, searchQuery]);

  const handleSearch = () => {
    // Search functionality is handled by useEffect above
    console.log('Searching for:', searchQuery);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Shop by Categories
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Discover our wide range of product categories
          </p>
        </div>

        {/* Search and View Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8 transition-colors">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search categories..."
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button 
                onClick={handleSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-primary transition-colors"
              >
                <HiOutlineSearch className="h-5 w-5" />
              </button>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">View:</span>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                <HiViewGrid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                <HiViewList className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            {filteredCategories.length} {filteredCategories.length === 1 ? 'category' : 'categories'} found
          </div>
        </div>

        {/* Categories Grid/List */}
        {filteredCategories.length > 0 ? (
          <div className={`
            ${viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6' 
              : 'space-y-4'
            }
          `}>
            {filteredCategories.map((category) => (
              <CategoryCard 
                key={category._id} 
                category={category} 
                viewMode={viewMode}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center transition-colors">
            <HiOutlineFilter className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No categories found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search terms or browse all categories.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Category Card Component
const CategoryCard = ({ category, viewMode }) => {
  const categorySlug = category.name.toLowerCase().replace(/\s+/g, '-');
  
  if (viewMode === 'list') {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 p-6">
        <div className="flex items-center space-x-6">
          <div className="flex-shrink-0">
            <img
              src={category.categoryImage || '/api/placeholder/80/80'}
              alt={category.name}
              className="w-20 h-20 object-cover rounded-lg"
            />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 hover:text-primary transition-colors">
              <Link to={`/category/${categorySlug}`}>
                {category.name}
              </Link>
              {category.subCategories && category.subCategories.length > 0 && (
                <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                  ({category.subCategories.length} subcategories)
                </span>
              )}
            </h3>
            
            {/* Subcategories List */}
            {category.subCategories && category.subCategories.length > 0 && (
              <div className="mb-3">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Subcategories:</p>
                <div className="flex flex-wrap gap-2">
                  {category.subCategories.map((subCategory, index) => (
                    <Link
                      key={index}
                      to={`/category/${categorySlug}`}
                      className="inline-block px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full hover:bg-primary hover:text-white transition-colors"
                    >
                      {subCategory}
                    </Link>
                  ))}
                </div>
              </div>
            )}
            
            <Link
              to={`/category/${categorySlug}`}
              className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors text-sm font-medium"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden group">
      <div className="relative aspect-square overflow-hidden">
        <img
          src={category.categoryImage || '/api/placeholder/300/300'}
          alt={category.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200"></div>
      </div>
      
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary transition-colors">
          <Link to={`/category/${categorySlug}`}>
            {category.name}
          </Link>
        </h3>
        
        {/* Subcategories in Grid View */}
        {category.subCategories && category.subCategories.length > 0 && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-1 mb-2">
              {category.subCategories.slice(0, 3).map((subCategory, index) => (
                <Link
                  key={index}
                  to={`/category/${categorySlug}`}
                  className="inline-block px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded hover:bg-primary hover:text-white transition-colors"
                >
                  {subCategory}
                </Link>
              ))}
              {category.subCategories.length > 3 && (
                <span className="inline-block px-2 py-1 text-gray-500 dark:text-gray-400 text-xs">
                  +{category.subCategories.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}
        
        <Link
          to={`/category/${categorySlug}`}
          className="block w-full text-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors text-sm font-medium"
        >
          Browse Products
        </Link>
      </div>
    </div>
  );
};

export default CategoriesPage;