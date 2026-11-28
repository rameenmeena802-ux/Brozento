import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      // Check karein ke same product + same variant pehle se hai ya nahi
      const existingItem = prevItems.find(
        (item) => item._id === product._id && item.variantName === product.variantName
      );
      
      if (existingItem) {
        return prevItems.map((item) =>
          (item._id === product._id && item.variantName === product.variantName)
            ? { ...item, quantity: item.quantity + (product.quantity || 1) }
            : item
        );
      }
      return [...prevItems, { ...product, quantity: product.quantity || 1 }];
    });
  };

  const removeFromCart = (id, variantName) => {
    setCartItems((prevItems) => prevItems.filter((item) => !(item._id === id && item.variantName === variantName)));
  };

  const updateQuantity = (id, variantName, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        (item._id === id && item.variantName === variantName) ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, getCartTotal, getCartCount, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);