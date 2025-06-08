import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube, FaLinkedinIn } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const footerLinks = [
    {
      title: 'Products',
      links: [
        { name: 'Gaming Laptops', href: '/category/gaming' },
        { name: 'Business Laptops', href: '/category/business' },
        { name: 'Student Laptops', href: '/category/student' },
        { name: 'Accessories', href: '/category/accessories' },
        { name: 'New Arrivals', href: '/new-arrivals' },
      ],
    },
    {
      title: 'Support',
      links: [
        { name: 'Help Center', href: '/support' },
        { name: 'Contact Us', href: '/contact' },
        { name: 'Returns & Refunds', href: '/returns' },
        { name: 'Warranty Information', href: '/warranty' },
        { name: 'Track Order', href: '/track-order' },
      ],
    },
    {
      title: 'Company',
      links: [
        { name: 'About Us', href: '/about' },
        { name: 'Careers', href: '/careers' },
        { name: 'Blog', href: '/blog' },
        { name: 'Press Releases', href: '/press' },
        { name: 'Privacy Policy', href: '/privacy' },
      ],
    },
  ];

  return (
    <footer className="bg-gray-900 text-white border-t border-gray-200 dark:border-gray-700">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Logo and Description */}
          <div className="lg:col-span-2">
            <Logo size="large" className="mb-4 -ml-6" />
            <p className="text-gray-400 mb-6">
              Digitex Laptop Store offers the latest and most innovative laptops with exceptional customer service. Find your perfect device from our curated selection of premium brands.
            </p>
            <div className="flex items-center space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="bg-primary hover:bg-primary-dark p-2 rounded-full transition-colors">
                <FaFacebookF size={18} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="bg-primary hover:bg-primary-dark p-2 rounded-full transition-colors">
                <FaTwitter size={18} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="bg-primary hover:bg-primary-dark p-2 rounded-full transition-colors">
                <FaInstagram size={18} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="bg-primary hover:bg-primary-dark p-2 rounded-full transition-colors">
                <FaYoutube size={18} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="bg-primary hover:bg-primary-dark p-2 rounded-full transition-colors">
                <FaLinkedinIn size={18} />
              </a>
            </div>
          </div>

          {/* Links */}
          {footerLinks.map((column) => (
            <div key={column.title}>
              <h3 className="text-lg font-semibold mb-4">{column.title}</h3>
              <ul className="space-y-2">
                {column.links.map((link) => (
                  <li key={link.name}>
                    <Link to={link.href} className="text-gray-400 hover:text-accent transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter */}
      <div className="border-t border-gray-800 mx-auto px-4">
        <div className="container py-8 mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-semibold mb-2">Subscribe to our newsletter</h3>
              <p className="text-gray-400">Get the latest updates on new products and upcoming deals</p>
            </div>
            <div className="w-full md:w-96">
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="px-4 py-2 rounded-l-md w-full focus:outline-none text-gray-900"
                />
                <button className="bg-accent hover:bg-accent-dark px-4 py-2 rounded-r-md font-medium transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-gray-950 py-4">
        <div className="container flex flex-col md:flex-row justify-between items-center mx-auto px-4">
          <p className="text-gray-500 text-sm mb-2 md:mb-0">
            &copy; {currentYear} Digitex Laptop Store. All rights reserved.
          </p>
          <div className="flex space-x-4">
            <Link to="/terms" className="text-gray-500 text-sm hover:text-accent">
              Terms of Service
            </Link>
            <Link to="/privacy" className="text-gray-500 text-sm hover:text-accent">
              Privacy Policy
            </Link>
            <Link to="/cookies" className="text-gray-500 text-sm hover:text-accent">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;