import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CouponInput } from '../components/CouponInput';

describe('CouponInput Component (FR-13)', () => {
  const mockOnApplyCoupon = vi.fn();

  beforeEach(() => { mockOnApplyCoupon.mockClear(); });

  it('should render coupon input form with input field and button', () => {
    render(<CouponInput onApplyCoupon={mockOnApplyCoupon} isLoading={false} appliedCoupon={null} error="" />);
    expect(screen.getByPlaceholderText('Enter coupon code')).toBeInTheDocument();
    expect(screen.getByText('Apply')).toBeInTheDocument();
    expect(screen.getByText('Apply Coupon')).toBeInTheDocument();
  });

  it('should call onApplyCoupon with code when form submitted', async () => {
    const mockApply = vi.fn().mockResolvedValue();
    render(<CouponInput onApplyCoupon={mockApply} isLoading={false} appliedCoupon={null} error="" />);
    fireEvent.change(screen.getByPlaceholderText('Enter coupon code'), { target: { value: 'SAVE50' } });
    fireEvent.click(screen.getByText('Apply'));
    await waitFor(() => expect(mockApply).toHaveBeenCalledWith('SAVE50'));
  });

  it('should display applied coupon message', () => {
    render(<CouponInput onApplyCoupon={mockOnApplyCoupon} isLoading={false} appliedCoupon="SAVE50" error="" />);
    expect(screen.getByText('Coupon applied!')).toBeInTheDocument();
    expect(screen.getByText('SAVE50')).toBeInTheDocument();
  });

  it('should show error message when coupon application fails', () => {
    render(<CouponInput onApplyCoupon={mockOnApplyCoupon} isLoading={false} appliedCoupon={null} error="Invalid or unknown coupon" />);
    expect(screen.getByText(/Invalid or unknown coupon/)).toBeInTheDocument();
  });

  it('should disable input when coupon is already applied', () => {
    render(<CouponInput onApplyCoupon={mockOnApplyCoupon} isLoading={false} appliedCoupon="SAVE50" error="" />);
    expect(screen.queryByPlaceholderText('Enter coupon code')).not.toBeInTheDocument();
  });

  it('should disable apply button when loading', () => {
    render(<CouponInput onApplyCoupon={mockOnApplyCoupon} isLoading={true} appliedCoupon={null} error="" />);
    expect(screen.getByText('Apply')).toBeDisabled();
  });

  it('should convert input to uppercase', () => {
    render(<CouponInput onApplyCoupon={mockOnApplyCoupon} isLoading={false} appliedCoupon={null} error="" />);
    const input = screen.getByPlaceholderText('Enter coupon code');
    fireEvent.change(input, { target: { value: 'save50' } });
    expect(input.value).toBe('SAVE50');
  });

  it('should show available coupon codes', () => {
    render(<CouponInput onApplyCoupon={mockOnApplyCoupon} isLoading={false} appliedCoupon={null} error="" />);
    expect(screen.getByText(/SAVE50/)).toBeInTheDocument();
    expect(screen.getByText(/SAVE100/)).toBeInTheDocument();
    expect(screen.getByText(/SAVE200/)).toBeInTheDocument();
  });
});
