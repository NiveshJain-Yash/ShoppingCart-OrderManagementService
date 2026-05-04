const { v4: uuidv4 } = require('uuid');
const CartService = require('./cartService');

// In-memory store for orders
const orders = [];

class OrderService {
  // Create order from cart (FR-07, BR-02, BR-05)
  static createOrder(sessionId, userId) {
    // BR-02: Validate cart is non-empty
    if (CartService.isCartEmpty(sessionId)) {
      throw new Error('Cart is empty');
    }

    const cart = CartService.getCart(sessionId);
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // BR-05: Store product name and price at placement time (snapshot)
    const order = {
      orderId,
      sessionId,
      userId,
      items: cart.items.map((item) => ({
        itemId: item.itemId,
        productId: item.productId,
        name: item.name,
        price: item.price, // Snapshot at time of order
        quantity: item.quantity,
      })),
      subtotal: cart.subtotal,
      discount: cart.discount,
      couponApplied: cart.couponApplied,
      total: cart.total,
      createdAt: new Date().toISOString(),
      status: 'placed',
    };

    orders.push(order);

    // Clear cart after order placement
    CartService.clearCart(sessionId);

    return order;
  }

  // Get order by ID (FR-08)
  static getOrderById(orderId) {
    const order = orders.find((o) => o.orderId === orderId);

    if (!order) {
      throw new Error('Order not found');
    }

    return order;
  }

  // Get all orders (internal use)
  static getAllOrders() {
    return orders;
  }

  // Get orders by sessionId (for potential history feature)
  static getOrdersBySessionId(sessionId) {
    return orders.filter((o) => o.sessionId === sessionId);
  }
}

module.exports = OrderService;
