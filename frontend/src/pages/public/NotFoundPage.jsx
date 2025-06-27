import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HiOutlineHome,
  HiOutlineArrowLeft,
  HiOutlineSearch,
  HiOutlineShoppingBag
} from 'react-icons/hi';
import Button from '../../components/common/Button';

const NotFoundPage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 12
      }
    }
  };

  const floatingAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  return (
    <div className="py-24 bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <motion.div
        className="max-w-2xl mx-auto text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* 404 Animation */}
        <motion.div
          className="mb-8"
          variants={itemVariants}
          animate={floatingAnimation}
        >
          <div className="relative">
            <h1 className="text-9xl md:text-[12rem] font-bold text-primary/20 dark:text-primary/10">
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-primary/10 p-6 rounded-full">
                <HiOutlineSearch className="h-16 w-16 text-primary" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div variants={itemVariants} className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Page Not Found
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
            Sorry, we couldn't find the laptop or page you're looking for. 
            It might have been moved, deleted, or you entered the wrong URL.
          </p>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
        >
          <Link to="/">
            <Button size="lg" className="w-full sm:w-auto">
              <HiOutlineHome className="mr-2 h-5 w-5" />
              Back to Home
            </Button>
          </Link>
          <Link to="/products">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              <HiOutlineShoppingBag className="mr-2 h-5 w-5" />
              Shop Laptops
            </Button>
          </Link>
        </motion.div>

        {/* Go Back Button */}
        <motion.div variants={itemVariants} className="mt-8">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center text-primary hover:text-primary-dark transition-colors"
          >
            <HiOutlineArrowLeft className="mr-2 h-4 w-4" />
            Go back to previous page
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;