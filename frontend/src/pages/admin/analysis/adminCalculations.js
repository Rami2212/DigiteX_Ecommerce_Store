// utils/adminCalculations.js

export const calculateProductAnalytics = (products) => {
  if (!products || products.length === 0) {
    return {
      totalProducts: 0,
      totalStock: 0,
      lowStockProducts: 0,
      outOfStockProducts: 0,
      averagePrice: 0,
      totalValue: 0,
      categoryDistribution: [],
      stockStatus: {
        inStock: 0,
        lowStock: 0,
        outOfStock: 0
      },
      priceRanges: {
        budget: 0,      // < 1000
        mid: 0,         // 1000-5000
        premium: 0,     // 5000-15000
        luxury: 0       // > 15000
      },
      topCategories: [],
      topProducts: []
    };
  }

  const totalProducts = products.length;
  let totalStock = 0;
  let lowStockProducts = 0;
  let outOfStockProducts = 0;
  let totalPrice = 0;
  let totalValue = 0;
  
  const categoryMap = new Map();
  const priceRanges = { budget: 0, mid: 0, premium: 0, luxury: 0 };
  const stockStatus = { inStock: 0, lowStock: 0, outOfStock: 0 };

  products.forEach(product => {
    const stock = product.stock || 0;
    const price = product.salePrice || product.price || 0;
    
    // Stock calculations
    totalStock += stock;
    totalValue += (stock * price);
    
    if (stock === 0) {
      outOfStockProducts++;
      stockStatus.outOfStock++;
    } else if (stock <= 5) {
      lowStockProducts++;
      stockStatus.lowStock++;
    } else {
      stockStatus.inStock++;
    }
    
    // Price calculations
    totalPrice += price;
    
    // Price range distribution
    if (price < 1000) priceRanges.budget++;
    else if (price <= 5000) priceRanges.mid++;
    else if (price <= 15000) priceRanges.premium++;
    else priceRanges.luxury++;
    
    // Category distribution
    const categoryName = product.category?.name || 'Uncategorized';
    if (categoryMap.has(categoryName)) {
      const existing = categoryMap.get(categoryName);
      categoryMap.set(categoryName, {
        count: existing.count + 1,
        totalStock: existing.totalStock + stock,
        totalValue: existing.totalValue + (stock * price)
      });
    } else {
      categoryMap.set(categoryName, {
        count: 1,
        totalStock: stock,
        totalValue: stock * price
      });
    }
  });

  // Convert category map to array and sort
  const categoryDistribution = Array.from(categoryMap.entries())
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.count - a.count);

  const topCategories = categoryDistribution.slice(0, 5);

  // Top products by value (stock * price)
  const topProducts = products
    .map(product => ({
      id: product._id,
      name: product.name,
      stock: product.stock || 0,
      price: product.salePrice || product.price || 0,
      value: (product.stock || 0) * (product.salePrice || product.price || 0),
      views: product.views || 0
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  return {
    totalProducts,
    totalStock,
    lowStockProducts,
    outOfStockProducts,
    averagePrice: totalPrice / totalProducts,
    totalValue,
    categoryDistribution,
    stockStatus,
    priceRanges,
    topCategories,
    topProducts,
    stockAlerts: {
      critical: outOfStockProducts,
      warning: lowStockProducts,
      healthy: stockStatus.inStock
    }
  };
};

export const calculateOrderAnalytics = (orders) => {
  if (!orders || orders.length === 0) {
    return {
      totalOrders: 0,
      totalRevenue: 0,
      averageOrderValue: 0,
      ordersByStatus: {},
      ordersByPaymentMethod: {},
      revenueByMonth: [],
      ordersByMonth: [],
      topSellingProducts: [],
      conversionMetrics: {
        completionRate: 0,
        cancelRate: 0,
        pendingRate: 0
      },
      paymentAnalysis: {
        cod: { count: 0, revenue: 0 },
        stripe: { count: 0, revenue: 0 }
      }
    };
  }

  const totalOrders = orders.length;
  let totalRevenue = 0;
  const statusMap = new Map();
  const paymentMethodMap = new Map();
  const monthlyData = new Map();
  const productSales = new Map();

  orders.forEach(order => {
    const amount = order.totalAmount || 0;
    const status = order.status || 'Unknown';
    const paymentMethod = order.paymentMethod || 'Unknown';
    const month = new Date(order.createdAt).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short' 
    });

    // Revenue calculation (only for completed orders)
    if (status === 'Delivered' || status === 'Processing' || status === 'Shipped') {
      totalRevenue += amount;
    }

    // Status distribution
    statusMap.set(status, (statusMap.get(status) || 0) + 1);

    // Payment method distribution
    paymentMethodMap.set(paymentMethod, (paymentMethodMap.get(paymentMethod) || 0) + 1);

    // Monthly data
    if (monthlyData.has(month)) {
      const existing = monthlyData.get(month);
      monthlyData.set(month, {
        orders: existing.orders + 1,
        revenue: existing.revenue + (status === 'Delivered' ? amount : 0)
      });
    } else {
      monthlyData.set(month, {
        orders: 1,
        revenue: status === 'Delivered' ? amount : 0
      });
    }

    // Product sales analysis
    if (order.items && Array.isArray(order.items)) {
      order.items.forEach(item => {
        const productName = item.name || 'Unknown Product';
        const quantity = item.quantity || 0;
        const price = item.price || 0;
        
        if (productSales.has(productName)) {
          const existing = productSales.get(productName);
          productSales.set(productName, {
            quantity: existing.quantity + quantity,
            revenue: existing.revenue + (quantity * price),
            orders: existing.orders + 1
          });
        } else {
          productSales.set(productName, {
            quantity: quantity,
            revenue: quantity * price,
            orders: 1
          });
        }
      });
    }
  });

  // Convert maps to objects/arrays
  const ordersByStatus = Object.fromEntries(statusMap);
  const ordersByPaymentMethod = Object.fromEntries(paymentMethodMap);

  // Sort monthly data by date
  const monthlyArray = Array.from(monthlyData.entries())
    .map(([month, data]) => ({ month, ...data }))
    .sort((a, b) => new Date(a.month) - new Date(b.month));

  const revenueByMonth = monthlyArray.map(item => ({
    month: item.month,
    revenue: item.revenue
  }));

  const ordersByMonth = monthlyArray.map(item => ({
    month: item.month,
    orders: item.orders
  }));

  // Top selling products
  const topSellingProducts = Array.from(productSales.entries())
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10);

  // Conversion metrics
  const completedOrders = statusMap.get('Delivered') || 0;
  const cancelledOrders = (statusMap.get('Cancelled') || 0) + (statusMap.get('Failed') || 0);
  const pendingOrders = (statusMap.get('Pending') || 0) + (statusMap.get('Processing') || 0);

  const conversionMetrics = {
    completionRate: totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0,
    cancelRate: totalOrders > 0 ? (cancelledOrders / totalOrders) * 100 : 0,
    pendingRate: totalOrders > 0 ? (pendingOrders / totalOrders) * 100 : 0
  };

  // Payment analysis
  const paymentAnalysis = {
    cod: { count: 0, revenue: 0 },
    stripe: { count: 0, revenue: 0 }
  };

  orders.forEach(order => {
    const method = order.paymentMethod?.toLowerCase();
    const amount = order.totalAmount || 0;
    const isCompleted = order.status === 'Delivered';

    if (method === 'cod') {
      paymentAnalysis.cod.count++;
      if (isCompleted) paymentAnalysis.cod.revenue += amount;
    } else if (method === 'stripe') {
      paymentAnalysis.stripe.count++;
      if (isCompleted) paymentAnalysis.stripe.revenue += amount;
    }
  });

  return {
    totalOrders,
    totalRevenue,
    averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
    ordersByStatus,
    ordersByPaymentMethod,
    revenueByMonth,
    ordersByMonth,
    topSellingProducts,
    conversionMetrics,
    paymentAnalysis
  };
};

