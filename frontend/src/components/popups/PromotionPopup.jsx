import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiX, 
  FiGift, 
  FiShoppingBag,
  FiStar,
  FiClock,
  FiTruck,
  FiShield,
  FiRefreshCw,
  FiHeadphones
} from 'react-icons/fi';
import { HiOutlineStar, HiOutlineArrowRight } from 'react-icons/hi';
import Button from '../common/Button';

const PromotionPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59
  });

  // Check if popup should be shown
  useEffect(() => {
    const checkPopupDisplay = () => {
      const lastShown = localStorage.getItem('promotionPopupLastShown');
      const popupDismissed = localStorage.getItem('promotionPopupDismissed');
      const currentTime = new Date().getTime();
      
      // Don't show if dismissed today
      if (popupDismissed) {
        const dismissedTime = parseInt(popupDismissed);
        const oneDayInMs = 24 * 60 * 60 * 1000;
        if (currentTime - dismissedTime < oneDayInMs) {
          return false;
        }
      }
      
      // Show popup if not shown in last hour
      if (!lastShown) {
        return true;
      }
      
      const oneHourInMs = 1 * 60 * 60 * 1000; // Changed from 0 to 1
      return currentTime - parseInt(lastShown) > oneHourInMs;
    };

    // Show popup after 3 seconds delay
    const timer = setTimeout(() => {
      if (checkPopupDisplay()) {
        setIsVisible(true);
        localStorage.setItem('promotionPopupLastShown', new Date().getTime().toString());
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Countdown timer effect
  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 23, minutes: 59, seconds: 59 };
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isVisible]);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('promotionPopupDismissed', new Date().getTime().toString());
  };

  const handleShopNow = () => {
    // Navigate to products page or specific offer page
    window.location.href = '/products';
    setIsVisible(false);
  };

  const handleViewDeals = () => {
    // Navigate to deals/offers page
    window.location.href = '/deals';
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="relative max-w-2xl w-full mx-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Main Popup Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden relative">
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-20 p-3 bg-white/20 hover:bg-white/30 rounded-full transition-all duration-200 backdrop-blur-sm"
            >
              <FiX className="h-6 w-6 text-white" />
            </button>

            {/* Header Section - Primary Gradient Style */}
            <div className="bg-gradient-to-br from-primary to-primary-dark p-8 text-white relative overflow-hidden">
              {/* Background decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12" />
              <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-white/5 rounded-full" />
              
              <div className="relative z-10 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                  className="flex items-center justify-center space-x-2 mb-4"
                >
                  <HiOutlineStar className="h-8 w-8 text-yellow-300" />
                  <span className="text-lg font-medium">Exclusive Offer</span>
                </motion.div>

                <motion.h2
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-3xl md:text-4xl text-white font-bold mb-3"
                >
                  Get 25% Off Your First Laptop
                </motion.h2>

                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-lg text-white/90 mb-4"
                >
                  Join thousands of satisfied customers and discover amazing deals on premium laptops.
                </motion.p>

                {/* Countdown Timer */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="flex items-center justify-center gap-2 mb-6"
                >
                  <FiClock className="h-5 w-5 text-yellow-300" />
                  <span className="text-white/90">Offer ends in:</span>
                  <div className="flex items-center gap-1 text-white font-bold">
                    <span className="bg-white/20 px-3 py-1 rounded-lg text-sm backdrop-blur-sm">
                      {String(timeLeft.hours).padStart(2, '0')}h
                    </span>
                    <span className="text-white/60">:</span>
                    <span className="bg-white/20 px-3 py-1 rounded-lg text-sm backdrop-blur-sm">
                      {String(timeLeft.minutes).padStart(2, '0')}m
                    </span>
                    <span className="text-white/60">:</span>
                    <span className="bg-white/20 px-3 py-1 rounded-lg text-sm backdrop-blur-sm">
                      {String(timeLeft.seconds).padStart(2, '0')}s
                    </span>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-6">
              {/* What You Get Section */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 text-center">
                  What You Get With This Offer
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <FiTruck className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">Free Shipping</p>
                      <p className="text-gray-600 dark:text-gray-400 text-xs">On all orders</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <FiShield className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">Extended Warranty</p>
                      <p className="text-gray-600 dark:text-gray-400 text-xs">2 years coverage</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={handleShopNow}
                  variant="primary"
                  className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3"
                >
                  Shop Laptops Now
                  <HiOutlineArrowRight className="ml-2 h-5 w-5" />
                </Button>
                
                <button
                  onClick={handleDismiss}
                  className="w-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 text-sm transition-colors py-2"
                >
                  No thanks, continue browsing
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-center gap-6 text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <FiStar className="h-3 w-3 text-yellow-500" />
                    <span>4.8/5 Rating</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FiShoppingBag className="h-3 w-3" />
                    <span>10k+ Customers</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FiShield className="h-3 w-3" />
                    <span>Secure Shopping</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PromotionPopup;