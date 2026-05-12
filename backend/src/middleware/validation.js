const { z } = require('zod');

// Validation schemas
const addItemSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  name: z.string().min(1, 'Product name is required'),
  price: z.number().positive('Price must be positive'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1').max(10, 'Quantity cannot exceed 10'),
});

const updateQuantitySchema = z.object({
  quantity: z.number().int().min(1, 'Quantity must be at least 1').max(10, 'Quantity cannot exceed 10'),
});

const applyCouponSchema = z.object({
  code: z.string().min(1, 'Coupon code is required'),
});

const createOrderSchema = z.object({
  sessionId: z.string().min(1, 'Session ID is required'),
  userId: z.string().optional(),
});

// Generic validation middleware
const validateRequest = (schema) => {
  return (req, res, next) => {
    try {
      req.validatedBody = schema.parse(req.body);
      next();
    } catch (error) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.errors.map((e) => ({ path: e.path.join('.'), message: e.message })),
      });
    }
  };
};

module.exports = {
  addItemSchema,
  updateQuantitySchema,
  applyCouponSchema,
  createOrderSchema,
  validateRequest,
};

