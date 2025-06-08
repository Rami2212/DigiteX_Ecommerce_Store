import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiUsers, 
  FiShoppingBag, 
  FiTrendingUp, 
  FiDollarSign,
  FiPackage,
  FiMail,
  FiGrid,
  FiShoppingCart,
  FiEye,
  FiEdit2,
  FiPlus,
  FiAlertTriangle
} from 'react-icons/fi';
import { HiOutlineExclamation } from 'react-icons/hi';
import { useUser } from '../../hooks/useUser';
import { useProduct } from '../../hooks/useProduct';
import { useOrder } from '../../hooks/useOrder';
import { useContact } from '../../hooks/useContact';
import { useCategory } from '../../hooks/useCategory';

const AdminDashboard = () => {
  const { users, totalUsers, getUsers } = useUser();
  const { products, totalProducts, getProducts } = useProduct();
  const { orders, totalOrders, orderStats, getAllOrders, getOrderStats } = useOrder();
  const { contacts, contactStats, getContacts, getContactStats } = useContact();
  const { categories, getCategories } = useCategory();

  useEffect(() => {
    // Fetch all data on component mount
    getUsers();
    getProducts(1, 10);
    getAllOrders(1, 10);
    getContacts();
    getCategories();
    getOrderStats();
    getContactStats();
  }, []);

  // Calculate stats
  const stats = [
    {
      title: 'Total Users',
      value: totalUsers?.toLocaleString() || users?.length?.toLocaleString() || '0',
      change: '+12%',
      changeType: 'increase',
      icon: FiUsers,
      color: 'blue'
    },
    {
      title: 'Total Products',
      value: totalProducts?.toLocaleString() || products?.length?.toLocaleString() || '0',
      change: '+8%',
      changeType: 'increase',
      icon: FiPackage,
      color: 'green'
    },
    {
      title: 'Total Orders',
      value: totalOrders?.toLocaleString() || orders?.length?.toLocaleString() || '0',
      change: '+15%',
      changeType: 'increase',
      icon: FiShoppingBag,
      color: 'purple'
    },
    {
      title: 'Revenue',
      value: orderStats?.totalRevenue ? `$${orderStats.totalRevenue.toLocaleString()}` : '$0',
      change: orderStats?.revenueGrowth ? `${orderStats.revenueGrowth > 0 ? '+' : ''}${orderStats.revenueGrowth}%` : '0%',
      changeType: orderStats?.revenueGrowth >= 0 ? 'increase' : 'decrease',
      icon: FiDollarSign,
      color: 'yellow'
    }
  ];

  // Recent orders for display
  const recentOrders = orders?.slice(0, 3) || [];

  // Pending contacts
  const pendingContacts = contacts?.filter(contact => contact.status === 'pending')?.slice(0, 5) || [];

  // Low stock products (assuming you have stock field)
  const lowStockProducts = products?.filter(product => product.stock && product.stock < 10)?.slice(0, 5) || [];

  const getColorClasses = (color) => {
    const colorMap = {
      blue: 'bg-blue-500 text-blue-600 bg-blue-50',
      green: 'bg-green-500 text-green-600 bg-green-50',
      purple: 'bg-purple-500 text-purple-600 bg-purple-50',
      yellow: 'bg-yellow-500 text-yellow-600 bg-yellow-50'
    };
    return colorMap[color] || 'bg-gray-500 text-gray-600 bg-gray-50';
  };

  const getOrderStatusBadge = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-sm text-gray-700">
          Welcome back! Here's what's happening with your store.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const colors = getColorClasses(stat.color).split(' ');
          
          return (
            <div key={index} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className={`p-3 rounded-md ${colors[2]}`}>
                      <Icon className={`h-6 w-6 ${colors[1]}`} />
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {stat.title}
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">
                          {stat.value}
                        </div>
                        <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                          stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {stat.change}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Recent Orders
              </h3>
              <Link 
                to="/admin/orders"
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                View all
              </Link>
            </div>
            <div className="flow-root">
              {recentOrders.length > 0 ? (
                <ul className="-mb-8">
                  {recentOrders.map((order, index) => (
                    <li key={order._id}>
                      <div className="relative pb-8">
                        {index !== recentOrders.length - 1 && (
                          <span
                            className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                            aria-hidden="true"
                          />
                        )}
                        <div className="relative flex space-x-3">
                          <div>
                            <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                              <FiShoppingBag className="h-4 w-4 text-white" />
                            </span>
                          </div>
                          <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                            <div>
                              <p className="text-sm text-gray-500">
                                Order <span className="font-medium text-gray-900">#{order.orderNumber || order._id.slice(-6)}</span>
                              </p>
                              <div className="flex items-center space-x-2 mt-1">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getOrderStatusBadge(order.status)}`}>
                                  {order.status}
                                </span>
                                <span className="text-sm font-medium text-gray-900">
                                  ${order.totalAmount?.toFixed(2) || '0.00'}
                                </span>
                              </div>
                            </div>
                            <div className="text-right text-sm whitespace-nowrap text-gray-500">
                              {formatDate(order.createdAt)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-center py-4">No recent orders</p>
              )}
            </div>
          </div>
        </div>

        {/* Pending Contacts */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Pending Messages
              </h3>
              <Link 
                to="/admin/contacts"
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                View all
              </Link>
            </div>
            <div className="flow-root">
              {pendingContacts.length > 0 ? (
                <ul className="-mb-8">
                  {pendingContacts.map((contact, index) => (
                    <li key={contact._id}>
                      <div className="relative pb-8">
                        {index !== pendingContacts.length - 1 && (
                          <span
                            className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                            aria-hidden="true"
                          />
                        )}
                        <div className="relative flex space-x-3">
                          <div>
                            <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                              contact.priority === 'urgent' ? 'bg-red-500' : 'bg-yellow-500'
                            }`}>
                              {contact.priority === 'urgent' ? (
                                <HiOutlineExclamation className="h-4 w-4 text-white" />
                              ) : (
                                <FiMail className="h-4 w-4 text-white" />
                              )}
                            </span>
                          </div>
                          <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                            <div>
                              <p className="text-sm text-gray-500">
                                <span className="font-medium text-gray-900">
                                  {contact.name}
                                </span>{' '}
                                sent a message
                              </p>
                              <p className="text-sm text-gray-500 truncate max-w-xs">
                                {contact.subject}
                              </p>
                            </div>
                            <div className="text-right text-sm whitespace-nowrap text-gray-500">
                              {formatDate(contact.createdAt)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-center py-4">No pending messages</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Three Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <Link 
                to="/admin/add-product"
                className="relative rounded-lg border border-gray-300 bg-white px-6 py-4 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <div className="flex-shrink-0">
                  <FiPackage className="h-6 w-6 text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 text-left">
                    Add Product
                  </p>
                  <p className="text-sm text-gray-500 text-left">
                    Add new product to catalog
                  </p>
                </div>
              </Link>

              <Link 
                to="/admin/add-category"
                className="relative rounded-lg border border-gray-300 bg-white px-6 py-4 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <div className="flex-shrink-0">
                  <FiGrid className="h-6 w-6 text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 text-left">
                    Add Category
                  </p>
                  <p className="text-sm text-gray-500 text-left">
                    Create new product category
                  </p>
                </div>
              </Link>

              <Link 
                to="/admin/orders"
                className="relative rounded-lg border border-gray-300 bg-white px-6 py-4 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <div className="flex-shrink-0">
                  <FiShoppingCart className="h-6 w-6 text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 text-left">
                    Manage Orders
                  </p>
                  <p className="text-sm text-gray-500 text-left">
                    View and process orders
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Low Stock Products */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Low Stock Alert
              </h3>
              <Link 
                to="/admin/products"
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                View all
              </Link>
            </div>
            <div className="space-y-3">
              {lowStockProducts.length > 0 ? (
                lowStockProducts.map((product) => (
                  <div key={product._id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FiAlertTriangle className="h-4 w-4 text-red-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
                          {product.name}
                        </p>
                        <p className="text-xs text-red-600">
                          Only {product.stock} left
                        </p>
                      </div>
                    </div>
                    <Link 
                      to={`/admin/edit-product/${product._id}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FiEdit2 className="h-4 w-4" />
                    </Link>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">All products in stock</p>
              )}
            </div>
          </div>
        </div>

        {/* System Overview */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              System Overview
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="text-center">
                <div className="text-2xl font-semibold text-green-600">
                  {categories?.length || 0}
                </div>
                <div className="text-sm text-gray-500">Categories</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-semibold text-blue-600">
                  {contactStats?.statusStats?.find(s => s._id === 'pending')?.count || 0}
                </div>
                <div className="text-sm text-gray-500">Pending Messages</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-semibold text-purple-600">
                  {orderStats?.pendingOrders || orders?.filter(o => o.status === 'pending')?.length || 0}
                </div>
                <div className="text-sm text-gray-500">Pending Orders</div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">System Status</span>
                <span className="text-green-600 font-medium">All Systems Operational</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;