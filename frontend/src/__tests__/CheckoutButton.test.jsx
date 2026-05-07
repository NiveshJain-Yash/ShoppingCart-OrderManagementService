import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CheckoutButton } from '../components/CheckoutButton';

describe('CheckoutButton Component (FR-14, FR-15)', () => {
  const mockOnCheckout = vi.fn();

  beforeEach(() => { mockOnCheckout.mockClear(); });

  it('should render checkout button when cart is not empty', () => {
    render(<CheckoutButton isCartEmpty={false} onCheckout={mockOnCheckout} isLoading={false} orderId={null} error="" />);
    expect(screen.getByText('Place Order')).toBeInTheDocument();
  });

  it('should disable button when cart is empty', () => {
    render(<CheckoutButton isCartEmpty={true} onCheckout={mockOnCheckout} isLoading={false} orderId={null} error="" />);
    expect(screen.getByText('Place Order')).toBeDisabled();
  });

  it('should show hint when cart is empty (FR-15)', () => {
    render(<CheckoutButton isCartEmpty={true} onCheckout={mockOnCheckout} isLoading={false} orderId={null} error="" />);
    expect(screen.getByText('Add items to your cart to checkout')).toBeInTheDocument();
  });

  it('should call onCheckout when button is clicked (FR-14)', () => {
    render(<CheckoutButton isCartEmpty={false} onCheckout={mockOnCheckout} isLoading={false} orderId={null} error="" />);
    fireEvent.click(screen.getByText('Place Order'));
    expect(mockOnCheckout).toHaveBeenCalled();
  });

  it('should display error message when checkout fails (FR-15)', () => {
    render(<CheckoutButton isCartEmpty={false} onCheckout={mockOnCheckout} isLoading={false} orderId={null} error="Your cart is empty. Please add items before checkout." />);
    expect(screen.getByText('Your cart is empty. Please add items before checkout.')).toBeInTheDocument();
  });

  it('should show loading state while processing', () => {
    render(<CheckoutButton isCartEmpty={false} onCheckout={mockOnCheckout} isLoading={true} orderId={null} error="" />);
    expect(screen.getByText('Processing...')).toBeInTheDocument();
  });

  it('should disable button when loading', () => {
    render(<CheckoutButton isCartEmpty={false} onCheckout={mockOnCheckout} isLoading={true} orderId={null} error="" />);
    expect(screen.getByText('Processing...')).toBeDisabled();
  });

  it('should render nothing when orderId is set (success handled by CartPage)', () => {
    const { container } = render(
      <CheckoutButton isCartEmpty={false} onCheckout={mockOnCheckout} isLoading={false} orderId="order-123" error="" />
    );
    expect(container.firstChild).toBeNull();
  });
});
