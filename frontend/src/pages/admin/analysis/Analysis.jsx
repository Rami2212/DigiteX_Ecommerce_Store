import React, { useEffect, useState } from 'react';
import {
    FiTrendingUp,
    FiTrendingDown,
    FiDollarSign,
    FiShoppingCart,
    FiPackage,
    FiUsers,
    FiAlertTriangle,
    FiCheckCircle,
    FiXCircle,
    FiClock,
    FiEye,
    FiBarChart,
    FiPieChart,
    FiRefreshCw,
    FiDownload
} from 'react-icons/fi';
import { motion } from 'framer-motion';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    Area,
    AreaChart
} from 'recharts';
import { useProduct } from '../../../hooks/useProduct';
import { useOrder } from '../../../hooks/useOrder';
import Button from '../../../components/common/Button';
import {
    calculateProductAnalytics,
    calculateOrderAnalytics,
    calculatePerformanceMetrics,
    generateRecommendations
} from './adminCalculations';

const AnalysisPage = () => {
    const { products, getProducts, isLoading: productsLoading } = useProduct();
    const { orders, getAllOrders, isLoading: ordersLoading } = useOrder();

    const [analytics, setAnalytics] = useState({
        products: null,
        orders: null,
        performance: null,
        recommendations: []
    });
    const [selectedTimeframe, setSelectedTimeframe] = useState('all');
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        if (products && orders) {
            calculateAnalytics();
        }
    }, [products, orders, selectedTimeframe]);

    const loadData = async () => {
        try {
            await Promise.all([
                getProducts(1, 1000), // Get all products
                getAllOrders(1, 1000)  // Get all orders
            ]);
        } catch (error) {
            console.error('Error loading data:', error);
        }
    };

    const calculateAnalytics = () => {
        let filteredOrders = orders || [];

        // Filter orders by timeframe
        if (selectedTimeframe !== 'all') {
            const now = new Date();
            const timeframes = {
                '7d': 7,
                '30d': 30,
                '90d': 90,
                '1y': 365
            };

            const days = timeframes[selectedTimeframe];
            if (days) {
                const cutoffDate = new Date(now.getTime() - (days * 24 * 60 * 60 * 1000));
                filteredOrders = orders.filter(order => new Date(order.createdAt) >= cutoffDate);
            }
        }

        const productAnalytics = calculateProductAnalytics(products);
        const orderAnalytics = calculateOrderAnalytics(filteredOrders);
        const performanceMetrics = calculatePerformanceMetrics(products, filteredOrders);
        const recommendations = generateRecommendations(products, filteredOrders);

        setAnalytics({
            products: productAnalytics,
            orders: orderAnalytics,
            performance: performanceMetrics,
            recommendations
        });
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        await loadData();
        setRefreshing(false);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-LK', {
            style: 'currency',
            currency: 'LKR'
        }).format(amount);
    };

    const isLoading = productsLoading || ordersLoading;

    // Chart colors
    const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#F97316'];

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

    if (isLoading && !analytics.products) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading analytics...</p>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Header */}
            <motion.div variants={itemVariants} className="sm:flex sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Analytics Dashboard</h1>
                    <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                        Comprehensive business insights and performance metrics
                    </p>
                </div>
                <div className="mt-4 sm:mt-0 flex gap-3">
                    <select
                        value={selectedTimeframe}
                        onChange={(e) => setSelectedTimeframe(e.target.value)}
                        className="block px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                        <option value="all">All Time</option>
                        <option value="7d">Last 7 Days</option>
                        <option value="30d">Last 30 Days</option>
                        <option value="90d">Last 90 Days</option>
                        <option value="1y">Last Year</option>
                    </select>
                    <Button
                        onClick={handleRefresh}
                        disabled={refreshing}
                        variant="outline"
                        icon={<FiRefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />}
                    >
                        Refresh
                    </Button>
                </div>
            </motion.div>

            {/* KPI Cards */}
            {analytics.performance && (
                <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <FiDollarSign className="h-8 w-8 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Revenue</p>
                                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                                    {formatCurrency(analytics.performance.kpis.totalRevenue)}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <FiShoppingCart className="h-8 w-8 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Orders</p>
                                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                                    {analytics.performance.kpis.totalOrders.toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <FiPackage className="h-8 w-8 text-purple-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Products</p>
                                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                                    {analytics.performance.kpis.totalProducts}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <FiTrendingUp className="h-8 w-8 text-indigo-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg Order Value</p>
                                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                                    {formatCurrency(analytics.performance.kpis.averageOrderValue)}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <FiBarChart className="h-8 w-8 text-orange-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Stock Value</p>
                                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                                    {formatCurrency(analytics.performance.kpis.stockValue)}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <FiCheckCircle className="h-8 w-8 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Completion Rate</p>
                                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                                    {analytics.performance.kpis.completionRate.toFixed(1)}%
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Alerts */}
            {analytics.performance?.alerts && (
                <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                        <div className="flex items-center">
                            <FiXCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                            <h3 className="ml-2 text-sm font-medium text-red-800 dark:text-red-200">Out of Stock</h3>
                        </div>
                        <p className="mt-1 text-2xl font-semibold text-red-900 dark:text-red-100">
                            {analytics.performance.alerts.outOfStock}
                        </p>
                    </div>

                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                        <div className="flex items-center">
                            <FiAlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                            <h3 className="ml-2 text-sm font-medium text-yellow-800 dark:text-yellow-200">Low Stock</h3>
                        </div>
                        <p className="mt-1 text-2xl font-semibold text-yellow-900 dark:text-yellow-100">
                            {analytics.performance.alerts.lowStock}
                        </p>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                        <div className="flex items-center">
                            <FiClock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            <h3 className="ml-2 text-sm font-medium text-blue-800 dark:text-blue-200">Pending Orders</h3>
                        </div>
                        <p className="mt-1 text-2xl font-semibold text-blue-900 dark:text-blue-100">
                            {analytics.performance.alerts.pendingOrders}
                        </p>
                    </div>

                    <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                        <div className="flex items-center">
                            <FiXCircle className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                            <h3 className="ml-2 text-sm font-medium text-purple-800 dark:text-purple-200">Failed Orders</h3>
                        </div>
                        <p className="mt-1 text-2xl font-semibold text-purple-900 dark:text-purple-100">
                            {analytics.performance.alerts.failedOrders}
                        </p>
                    </div>
                </motion.div>
            )}

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Trend */}
                {analytics.orders?.revenueByMonth && (
                    <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Revenue Trend</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={analytics.orders.revenueByMonth}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip formatter={(value) => [formatCurrency(value), 'Revenue']} />
                                <Area type="monotone" dataKey="revenue" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </motion.div>
                )}

                {/* Orders Trend */}
                {analytics.orders?.ordersByMonth && (
                    <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Orders Trend</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={analytics.orders.ordersByMonth}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="orders" stroke="#10B981" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </motion.div>
                )}

                {/* Order Status Distribution */}
                {analytics.orders?.ordersByStatus && (
                    <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Order Status Distribution</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={Object.entries(analytics.orders.ordersByStatus).map(([status, count]) => ({
                                        name: status,
                                        value: count
                                    }))}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {Object.keys(analytics.orders.ordersByStatus).map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </motion.div>
                )}

                {/* Stock Status */}
                {analytics.products?.stockStatus && (
                    <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Stock Status</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart
                                data={[
                                    { name: 'In Stock', count: analytics.products.stockStatus.inStock, fill: '#10B981' },
                                    { name: 'Low Stock', count: analytics.products.stockStatus.lowStock, fill: '#F59E0B' },
                                    { name: 'Out of Stock', count: analytics.products.stockStatus.outOfStock, fill: '#EF4444' }
                                ]}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="count" />
                            </BarChart>
                        </ResponsiveContainer>
                    </motion.div>
                )}
            </div>

            {/* Top Products & Categories */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Selling Products */}
                {analytics.orders?.topSellingProducts && (
                    <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Top Selling Products</h3>
                        <div className="space-y-3">
                            {analytics.orders.topSellingProducts.slice(0, 5).map((product, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium">
                                            {index + 1}
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">{product.name}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {product.quantity} units sold
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {formatCurrency(product.revenue)}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {product.orders} orders
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Recommendations */}
                {analytics.recommendations && analytics.recommendations.length > 0 && (
                    <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Recommendations</h3>
                        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                            {analytics.recommendations.map((rec, index) => (
                                <div
                                    key={index}
                                    className={`p-4 rounded-lg border-l-4 ${rec.type === 'critical'
                                            ? 'bg-red-50 dark:bg-red-900/20 border-red-400'
                                            : rec.type === 'warning'
                                                ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-400'
                                                : 'bg-blue-50 dark:bg-blue-900/20 border-blue-400'
                                        }`}
                                >
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0">
                                            {rec.type === 'critical' && <FiXCircle className="h-5 w-5 text-red-500" />}
                                            {rec.type === 'warning' && <FiAlertTriangle className="h-5 w-5 text-yellow-500" />}
                                            {rec.type === 'info' && <FiCheckCircle className="h-5 w-5 text-blue-500" />}
                                        </div>
                                        <div className="ml-3 flex-1">
                                            <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                                                {rec.title}
                                            </h4>
                                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                                                {rec.message}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Performance Metrics */}
            {analytics.performance && (
                <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Performance Metrics</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="text-center">
                            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg mx-auto mb-3">
                                <FiEye className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                                {analytics.performance.performance.viewsToOrdersRatio.toFixed(2)}%
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Views to Orders</p>
                        </div>

                        <div className="text-center">
                            <div className="flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg mx-auto mb-3">
                                <FiTrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
                            </div>
                            <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                                {analytics.performance.performance.stockTurnover.toFixed(2)}%
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Stock Turnover</p>
                        </div>

                        <div className="text-center">
                            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg mx-auto mb-3">
                                <FiDollarSign className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                                {formatCurrency(analytics.performance.performance.revenuePerProduct)}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Revenue per Product</p>
                        </div>

                        <div className="text-center">
                            <div className="flex items-center justify-center w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg mx-auto mb-3">
                                <FiShoppingCart className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                            </div>
                            <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                                {analytics.performance.performance.thisMonthOrders}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">This Month Orders</p>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Payment Methods Analysis */}
            {analytics.orders?.paymentAnalysis && (
                <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Payment Methods Analysis</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Cash on Delivery</h4>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-300">Orders:</span>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                        {analytics.orders.paymentAnalysis.cod.count}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-300">Revenue:</span>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                        {formatCurrency(analytics.orders.paymentAnalysis.cod.revenue)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-300">Avg Order:</span>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                        {formatCurrency(analytics.orders.paymentAnalysis.cod.count > 0
                                            ? analytics.orders.paymentAnalysis.cod.revenue / analytics.orders.paymentAnalysis.cod.count
                                            : 0)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Stripe Payments</h4>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-300">Orders:</span>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                        {analytics.orders.paymentAnalysis.stripe.count}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-300">Revenue:</span>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                        {formatCurrency(analytics.orders.paymentAnalysis.stripe.revenue)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-300">Avg Order:</span>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                        {formatCurrency(analytics.orders.paymentAnalysis.stripe.count > 0
                                            ? analytics.orders.paymentAnalysis.stripe.revenue / analytics.orders.paymentAnalysis.stripe.count
                                            : 0)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
};

export default AnalysisPage;