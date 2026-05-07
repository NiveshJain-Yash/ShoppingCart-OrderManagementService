import React, { useState } from 'react';

export function CouponInput({ onApplyCoupon, isLoading, appliedCoupon, error }) {
  const [code, setCode] = useState('');

  const handleApply = async (e) => {
    e.preventDefault();
    if (!code.trim()) return;
    const appliedCode = code;
    setCode('');
    await onApplyCoupon(appliedCode);
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
      <h3 className="font-semibold text-white mb-3">Apply Coupon</h3>

      {appliedCoupon ? (
        <div className="flex items-center gap-2 p-3 bg-green-900/40 border border-green-700 rounded-lg">
          <span className="text-green-400 text-lg">✓</span>
          <div>
            <p className="text-green-300 text-sm font-semibold">Coupon applied!</p>
            <p className="text-green-500 text-xs font-mono">{appliedCoupon}</p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleApply} className="space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="Enter coupon code"
              disabled={isLoading}
              className="flex-1 px-3 py-2 bg-gray-900 border border-gray-600 text-white placeholder-gray-500 rounded-lg text-sm focus:outline-none focus:border-blue-500 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isLoading || !code.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 disabled:opacity-50 transition text-sm font-medium"
            >
              Apply
            </button>
          </div>
          {error && (
            <p className="text-red-400 text-xs flex items-center gap-1">
              <span>✕</span> {error}
            </p>
          )}
          <p className="text-gray-600 text-xs">
            Available: <span className="font-mono text-gray-500">SAVE50 · SAVE100 · SAVE200</span>
          </p>
        </form>
      )}
    </div>
  );
}
