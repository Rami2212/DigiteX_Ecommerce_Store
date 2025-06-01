import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  HiOutlineSearch, 
  HiViewGrid, 
  HiViewList,
  HiOutlineFilter,
  HiOutlineChevronRight,
  HiOutlineAdjustments,
  HiOutlineSortAscending,
  HiX,
  HiOutlineChevronDown,
  HiOutlineChevronUp
} from 'react-icons/hi';
import { useProduct } from '../../hooks/useProduct';
import { useCategory } from '../../hooks/useCategory';
import ProductCard from '../../components/common/ProductCard';

const CategoryProductsPage = () => {
  const { categorySlug } = useParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedRating, setSelectedRating] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(12);
  
  const { productsByCategory, isLoading, getProductsByCategory, error } = useProduct();
  const { categories, getCategories } = useCategory();

  // Find current category
  const currentCategory = categories.find(cat => 
    cat.name.toLowerCase().replace(/\s+/g, '-') === categorySlug
  );

  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    if (currentCategory) {
      getProductsByCategory(currentCategory._id);
    }
  }, [currentCategory]);

  useEffect(() => {
    if (productsByCategory && productsByCategory.length > 0) {
      let filtered = [...productsByCategory];

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(product =>
          product.name?.toLowerCase().includes(query) ||
          product.description?.toLowerCase().includes(query) ||
          product.brand?.toLowerCase().includes(query) ||
          product.tags?.some(tag => tag.toLowerCase().includes(query))
        );
      }

      // Price range filter
      filtered = filtered.filter(product => {
        const price = product.price || 0;
        return price >= priceRange.min && price <= priceRange.max;
      });

      // Brand filter
      if (selectedBrands.length > 0) {
        filtered = filtered.filter(product => 
          product.brand && selectedBrands.includes(product.brand)
        );
      }

      // Rating filter
      if (selectedRating > 0) {
        filtered = filtered.filter(product => 
          (product.rating || 0) >= selectedRating
        );
      }

      // Stock filter
      if (inStockOnly) {
        filtered = filtered.filter(product => 
          (product.stock || 0) > 0
        );
      }

      // Sort products
      filtered.sort((a, b) => {
        let aValue, bValue;
        
        switch (sortBy) {
          case 'price':
            aValue = a.price || 0;
            bValue = b.price || 0;
            break;
          case 'rating':
            aValue = a.rating || 0;
            bValue = b.rating || 0;
            break;
          case 'newest':
            aValue = new Date(a.createdAt || 0);
            bValue = new Date(b.createdAt || 0);
            break;
          case 'popularity':
            aValue = a.viewsCount || 0;
            bValue = b.viewsCount || 0;
            break;
          case 'name':
          default:
            aValue = (a.name || '').toLowerCase();
            bValue = (b.name || '').toLowerCase();
            break;
        }

        if (sortOrder === 'desc') {
          return aValue < bValue ? 1 : -1;
        } else {
          return aValue > bValue ? 1 : -1;
        }
      });

      setFilteredProducts(filtered);
      setCurrentPage(1); // Reset to first page when filters change
    } else {
      setFilteredProducts([]);
    }
  }, [productsByCategory, searchQuery, sortBy, sortOrder, priceRange, selectedBrands, selectedRating, inStockOnly]);

  // Get unique brands from products
  const availableBrands = productsByCategory 
    ? [...new Set(productsByCategory.map(p => p.brand).filter(Boolean))].sort()
    : [];

  // Get price range from products
  const productPriceRange = productsByCategory 
    ? productsByCategory.reduce((acc, product) => {
        const price = product.price || 0;
        return {
          min: Math.min(acc.min, price),
          max: Math.max(acc.max, price)
        };
      }, { min: Infinity, max: 0 })
    : { min: 0, max: 1000 };

  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handleSearch = () => {
    // Search is handled by useEffect
    console.log('Searching for:', searchQuery);
  };

  const handleBrandToggle = (brand) => {
    setSelectedBrands(prev => 
      prev.includes(brand) 
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setPriceRange({ 
      min: Math.floor(productPriceRange.min) || 0, 
      max: Math.ceil(productPriceRange.max) || 1000 
    });
    setSelectedBrands([]);
    setSelectedRating(0);
    setInStockOnly(false);
  };

  const hasActiveFilters = searchQuery || selectedBrands.length > 0 || selectedRating > 0 || inStockOnly ||
    priceRange.min !== (Math.floor(productPriceRange.min) || 0) ||
    priceRange.max !== (Math.ceil(productPriceRange.max) || 1000);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Previous button
    pages.push(
      <button
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700"
      >
        Previous
      </button>
    );

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-2 text-sm font-medium border ${
            i === currentPage
              ? 'bg-primary text-white border-primary'
              : 'text-gray-500 bg-white border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700'
          }`}
        >
          {i}
        </button>
      );
    }

    // Next button
    pages.push(
      <button
        key="next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700"
      >
        Next
      </button>
    );

    return (
      <div className="flex justify-center items-center mt-8">
        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
          {pages}
        </nav>
      </div>
    );
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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-16">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Error Loading Products
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              {error}
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentCategory) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-16">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Category Not Found
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              The category you're looking for doesn't exist.
            </p>
            <Link 
              to="/categories"
              className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
            >
              Browse All Categories
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm mb-6">
          <Link to="/" className="text-gray-500 hover:text-primary transition-colors">
            Home
          </Link>
          <HiOutlineChevronRight className="h-4 w-4 text-gray-400" />
          <Link to="/categories" className="text-gray-500 hover:text-primary transition-colors">
            Categories
          </Link>
          <HiOutlineChevronRight className="h-4 w-4 text-gray-400" />
          <span className="text-gray-900 dark:text-white font-medium">
            {currentCategory.name}
          </span>
        </nav>

        {/* Category Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-4">
            {currentCategory.categoryImage && (
              <img
                src={currentCategory.categoryImage}
                alt={currentCategory.name}
                className="w-20 h-20 object-cover rounded-lg shadow-md"
              />
            )}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {currentCategory.name}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                {filteredProducts.length} products available
              </p>
            </div>
          </div>
        </div>

        {/* Search and Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8 transition-colors">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-4">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full px-4 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <HiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>

            <div className="flex items-center gap-4 flex-wrap">
              {/* Sort Dropdown */}
              <div className="flex items-center gap-2">
                <HiOutlineSortAscending className="h-5 w-5 text-gray-500" />
                <select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [field, order] = e.target.value.split('-');
                    setSortBy(field);
                    setSortOrder(order);
                  }}
                  className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent min-w-[140px]"
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

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 border rounded-md transition-colors ${
                  showFilters || hasActiveFilters
                    ? 'border-primary bg-primary text-white'
                    : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <HiOutlineAdjustments className="h-5 w-5" />
                <span className="text-sm">Filters</span>
                {hasActiveFilters && (
                  <span className="bg-white bg-opacity-20 text-xs px-1.5 py-0.5 rounded-full">
                    {[searchQuery, ...selectedBrands, selectedRating > 0 ? '★' : '', inStockOnly ? 'Stock' : ''].filter(Boolean).length}
                  </span>
                )}
                {showFilters ? (
                  <HiOutlineChevronUp className="h-4 w-4" />
                ) : (
                  <HiOutlineChevronDown className="h-4 w-4" />
                )}
              </button>

              {/* View Mode Toggle */}
              <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-primary text-white' 
                      : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <HiViewGrid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-primary text-white' 
                      : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <HiViewList className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Price Range */}
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    Price Range
                    <span className="text-xs text-gray-500">${Math.floor(productPriceRange.min)}-${Math.ceil(productPriceRange.max)}</span>
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={priceRange.min}
                        onChange={(e) => setPriceRange(prev => ({ ...prev, min: parseInt(e.target.value) || 0 }))}
                        className="w-24 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary"
                        placeholder="Min"
                        min="0"
                      />
                      <span className="text-gray-500">-</span>
                      <input
                        type="number"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange(prev => ({ ...prev, max: parseInt(e.target.value) || 1000 }))}
                        className="w-24 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary"
                        placeholder="Max"
                        min="0"
                      />
                    </div>
                    <input
                      type="range"
                      min={Math.floor(productPriceRange.min) || 0}
                      max={Math.ceil(productPriceRange.max) || 1000}
                      value={priceRange.max}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, max: parseInt(e.target.value) }))}
                      className="w-full accent-primary"
                    />
                  </div>
                </div>

                {/* Brands */}
                {availableBrands.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                      Brands ({availableBrands.length})
                    </h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                      {availableBrands.map(brand => (
                        <label key={brand} className="flex items-center cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={selectedBrands.includes(brand)}
                            onChange={() => handleBrandToggle(brand)}
                            className="rounded border-gray-300 text-primary focus:ring-primary focus:ring-2"
                          />
                          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                            {brand}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Rating & Stock */}
                <div className="space-y-4">
                  {/* Minimum Rating */}
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">Minimum Rating</h4>
                    <select
                      value={selectedRating}
                      onChange={(e) => setSelectedRating(parseInt(e.target.value))}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value={0}>All Ratings</option>
                      <option value={4}>4+ Stars</option>
                      <option value={3}>3+ Stars</option>
                      <option value={2}>2+ Stars</option>
                      <option value={1}>1+ Stars</option>
                    </select>
                  </div>

                  {/* Stock Filter */}
                  <div>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={inStockOnly}
                        onChange={(e) => setInStockOnly(e.target.checked)}
                        className="rounded border-gray-300 text-primary focus:ring-primary focus:ring-2"
                      />
                      <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        In Stock Only
                      </span>
                    </label>
                  </div>
                </div>

                {/* Clear Filters */}
                <div className="flex items-end">
                  <div className="w-full space-y-2">
                    {hasActiveFilters && (
                      <button
                        onClick={clearFilters}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors text-sm font-medium border border-red-200 dark:border-red-800"
                      >
                        <HiX className="h-4 w-4" />
                        Clear All Filters
                      </button>
                    )}
                    <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                      {filteredProducts.length} of {productsByCategory?.length || 0} products
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Products Grid/List */}
        {currentProducts.length > 0 ? (
          <>
            <div className={`
              ${viewMode === 'grid' 
                ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6' 
                : 'space-y-6'
              }
            `}>
              {currentProducts.map((product) => (
                <ProductCard 
                  key={product._id} 
                  product={product} 
                  viewMode={viewMode}
                  onAddToCart={(product) => {
                    // Handle add to cart
                    console.log('Add to cart:', product);
                    // You can dispatch to cart here
                  }}
                  onToggleWishlist={(product) => {
                    // Handle wishlist toggle
                    console.log('Toggle wishlist:', product);
                    // You can dispatch to wishlist here
                  }}
                  isInWishlist={false} // You can implement wishlist logic here
                />
              ))}
            </div>

            {/* Pagination */}
            {renderPagination()}

            {/* Results Summary */}
            <div className="text-center mt-8 text-sm text-gray-600 dark:text-gray-400">
              Showing {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, filteredProducts.length)} of {filteredProducts.length} products
            </div>
          </>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center transition-colors">
            <HiOutlineFilter className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No products found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {hasActiveFilters
                ? 'Try adjusting your search or filters to find what you\'re looking for.'
                : 'This category doesn\'t have any products yet.'
              }
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors font-medium"
              >
                <HiX className="h-5 w-5 mr-2" />
                Clear All Filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryProductsPage;