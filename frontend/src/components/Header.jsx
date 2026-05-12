import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export function Header({ cartCount }) {
  const { pathname } = useLocation();

  return (
    <header className="bg-gray-900 border-b border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <span className="text-2xl">🛒</span>
          <div>
            <h1 className="text-2xl font-bold text-white group-hover:text-blue-400 transition leading-none">
              NiveshHub
            </h1>
            <p className="text-gray-500 text-xs">E-Commerce POC</p>
          </div>
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-6">
          <Link
            to="/"
            className={`text-sm font-medium transition ${
              pathname === '/' ? 'text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            Products
          </Link>

          {/* Cart icon with badge */}
          <Link to="/cart" className="relative group">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition ${
              pathname === '/cart'
                ? 'bg-blue-600 border-blue-500 text-white'
                : 'border-gray-600 text-gray-300 hover:border-blue-500 hover:text-white'
            }`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span className="text-sm font-medium">Cart</span>
              {cartCount > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </div>
          </Link>
        </nav>
      </div>
    </header>
  );
}
