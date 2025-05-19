import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineSearch, HiOutlineShoppingCart, HiOutlineUser, HiOutlineMenu, HiOutlineX } from 'react-icons/hi';
import Logo from './Logo';
import { useAuth } from '../../hooks/useAuth';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="w-full">
      {/* Top Bar */}
      <div className="bg-primary text-white py-2">
        <div className="container flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <a href="tel:+1234567890" className="text-sm hover:text-accent">
              Call Us: (123) 456-7890
            </a>
            <span className="hidden md:inline text-sm">Free shipping on orders over $999</span>
          </div>
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link to="/user/profile" className="text-sm hover:text-accent">
                  Hi, {user?.firstName || 'User'}
                </Link>
                <button onClick={logout} className="text-sm hover:text-accent">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/auth/login" className="text-sm hover:text-accent">
                  Login
                </Link>
                <Link to="/auth/register" className="text-sm hover:text-accent">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-white py-4 shadow-md">
        <div className="container flex justify-between items-center">
          {/* Logo */}
          <Logo size="default" />

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex flex-grow mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search for laptops, accessories..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-primary">
                <HiOutlineSearch size={20} />
              </button>
            </div>
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-4">
            <button className="relative p-2 hover:text-primary">
              <HiOutlineShoppingCart size={24} />
              <span className="absolute -top-1 -right-1 bg-accent text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                0
              </span>
            </button>

            {isAuthenticated ? (
              <Link to="/user/profile" className="p-2 hover:text-primary">
                <HiOutlineUser size={24} />
              </Link>
            ) : (
              <Link to="/auth/login" className="p-2 hover:text-primary">
                <HiOutlineUser size={24} />
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2 hover:text-primary" onClick={toggleMenu}>
              {isMenuOpen ? <HiOutlineX size={24} /> : <HiOutlineMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <NavigationBar isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
    </header>
  );
};

const NavigationBar = ({ isMenuOpen, toggleMenu }) => {
  const categories = [
    { id: 1, name: 'Laptops', href: '/category/laptops' },
    { id: 2, name: 'Gaming', href: '/category/gaming' },
    { id: 3, name: 'Business', href: '/category/business' },
    { id: 4, name: 'Student', href: '/category/student' },
    { id: 5, name: 'Accessories', href: '/category/accessories' },
    { id: 6, name: 'Deals', href: '/deals' },
  ];

  return (
    <nav className="bg-white border-t border-b border-gray-200">
      {/* Desktop Navigation */}
      <div className="container hidden md:flex items-center py-3">
        <ul className="flex items-center space-x-8">
          <li>
            <Link
              to="/"
              className="font-medium text-gray-800 hover:text-primary transition-colors"
            >
              Home
            </Link>
          </li>
          {categories.map((category) => (
            <li key={category.id}>
              <Link
                to={category.href}
                className="font-medium text-gray-800 hover:text-primary transition-colors"
              >
                {category.name}
              </Link>
            </li>
          ))}
          <li>
            <Link
              to="/support"
              className="font-medium text-gray-800 hover:text-primary transition-colors"
            >
              Support
            </Link>
          </li>
        </ul>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden transition-opacity duration-300 ${
          isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggleMenu}
      />

      <div
        className={`fixed top-0 left-0 h-full w-4/5 max-w-sm bg-white z-40 md:hidden transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <Logo size="small" />
            <button onClick={toggleMenu} className="p-2">
              <HiOutlineX size={24} />
            </button>
          </div>
        </div>
        
        {/* Mobile Search */}
        <div className="p-4 border-b">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-primary">
              <HiOutlineSearch size={20} />
            </button>
          </div>
        </div>

        {/* Mobile Menu Links */}
        <div className="p-4">
          <ul className="space-y-4">
            <li>
              <Link
                to="/"
                className="block font-medium text-gray-800 hover:text-primary"
                onClick={toggleMenu}
              >
                Home
              </Link>
            </li>
            {categories.map((category) => (
              <li key={category.id}>
                <Link
                  to={category.href}
                  className="block font-medium text-gray-800 hover:text-primary"
                  onClick={toggleMenu}
                >
                  {category.name}
                </Link>
              </li>
            ))}
            <li>
              <Link
                to="/support"
                className="block font-medium text-gray-800 hover:text-primary"
                onClick={toggleMenu}
              >
                Support
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;