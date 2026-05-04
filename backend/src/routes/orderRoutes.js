const express = require('express');
const OrderService = require('../services/orderService');
const { createOrderSchema, validateRequest } = require('../middleware/validation');

const router = express.Router();

// POST /api/v1/orders (FR-07)
router.post('/', validateRequest(createOrderSchema), (req, res) => {
  try {
    const { sessionId, userId } = req.validatedBody;
    const order = OrderService.createOrder(sessionId, userId || 'guest');
    res.status(201).json(order);
  } catch (error) {
    if (error.message === 'Cart is empty') {
      res.status(422).json({ error: error.message });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
});

// GET /api/v1/orders/:orderId (FR-08)
router.get('/:orderId', (req, res) => {
  try {
    const { orderId } = req.params;
    const order = OrderService.getOrderById(orderId);
    res.status(200).json(order);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// GET /api/v1/orders (Get all orders)
router.get('/', (req, res) => {
  try {
    const orders = OrderService.getAllOrders();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
