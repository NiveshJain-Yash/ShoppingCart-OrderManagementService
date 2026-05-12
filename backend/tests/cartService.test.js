const CartService = require('../src/services/cartService');

describe('CartService', () => {
  beforeEach(() => {
    CartService.resetStore();
  });

  describe('addItem (FR-01)', () => {
    test('should add item to cart', () => {
      const sessionId = 'test-session-' + Date.now();
      const cart = CartService.addItem(sessionId, 'prod1', 'Laptop', 50000, 1);
      expect(cart.items.length).toBeGreaterThan(0);
      expect(cart.items[0].productId).toBe('prod1');
      expect(cart.items[0].quantity).toBe(1);
    });

    test('should throw error when quantity exceeds 10 (BR-01)', () => {
      const sessionId = 'test-session-' + Date.now();
      expect(() => {
        CartService.addItem(sessionId, 'prod1', 'Laptop', 50000, 11);
      }).toThrow('Quantity exceeds limit of 10');
    });

    test('should update quantity when adding same product', () => {
      const sessionId = 'test-session-' + Date.now();
      CartService.addItem(sessionId, 'prod1', 'Laptop', 50000, 2);
      const cart = CartService.addItem(sessionId, 'prod1', 'Laptop', 50000, 3);
      expect(cart.items.length).toBe(1);
      expect(cart.items[0].quantity).toBe(5);
    });
  });

  describe('updateItemQuantity (FR-02)', () => {
    test('should update item quantity', () => {
      const sessionId = 'test-session-' + Date.now();
      const addedCart = CartService.addItem(sessionId, 'prod1', 'Laptop', 50000, 2);
      const itemId = addedCart.items[0].itemId;
      const updatedCart = CartService.updateItemQuantity(sessionId, itemId, 5);
      expect(updatedCart.items[0].quantity).toBe(5);
    });

    test('should throw error when quantity exceeds 10 (BR-01)', () => {
      const sessionId = 'test-session-' + Date.now();
      const addedCart = CartService.addItem(sessionId, 'prod1', 'Laptop', 50000, 2);
      const itemId = addedCart.items[0].itemId;
      expect(() => {
        CartService.updateItemQuantity(sessionId, itemId, 11);
      }).toThrow('Quantity exceeds limit of 10');
    });
  });

  describe('removeItem (FR-03)', () => {
    test('should remove item from cart', () => {
      const sessionId = 'test-session-' + Date.now();
      const addedCart = CartService.addItem(sessionId, 'prod1', 'Laptop', 50000, 2);
      const itemId = addedCart.items[0].itemId;
      const updatedCart = CartService.removeItem(sessionId, itemId);
      expect(updatedCart.items.length).toBe(0);
    });
  });

  describe('getCart (FR-04)', () => {
    test('should return cart with subtotal', () => {
      const sessionId = 'test-session-' + Date.now();
      CartService.addItem(sessionId, 'prod1', 'Laptop', 50000, 1);
      CartService.addItem(sessionId, 'prod2', 'Mouse', 500, 2);
      const cart = CartService.getCart(sessionId);
      expect(cart.subtotal).toBe(50000 + 1000);
      expect(cart.total).toBe(50000 + 1000);
    });

    test('should return empty cart structure', () => {
      const sessionId = 'test-session-' + Date.now();
      const cart = CartService.getCart(sessionId);
      expect(cart.items).toEqual([]);
      expect(cart.subtotal).toBe(0);
      expect(cart.total).toBe(0);
    });

    test('should compute subtotal correctly', () => {
      const sessionId = 'test-session-' + Date.now();
      CartService.addItem(sessionId, 'prod1', 'Laptop', 100, 2);
      CartService.addItem(sessionId, 'prod2', 'Mouse', 50, 1);
      const cart = CartService.getCart(sessionId);
      expect(cart.subtotal).toBe(250); // (100 * 2) + (50 * 1)
    });
  });

  describe('applyCoupon (FR-05, BR-03, BR-04)', () => {
    test('should apply valid coupon code SAVE50', () => {
      const sessionId = 'test-session-' + Date.now();
      CartService.addItem(sessionId, 'prod1', 'Laptop', 100, 2);
      const cart = CartService.applyCoupon(sessionId, 'SAVE50');
      expect(cart.couponApplied).toBe('SAVE50');
      expect(cart.discount).toBe(50);
      expect(cart.total).toBe(150); // 200 - 50
    });

    test('should apply valid coupon code SAVE100', () => {
      const sessionId = 'test-session-' + Date.now();
      CartService.addItem(sessionId, 'prod1', 'Laptop', 100, 2);
      const cart = CartService.applyCoupon(sessionId, 'SAVE100');
      expect(cart.couponApplied).toBe('SAVE100');
      expect(cart.discount).toBe(100);
      expect(cart.total).toBe(100); // 200 - 100
    });

    test('should throw error for invalid coupon (BR-03)', () => {
      const sessionId = 'test-session-' + Date.now();
      expect(() => {
        CartService.applyCoupon(sessionId, 'INVALID');
      }).toThrow('Invalid or unknown coupon');
    });

    test('should throw error when coupon already applied (BR-04)', () => {
      const sessionId = 'test-session-' + Date.now();
      CartService.addItem(sessionId, 'prod1', 'Laptop', 100, 1);
      CartService.applyCoupon(sessionId, 'SAVE50');
      expect(() => {
        CartService.applyCoupon(sessionId, 'SAVE100');
      }).toThrow('Coupon already applied');
    });
  });

  describe('clearCart', () => {
    test('should clear all items from cart', () => {
      const sessionId = 'test-session-' + Date.now();
      CartService.addItem(sessionId, 'prod1', 'Laptop', 100, 2);
      const clearedCart = CartService.clearCart(sessionId);
      expect(clearedCart.items.length).toBe(0);
      expect(clearedCart.couponApplied).toBeNull();
      expect(clearedCart.discount).toBe(0);
    });
  });

  describe('isCartEmpty (BR-02)', () => {
    test('should return true for empty cart', () => {
      const sessionId = 'test-session-' + Date.now();
      expect(CartService.isCartEmpty(sessionId)).toBe(true);
    });

    test('should return false for non-empty cart', () => {
      const sessionId = 'test-session-' + Date.now();
      CartService.addItem(sessionId, 'prod1', 'Laptop', 100, 1);
      expect(CartService.isCartEmpty(sessionId)).toBe(false);
    });
  });
});
