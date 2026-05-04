import React, { useState } from 'react';

export function CouponInput({ onApplyCoupon, isLoading, appliedCoupon, error }) {
  const [code, setCode] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleApply = async (e) => {
    e.preventDefault();
    if (!code.trim()) return;
    
    const appliedCode = code;
    setSuccessMessage('');
    await onApplyCoupon(appliedCode);
    setCode('');
    if (!error) {
      setSuccessMessage(`Coupon "${appliedCode}" applied successfully!`);
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">Apply Coupon</h3>
      
      <form onSubmit={handleApply} className="space-y-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="Enter coupon code"
            disabled={isLoading || appliedCoupon}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          />
          <button
            type="submit"
            disabled={isLoading || appliedCoupon || !code.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
          >
            Apply
          </button>
        </div>

        {successMessage && (
          <div className="p-3 bg-green-50 text-green-700 rounded-lg text-sm">
            ✓ {successMessage}
          </div>
        )}

        {appliedCoupon && (
          <div className="p-3 bg-blue-50 text-blue-700 rounded-lg text-sm">
            ✓ Coupon "{appliedCoupon}" is applied
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
            ✕ {error}
          </div>
        )}

        <div className="text-xs text-gray-600 pt-2">
          <p className="font-semibold mb-1">Available codes:</p>
          <p>• SAVE50 (₹50 off) • SAVE100 (₹100 off) • SAVE25 (₹25 off)</p>
        </div>
      </form>
    </div>
  );
}
