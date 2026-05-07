import React from 'react';

export function CartSidebar({ items, subtotal, discount, total, onUpdateQuantity, onRemoveItem, isLoading }) {
  if (items.length === 0) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-12 text-center">
        <div className="text-5xl mb-4">🛒</div>
        <p className="text-gray-400 text-lg font-medium">Your cart is empty</p>
        <p className="text-gray-600 text-sm mt-1">Add some products to get started</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-700">
        <h2 className="text-lg font-semibold text-white">Cart Items ({items.length})</h2>
      </div>

      <div className="divide-y divide-gray-700">
        {items.map((item) => (
          <div key={item.itemId} className="flex items-center gap-4 px-6 py-4">
            <div className="flex-1 min-w-0">
              <p className="font-medium text-white truncate">{item.name}</p>
              <p className="text-sm text-gray-400">₹{item.price.toLocaleString()} each</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onUpdateQuantity(item.itemId, item.quantity - 1)}
                disabled={isLoading}
                className="w-8 h-8 flex items-center justify-center bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 transition font-bold"
              >
                −
              </button>
              <span className="w-8 text-center text-white font-semibold">{item.quantity}</span>
              <button
                onClick={() => onUpdateQuantity(item.itemId, item.quantity + 1)}
                disabled={item.quantity >= 10 || isLoading}
                className="w-8 h-8 flex items-center justify-center bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 transition font-bold"
              >
                +
              </button>
            </div>

            <p className="text-white font-semibold w-24 text-right">
              ₹{(item.price * item.quantity).toLocaleString()}
            </p>

            <button
              onClick={() => onRemoveItem(item.itemId)}
              disabled={isLoading}
              className="text-gray-500 hover:text-red-400 disabled:opacity-50 transition ml-2"
              title="Remove item"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="px-6 py-4 bg-gray-900/50 border-t border-gray-700 space-y-2">
        <div className="flex justify-between text-gray-400 text-sm">
          <span>Subtotal</span>
          <span>₹{subtotal.toLocaleString()}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-green-400 text-sm">
            <span>Discount</span>
            <span>-₹{discount.toLocaleString()}</span>
          </div>
        )}
        <div className="flex justify-between text-white font-bold text-base pt-2 border-t border-gray-700">
          <span>Total</span>
          <span>₹{total.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
