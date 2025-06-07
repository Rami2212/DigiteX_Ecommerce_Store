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
            title: "Latest Laptops",
            subtitle: "Power Your Performance",
            description: "Discover high-performance laptops for gaming, work, and creativity",
            image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=600&fit=crop",
            cta: "Shop Now",
            link: "/products",
            badge: "New Collection"
        },
        {
            id: 2,
            title: "Gaming Laptops",
            subtitle: "Unleash Your Potential",
            description: "High-performance gaming laptops with cutting-edge graphics and processors",
            image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&h=600&fit=crop",
            cta: "Explore Gaming",
            link: "/category/gaming",
            badge: "Up to 50% Off"
        },
        {
            id: 3,
            title: "Business Laptops",
            subtitle: "Professional Excellence",
            description: "Reliable business laptops designed for productivity and portability",
            image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=1200&h=600&fit=crop",
            cta: "Explore Business",
            link: "/category/business-laptops",
            badge: "Extended Warranty"
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
        <div className="relative h-[500px] md:h-[600px] overflow-hidden">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0"
                >
                    <div
                        className="h-full w-full bg-cover bg-center relative"
                        style={{ backgroundImage: `url(${slides[currentSlide].image})` }}
                    >
                        <div className="absolute inset-0 bg-black/40" />
                        <div className="absolute inset-0 flex items-center">
                            <div className="container mx-auto px-4">
                                <div className="max-w-2xl text-white">
                                    {slides[currentSlide].badge && (
                                        <span className="inline-block bg-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
                                            {slides[currentSlide].badge}
                                        </span>
                                    )}
                                    <h1 className="text-4xl md:text-6xl font-bold mb-4">
                                        {slides[currentSlide].title}
                                    </h1>
                                    <h2 className="text-xl md:text-2xl text-gray-200 mb-6">
                                        {slides[currentSlide].subtitle}
                                    </h2>
                                    <p className="text-lg text-gray-300 mb-8 max-w-xl">
                                        {slides[currentSlide].description}
                                    </p>
                                    <Link to={slides[currentSlide].link}>
                                        <Button size="lg" className="bg-primary hover:bg-primary-dark">
                                            {slides[currentSlide].cta}
                                            <HiOutlineArrowRight className="ml-2 h-5 w-5" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-sm transition-colors"
            >
                <HiChevronLeft className="h-6 w-6" />
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-sm transition-colors"
            >
                <HiChevronRight className="h-6 w-6" />
            </button>

            {/* Slide Indicators */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => handleSlideChange(index)}
                        className={`w-3 h-3 rounded-full transition-colors ${index === currentSlide ? 'bg-white' : 'bg-white/50'
                            }`}
                    />
                ))}
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
        <section className="py-16 bg-white dark:bg-gray-800">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="text-center group"
                        >
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 text-primary rounded-full mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                                {feature.icon}
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                {feature.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                {feature.description}
                            </p>
                        </motion.div>
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
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-12">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            Shop by Category
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Find the perfect laptop for your needs
                        </p>
                    </div>
                    <Link to="/categories" className="mt-4 sm:mt-0 sm:flex-shrink-0">
                        <Button variant="outline">
                            View All Categories
                            <HiOutlineArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8">
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
                                whileHover={{ scale: 1.05 }}
                                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden group-hover:shadow-xl transition-all duration-300"
                            >
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={category.categoryImage}
                                        alt={category.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                                    <div className="absolute bottom-4 left-4">
                                        <h3 className="text-xl font-bold text-white">
                                            {category.name}
                                        </h3>
                                    </div>
                                </div>
                            </motion.div>
                        </Link>
                    ))}
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