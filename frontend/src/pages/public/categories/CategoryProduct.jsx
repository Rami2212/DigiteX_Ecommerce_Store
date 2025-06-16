import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  FiSearch, 
  FiChevronRight,
  FiTrendingUp
} from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useProduct } from '../../../hooks/useProduct';
import { useCategory } from '../../../hooks/useCategory';
import ProductCard from '../../../components/products/ProductCard';
import Button from '../../../components/common/Button';

const CategoryProductsPage = () => {
  const { categorySlug } = useParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [productsPerPage] = useState(12);
  
  const { 
    productsByCategory, 
    isLoading, 
    getProductsByCategory, 
    error,
    categoryTotalPages,
    categoryCurrentPage,
    categoryTotalProducts
  } = useProduct();
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
      // Reset to page 1 and fetch products
      getProductsByCategory(currentCategory._id, 1, productsPerPage);
    }
  }, [currentCategory, productsPerPage]);

  useEffect(() => {
    if (productsByCategory && productsByCategory.length > 0) {
      let filtered = [...productsByCategory];

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(product =>
          product.name?.toLowerCase().includes(query) ||
          product.description?.toLowerCase().includes(query) ||
          product.shortDescription?.toLowerCase().includes(query) ||
          product.category?.name?.toLowerCase().includes(query)
        );
      }

      // Sort products
      filtered.sort((a, b) => {
        let aValue, bValue;
        
        switch (sortBy) {
          case 'price':
            aValue = a.salePrice || a.price || 0;
            bValue = b.salePrice || b.price || 0;
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
            aValue = a.reviewsCount || 0;
            bValue = b.reviewsCount || 0;
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
    } else {
      setFilteredProducts([]);
    }
  }, [productsByCategory, searchQuery, sortBy, sortOrder]);

  const handlePageChange = (pageNumber) => {
    if (currentCategory) {
      getProductsByCategory(currentCategory._id, pageNumber, productsPerPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const renderPagination = () => {
    if (!categoryTotalPages || categoryTotalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, categoryCurrentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(categoryTotalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    return (
      <div className="flex flex-col sm:flex-row justify-between items-center mt-12 gap-4">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Showing page {categoryCurrentPage} of {categoryTotalPages} ({categoryTotalProducts} total products)
        </div>
        <nav className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(categoryCurrentPage - 1)}
            disabled={categoryCurrentPage === 1}
          >
            Previous
          </Button>
          
          {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map(page => (
            <Button
              key={page}
              variant={page === categoryCurrentPage ? "primary" : "outline"}
              size="sm"
              onClick={() => handlePageChange(page)}
            >
              {page}
            </Button>
          ))}
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(categoryCurrentPage + 1)}
            disabled={categoryCurrentPage === categoryTotalPages}
          >
            Next
          </Button>
        </nav>
      </div>
    );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
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
            <Button 
              onClick={() => currentCategory && getProductsByCategory(currentCategory._id, 1, productsPerPage)}
              variant="primary"
            >
              Try Again
            </Button>
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
            <Link to="/categories">
              <Button variant="primary">
                Browse All Categories
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <motion.nav variants={itemVariants} className="flex items-center space-x-2 text-sm mb-6">
          <Link to="/" className="text-gray-500 hover:text-primary transition-colors">
            Home
          </Link>
          <FiChevronRight className="h-4 w-4 text-gray-400" />
          <Link to="/categories" className="text-gray-500 hover:text-primary transition-colors">
            Categories
          </Link>
          <FiChevronRight className="h-4 w-4 text-gray-400" />
          <span className="text-gray-900 dark:text-white font-medium">
            {currentCategory.name}
          </span>
        </motion.nav>

        {/* Category Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-4">
            {currentCategory.categoryImage && (
              <img
                src={currentCategory.categoryImage}
                alt={currentCategory.name}
                className="w-20 h-20 object-cover rounded-xl shadow-md"
              />
            )}
            <div className="flex-1">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {currentCategory.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {categoryTotalProducts || filteredProducts.length} products available
              </p>
            </div>
          </div>
        </motion.div>

        {/* Search and Sort Controls */}
        <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 transition-colors">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full px-4 py-3 pl-12 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
              />
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <FiTrendingUp className="h-5 w-5 text-gray-500" />
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-');
                  setSortBy(field);
                  setSortOrder(order);
                }}
                className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent min-w-[160px]"
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
          </div>
        </motion.div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <motion.div variants={itemVariants}>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard 
                  key={product._id} 
                  product={product} 
                />
              ))}
            </div>

            {/* Pagination */}
            {renderPagination()}
          </motion.div>
        ) : (
          <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center transition-colors">
            <FiSearch className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No products found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {searchQuery
                ? 'Try adjusting your search terms to find what you\'re looking for.'
                : 'This category doesn\'t have any products yet.'
              }
            </p>
            {searchQuery && (
              <Button
                onClick={() => setSearchQuery('')}
                variant="primary"
              >
                Clear Search
              </Button>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default CategoryProductsPage;