const express = require('express');
const cors = require('cors');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Sample product data (for frontend reference)
const sampleProducts = [
  { productId: 'p1', name: 'Laptop', price: 50000 },
  { productId: 'p2', name: 'Mouse', price: 500 },
  { productId: 'p3', name: 'Keyboard', price: 1500 },
  { productId: 'p4', name: 'Monitor', price: 10000 },
  { productId: 'p5', name: 'Headphones', price: 2000 },
];

// API Routes
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/orders', orderRoutes);

// Get products endpoint
app.get('/api/v1/products', (req, res) => {
  res.status(200).json(sampleProducts);
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Shopping Cart API is running' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`Shopping Cart API running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

module.exports = app;
