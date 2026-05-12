import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PRODUCTS = [
  { id: 'p1', name: 'Laptop Pro', price: 89999, emoji: '💻', category: 'Computers' },
  { id: 'p2', name: 'Wireless Mouse', price: 1299, emoji: '🖱️', category: 'Accessories' },
  { id: 'p3', name: 'USB-C Cable', price: 499, emoji: '🔌', category: 'Accessories' },
  { id: 'p4', name: 'Monitor 4K', price: 28999, emoji: '🖥️', category: 'Displays' },
  { id: 'p5', name: 'Mechanical Keyboard', price: 8999, emoji: '⌨️', category: 'Accessories' },
  { id: 'p6', name: 'Webcam HD', price: 4999, emoji: '📷', category: 'Accessories' },
];

export function HomePage({ onAddToCart, isLoading }) {
  const [addedItems, setAddedItems] = useState({});
  const navigate = useNavigate();

  const handleAdd = async (product) => {
    await onAddToCart(product);
    setAddedItems(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => setAddedItems(prev => ({ ...prev, [product.id]: false })), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 mb-10 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Summer Tech Sale 🎉</h2>
          <p className="text-blue-100 mb-4">
            Use coupons{' '}
            <span className="font-mono bg-blue-500 px-2 py-0.5 rounded text-sm">SAVE50</span>{' '}
            <span className="font-mono bg-blue-500 px-2 py-0.5 rounded text-sm">SAVE100</span>{' '}
            <span className="font-mono bg-blue-500 px-2 py-0.5 rounded text-sm">SAVE200</span>
          </p>
          <button
            onClick={() => navigate('/cart')}
            className="px-5 py-2 bg-white text-blue-700 font-semibold rounded-lg hover:bg-blue-50 transition text-sm"
          >
            View Cart →
          </button>
        </div>
        <span className="text-7xl hidden md:block">🛍️</span>
      </div>

      {/* Grid */}
      <h2 className="text-2xl font-bold text-white mb-6">Featured Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {PRODUCTS.map((product) => (
          <div
            key={product.id}
            className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden hover:border-blue-500 hover:shadow-lg hover:shadow-blue-900/20 transition group"
          >
            <div className="bg-gradient-to-br from-gray-700 to-gray-800 h-40 flex items-center justify-center">
              <span className="text-6xl group-hover:scale-110 transition-transform">{product.emoji}</span>
            </div>
            <div className="p-5">
              <span className="text-xs text-blue-400 font-medium uppercase tracking-wide">{product.category}</span>
              <h3 className="font-semibold text-white text-lg mt-1 mb-1">{product.name}</h3>
              <p className="text-2xl font-bold text-green-400 mb-4">₹{product.price.toLocaleString()}</p>
              <button
                onClick={() => handleAdd(product)}
                disabled={isLoading}
                className={`w-full py-2.5 px-4 rounded-lg font-semibold text-sm transition ${
                  addedItems[product.id]
                    ? 'bg-green-500 text-white'
                    : 'bg-blue-600 text-white hover:bg-blue-500'
                } disabled:opacity-50`}
              >
                {addedItems[product.id] ? '✓ Added to Cart' : 'Add to Cart'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
