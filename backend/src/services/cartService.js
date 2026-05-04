const { v4: uuidv4 } = require('uuid');

// In-memory store for carts
const carts = new Map();

// Fixed coupon database (in-memory)
const validCoupons = {
  SAVE50: { discount: 50, description: 'Rs.50 off' },
  SAVE100: { discount: 100, description: 'Rs.100 off' },
  SAVE25: { discount: 25, description: 'Rs.25 off' },
};

// Business Rules Constants
const MAX_QUANTITY_PER_ITEM = 10;

class CartService {
  // Initialize or get cart by sessionId
  static getOrCreateCart(sessionId) {
    if (!carts.has(sessionId)) {
      carts.set(sessionId, {
        sessionId,
        items: [],
        couponApplied: null,
        createdAt: new Date(),
      });
    }
    return carts.get(sessionId);
  }

  // Add item to cart (FR-01)
  static addItem(sessionId, productId, name, price, quantity) {
    if (quantity > MAX_QUANTITY_PER_ITEM) {
      throw new Error(`Quantity exceeds limit of ${MAX_QUANTITY_PER_ITEM}`);
    }

    const cart = this.getOrCreateCart(sessionId);
    const existingItem = cart.items.find((item) => item.productId === productId);

    if (existingItem) {
      existingItem.quantity += quantity;
      if (existingItem.quantity > MAX_QUANTITY_PER_ITEM) {
        throw new Error(`Quantity exceeds limit of ${MAX_QUANTITY_PER_ITEM}`);
      }
    } else {
      const itemId = `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      cart.items.push({
        itemId,
        productId,
        name,
        price,
        quantity,
      });
    }

    return this.getCart(sessionId);
  }

  // Update item quantity (FR-02)
  static updateItemQuantity(sessionId, itemId, quantity) {
    if (quantity > MAX_QUANTITY_PER_ITEM) {
      throw new Error(`Quantity exceeds limit of ${MAX_QUANTITY_PER_ITEM}`);
    }

    const cart = this.getOrCreateCart(sessionId);
    const item = cart.items.find((i) => i.itemId === itemId);

    if (!item) {
      throw new Error('Item not found');
    }

    if (quantity <= 0) {
      return this.removeItem(sessionId, itemId);
    }

    item.quantity = quantity;
    return this.getCart(sessionId);
  }

  // Remove item from cart (FR-03)
  static removeItem(sessionId, itemId) {
    const cart = this.getOrCreateCart(sessionId);
    const itemIndex = cart.items.findIndex((i) => i.itemId === itemId);

    if (itemIndex === -1) {
      throw new Error('Item not found');
    }

    cart.items.splice(itemIndex, 1);
    return this.getCart(sessionId);
  }

  // Get cart with computed subtotal (FR-04)
  static getCart(sessionId) {
    const cart = this.getOrCreateCart(sessionId);
    const subtotal = this.computeSubtotal(cart.items);
    const discount = cart.couponApplied ? validCoupons[cart.couponApplied].discount : 0;
    const total = Math.max(0, subtotal - discount);

    return {
      sessionId: cart.sessionId,
      items: cart.items,
      subtotal,
      discount,
      couponApplied: cart.couponApplied,
      total,
    };
  }

  // Compute subtotal from items
  static computeSubtotal(items) {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  // Apply coupon code (FR-05, BR-03, BR-04)
  static applyCoupon(sessionId, code) {
    const cart = this.getOrCreateCart(sessionId);

    // BR-03: Validate coupon exists
    if (!validCoupons[code]) {
      throw new Error('Invalid or unknown coupon');
    }

    // BR-04: Coupon can only be applied once per cart session
    if (cart.couponApplied) {
      throw new Error('Coupon already applied');
    }

    cart.couponApplied = code;
    return this.getCart(sessionId);
  }

  // Clear cart
  static clearCart(sessionId) {
    const cart = this.getOrCreateCart(sessionId);
    cart.items = [];
    cart.couponApplied = null;
    return this.getCart(sessionId);
  }

  // Get cart items (internal use)
  static getCartItems(sessionId) {
    const cart = this.getOrCreateCart(sessionId);
    return cart.items;
  }

  // Reset store (for testing)
  static resetStore() {
    carts.clear();
  }

  // Check if cart is empty (BR-02)
  static isCartEmpty(sessionId) {
    const cart = this.getOrCreateCart(sessionId);
    return cart.items.length === 0;
  }
}

module.exports = CartService;
