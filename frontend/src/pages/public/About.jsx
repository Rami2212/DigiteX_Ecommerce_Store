import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HiOutlineHome,
  HiChevronRight,
  HiOutlineUsers,
  HiOutlineGlobe,
  HiOutlineShieldCheck,
  HiOutlineTruck,
  HiOutlineSupport,
  HiOutlineHeart,
  HiOutlineLightBulb,
  HiOutlineCheckCircle,
  HiOutlineArrowRight
} from 'react-icons/hi';
import {
  FiAward,
  FiTarget,
  FiZap,
  FiTrendingUp
} from 'react-icons/fi';
import Button from '../../components/common/Button';

const AboutPage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
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

  const stats = [
    { number: '50K+', label: 'Happy Customers', icon: <HiOutlineUsers className="h-8 w-8" /> },
    { number: '1000+', label: 'Laptop Models', icon: <HiOutlineGlobe className="h-8 w-8" /> },
    { number: '99.5%', label: 'Customer Satisfaction', icon: <HiOutlineHeart className="h-8 w-8" /> },
    { number: '24/7', label: 'Support Available', icon: <HiOutlineSupport className="h-8 w-8" /> }
  ];

  const values = [
    {
      icon: <FiTarget className="h-8 w-8" />,
      title: 'Quality First',
      description: 'We source only the finest laptops from trusted manufacturers, ensuring every product meets our high standards.'
    },
    {
      icon: <HiOutlineLightBulb className="h-8 w-8" />,
      title: 'Innovation',
      description: 'Staying ahead of technology trends to bring you the latest and most advanced laptop solutions.'
    },
    {
      icon: <HiOutlineShieldCheck className="h-8 w-8" />,
      title: 'Trust & Security',
      description: 'Your privacy and security are paramount. We protect your data and provide secure transactions.'
    },
    {
      icon: <HiOutlineSupport className="h-8 w-8" />,
      title: 'Customer Care',
      description: 'Exceptional support from purchase to after-sales service, ensuring your complete satisfaction.'
    }
  ];

  const milestones = [
    {
      year: '2018',
      title: 'Company Founded',
      description: 'Started with a vision to make premium laptops accessible to everyone.'
    },
    {
      year: '2019',
      title: 'First 1000 Customers',
      description: 'Reached our first milestone with exceptional customer satisfaction.'
    },
    {
      year: '2021',
      title: 'Nationwide Expansion',
      description: 'Expanded delivery services to cover the entire country.'
    },
    {
      year: '2023',
      title: '50K+ Happy Customers',
      description: 'Celebrated serving over 50,000 satisfied customers worldwide.'
    },
    {
      year: '2024',
      title: 'Premium Partnership',
      description: 'Became authorized dealers for all major laptop brands.'
    }
  ];

  return (
    <motion.div
      className="min-h-screen bg-gray-50 dark:bg-gray-900"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Breadcrumb */}
      <div className="bg-white dark:bg-gray-800 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4">
          <motion.nav variants={itemVariants} className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-gray-500 hover:text-primary transition-colors">
              <HiOutlineHome className="h-4 w-4" />
            </Link>
            <HiChevronRight className="h-4 w-4 text-gray-400" />
            <span className="text-gray-900 dark:text-white font-medium">About Us</span>
          </motion.nav>
        </div>
      </div>

      {/* Hero Section */}
      <motion.section variants={itemVariants} className="py-16 bg-gradient-to-r from-primary to-primary-dark text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
              About DigiteX
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 mb-8 max-w-3xl mx-auto">
              Your trusted partner in finding the perfect laptop for work, gaming, and creativity since 2018
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100">
                  Contact Us
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section variants={itemVariants} className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                className="text-center group"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 text-primary rounded-full mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                  {stat.icon}
                </div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {stat.number}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Our Story Section */}
      <motion.section variants={itemVariants} className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                  Our Story
                </h2>
                <div className="space-y-4 text-gray-600 dark:text-gray-400">
                  <p className="text-lg">
                    Founded in 2018 by Ramitha Iddamalgoda, DigiteX began with a simple mission: 
                    to make high-quality laptops accessible to everyone, from students to professionals to gamers.
                  </p>
                  <p>
                    We recognized that choosing the right laptop can be overwhelming with so many options available. 
                    That's why we created a curated selection of the best laptops from trusted brands, backed by 
                    expert advice and exceptional customer service.
                  </p>
                  <p>
                    Today, we're proud to serve thousands of customers worldwide, helping them find the perfect 
                    laptop to power their dreams, whether it's coding the next big app, creating stunning visuals, 
                    or dominating the latest games.
                  </p>
                </div>
                <div className="mt-8">
                  <Link to="/products">
                    <Button className="group">
                      Explore Our Collection
                      <HiOutlineArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="relative">
                <div className="bg-gradient-to-br from-primary/20 to-purple-100 dark:from-primary/10 dark:to-purple-900/20 rounded-2xl p-8">
                  <img
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop"
                    alt="Our team"
                    className="w-full h-80 object-cover rounded-xl shadow-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Values Section */}
      <motion.section variants={itemVariants} className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Our Values
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 text-center group hover:shadow-lg transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 text-primary rounded-full mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Timeline Section */}
      <motion.section variants={itemVariants} className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Our Journey
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Key milestones in our growth story
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="flex flex-col md:flex-row items-start md:items-center gap-6"
                >
                  <div className="flex-shrink-0">
                    <div className="bg-primary text-white px-4 py-2 rounded-full font-bold text-lg">
                      {milestone.year}
                    </div>
                  </div>
                  <div className="flex-grow bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {milestone.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {milestone.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section variants={itemVariants} className="py-16 bg-gradient-to-r from-primary to-primary-dark text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Ready to Find Your Perfect Laptop?
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Join thousands of satisfied customers who trust us for their laptop needs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/products">
                <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100">
                  Browse Laptops
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
};

export default AboutPage;