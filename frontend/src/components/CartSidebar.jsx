import React, { useState } from 'react';

export function CartSidebar({ 
  items, 
  subtotal, 
  discount, 
  total, 
  onUpdateQuantity, 
  onRemoveItem, 
  isLoading 
}) {
  return (
    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
      <h2 className="text-2xl font-bold mb-4 text-gray-900">Shopping Cart</h2>
      
      {items.length === 0 ? (
        <p className="text-gray-500 text-center py-8">Your cart is empty</p>
      ) : (
        <div className="space-y-4 mb-6">
          {items.map((item) => (
            <div key={item.itemId} className="flex items-center justify-between bg-white p-4 rounded-lg border border-gray-100">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{item.name}</h3>
                <p className="text-sm text-gray-600">₹{item.price.toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onUpdateQuantity(item.itemId, item.quantity - 1)}
                  disabled={isLoading}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 transition"
                >
                  −
                </button>
                <span className="w-8 text-center font-semibold">{item.quantity}</span>
                <button
                  onClick={() => onUpdateQuantity(item.itemId, item.quantity + 1)}
                  disabled={item.quantity >= 10 || isLoading}
                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 transition"
                >
                  +
                </button>
                <button
                  onClick={() => onRemoveItem(item.itemId)}
                  disabled={isLoading}
                  className="px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 disabled:opacity-50 transition ml-2"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="border-t border-gray-200 pt-4 space-y-2">
        <div className="flex justify-between text-gray-700">
          <span>Subtotal:</span>
          <span className="font-semibold">₹{subtotal.toLocaleString()}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount:</span>
            <span className="font-semibold">-₹{discount.toLocaleString()}</span>
          </div>
        )}
        <div className="flex justify-between text-lg font-bold text-gray-900 pt-2">
          <span>Total:</span>
          <span>₹{total.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
