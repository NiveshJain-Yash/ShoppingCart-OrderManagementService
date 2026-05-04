const OrderService = require('../src/services/orderService');
const CartService = require('../src/services/cartService');

describe('OrderService', () => {
  beforeEach(() => {
    CartService.resetStore();
  });

  describe('createOrder (FR-07, BR-02, BR-05)', () => {
    test('should create order from non-empty cart', () => {
      const sessionId = 'test-session-' + Date.now();
      CartService.addItem(sessionId, 'prod1', 'Laptop', 50000, 1);
      const order = OrderService.createOrder(sessionId, 'user123');
      expect(order.orderId).toBeDefined();
      expect(order.items.length).toBeGreaterThan(0);
      expect(order.total).toBe(50000);
      expect(order.status).toBe('placed');
    });

    test('should throw error when cart is empty (BR-02)', () => {
      const sessionId = 'test-session-' + Date.now();
      expect(() => {
        OrderService.createOrder(sessionId, 'user123');
      }).toThrow('Cart is empty');
    });

    test('should capture product snapshot at placement time (BR-05)', () => {
      const sessionId = 'test-session-' + Date.now();
      CartService.addItem(sessionId, 'prod1', 'Laptop', 50000, 2);
      const order = OrderService.createOrder(sessionId, 'user123');
      expect(order.items[0].name).toBe('Laptop');
      expect(order.items[0].price).toBe(50000);
      expect(order.items[0].quantity).toBe(2);
    });

    test('should apply coupon discount to order', () => {
      const sessionId = 'test-session-' + Date.now();
      CartService.addItem(sessionId, 'prod1', 'Laptop', 100, 2);
      CartService.applyCoupon(sessionId, 'SAVE50');
      const order = OrderService.createOrder(sessionId, 'user123');
      expect(order.discount).toBe(50);
      expect(order.total).toBe(150); // 200 - 50
      expect(order.couponApplied).toBe('SAVE50');
    });

    test('should clear cart after order placement', () => {
      const sessionId = 'test-session-' + Date.now();
      CartService.addItem(sessionId, 'prod1', 'Laptop', 100, 2);
      OrderService.createOrder(sessionId, 'user123');
      const cart = CartService.getCart(sessionId);
      expect(cart.items.length).toBe(0);
    });
  });

  describe('getOrderById (FR-08)', () => {
    test('should return order by ID', () => {
      const sessionId = 'test-session-' + Date.now();
      CartService.addItem(sessionId, 'prod1', 'Laptop', 50000, 1);
      const createdOrder = OrderService.createOrder(sessionId, 'user123');
      const retrievedOrder = OrderService.getOrderById(createdOrder.orderId);
      expect(retrievedOrder.orderId).toBe(createdOrder.orderId);
      expect(retrievedOrder.items.length).toBeGreaterThan(0);
    });

    test('should throw error when order not found', () => {
      expect(() => {
        OrderService.getOrderById('nonexistent-order-id');
      }).toThrow('Order not found');
    });

    test('should return complete order details', () => {
      const sessionId = 'test-session-' + Date.now();
      CartService.addItem(sessionId, 'prod1', 'Laptop', 50000, 1);
      CartService.addItem(sessionId, 'prod2', 'Mouse', 500, 1);
      const createdOrder = OrderService.createOrder(sessionId, 'user123');
      const order = OrderService.getOrderById(createdOrder.orderId);
      expect(order.sessionId).toBe(sessionId);
      expect(order.userId).toBe('user123');
      expect(order.subtotal).toBe(50500);
      expect(order.total).toBe(50500);
      expect(order.createdAt).toBeDefined();
    });
  });

  describe('getAllOrders', () => {
    test('should return all orders', () => {
      const sessionId1 = 'test-session-' + Date.now() + '-1';
      const sessionId2 = 'test-session-' + Date.now() + '-2';
      
      CartService.addItem(sessionId1, 'prod1', 'Laptop', 50000, 1);
      OrderService.createOrder(sessionId1, 'user123');
      
      CartService.addItem(sessionId2, 'prod2', 'Mouse', 500, 2);
      OrderService.createOrder(sessionId2, 'user456');
      
      const allOrders = OrderService.getAllOrders();
      expect(allOrders.length).toBeGreaterThanOrEqual(2);
    });
  });
});
