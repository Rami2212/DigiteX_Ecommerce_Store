import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  HiOutlineSearch,
  HiOutlineShoppingCart,
  HiOutlineUser,
  HiOutlineMenu,
  HiOutlineX,
  HiOutlineHeart,
  HiOutlineSun,
  HiOutlineMoon,
  HiChevronDown
} from 'react-icons/hi';
import {
  FiLogOut,
  FiSettings,
  FiPackage
} from 'react-icons/fi';
import Logo from './Logo';
import { useAuth } from '../../hooks/useAuth';
import { useCategory } from '../../hooks/useCategory';
import { useCart } from '../../hooks/useCart';
import { useTheme } from '../../hooks/useTheme';


// Account Dropdown Component
const AccountDropdown = ({ isAuthenticated, user, logout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 p-2 hover:text-primary transition-colors"
      >
        <HiOutlineUser className="h-6 w-6" />
        <HiChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
          {isAuthenticated ? (
            <>
              <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {user?.firstName || user?.name || 'User'}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {user?.email || 'user@example.com'}
                </p>
              </div>

              <Link
                to="/user/my-profile"
                className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <HiOutlineUser className="h-4 w-4 mr-3" />
                My Profile
              </Link>

              <Link
                to="/user/my-orders"
                className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <FiPackage className="h-4 w-4 mr-3" />
                My Orders
              </Link>

              <Link
                to="/user/wishlist"
                className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <HiOutlineHeart className="h-4 w-4 mr-3" />
                Wishlist
              </Link>

              <Link
                to="/user/edit-profile"
                className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <FiSettings className="h-4 w-4 mr-3" />
                Settings
              </Link>

              <div className="border-t border-gray-200 dark:border-gray-700 mt-2 pt-2">
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <FiLogOut className="h-4 w-4 mr-3" />
                  Sign Out
                </button>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/auth/login"
                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Sign In
              </Link>
              <Link
                to="/auth/register"
                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Create Account
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
};

// Categories Mega Menu Component
const CategoriesMegaMenu = ({ categories = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-primary text-white hover:bg-primary-dark rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <HiOutlineMenu className="h-5 w-5" />
        <span>All Categories</span>
        <HiChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-screen max-w-4xl bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {categories.map((category) => (
              <div key={category._id} className="group">
                <div className="mb-3">
                  <img
                    src={category.categoryImage}
                    alt={category.name}
                    className="w-24 h-24 object-cover rounded-lg group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary transition-colors">
                  <Link
                    to={`/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                    onClick={() => setIsOpen(false)}
                  >
                    {category.name}
                  </Link>
                </h3>
                {category.subCategories && category.subCategories.length > 0 && (
                  <ul className="space-y-1">
                    {category.subCategories.slice(0, 4).map((sub, index) => (
                      <li key={index}>
                        <Link
                          to={`/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                          className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
                          onClick={() => setIsOpen(false)}
                        >
                          {sub.name || sub}
                        </Link>
                      </li>
                    ))}
                    {category.subCategories.length > 4 && (
                      <li>
                        <Link
                          to={`/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                          className="text-sm text-primary hover:text-primary-dark transition-colors font-medium"
                          onClick={() => setIsOpen(false)}
                        >
                          View All ({category.subCategories.length})
                        </Link>
                      </li>
                    )}
                  </ul>
                )}
              </div>
            ))}
            {categories.length === 0 && (
              <div className="col-span-full text-center py-8 text-gray-500 dark:text-gray-400">
                No categories available
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Main Header Component
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartCount, setCartCount] = useState('');

  const { isAuthenticated, user, logout } = useAuth();
  const { categories, getCategories } = useCategory();
  const { getCart, itemCount, cartItems } = useCart();
  const { theme, toggle } = useTheme();

  // Load categories on component mount
  useEffect(() => {
    getCategories();
    
    if (isAuthenticated) {
      getCart();
    }
  }, [isAuthenticated]); 

  useEffect(() => {
    const cartItemQuantity = itemCount;
    setCartCount(cartItemQuantity);
  }, [itemCount, cartItems]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
      // Add your search logic here
    }
  };

  return (
    <header className="w-full">
      {/* Top Bar */}
      <div className="bg-primary text-white py-2">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <a href="tel:+1234567890" className="text-sm hover:text-accent transition-colors">
              Call Us: (123) 456-7890
            </a>
            <span className="hidden md:inline text-sm">Free shipping on orders over $999</span>
          </div>
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link to="/user/profile" className="text-sm hover:text-accent transition-colors">
                  Hi, {user?.firstName || 'User'}
                </Link>
                <button onClick={logout} className="text-sm hover:text-accent transition-colors">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/auth/login" className="text-sm hover:text-accent transition-colors">
                  Login
                </Link>
                <Link to="/auth/register" className="text-sm hover:text-accent transition-colors">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-white dark:bg-gray-800 py-4 shadow-md transition-colors">
        <div className="container mx-auto px-4 flex justify-between items-center">
          {/* Logo */}
          <Logo size="small" />

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex flex-grow mx-8">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for laptops, accessories..."
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
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggle}
              className="hidden md:flex p-2 hover:text-primary transition-colors"
              aria-label="Toggle dark mode"
            >
              {theme === 'light' ? (
                <HiOutlineSun className="h-6 w-6" />
              ) : (
                <HiOutlineMoon className="h-6 w-6" />
              )}
            </button>

            {/* Wishlist */}
            <Link to="/user/wishlist" className="p-2 hidden md:flex hover:text-primary transition-colors">
              <HiOutlineHeart className="h-6 w-6" />
            </Link>

            {/* Cart */}
            <Link to="/cart" className="relative p-2 hover:text-primary transition-colors">
              <HiOutlineShoppingCart className="h-6 w-6" />
              <span className="absolute -top-1 -right-1 bg-accent text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount}
              </span>
            </Link>

            {/* Account Dropdown */}
            <AccountDropdown
              isAuthenticated={isAuthenticated}
              user={user}
              logout={logout}
            />

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2 hover:text-primary transition-colors" onClick={toggleMenu}>
              {isMenuOpen ? <HiOutlineX className="h-6 w-6" /> : <HiOutlineMenu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <NavigationBar
        isMenuOpen={isMenuOpen}
        toggleMenu={toggleMenu}
        categories={categories}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
        theme={theme}
        toggleDarkMode={toggle}
      />
    </header>
  );
};

const NavigationBar = ({ isMenuOpen, toggleMenu, categories, searchQuery, setSearchQuery, handleSearch, theme, toggleDarkMode }) => {
  return (
    <nav className="bg-white dark:bg-gray-800 border-t border-b border-gray-200 dark:border-gray-700 transition-colors">
      {/* Desktop Navigation */}
      <div className="container mx-auto px-4 hidden md:flex items-center justify-between py-3">
        {/* Categories Mega Menu */}
        <CategoriesMegaMenu categories={categories} />

        {/* Navigation Links */}
        <ul className="flex items-center space-x-8">
          <li>
            <Link
              to="/"
              className="font-medium text-gray-800 dark:text-gray-200 hover:text-primary transition-colors"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/products"
              className="font-medium text-gray-800 dark:text-gray-200 hover:text-primary transition-colors"
            >
              Products
            </Link>
          </li>
          <li>
            <Link
              to="/categories"
              className="font-medium text-gray-800 dark:text-gray-200 hover:text-primary transition-colors"
            >
              Categories
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              className="font-medium text-gray-800 dark:text-gray-200 hover:text-primary transition-colors"
            >
              About
            </Link>
          </li>
          <li>
            <Link
              to="/contact"
              className="font-medium text-gray-800 dark:text-gray-200 hover:text-primary transition-colors"
            >
              Contact
            </Link>
          </li>
        </ul>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden transition-opacity duration-300 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        onClick={toggleMenu}
      />

      <div
        className={`fixed top-0 left-0 h-full w-4/5 max-w-sm bg-white dark:bg-gray-800 z-40 md:hidden transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <Logo size="small" />
            <button onClick={toggleMenu} className="p-2 text-gray-600 dark:text-gray-300">
              <HiOutlineX className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
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
        </div>

        {/* Mobile Menu Links */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <ul className="space-y-4">
              <li>
                <Link
                  to="/"
                  className="flex items-center font-medium text-gray-800 dark:text-gray-200 hover:text-primary transition-colors"
                  onClick={toggleMenu}
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  to="/products"
                  className="flex items-center font-medium text-gray-800 dark:text-gray-200 hover:text-primary transition-colors"
                  onClick={toggleMenu}
                >
                  Products
                </Link>
              </li>

              <li>
                <Link
                  to="/products"
                  className="flex items-center font-medium text-gray-800 dark:text-gray-200 hover:text-primary transition-colors"
                  onClick={toggleMenu}
                >
                  Products
                </Link>
              </li>

              <li>
                <Link
                  to="/categories"
                  className="flex items-center font-medium text-gray-800 dark:text-gray-200 hover:text-primary transition-colors"
                  onClick={toggleMenu}
                >
                  Categories
                </Link>
              </li>

              <li>
                <Link
                  to="/about"
                  className="flex items-center font-medium text-gray-800 dark:text-gray-200 hover:text-primary transition-colors"
                  onClick={toggleMenu}
                >
                  About
                </Link>
              </li>
              <li>

                <Link
                  to="/contact"
                  className="flex items-center font-medium text-gray-800 dark:text-gray-200 hover:text-primary transition-colors"
                  onClick={toggleMenu}
                >
                  Contact
                </Link>
              </li>

              {/* Mobile-specific links */}
              <li className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <Link
                  to="/user/wishlist"
                  className="flex items-center font-medium text-gray-800 dark:text-gray-200 hover:text-primary transition-colors"
                  onClick={toggleMenu}
                >
                  <HiOutlineHeart className="h-5 w-5 mr-3" />
                  Wishlist
                </Link>
              </li>

              <li>
                <button
                  onClick={toggleDarkMode}
                  className="flex items-center w-full font-medium text-gray-800 dark:text-gray-200 hover:text-primary transition-colors"
                >
                  {theme === 'light' ? (
                    <>
                      <HiOutlineSun className="h-5 w-5 mr-3" />
                      Light Mode
                    </>
                  ) : (
                    <>
                      <HiOutlineMoon className="h-5 w-5 mr-3" />
                      Dark Mode
                    </>
                  )}
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;