export class UserStatsCalculations {
  
  /**
   * Calculate comprehensive user statistics
   * @param {Array} userOrders - Array of user orders
   * @param {Object} wishlist - User wishlist object
   * @param {Object} user - User object
   * @param {string} timeframe - Time filter ('all', 'year', 'month', 'week')
   * @returns {Object} Calculated statistics
   */
  static calculateUserStats(userOrders = [], wishlist = null, user = null, timeframe = 'all') {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Filter orders based on timeframe
    const filteredOrders = this.filterOrdersByTimeframe(userOrders, timeframe, now);
    
    // Basic order statistics
    const basicStats = this.calculateBasicOrderStats(filteredOrders);
    
    // Time-based statistics
    const timeBasedStats = this.calculateTimeBasedStats(userOrders, currentYear, currentMonth);
    
    // Shopping behavior insights
    const behaviorStats = this.calculateShoppingBehavior(filteredOrders);
    
    // Discount and savings analysis
    const savingsStats = this.calculateSavingsStats(filteredOrders);
    
    // Wishlist statistics
    const wishlistStats = this.calculateWishlistStats(wishlist);
    
    // Account information
    const accountStats = this.calculateAccountStats(user, now);
    
    // Order history data for charts
    const orderHistory = this.generateOrderHistoryData(filteredOrders, timeframe, now);

    return {
      ...basicStats,
      ...timeBasedStats,
      ...behaviorStats,
      ...savingsStats,
      ...wishlistStats,
      ...accountStats,
      orderHistory
    };
  }

  /**
   * Filter orders by timeframe
   */
  static filterOrdersByTimeframe(orders, timeframe, now) {
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    switch (timeframe) {
      case 'year':
        return orders.filter(order => 
          new Date(order.createdAt).getFullYear() === currentYear
        );
      case 'month':
        return orders.filter(order => {
          const orderDate = new Date(order.createdAt);
          return orderDate.getFullYear() === currentYear && orderDate.getMonth() === currentMonth;
        });
      case 'week':
        return orders.filter(order => 
          new Date(order.createdAt) >= oneWeekAgo
        );
      default:
        return orders;
    }
  }

  /**
   * Calculate basic order statistics
   */
  static calculateBasicOrderStats(orders) {
    const totalOrders = orders.length;
    const totalSpent = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    const averageOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;
    
    const totalItemsPurchased = orders.reduce((sum, order) => 
      sum + (order.items?.reduce((itemSum, item) => itemSum + (item.quantity || 0), 0) || 0), 0
    );

    const ordersByStatus = {
      pending: orders.filter(o => o.status === 'pending').length,
      processing: orders.filter(o => o.status === 'processing').length,
      shipped: orders.filter(o => o.status === 'shipped').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length,
    };

    return {
      totalOrders,
      totalSpent,
      averageOrderValue,
      totalItemsPurchased,
      ordersByStatus
    };
  }

