import React from 'react';

export function CheckoutButton({ isCartEmpty, onCheckout, isLoading, orderId, error }) {
  if (orderId) return null; // CartPage handles the success state

  return (
    <div className="space-y-2">
      <button
        onClick={onCheckout}
        disabled={isCartEmpty || isLoading}
        className="w-full py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition text-base"
      >
        {isLoading ? 'Processing...' : 'Place Order'}
      </button>

      {error && (
        <div className="p-3 bg-red-900/40 border border-red-700 rounded-lg">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {isCartEmpty && !error && (
        <p className="text-center text-gray-500 text-xs">Add items to your cart to checkout</p>
      )}
    </div>
  );
}
