import React, { useState } from 'react';

const SAMPLE_PRODUCTS = [
  { id: 'p1', name: 'Laptop Pro', price: 89999 },
  { id: 'p2', name: 'Wireless Mouse', price: 1299 },
  { id: 'p3', name: 'USB-C Cable', price: 499 },
  { id: 'p4', name: 'Monitor 4K', price: 28999 },
  { id: 'p5', name: 'Mechanical Keyboard', price: 8999 },
  { id: 'p6', name: 'Webcam HD', price: 4999 }
];

export function ProductShowcase({ onAddToCart, isLoading }) {
  const [addedItems, setAddedItems] = useState({});

  const handleAddToCart = (product) => {
    onAddToCart(product);
    setAddedItems(prev => ({
      ...prev,
      [product.id]: true
    }));
    setTimeout(() => {
      setAddedItems(prev => ({
        ...prev,
        [product.id]: false
      }));
    }, 2000);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Featured Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {SAMPLE_PRODUCTS.map((product) => (
          <div 
            key={product.id} 
            className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition"
          >
            <div className="bg-gradient-to-br from-blue-100 to-blue-50 h-32 flex items-center justify-center">
              <span className="text-3xl">📦</span>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
              <p className="text-2xl font-bold text-green-600 mb-3">₹{product.price.toLocaleString()}</p>
              <button
                onClick={() => handleAddToCart(product)}
                disabled={isLoading}
                className={`w-full py-2 px-4 rounded-lg font-medium transition ${
                  addedItems[product.id]
                    ? 'bg-green-500 text-white'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
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
