import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CartSidebar } from '../components/CartSidebar.jsx';
import { CouponInput } from '../components/CouponInput.jsx';
import { CheckoutButton } from '../components/CheckoutButton.jsx';

export function CartPage({
  cart,
  isLoading,
  error,
  couponError,
  orderId,
  onUpdateQuantity,
  onRemoveItem,
  onApplyCoupon,
  onCheckout,
  onContinueShopping,
}) {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Back link */}
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition mb-6 text-sm"
      >
        ← Continue Shopping
      </button>

      <h2 className="text-2xl font-bold text-white mb-6">Your Cart</h2>

      {orderId ? (
        /* Order success */
        <div className="max-w-lg mx-auto">
          <div className="bg-gray-800 border border-green-500 rounded-2xl p-8 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold text-green-400 mb-2">Order Placed!</h3>
            <p className="text-gray-300 mb-4">Your order has been confirmed.</p>
            <div className="bg-gray-900 rounded-lg px-4 py-3 mb-6 inline-block">
              <p className="text-xs text-gray-500 mb-1">Order ID</p>
              <p className="font-mono text-white font-bold text-sm">{orderId}</p>
            </div>
            <button
              onClick={onContinueShopping}
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-500 transition"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart items — takes 2 cols */}
          <div className="lg:col-span-2">
            <CartSidebar
              items={cart.items}
              subtotal={cart.subtotal}
              discount={cart.discount}
              total={cart.total}
              onUpdateQuantity={onUpdateQuantity}
              onRemoveItem={onRemoveItem}
              isLoading={isLoading}
            />
          </div>

          {/* Order summary — 1 col */}
          <div className="space-y-4">
            <CouponInput
              onApplyCoupon={onApplyCoupon}
              isLoading={isLoading}
              appliedCoupon={cart.couponApplied}
              error={couponError}
            />

            {/* Order summary card */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
              <h3 className="font-semibold text-white mb-4">Order Summary</h3>
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal ({cart.items.length} items)</span>
                  <span>₹{(cart.subtotal || 0).toLocaleString()}</span>
                </div>
                {cart.discount > 0 && (
                  <div className="flex justify-between text-green-400">
                    <span>Coupon discount</span>
                    <span>-₹{cart.discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-white font-bold text-base border-t border-gray-700 pt-2 mt-2">
                  <span>Total</span>
                  <span>₹{(cart.total || 0).toLocaleString()}</span>
                </div>
              </div>

              <CheckoutButton
                isCartEmpty={cart.items.length === 0}
                onCheckout={onCheckout}
                isLoading={isLoading}
                orderId={orderId}
                error={error}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
