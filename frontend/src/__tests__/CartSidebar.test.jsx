import { describe, it, expect, beforeEach, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CartSidebar } from '../components/CartSidebar';

describe('CartSidebar Component (FR-11, FR-12)', () => {
  const mockOnUpdateQuantity = vi.fn();
  const mockOnRemoveItem = vi.fn();

  beforeEach(() => {
    mockOnUpdateQuantity.mockClear();
    mockOnRemoveItem.mockClear();
  });

  it('should render empty cart message when no items', () => {
    render(
      <CartSidebar
        items={[]}
        subtotal={0}
        discount={0}
        total={0}
        onUpdateQuantity={mockOnUpdateQuantity}
        onRemoveItem={mockOnRemoveItem}
        isLoading={false}
      />
    );
    expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
  });

  it('should render cart items with name and price', () => {
    const mockItems = [
      { itemId: '1', name: 'Laptop', price: 50000, quantity: 1 },
      { itemId: '2', name: 'Mouse', price: 500, quantity: 2 },
    ];
    
    render(
      <CartSidebar
        items={mockItems}
        subtotal={51000}
        discount={0}
        total={51000}
        onUpdateQuantity={mockOnUpdateQuantity}
        onRemoveItem={mockOnRemoveItem}
        isLoading={false}
      />
    );
    expect(screen.getByText('Laptop')).toBeInTheDocument();
    expect(screen.getByText('Mouse')).toBeInTheDocument();
  });

  it('should display subtotal correctly', () => {
    const mockItems = [
      { itemId: '1', name: 'Product 1', price: 100, quantity: 2 },
    ];
    
    render(
      <CartSidebar
        items={mockItems}
        subtotal={200}
        discount={0}
        total={200}
        onUpdateQuantity={mockOnUpdateQuantity}
        onRemoveItem={mockOnRemoveItem}
        isLoading={false}
      />
    );
    expect(screen.getAllByText(/₹200/)[0]).toBeInTheDocument();
  });

  it('should display discount when applied', () => {
    const mockItems = [
      { itemId: '1', name: 'Product 1', price: 100, quantity: 2 },
    ];
    
    render(
      <CartSidebar
        items={mockItems}
        subtotal={200}
        discount={50}
        total={150}
        onUpdateQuantity={mockOnUpdateQuantity}
        onRemoveItem={mockOnRemoveItem}
        isLoading={false}
      />
    );
    expect(screen.getByText('Discount:')).toBeInTheDocument();
    expect(screen.getAllByText(/50/)[0]).toBeInTheDocument();
  });

  it('should call onUpdateQuantity when + button clicked', () => {
    const mockItems = [
      { itemId: '1', name: 'Product 1', price: 100, quantity: 2 },
    ];
    
    render(
      <CartSidebar
        items={mockItems}
        subtotal={200}
        discount={0}
        total={200}
        onUpdateQuantity={mockOnUpdateQuantity}
        onRemoveItem={mockOnRemoveItem}
        isLoading={false}
      />
    );
    
    const addButton = screen.getByText('+');
    fireEvent.click(addButton);
    expect(mockOnUpdateQuantity).toHaveBeenCalledWith('1', 3);
  });

  it('should call onUpdateQuantity when - button clicked', () => {
    const mockItems = [
      { itemId: '1', name: 'Product 1', price: 100, quantity: 2 },
    ];
    
    render(
      <CartSidebar
        items={mockItems}
        subtotal={200}
        discount={0}
        total={200}
        onUpdateQuantity={mockOnUpdateQuantity}
        onRemoveItem={mockOnRemoveItem}
        isLoading={false}
      />
    );
    
    const removeButton = screen.getByText('−');
    fireEvent.click(removeButton);
    expect(mockOnUpdateQuantity).toHaveBeenCalledWith('1', 1);
  });

  it('should call onRemoveItem when remove button clicked (FR-12)', () => {
    const mockItems = [
      { itemId: '1', name: 'Product 1', price: 100, quantity: 2 },
    ];
    
    render(
      <CartSidebar
        items={mockItems}
        subtotal={200}
        discount={0}
        total={200}
        onUpdateQuantity={mockOnUpdateQuantity}
        onRemoveItem={mockOnRemoveItem}
        isLoading={false}
      />
    );
    
    const removeButton = screen.getByText('✕');
    fireEvent.click(removeButton);
    expect(mockOnRemoveItem).toHaveBeenCalledWith('1');
  });

  it('should disable buttons when isLoading is true', () => {
    const mockItems = [
      { itemId: '1', name: 'Product 1', price: 100, quantity: 2 },
    ];
    
    render(
      <CartSidebar
        items={mockItems}
        subtotal={200}
        discount={0}
        total={200}
        onUpdateQuantity={mockOnUpdateQuantity}
        onRemoveItem={mockOnRemoveItem}
        isLoading={true}
      />
    );
    
    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      expect(button).toBeDisabled();
    });
  });
});

