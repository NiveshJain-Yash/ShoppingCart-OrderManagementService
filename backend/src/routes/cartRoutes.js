const express = require('express');
const CartService = require('../services/cartService');
const { addItemSchema, updateQuantitySchema, applyCouponSchema, validateRequest } = require('../middleware/validation');

const router = express.Router();

// GET /api/v1/cart/:sessionId (FR-04)
router.get('/:sessionId', (req, res) => {
  try {
    const { sessionId } = req.params;
    const cart = CartService.getCart(sessionId);
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/v1/cart/:sessionId/items (FR-01)
router.post('/:sessionId/items', validateRequest(addItemSchema), (req, res) => {
  try {
    const { sessionId } = req.params;
    const { productId, name, price, quantity } = req.validatedBody;
    CartService.addItem(sessionId, productId, name, price, quantity);
    res.status(201).json(CartService.getCart(sessionId));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT /api/v1/cart/:sessionId/items/:itemId (FR-02)
router.put('/:sessionId/items/:itemId', validateRequest(updateQuantitySchema), (req, res) => {
  try {
    const { sessionId, itemId } = req.params;
    const { quantity } = req.validatedBody;
    CartService.updateItemQuantity(sessionId, itemId, quantity);
    res.status(200).json(CartService.getCart(sessionId));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/v1/cart/:sessionId/items/:itemId (FR-03)
router.delete('/:sessionId/items/:itemId', (req, res) => {
  try {
    const { sessionId, itemId } = req.params;
    CartService.removeItem(sessionId, itemId);
    res.status(200).json(CartService.getCart(sessionId));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// POST /api/v1/cart/:sessionId/coupon (FR-05)
router.post('/:sessionId/coupon', validateRequest(applyCouponSchema), (req, res) => {
  try {
    const { sessionId } = req.params;
    const { code } = req.validatedBody;
    const updatedCart = CartService.applyCoupon(sessionId, code);
    res.status(200).json(updatedCart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/v1/cart/:sessionId (Clear cart)
router.delete('/:sessionId', (req, res) => {
  try {
    const { sessionId } = req.params;
    CartService.clearCart(sessionId);
    res.status(200).json(CartService.getCart(sessionId));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
