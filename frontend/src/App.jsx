import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { cartApi, orderApi } from './api.js';
import { CartSidebar } from './components/CartSidebar.jsx';
import { CouponInput } from './components/CouponInput.jsx';
import { CheckoutButton } from './components/CheckoutButton.jsx';
import { ProductShowcase } from './components/ProductShowcase.jsx';

function App() {
  const [sessionId] = useState(() => {
    const stored = localStorage.getItem('sessionId');
    if (stored) return stored;
    const newId = uuidv4();
    localStorage.setItem('sessionId', newId);
    return newId;
  });

  const [cart, setCart] = useState({
    items: [],
    subtotal: 0,
    discount: 0,
    total: 0,
    couponApplied: null
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [couponError, setCouponError] = useState('');
  const [orderId, setOrderId] = useState(null);

  // Fetch cart on mount
  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await cartApi.getCart(sessionId);
      setCart(response.data);
      setError('');
    } catch (err) {
      console.error('Failed to fetch cart:', err);
    }
  };

  const handleAddToCart = async (product) => {
    setIsLoading(true);
    try {
      const response = await cartApi.addItem(sessionId, {
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1
      });
      setCart(response.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add item to cart');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 0) return;
    
    setIsLoading(true);
    try {
      if (newQuantity === 0) {
        const response = await cartApi.removeItem(sessionId, itemId);
        setCart(response.data);
      } else {
        const response = await cartApi.updateItem(sessionId, itemId, newQuantity);
        setCart(response.data);
      }
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update cart');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveItem = async (itemId) => {
    setIsLoading(true);
    try {
      const response = await cartApi.removeItem(sessionId, itemId);
      setCart(response.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to remove item');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyCoupon = async (code) => {
    setIsLoading(true);
    setCouponError('');
    try {
      const response = await cartApi.applyCoupon(sessionId, code);
      setCart(response.data);
    } catch (err) {
      setCouponError(err.response?.data?.error || 'Failed to apply coupon');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckout = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await orderApi.createOrder(sessionId, 'user-' + sessionId.substring(0, 8));
      setOrderId(response.data.orderId);
      // Clear cart after successful order
      await fetchCart();
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to create order';
      if (err.response?.status === 422) {
        setError('Your cart is empty. Please add items before checkout.');
      } else {
        setError(errorMsg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewOrder = () => {
    setOrderId(null);
    fetchCart();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            🛒 ShopHub
          </h1>
          <p className="text-gray-400 text-sm mt-1">E-Commerce Shopping Cart & Order Management</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Products Section */}
          <div className="lg:col-span-2">
            <ProductShowcase 
              onAddToCart={handleAddToCart}
              isLoading={isLoading}
            />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {orderId ? (
              <div className="space-y-4">
                <CheckoutButton 
                  isCartEmpty={cart.items.length === 0}
                  onCheckout={handleCheckout}
                  isLoading={isLoading}
                  orderId={orderId}
                  error={error}
                />
                <button
                  onClick={handleNewOrder}
                  className="w-full px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <>
                <CartSidebar
                  items={cart.items}
                  subtotal={cart.subtotal}
                  discount={cart.discount}
                  total={cart.total}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemoveItem={handleRemoveItem}
                  isLoading={isLoading}
                />

                <CouponInput 
                  onApplyCoupon={handleApplyCoupon}
                  isLoading={isLoading}
                  appliedCoupon={cart.couponApplied}
                  error={couponError}
                />

                <CheckoutButton 
                  isCartEmpty={cart.items.length === 0}
                  onCheckout={handleCheckout}
                  isLoading={isLoading}
                  orderId={orderId}
                  error={error}
                />
              </>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-700 mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-400">
          <p>© 2024 ShopHub E-Commerce Platform. All rights reserved.</p>
          <p className="text-xs mt-2">Session ID: <span className="font-mono">{sessionId.substring(0, 8)}...</span></p>
        </div>
      </footer>
    </div>
  );
}

export default App;
