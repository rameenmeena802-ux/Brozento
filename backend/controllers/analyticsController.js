const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

exports.getDashboardStats = async (req, res) => {
  try {
    // Total Sales (Sirf Paid ya Delivered orders ka)
    const totalSales = await Order.aggregate([
      { $match: { orderStatus: { $in: ['Delivered', 'Shipped', 'Processing'] } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    // Total Orders
    const totalOrders = await Order.countDocuments();

    // Pending Orders
    const pendingOrders = await Order.countDocuments({ orderStatus: 'Pending' });

    // Total Products
    const totalProducts = await Product.countDocuments();

    // Total Customers
    const totalCustomers = await User.countDocuments({ role: 'customer' });

    res.json({
      totalSales: totalSales.length > 0 ? totalSales[0].total : 0,
      totalOrders,
      pendingOrders,
      totalProducts,
      totalCustomers
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};