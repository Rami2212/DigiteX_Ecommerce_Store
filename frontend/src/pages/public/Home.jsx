import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    HiChevronLeft,
    HiChevronRight,
    HiStar,
    HiOutlineHeart,
    HiOutlineShoppingCart,
    HiOutlineEye,
    HiOutlineTruck,
    HiOutlineShieldCheck,
    HiOutlineRefresh,
    HiOutlineSupport,
    HiOutlineArrowRight,
    HiOutlineFire,
    HiOutlineGift,
    HiOutlineStar
} from 'react-icons/hi';
import { FiTrendingUp, FiPackage, FiUsers } from 'react-icons/fi';
import { useProduct } from '../../hooks/useProduct';
import { useCategory } from '../../hooks/useCategory';
import { useCart } from '../../hooks/useCart';
import ProductCard from '../../components/products/ProductCard';
import Button from '../../components/common/Button';
import slider1 from '../../assets/home/slider1.jpg';
import slider2 from '../../assets/home/slider2.jpg';
import slider3 from '../../assets/home/slider3.jpg';

const HomePage = () => {
    const { products, getProducts, isLoading } = useProduct();
    const { categories, getCategories } = useCategory();
    const { addToCart } = useCart();

    useEffect(() => {
        getProducts(1, 20);
        getCategories();
    }, []);

    const featuredProducts = products?.slice(0, 8) || [];
    const trendingProducts = products?.slice(8, 16) || [];
    const newArrivals = products?.slice(16, 24) || [];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Hero Section */}
            <HeroSlider />

            {/* Features Section */}
            <FeaturesSection />

            {/* Categories Section */}
            <CategoriesGrid categories={categories} />

            {/* Featured Products Section */}
            <ProductSection
                title="Featured Laptops"
                subtitle="Our top picks for performance and value"
                products={featuredProducts}
                icon={<HiOutlineFire className="h-6 w-6" />}
                viewAllLink="/products"
            />

            {/* Promotional Banner */}
            <PromotionalBanner />

            {/* Trending Products Section */}
            <ProductSection
                title="Trending Models"
                subtitle="Popular laptops everyone's choosing"
                products={trendingProducts}
                icon={<FiTrendingUp className="h-6 w-6" />}
                viewAllLink="/products"
                bgColor="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20"
            />

            {/* New Arrivals Section */}
            <ProductSection
                title="New Arrivals"
                subtitle="Latest laptop models and configurations"
                products={newArrivals}
                icon={<HiOutlineGift className="h-6 w-6" />}
                viewAllLink="/products"
            />
        </div>
    );
};

