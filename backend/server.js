const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Routes import karein
const productRoutes = require('./routes/productRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const authRoutes = require('./routes/authRoutes'); // Yeh naya add hua hai

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Routes use karein
app.use('/api/products', productRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/auth', authRoutes); // Yeh naya add hua hai

app.get('/', (req, res) => {
  res.json({ message: 'Brozento Backend API is running!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
const uploadRoutes = require('./routes/uploadRoutes'); // Top par import

// ... baaki routes ke saath
app.use('/api/upload', uploadRoutes); // 
//
// ... baaki imports
const orderRoutes = require('./routes/orderRoutes'); // YEH NAYA ADD KAREIN

// ... baaki app.use
app.use('/api/orders', orderRoutes); // YEH NAYA ADD KAREIN
const cityRoutes = require('./routes/cityRoutes'); // Import

// ... baaki app.use ke saath
app.use('/api/cities', cityRoutes); // Use

const categoryRoutes = require('./routes/categoryRoutes'); // Import

// ... baaki app.use ke saath
app.use('/api/categories', categoryRoutes); // Use

const pageRoutes = require('./routes/pageRoutes'); // Import

// ... baaki app.use ke saath
app.use('/api/pages', pageRoutes); // Use

const contactRoutes = require('./routes/contactRoutes'); // Import

// ... baaki app.use ke saath
app.use('/api/contact', contactRoutes); // Use

const reviewRoutes = require('./routes/reviewRoutes'); // Import

// ... baaki app.use ke saath
app.use('/api/reviews', reviewRoutes); // Use

const analyticsRoutes = require('./routes/analyticsRoutes'); // Import
// ... baaki app.use ke saath
app.use('/api/analytics', analyticsRoutes); // Use