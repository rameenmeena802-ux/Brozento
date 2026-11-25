const Order = require('../models/Order');
const sendEmail = require('../config/email'); // Email bhejne ke liye

// Naya order banayein
exports.createOrder = async (req, res) => {
  try {
    const order = new Order(req.body);
    const savedOrder = await order.save();

    // Customer ko email bhejein
    const emailHtml = `
      <h1>Order Confirmation - Brozento</h1>
      <p>Dear ${order.customerName},</p>
      <p>Thank you for your order! Your order has been placed successfully.</p>
      <p><strong>Order ID:</strong> ${order._id}</p>
      <p><strong>Total Amount:</strong> Rs ${order.totalAmount}</p>
      <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
      <p>We will contact you shortly for payment verification.</p>
      <p>Best regards,<br/>Brozento Team</p>
    `;
    
    // Agar customer ka email hai toh bhejein (Ab yeh ACTIVE hai)
    if (order.email) {
      await sendEmail(order.email, 'Order Confirmation - Brozento', emailHtml);
    }

    res.status(201).json(savedOrder);
  } catch (error) {
    console.error('Order Creation Error:', error);
    res.status(400).json({ message: error.message });
  }
};

// Saare orders dekhein (Admin ke liye)
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Customer ke apne orders (My Orders ke liye)
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ phone: req.params.phone }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Order status update (Admin ke liye) - Email notification ke saath
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { orderStatus: status }, { new: true });
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Status update email
    const emailHtml = `
      <h1>Order Status Update - Brozento</h1>
      <p>Dear ${order.customerName},</p>
      <p>Your order status has been updated to: <strong>${status}</strong></p>
      <p><strong>Order ID:</strong> ${order._id}</p>
      <p>Thank you for shopping with Brozento!</p>
    `;
    
    // Agar customer ka email hai toh bhejein (Ab yeh ACTIVE hai)
    if (order.email) {
      await sendEmail(order.email, 'Order Status Update - Brozento', emailHtml);
    }

    res.json(order);
  } catch (error) {
    console.error('Status Update Error:', error);
    res.status(400).json({ message: error.message });
  }
};