// Hero Slider Component
const HeroSlider = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const intervalRef = useRef(null);

    const slides = [
        {
            id: 1,
            image: slider1,
        },
        {
            id: 2,
            image: slider2,
        },
        {
            id: 3,
            image: slider3,
        }
    ];

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    useEffect(() => {
        intervalRef.current = setInterval(nextSlide, 5000);
        return () => clearInterval(intervalRef.current);
    }, []);

    const handleSlideChange = (index) => {
        setCurrentSlide(index);
        clearInterval(intervalRef.current);
        intervalRef.current = setInterval(nextSlide, 5000);
    };

    return (
        <div className="bg-white dark:bg-gray-800">
            <div className="container mx-auto px-4 py-4">
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Image Slider - Full width on mobile (first), 2/3 width on desktop */}
                    <div className="w-full lg:w-2/3 relative h-[300px] lg:h-[500px] overflow-hidden rounded-lg shadow-lg order-1">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentSlide}
                                initial={{ opacity: 0, x: 100 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -100 }}
                                transition={{ duration: 0.5 }}
                                className="absolute inset-0"
                            >
                                <img
                                    src={slides[currentSlide].image}
                                    alt={`Slide ${currentSlide + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            </motion.div>
                        </AnimatePresence>

                        {/* Navigation Arrows */}
                        <button
                            onClick={prevSlide}
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-md transition-colors"
                        >
                            <HiChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                            onClick={nextSlide}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-md transition-colors"
                        >
                            <HiChevronRight className="h-5 w-5" />
                        </button>

                        {/* Slide Indicators */}
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                            {slides.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleSlideChange(index)}
                                    className={`w-3 h-3 rounded-full transition-colors ${
                                        index === currentSlide ? 'bg-white' : 'bg-white/50'
                                    }`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Sidebar - 1/3 width on desktop */}
                    <div className="w-full lg:w-1/3 h-auto lg:h-[500px] flex flex-col space-y-4 order-2">
                        {/* Welcome Message Container */}
                        <div className="bg-gradient-to-br from-primary to-primary-dark rounded-lg p-6 shadow-lg text-white relative overflow-hidden">
                            {/* Background decorative elements */}
                            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12" />
                            <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full translate-y-10 -translate-x-10" />
                            
                            <div className="relative z-10">
                                <div className="flex items-center space-x-2 mb-2">
                                    <HiOutlineStar className="h-6 w-6 text-yellow-300" />
                                    <span className="text-lg font-medium">Welcome</span>
                                </div>
                                <h2 className="text-2xl text-white font-bold mb-2">
                                    Welcome to DigiteX
                                </h2>
                                <p className="text-primary-100 leading-relaxed">
                                    Discover our premium collection of laptops designed for gaming, 
                                    business, and everyday use.
                                </p>
                            </div>
                        </div>

                        {/* Navigation Links - Each in separate container */}
                        <div className="space-y-4 flex-grow">
                            <Link to="/products" className="block">
                                <div className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-primary group">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <div className="p-3 bg-primary/10 group-hover:bg-primary rounded-lg transition-colors">
                                                <FiPackage className="h-6 w-6 text-primary group-hover:text-white" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary">
                                                    All Products
                                                </h3>
                                                <p className="text-gray-500 dark:text-gray-400">
                                                    Browse our complete laptop collection
                                                </p>
                                            </div>
                                        </div>
                                        <HiOutlineArrowRight className="h-6 w-6 text-gray-400 group-hover:text-primary transition-colors" />
                                    </div>
                                </div>
                            </Link>

                            <Link to="/categories" className="block">
                                <div className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-primary group">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <div className="p-3 bg-primary/10 group-hover:bg-primary rounded-lg transition-colors">
                                                <HiOutlineEye className="h-6 w-6 text-primary group-hover:text-white" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary">
                                                    Categories
                                                </h3>
                                                <p className="text-gray-500 dark:text-gray-400">
                                                    Gaming, Business, Creative & more
                                                </p>
                                            </div>
                                        </div>
                                        <HiOutlineArrowRight className="h-6 w-6 text-gray-400 group-hover:text-primary transition-colors" />
                                    </div>
                                </div>
                            </Link>

                            <Link to="/contact" className="block">
                                <div className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-primary group">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <div className="p-3 bg-primary/10 group-hover:bg-primary rounded-lg transition-colors">
                                                <FiUsers className="h-6 w-6 text-primary group-hover:text-white" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary">
                                                    Contact Us
                                                </h3>
                                                <p className="text-gray-500 dark:text-gray-400">
                                                    Get expert advice and support
                                                </p>
                                            </div>
                                        </div>
                                        <HiOutlineArrowRight className="h-6 w-6 text-gray-400 group-hover:text-primary transition-colors" />
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Features Section
const FeaturesSection = () => {
    const features = [
        {
            icon: <HiOutlineTruck className="h-8 w-8" />,
            title: "Free Shipping",
            description: "Free delivery on laptop orders over $999"
        },
        {
            icon: <HiOutlineShieldCheck className="h-8 w-8" />,
            title: "Secure Payment",
            description: "100% secure payment processing"
        },
        {
            icon: <HiOutlineRefresh className="h-8 w-8" />,
            title: "Easy Returns",
            description: "30-day hassle-free returns"
        },
        {
            icon: <HiOutlineSupport className="h-8 w-8" />,
            title: "24/7 Support",
            description: "Round-the-clock customer service"
        }
    ];

    return (
        <section className="py-8 bg-white dark:bg-gray-800">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="w-full"
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -2 }}
                                className="bg-gray-50 dark:bg-gray-700 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-600 hover:border-primary/20 group p-6 h-full w-full"
                            >
                                <div className="flex flex-col lg:flex-row items-center lg:items-start text-center lg:text-left h-full">
                                    {/* Icon Section */}
                                    <div className="mb-4 lg:mb-0 lg:mr-4 flex-shrink-0">
                                        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 text-primary rounded-full group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-lg group-hover:shadow-xl">
                                            {feature.icon}
                                        </div>
                                    </div>

                                    {/* Content Section */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary transition-colors">
                                            {feature.title}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// Categories Grid Component
const CategoriesGrid = ({ categories }) => {
    if (!categories || categories.length === 0) return null;

    const displayCategories = categories.slice(0, 6);

    return (
        <section className="py-16 bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row gap-8 items-stretch">
                    {/* Left Sidebar - Promotional Banner Style */}
                    <div className="w-full lg:w-1/3">
                        <div className="bg-gradient-to-br from-primary to-primary-dark rounded-2xl p-8 shadow-xl text-white relative overflow-hidden h-full flex flex-col justify-center">
                            {/* Background decorative elements */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12" />
                            <div className="absolute top-1/2 right-1/4 w-20 h-20 bg-white/5 rounded-full" />
                            
                            <div className="relative z-10">
                                <div className="flex items-center space-x-3 mb-4">
                                    <HiOutlineEye className="h-8 w-8 text-yellow-300" />
                                    <span className="text-lg font-medium text-white">Discover</span>
                                </div>
                                
                                <h2 className="text-4xl font-bold mb-4 leading-tight text-white">
                                    Shop by Brand
                                </h2>
                                
                                <div className="space-y-3 mb-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-2 h-2 bg-yellow-300 rounded-full"></div>
                                        <span className="text-white/90">Premium Quality</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <div className="w-2 h-2 bg-yellow-300 rounded-full"></div>
                                        <span className="text-white/90">Latest Technology</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <div className="w-2 h-2 bg-yellow-300 rounded-full"></div>
                                        <span className="text-white/90">Reliable Performance</span>
                                    </div>
                                </div>
                                
                                <Link to="/categories">
                                    <Button 
                                        size="lg" 
                                        variant="secondary"
                                        className="bg-white text-primary hover:bg-gray-100 font-semibold border-0"
                                    >
                                        View All Brands
                                        <HiOutlineArrowRight className="ml-2 h-5 w-5" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Brands Grid */}
                    <div className="w-full lg:w-2/3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 h-full">
                            {displayCategories.map((category, index) => (
                                <Link
                                    key={category._id}
                                    to={`/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                                    className="group"
                                >
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        whileHover={{ y: -4 }}
                                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden group-hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-primary/30 h-40"
                                    >
                                        <div className="flex items-center h-full">
                                            {/* Large Brand Image with White Background - Left Side */}
                                            <div className="w-40 h-full flex-shrink-0 p-4 bg-white dark:bg-white">
                                                <img
                                                    src={category.categoryImage}
                                                    alt={category.name}
                                                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                                                />
                                            </div>
                                            
                                            {/* Brand Name - Right Side */}
                                            <div className="flex-1 min-w-0 p-6">
                                                <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors duration-300 mb-2">
                                                    {category.name}
                                                </h3>
                                                <div className="flex items-center space-x-2 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                                                    <span className="text-gray-600 dark:text-gray-300 text-sm font-medium">Explore Products</span>
                                                    <HiOutlineArrowRight className="h-4 w-4 text-primary group-hover:translate-x-1 transition-transform duration-300" />
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

// Product Section Component
const ProductSection = ({ title, subtitle, products, icon, viewAllLink, bgColor = "bg-white dark:bg-gray-800" }) => {
    if (!products || products.length === 0) return null;

    return (
        <section className={`py-16 ${bgColor}`}>
            <div className="container mx-auto px-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-12">
                    <div className="flex items-center space-x-3">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                                {title}
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">
                                {subtitle}
                            </p>
                        </div>
                    </div>
                    <Link to={viewAllLink} className="mt-4 sm:mt-0 sm:flex-shrink-0">
                        <Button variant="outline">
                            View All
                            <HiOutlineArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {products.slice(0, 8).map((product, index) => (
                        <motion.div
                            key={product._id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <ProductCard product={product} />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// Promotional Banner Component
const PromotionalBanner = () => {
    return (
        <section className="">
            <div className="bg-gradient-to-r from-primary to-primary-dark py-16 md:py-32 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24" />

                <div className="container mx-auto px-4">
                    <div className="relative z-10 max-w-3xl mx-auto text-center">
                        <div className="flex items-center justify-center space-x-2 mb-4">
                            <HiOutlineStar className="h-6 w-6 text-yellow-300" />
                            <span className="text-lg font-medium">Special Offer</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                            Get 25% Off Your First Laptop
                        </h2>
                        <p className="text-xl text-primary-100 mb-8">
                            Join thousands of satisfied customers and discover amazing deals on premium laptops.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/products">
                                <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100">
                                    Shop Laptops
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HomePage;