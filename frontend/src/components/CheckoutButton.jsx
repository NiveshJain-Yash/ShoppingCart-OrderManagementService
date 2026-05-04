import React, { useState } from 'react';

export function CheckoutButton({ 
  isCartEmpty, 
  onCheckout, 
  isLoading,
  orderId,
  error 
}) {
  const [showSuccess, setShowSuccess] = useState(false);

  const handleCheckout = async () => {
    setShowSuccess(false);
    await onCheckout();
  };

  if (orderId) {
    return (
      <div className="w-full p-6 bg-green-50 rounded-lg border-2 border-green-200">
        <div className="text-center">
          <div className="text-4xl mb-2">✓</div>
          <h3 className="text-xl font-bold text-green-800 mb-2">Order Placed Successfully!</h3>
          <p className="text-gray-700 mb-3">Order ID: <span className="font-mono font-bold bg-green-100 px-3 py-1 rounded">{orderId}</span></p>
          <p className="text-sm text-gray-600">Thank you for your purchase. Your order has been confirmed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <button
        onClick={handleCheckout}
        disabled={isCartEmpty || isLoading}
        className="w-full px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition text-lg"
      >
        {isLoading ? 'Processing...' : `Checkout`}
      </button>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
          <p className="font-semibold mb-1">Error:</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {isCartEmpty && !error && (
        <div className="p-4 bg-yellow-50 text-yellow-700 rounded-lg border border-yellow-200 text-center">
          <p className="text-sm">Add items to your cart to proceed with checkout</p>
        </div>
      )}
    </div>
  );
}
