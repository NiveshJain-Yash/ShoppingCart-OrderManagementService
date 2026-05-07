import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { cartApi, orderApi } from './api.js';
import { Header } from './components/Header.jsx';
import { HomePage } from './pages/HomePage.jsx';
import { CartPage } from './pages/CartPage.jsx';

function App() {
  const [sessionId] = useState(() => {
    const stored = localStorage.getItem('sessionId');
    if (stored) return stored;
    const newId = uuidv4();
    localStorage.setItem('sessionId', newId);
    return newId;
  });

  const [cart, setCart] = useState({ items: [], subtotal: 0, discount: 0, total: 0, couponApplied: null });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [couponError, setCouponError] = useState('');
  const [orderId, setOrderId] = useState(null);

  useEffect(() => { fetchCart(); }, []);

  const fetchCart = async () => {
    try {
      const res = await cartApi.getCart(sessionId);
      setCart(res.data);
    } catch (err) {
      console.error('Failed to fetch cart:', err);
    }
  };

  const handleAddToCart = async (product) => {
    setIsLoading(true);
    try {
      const res = await cartApi.addItem(sessionId, {
        productId: product.id, name: product.name, price: product.price, quantity: 1,
      });
      setCart(res.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add item');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateQuantity = async (itemId, newQty) => {
    if (newQty < 0) return;
    setIsLoading(true);
    try {
      const res = newQty === 0
        ? await cartApi.removeItem(sessionId, itemId)
        : await cartApi.updateItem(sessionId, itemId, newQty);
      setCart(res.data);
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
      const res = await cartApi.removeItem(sessionId, itemId);
      setCart(res.data);
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
      const res = await cartApi.applyCoupon(sessionId, code);
      setCart(res.data);
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
      const res = await orderApi.createOrder(sessionId, 'user-' + sessionId.substring(0, 8));
      setOrderId(res.data.orderId);
      await fetchCart();
    } catch (err) {
      setError(
        err.response?.status === 422
          ? 'Your cart is empty. Please add items before checkout.'
          : err.response?.data?.error || 'Failed to create order'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinueShopping = () => {
    setOrderId(null);
    setError('');
    fetchCart();
  };

  const cartCount = cart.items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <Header cartCount={cartCount} />

        <main>
          <Routes>
            <Route
              path="/"
              element={<HomePage onAddToCart={handleAddToCart} isLoading={isLoading} />}
            />
            <Route
              path="/cart"
              element={
                <CartPage
                  cart={cart}
                  isLoading={isLoading}
                  error={error}
                  couponError={couponError}
                  orderId={orderId}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemoveItem={handleRemoveItem}
                  onApplyCoupon={handleApplyCoupon}
                  onCheckout={handleCheckout}
                  onContinueShopping={handleContinueShopping}
                />
              }
            />
          </Routes>
        </main>

        <footer className="bg-gray-900 border-t border-gray-700 mt-12 py-6">
          <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
            <p>© 2024 NiveshHub E-Commerce Platform · POC Demo</p>
            <p className="text-xs mt-1 font-mono">Session: {sessionId.substring(0, 8)}...</p>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