export const calculatePerformanceMetrics = (products, orders) => {
  const productAnalytics = calculateProductAnalytics(products);
  const orderAnalytics = calculateOrderAnalytics(orders);

  // Calculate additional performance metrics
  const totalViews = products.reduce((sum, product) => sum + (product.views || 0), 0);
  const viewsToOrdersRatio = totalViews > 0 ? (orderAnalytics.totalOrders / totalViews) * 100 : 0;

  // Stock turnover rate (simplified)
  const stockTurnover = productAnalytics.totalStock > 0 ? 
    (orderAnalytics.totalOrders / productAnalytics.totalStock) * 100 : 0;

  // Revenue per product
  const revenuePerProduct = productAnalytics.totalProducts > 0 ? 
    orderAnalytics.totalRevenue / productAnalytics.totalProducts : 0;

  // Growth metrics (would need historical data for accurate calculation)
  const currentMonth = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short' 
  });
  
  const thisMonthData = orderAnalytics.revenueByMonth.find(item => item.month === currentMonth);
  const thisMonthRevenue = thisMonthData?.revenue || 0;
  const thisMonthOrders = orderAnalytics.ordersByMonth.find(item => item.month === currentMonth)?.orders || 0;

  return {
    kpis: {
      totalRevenue: orderAnalytics.totalRevenue,
      totalOrders: orderAnalytics.totalOrders,
      totalProducts: productAnalytics.totalProducts,
      averageOrderValue: orderAnalytics.averageOrderValue,
      stockValue: productAnalytics.totalValue,
      completionRate: orderAnalytics.conversionMetrics.completionRate
    },
    performance: {
      viewsToOrdersRatio,
      stockTurnover,
      revenuePerProduct,
      thisMonthRevenue,
      thisMonthOrders
    },
    alerts: {
      lowStock: productAnalytics.lowStockProducts,
      outOfStock: productAnalytics.outOfStockProducts,
      pendingOrders: orderAnalytics.ordersByStatus.Pending || 0,
      failedOrders: orderAnalytics.ordersByStatus.Failed || 0
    }
  };
};

