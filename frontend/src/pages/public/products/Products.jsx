import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useSearchParams, useLocation } from 'react-router-dom';
import {
    FiFilter,
    FiChevronRight,
    FiGrid,
    FiPackage,
    FiHome,
    FiStar,
    FiTrendingUp,
    FiUsers,
    FiShoppingBag,
    FiSearch
} from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useProduct } from '../../../hooks/useProduct';
import { useCategory } from '../../../hooks/useCategory';
import ProductCard from '../../../components/products/ProductCard';
import ProductsSidebar from '../../../components/products/ProductsSidebar';
import Button from '../../../components/common/Button';

const ProductsPage = () => {
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [currentFilters, setCurrentFilters] = useState({});
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(12);
    const [searchParams] = useSearchParams();
    const location = useLocation();

    const {
        products,
        isLoading,
        getProducts,
        error,
        totalPages,
        totalProducts
    } = useProduct();

    const { categories, getCategories } = useCategory();

    // Get search query and category from URL parameters
    const urlSearchQuery = searchParams.get('search') || '';
    const urlCategoryId = searchParams.get('category') || '';

    useEffect(() => {
        getProducts(1, 100); // Get more products for filtering
        getCategories();
    }, []);

    // Set initial filters from URL parameters
    useEffect(() => {
        const initialFilters = {};
        
        if (urlSearchQuery) {
            initialFilters.searchQuery = urlSearchQuery;
        }
        
        if (urlCategoryId) {
            initialFilters.selectedCategories = [urlCategoryId];
        }
        
        setCurrentFilters(initialFilters);
    }, [urlSearchQuery, urlCategoryId, location.search]);

    // Apply filters to products
    const applyFilters = useMemo(() => {
        if (!products || products.length === 0) return [];

        let filtered = [...products];

        // Search filter
        if (currentFilters.searchQuery) {
            const query = currentFilters.searchQuery.toLowerCase();
            filtered = filtered.filter(product =>
                product.name?.toLowerCase().includes(query) ||
                product.description?.toLowerCase().includes(query) ||
                product.shortDescription?.toLowerCase().includes(query) ||
                product.category?.name?.toLowerCase().includes(query)
            );
        }

        // Category filter
        if (currentFilters.selectedCategories && currentFilters.selectedCategories.length > 0) {
            filtered = filtered.filter(product =>
                product.category && currentFilters.selectedCategories.includes(product.category._id || product.category)
            );
        }

        // Price range filter
        if (currentFilters.priceRange) {
            filtered = filtered.filter(product => {
                const price = product.salePrice || product.price || 0;
                return price >= currentFilters.priceRange.min && price <= currentFilters.priceRange.max;
            });
        }

        // Sort products
        if (currentFilters.sortBy) {
            filtered.sort((a, b) => {
                let aValue, bValue;

                switch (currentFilters.sortBy) {
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

                if (currentFilters.sortOrder === 'desc') {
                    return aValue < bValue ? 1 : -1;
                } else {
                    return aValue > bValue ? 1 : -1;
                }
            });
        }

        return filtered;
    }, [products, currentFilters]);

    useEffect(() => {
        setFilteredProducts(applyFilters);
        setCurrentPage(1); // Reset to first page when filters change
    }, [applyFilters]);

    // Pagination
    const totalFilteredPages = Math.ceil(filteredProducts.length / productsPerPage);
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const currentProducts = filteredProducts.slice(startIndex, endIndex);

    const handleFiltersChange = useCallback((filters) => {
        setCurrentFilters(filters);
    }, []);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const renderPagination = () => {
        if (!totalFilteredPages || totalFilteredPages <= 1) return null;

        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalFilteredPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        return (
            <div className="flex flex-col sm:flex-row justify-between items-center mt-12 gap-4">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                    Showing {startIndex + 1}-{Math.min(endIndex, filteredProducts.length)} of {filteredProducts.length} products
                </div>
                <nav className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </Button>

                    {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map(page => (
                        <Button
                            key={page}
                            variant={page === currentPage ? "primary" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(page)}
                        >
                            {page}
                        </Button>
                    ))}

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalFilteredPages}
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

    const hasActiveFilters = Object.keys(currentFilters).some(key => {
        const value = currentFilters[key];
        if (key === 'selectedCategories') return value && value.length > 0;
        if (key === 'searchQuery') return value && value.trim();
        if (key === 'priceRange') return value && (value.min > 0 || value.max < 10000);
        return false;
    });

    // Get current search/category info for display
    const getCurrentFilterInfo = () => {
        if (urlSearchQuery) {
            return {
                type: 'search',
                query: urlSearchQuery,
                title: `Search Results for "${urlSearchQuery}"`,
                description: `Found ${filteredProducts.length} products matching your search`
            };
        }
        
        if (urlCategoryId && categories.length > 0) {
            const category = categories.find(cat => cat._id === urlCategoryId);
            if (category) {
                return {
                    type: 'category',
                    query: category.name,
                    title: `${category.name} Products`,
                    description: `Explore our ${filteredProducts.length} ${category.name.toLowerCase()} products`
                };
            }
        }
        
        return {
            type: 'all',
            query: '',
            title: 'All Products',
            description: `Discover our curated collection of ${totalProducts || products?.length || 0}+ premium products`
        };
    };

    const filterInfo = getCurrentFilterInfo();

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
                            onClick={() => getProducts(1, 100)}
                            variant="primary"
                        >
                            Try Again
                        </Button>
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
                        <FiHome className="h-4 w-4" />
                    </Link>
                    <FiChevronRight className="h-4 w-4 text-gray-400" />
                    <Link to="/products" className="text-gray-500 hover:text-primary transition-colors">
                        Products
                    </Link>
                    {filterInfo.type !== 'all' && (
                        <>
                            <FiChevronRight className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-900 dark:text-white font-medium">
                                {filterInfo.query}
                            </span>
                        </>
                    )}
                </motion.nav>

                {/* Hero Section */}
                <motion.div variants={itemVariants} className="mb-12">
                    <div className={`rounded-2xl shadow-xl p-8 md:p-12 text-white bg-gradient-to-r from-primary to-primary/80
                    }`}>
                        <div className="max-w-3xl">
                            <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-white">
                                {filterInfo.title}
                            </h1>
                            <p className="text-xl text-white/90 mb-6">
                                {filterInfo.description}
                            </p>
                            <div className="flex flex-wrap gap-4">
                                {filterInfo.type === 'search' ? (
                                    <div className="flex items-center gap-2 bg-white/10 rounded-lg px-4 py-2">
                                        <FiSearch className="h-5 w-5" />
                                        <span>Search Results</span>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex items-center gap-2 bg-white/10 rounded-lg px-4 py-2">
                                            <FiPackage className="h-5 w-5" />
                                            <span>Premium Quality</span>
                                        </div>
                                        <div className="flex items-center gap-2 bg-white/10 rounded-lg px-4 py-2">
                                            <FiStar className="h-5 w-5" />
                                            <span>Top Rated</span>
                                        </div>
                                        <div className="flex items-center gap-2 bg-white/10 rounded-lg px-4 py-2">
                                            <FiTrendingUp className="h-5 w-5" />
                                            <span>Trending Now</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Main Content */}
                <div className="flex gap-8">
                    {/* Sidebar */}
                    <ProductsSidebar
                        products={products || []}
                        onFiltersChange={handleFiltersChange}
                        isOpen={isSidebarOpen}
                        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
                        initialFilters={currentFilters}
                    />

                    {/* Products Section */}
                    <motion.div variants={itemVariants} className="flex-1">
                        {/* Controls Header */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 transition-colors">
                            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                                <div className="flex items-center gap-3">
                                    <FiGrid className="h-5 w-5 text-primary" />
                                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                                        {filteredProducts.length} Products Found
                                    </span>
                                    {filterInfo.type === 'search' && (
                                        <span className="text-sm text-gray-500 dark:text-gray-400">
                                            for "{urlSearchQuery}"
                                        </span>
                                    )}
                                </div>

                                <div className="flex items-center gap-4">
                                    {/* Mobile Filter Toggle */}
                                    <div className="lg:hidden">
                                        <Button
                                            onClick={() => setIsSidebarOpen(true)}
                                            variant="outline"
                                            icon={<FiFilter className="h-5 w-5" />}
                                            className="relative"
                                        >
                                            Filters
                                            {hasActiveFilters && (
                                                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                                    !
                                                </span>
                                            )}
                                        </Button>
                                    </div>

                                    {/* Active Filters Display */}
                                    {hasActiveFilters && (
                                        <div className="flex flex-wrap gap-2">
                                            {currentFilters.searchQuery && (
                                                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm flex items-center gap-1">
                                                    Search: "{currentFilters.searchQuery}"
                                                </span>
                                            )}
                                            {currentFilters.selectedCategories?.length > 0 && (
                                                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                                                    {currentFilters.selectedCategories.length} Categories
                                                </span>
                                            )}
                                            {currentFilters.priceRange && (currentFilters.priceRange.min > 0 || currentFilters.priceRange.max < 10000) && (
                                                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                                                    Rs.{currentFilters.priceRange.min} - Rs.{currentFilters.priceRange.max}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Products Grid */}
                        {currentProducts.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
                                    {currentProducts.map((product) => (
                                        <motion.div
                                            key={product._id}
                                            variants={itemVariants}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <ProductCard product={product} />
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Pagination */}
                                {renderPagination()}
                            </>
                        ) : (
                            <motion.div
                                variants={itemVariants}
                                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center transition-colors"
                            >
                                <FiPackage className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                    {filterInfo.type === 'search' 
                                        ? `No products found for "${urlSearchQuery}"`
                                        : 'No products found'
                                    }
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-6">
                                    {filterInfo.type === 'search' 
                                        ? 'Try searching with different keywords or check your spelling.'
                                        : hasActiveFilters
                                        ? 'Try adjusting your filters to find what you\'re looking for.'
                                        : 'No products are available at the moment.'
                                    }
                                </p>
                                {(hasActiveFilters || filterInfo.type === 'search') && (
                                    <div className="flex gap-3 justify-center">
                                        {hasActiveFilters && (
                                            <Button
                                                onClick={() => setCurrentFilters({})}
                                                variant="primary"
                                            >
                                                Clear All Filters
                                            </Button>
                                        )}
                                        {filterInfo.type === 'search' && (
                                            <Button
                                                onClick={() => window.location.href = '/products'}
                                                variant="outline"
                                            >
                                                Browse All Products
                                            </Button>
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

export default ProductsPage;