  /**
   * Calculate time-based statistics
   */
  static calculateTimeBasedStats(orders, currentYear, currentMonth) {
    const ordersThisMonth = orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return orderDate.getFullYear() === currentYear && orderDate.getMonth() === currentMonth;
    }).length;

    const ordersThisYear = orders.filter(order => 
      new Date(order.createdAt).getFullYear() === currentYear
    ).length;

    const spentThisMonth = orders
      .filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate.getFullYear() === currentYear && orderDate.getMonth() === currentMonth;
      })
      .reduce((sum, order) => sum + (order.totalAmount || 0), 0);

    const spentThisYear = orders
      .filter(order => new Date(order.createdAt).getFullYear() === currentYear)
      .reduce((sum, order) => sum + (order.totalAmount || 0), 0);

    return {
      ordersThisMonth,
      ordersThisYear,
      spentThisMonth,
      spentThisYear
    };
  }

  /**
   * Calculate shopping behavior insights
   */
  static calculateShoppingBehavior(orders) {
    // Favorite shopping day calculation
    const orderDays = orders.map(order => new Date(order.createdAt).getDay());
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayCounts = dayNames.map((_, index) => ({
      day: dayNames[index],
      count: orderDays.filter(day => day === index).length
    }));
    const favoriteShoppingDay = dayCounts.reduce((max, current) => 
      current.count > max.count ? current : max, { day: 'N/A', count: 0 }
    ).day;

    // Average time between orders
    const averageTimeBetweenOrders = this.calculateAverageTimeBetweenOrders(orders);

    return {
      favoriteShoppingDay,
      averageTimeBetweenOrders
    };
  }

  /**
   * Calculate average time between orders
   */
  static calculateAverageTimeBetweenOrders(orders) {
    if (orders.length < 2) return 0;

    const sortedOrders = [...orders].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    let totalDaysBetween = 0;
    
    for (let i = 1; i < sortedOrders.length; i++) {
      const diff = new Date(sortedOrders[i].createdAt) - new Date(sortedOrders[i-1].createdAt);
      totalDaysBetween += Math.floor(diff / (1000 * 60 * 60 * 24));
    }
    
    return Math.floor(totalDaysBetween / (sortedOrders.length - 1));
  }

  /**
   * Calculate savings and discount statistics
   */
  static calculateSavingsStats(orders) {
    const discountOrders = orders.filter(order => order.discountAmount && order.discountAmount > 0).length;
    const totalSavings = orders.reduce((sum, order) => sum + (order.discountAmount || 0), 0);

    return {
      totalSavings,
      discountOrders
    };
  }

  /**
   * Calculate wishlist statistics
   */
  static calculateWishlistStats(wishlist) {
    const wishlistItems = wishlist?.totalItems || 0;
    const wishlistValue = wishlist?.items?.reduce((sum, item) => 
      sum + (item.product.salePrice || item.product.price || 0), 0) || 0;

    return {
      wishlistItems,
      wishlistValue
    };
  }

  /**
   * Calculate account statistics
   */
  static calculateAccountStats(user, now) {
    const memberSince = user?.createdAt ? new Date(user.createdAt) : null;
    const accountAge = memberSince ? Math.floor((now - memberSince) / (1000 * 60 * 60 * 24)) : 0;

    return {
      memberSince,
      accountAge
    };
  }

  /**
   * Generate order history data for charts
   */
  static generateOrderHistoryData(orders, timeframe, now) {
    let dataPoints = [];
    
    switch (timeframe) {
      case 'week':
        dataPoints = this.generateWeeklyData(orders, now);
        break;
      case 'month':
        dataPoints = this.generateMonthlyWeekData(orders, now);
        break;
      case 'year':
        dataPoints = this.generateYearlyMonthData(orders, now);
        break;
      default:
        dataPoints = this.generateAllTimeYearData(orders);
        break;
    }
    
    return dataPoints;
  }

  /**
   * Generate weekly data (last 7 days)
   */
  static generateWeeklyData(orders, now) {
    const dataPoints = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dayOrders = orders.filter(order => 
        new Date(order.createdAt).toDateString() === date.toDateString()
      );
      
      dataPoints.push({
        label: date.toLocaleDateString('en-US', { weekday: 'short' }),
        orders: dayOrders.length,
        amount: dayOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0)
      });
    }
    
    return dataPoints;
  }

  /**
   * Generate monthly data by weeks (last 4 weeks)
   */
  static generateMonthlyWeekData(orders, now) {
    const dataPoints = [];
    
    for (let i = 3; i >= 0; i--) {
      const weekStart = new Date(now.getTime() - (i + 1) * 7 * 24 * 60 * 60 * 1000);
      const weekEnd = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
      const weekOrders = orders.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= weekStart && orderDate < weekEnd;
      });
      
      dataPoints.push({
        label: `Week ${4 - i}`,
        orders: weekOrders.length,
        amount: weekOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0)
      });
    }
    
    return dataPoints;
  }

  /**
   * Generate yearly data by months (last 12 months)
   */
  static generateYearlyMonthData(orders, now) {
    const dataPoints = [];
    
    for (let i = 11; i >= 0; i--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthOrders = orders.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate.getFullYear() === monthDate.getFullYear() && 
               orderDate.getMonth() === monthDate.getMonth();
      });
      
      dataPoints.push({
        label: monthDate.toLocaleDateString('en-US', { month: 'short' }),
        orders: monthOrders.length,
        amount: monthOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0)
      });
    }
    
    return dataPoints;
  }

  /**
   * Generate all-time data by years
   */
  static generateAllTimeYearData(orders) {
    const dataPoints = [];
    const years = [...new Set(orders.map(order => new Date(order.createdAt).getFullYear()))].sort();
    
    years.forEach(year => {
      const yearOrders = orders.filter(order => new Date(order.createdAt).getFullYear() === year);
      dataPoints.push({
        label: year.toString(),
        orders: yearOrders.length,
        amount: yearOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0)
      });
    });
    
    return dataPoints;
  }

  /**
   * Calculate monthly growth rate
   */
  static calculateMonthlyGrowthRate(orders) {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const thisMonthOrders = orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return orderDate.getFullYear() === currentYear && orderDate.getMonth() === currentMonth;
    });
    
    const lastMonthOrders = orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      return orderDate.getFullYear() === lastMonthYear && orderDate.getMonth() === lastMonth;
    });

    const thisMonthSpent = thisMonthOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    const lastMonthSpent = lastMonthOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

    const growthRate = lastMonthSpent > 0 ? ((thisMonthSpent - lastMonthSpent) / lastMonthSpent) * 100 : 0;

    return {
      ordersGrowth: ((thisMonthOrders.length - lastMonthOrders.length) / Math.max(lastMonthOrders.length, 1)) * 100,
      spendingGrowth: growthRate,
      thisMonthOrders: thisMonthOrders.length,
      lastMonthOrders: lastMonthOrders.length,
      thisMonthSpent,
      lastMonthSpent
    };
  }

  /**
   * Calculate seasonal shopping patterns
   */
  static calculateSeasonalPatterns(orders) {
    const seasons = {
      spring: [2, 3, 4], // March, April, May
      summer: [5, 6, 7], // June, July, August
      autumn: [8, 9, 10], // September, October, November
      winter: [11, 0, 1] // December, January, February
    };

    const seasonalData = {};
    
    Object.keys(seasons).forEach(season => {
      const seasonOrders = orders.filter(order => {
        const month = new Date(order.createdAt).getMonth();
        return seasons[season].includes(month);
      });
      
      seasonalData[season] = {
        orders: seasonOrders.length,
        amount: seasonOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0),
        averageOrder: seasonOrders.length > 0 ? 
          seasonOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0) / seasonOrders.length : 0
      };
    });

    return seasonalData;
  }

  /**
   * Calculate top spending categories (if category data is available)
   */
  static calculateTopCategories(orders, limit = 5) {
    const categoryStats = {};
    
    orders.forEach(order => {
      if (order.items) {
        order.items.forEach(item => {
          const category = item.product?.category || 'Uncategorized';
          if (!categoryStats[category]) {
            categoryStats[category] = {
              orders: 0,
              items: 0,
              amount: 0
            };
          }
          categoryStats[category].orders += 1;
          categoryStats[category].items += item.quantity || 0;
          categoryStats[category].amount += (item.price || 0) * (item.quantity || 0);
        });
      }
    });

    return Object.entries(categoryStats)
      .sort(([,a], [,b]) => b.amount - a.amount)
      .slice(0, limit)
      .map(([category, stats]) => ({
        category,
        ...stats
      }));
  }

  /**
   * Utility function to format currency
   */
  static formatCurrency(amount) {
    return `LKR ${amount.toFixed(2)}`;
  }

  /**
   * Utility function to format date
   */
  static formatDate(date) {
    return date ? new Date(date).toLocaleDateString() : 'N/A';
  }

  /**
   * Utility function to calculate percentage
   */
  static calculatePercentage(part, total) {
    return total > 0 ? ((part / total) * 100).toFixed(1) : 0;
  }
}