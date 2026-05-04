import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CheckoutButton } from '../components/CheckoutButton';

describe('CheckoutButton Component (FR-14, FR-15)', () => {
  const mockOnCheckout = vi.fn();

  beforeEach(() => {
    mockOnCheckout.mockClear();
  });

  it('should render checkout button when cart is not empty', () => {
    render(
      <CheckoutButton
        isCartEmpty={false}
        onCheckout={mockOnCheckout}
        isLoading={false}
        orderId={null}
        error=""
      />
    );
    expect(screen.getByText('Checkout')).toBeInTheDocument();
  });

  it('should disable button when cart is empty', () => {
    render(
      <CheckoutButton
        isCartEmpty={true}
        onCheckout={mockOnCheckout}
        isLoading={false}
        orderId={null}
        error=""
      />
    );
    expect(screen.getByText('Checkout')).toBeDisabled();
  });

  it('should show warning when cart is empty (FR-15)', () => {
    render(
      <CheckoutButton
        isCartEmpty={true}
        onCheckout={mockOnCheckout}
        isLoading={false}
        orderId={null}
        error=""
      />
    );
    expect(screen.getByText('Add items to your cart to proceed with checkout')).toBeInTheDocument();
  });

  it('should call onCheckout when button is clicked (FR-14)', () => {
    render(
      <CheckoutButton
        isCartEmpty={false}
        onCheckout={mockOnCheckout}
        isLoading={false}
        orderId={null}
        error=""
      />
    );
    
    fireEvent.click(screen.getByText('Checkout'));
    expect(mockOnCheckout).toHaveBeenCalled();
  });

  it('should display order success message with order ID (FR-14)', () => {
    render(
      <CheckoutButton
        isCartEmpty={false}
        onCheckout={mockOnCheckout}
        isLoading={false}
        orderId="order_123_abc"
        error=""
      />
    );
    expect(screen.getByText('Order Placed Successfully!')).toBeInTheDocument();
    expect(screen.getByText('order_123_abc')).toBeInTheDocument();
    expect(screen.getByText('Thank you for your purchase. Your order has been confirmed.')).toBeInTheDocument();
  });

  it('should display error message when checkout fails (FR-15)', () => {
    render(
      <CheckoutButton
        isCartEmpty={false}
        onCheckout={mockOnCheckout}
        isLoading={false}
        orderId={null}
        error="Your cart is empty. Please add items before checkout."
      />
    );
    expect(screen.getByText('Your cart is empty. Please add items before checkout.')).toBeInTheDocument();
  });

  it('should show loading state while processing', () => {
    render(
      <CheckoutButton
        isCartEmpty={false}
        onCheckout={mockOnCheckout}
        isLoading={true}
        orderId={null}
        error=""
      />
    );
    expect(screen.getByText('Processing...')).toBeInTheDocument();
  });

  it('should disable button when loading', () => {
    render(
      <CheckoutButton
        isCartEmpty={false}
        onCheckout={mockOnCheckout}
        isLoading={true}
        orderId={null}
        error=""
      />
    );
    expect(screen.getByText('Processing...')).toBeDisabled();
  });

  it('should show order ID in a highlighted box', () => {
    render(
      <CheckoutButton
        isCartEmpty={false}
        onCheckout={mockOnCheckout}
        isLoading={false}
        orderId="test-order-12345"
        error=""
      />
    );
    const orderId = screen.getByText('test-order-12345');
    expect(orderId).toBeInTheDocument();
    expect(orderId.className).toContain('font-mono');
    expect(orderId.className).toContain('font-bold');
  });

  it('should show success checkmark when order placed', () => {
    render(
      <CheckoutButton
        isCartEmpty={false}
        onCheckout={mockOnCheckout}
        isLoading={false}
        orderId="order-xyz"
        error=""
      />
    );
    expect(screen.getByText('✓')).toBeInTheDocument();
  });
});
