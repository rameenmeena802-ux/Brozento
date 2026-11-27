
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = require('./config/db');

const productRoutes = require('./routes/productRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const authRoutes = require('./routes/authRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const orderRoutes = require('./routes/orderRoutes');
const cityRoutes = require('./routes/cityRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const pageRoutes = require('./routes/pageRoutes');
const contactRoutes = require('./routes/contactRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Database connection before handling requests
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('Database connection failed:', error.message);
    res.status(500).json({
      success: false,
      message: 'Database connection failed'
    });
  }
});

// API routes
app.use('/api/products', productRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cities', cityRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/pages', pageRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/analytics', analyticsRoutes);

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Brozento Backend API is running!'
  });
});

module.exports = app;

// Local development
if (require.main === module) {
  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`Brozento server running on port ${PORT}`);
  });
}