export const generateRecommendations = (products, orders) => {
  const productAnalytics = calculateProductAnalytics(products);
  const orderAnalytics = calculateOrderAnalytics(orders);
  const recommendations = [];

  // Stock recommendations
  if (productAnalytics.outOfStockProducts > 0) {
    recommendations.push({
      type: 'critical',
      category: 'inventory',
      title: 'Out of Stock Alert',
      message: `${productAnalytics.outOfStockProducts} products are out of stock. Restock immediately to avoid lost sales.`,
      action: 'View out of stock products'
    });
  }

  if (productAnalytics.lowStockProducts > 5) {
    recommendations.push({
      type: 'warning',
      category: 'inventory',
      title: 'Low Stock Warning',
      message: `${productAnalytics.lowStockProducts} products have low stock (≤5 units). Consider restocking soon.`,
      action: 'View low stock products'
    });
  }

  // Order recommendations
  const pendingOrders = orderAnalytics.ordersByStatus.Pending || 0;
  if (pendingOrders > 10) {
    recommendations.push({
      type: 'warning',
      category: 'orders',
      title: 'Pending Orders',
      message: `${pendingOrders} orders are pending. Process them to improve customer satisfaction.`,
      action: 'View pending orders'
    });
  }

  // Revenue recommendations
  if (orderAnalytics.conversionMetrics.cancelRate > 15) {
    recommendations.push({
      type: 'warning',
      category: 'performance',
      title: 'High Cancel Rate',
      message: `Order cancellation rate is ${orderAnalytics.conversionMetrics.cancelRate.toFixed(1)}%. Review order process and product descriptions.`,
      action: 'Analyze cancelled orders'
    });
  }

  // Product performance recommendations
  const lowPerformingProducts = products.filter(p => (p.views || 0) < 10 && (p.stock || 0) > 20);
  if (lowPerformingProducts.length > 0) {
    recommendations.push({
      type: 'info',
      category: 'marketing',
      title: 'Low Visibility Products',
      message: `${lowPerformingProducts.length} products have low views but high stock. Consider promoting them.`,
      action: 'View low performing products'
    });
  }

  return recommendations.slice(0, 3); // Limit to 6 recommendations
};