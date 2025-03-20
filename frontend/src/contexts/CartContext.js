import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [itemCount, setItemCount] = useState(0);

  // Load cart from localStorage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      const parsedCart = JSON.parse(storedCart);
      setItems(parsedCart);
      updateCartStats(parsedCart);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
    updateCartStats(items);
  }, [items]);

  // Update cart statistics
  const updateCartStats = (cartItems) => {
    const count = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const cartTotal = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    setItemCount(count);
    setTotal(cartTotal);
  };

  // Add item to cart
  const addItem = (product, quantity = 1) => {
    setItems(currentItems => {
      const existingItem = currentItems.find(item => item._id === product._id);
      
      if (existingItem) {
        // Update quantity if item exists
        const updatedItems = currentItems.map(item =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
        toast.success('Cart updated successfully');
        return updatedItems;
      } else {
        // Add new item
        const newItem = {
          _id: product._id,
          name: product.name,
          price: product.price,
          image: product.images[0],
          quantity
        };
        toast.success('Item added to cart');
        return [...currentItems, newItem];
      }
    });
  };

  // Remove item from cart
  const removeItem = (productId) => {
    setItems(currentItems => {
      const updatedItems = currentItems.filter(item => item._id !== productId);
      toast.info('Item removed from cart');
      return updatedItems;
    });
  };

  // Update item quantity
  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) {
      removeItem(productId);
      return;
    }

    setItems(currentItems => {
      const updatedItems = currentItems.map(item =>
        item._id === productId
          ? { ...item, quantity }
          : item
      );
      toast.success('Cart updated successfully');
      return updatedItems;
    });
  };

  // Clear cart
  const clearCart = () => {
    setItems([]);
    toast.info('Cart cleared');
  };

  // Check if item exists in cart
  const itemExists = (productId) => {
    return items.some(item => item._id === productId);
  };

  // Get item quantity
  const getItemQuantity = (productId) => {
    const item = items.find(item => item._id === productId);
    return item ? item.quantity : 0;
  };

  // Calculate shipping cost
  const calculateShipping = () => {
    // Free shipping over $100
    return total >= 100 ? 0 : 10;
  };

  // Calculate tax
  const calculateTax = () => {
    return total * 0.1; // 10% tax
  };

  // Calculate final total
  const calculateFinalTotal = () => {
    return total + calculateShipping() + calculateTax();
  };

  const value = {
    items,
    total,
    itemCount,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    itemExists,
    getItemQuantity,
    calculateShipping,
    calculateTax,
    calculateFinalTotal
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}