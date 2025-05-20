import React from 'react';
import { FiUsers, FiFileText, FiTrendingUp, FiDollarSign } from 'react-icons/fi';

const AdminDashboard = () => {
  // Sample data - replace with real data from your API
  const stats = [
    {
      title: 'Total Users',
      value: '1,234',
      change: '+12%',
      changeType: 'increase',
      icon: FiUsers,
      color: 'blue'
    },
    {
      title: 'Total Posts',
      value: '567',
      change: '+8%',
      changeType: 'increase',
      icon: FiFileText,
      color: 'green'
    },
    {
      title: 'Page Views',
      value: '89,123',
      change: '+15%',
      changeType: 'increase',
      icon: FiTrendingUp,
      color: 'purple'
    },
    {
      title: 'Revenue',
      value: '$12,345',
      change: '-3%',
      changeType: 'decrease',
      icon: FiDollarSign,
      color: 'yellow'
    }
  ];

  const recentActivities = [
    { id: 1, action: 'New user registered', user: 'John Doe', time: '2 minutes ago' },
    { id: 2, action: 'Post published', user: 'Jane Smith', time: '15 minutes ago' },
    { id: 3, action: 'Order completed', user: 'Mike Johnson', time: '1 hour ago' },
    { id: 4, action: 'Comment posted', user: 'Sarah Wilson', time: '2 hours ago' },
    { id: 5, action: 'Product updated', user: 'Admin', time: '3 hours ago' }
  ];

  const getColorClasses = (color) => {
    const colorMap = {
      blue: 'bg-blue-500 text-blue-600 bg-blue-50',
      green: 'bg-green-500 text-green-600 bg-green-50',
      purple: 'bg-purple-500 text-purple-600 bg-purple-50',
      yellow: 'bg-yellow-500 text-yellow-600 bg-yellow-50'
    };
    return colorMap[color] || 'bg-gray-500 text-gray-600 bg-gray-50';
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-sm text-gray-700">
          Welcome back! Here's what's happening with your application.
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
        {/* Recent Activity */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Recent Activity
            </h3>
            <div className="flow-root">
              <ul className="-mb-8">
                {recentActivities.map((activity, index) => (
                  <li key={activity.id}>
                    <div className="relative pb-8">
                      {index !== recentActivities.length - 1 && (
                        <span
                          className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                          aria-hidden="true"
                        />
                      )}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                            <FiUsers className="h-4 w-4 text-white" />
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm text-gray-500">
                              <span className="font-medium text-gray-900">
                                {activity.user}
                              </span>{' '}
                              {activity.action}
                            </p>
                          </div>
                          <div className="text-right text-sm whitespace-nowrap text-gray-500">
                            {activity.time}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-6">
              <a
                href="#"
                className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                View all activity
              </a>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <button className="relative rounded-lg border border-gray-300 bg-white px-6 py-4 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <div className="flex-shrink-0">
                  <FiUsers className="h-6 w-6 text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 text-left">
                    Add New User
                  </p>
                  <p className="text-sm text-gray-500 text-left">
                    Create a new user account
                  </p>
                </div>
              </button>

              <button className="relative rounded-lg border border-gray-300 bg-white px-6 py-4 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <div className="flex-shrink-0">
                  <FiFileText className="h-6 w-6 text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 text-left">
                    Create Post
                  </p>
                  <p className="text-sm text-gray-500 text-left">
                    Write a new blog post
                  </p>
                </div>
              </button>

              <button className="relative rounded-lg border border-gray-300 bg-white px-6 py-4 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <div className="flex-shrink-0">
                  <FiTrendingUp className="h-6 w-6 text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 text-left">
                    View Analytics
                  </p>
                  <p className="text-sm text-gray-500 text-left">
                    Check your site statistics
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Charts or Widgets can go here */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            System Status
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-semibold text-green-600">99.9%</div>
              <div className="text-sm text-gray-500">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold text-blue-600">45ms</div>
              <div className="text-sm text-gray-500">Response Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold text-purple-600">2.1GB</div>
              <div className="text-sm text-gray-500">Storage Used</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;