const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const chalk = require('chalk');

// Import Routes
const adminAuthRoutes = require('./routes/authRoutes');
const salonAdminRoutes = require('./routes/salonAdminRoutes');
const customerRoutes = require('./routes/customerRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const branchRoutes = require('./routes/branchRoutes')
const bookingRoutes = require('./routes/bookingRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

// Initialize environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize app
const app = express();

// Middleware
app.use(cors({ origin: '*' })); // CORS Security
app.use(express.json()); // JSON Parsing

// Routes
app.use('/api/auth', adminAuthRoutes);
app.use('/api/salon-admin', salonAdminRoutes);
app.use('/api/customer', customerRoutes);
app.use('/api/employee', employeeRoutes);
app.use('/api/branch',branchRoutes)
app.use('/api/booking', bookingRoutes);
app.use('/api/service', serviceRoutes);
app.use('/api/product', productRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/category', categoryRoutes);

app.use((err, req, res, next) => {
  console.error(chalk.red.bold(`❌ Error: ${err.message}`));
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Port Configuration
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(
    chalk.yellow.bold(
      `\n 🚀 Server running on: ${chalk.cyan(`http://localhost:${PORT}`)}`
    )
  );
});
