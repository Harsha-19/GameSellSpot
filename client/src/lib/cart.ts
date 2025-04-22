import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Game } from '@shared/schema';
import { calculateDiscountedPrice } from './gameData';
import { apiRequest } from './queryClient';
import { queryClient } from './queryClient';
import { useToast } from '@/hooks/use-toast';

interface CartContextType {
  cartItems: CartItem[];
  totalItems: number;
  subtotal: number;
  tax: number;
  total: number;
  addToCart: (game: Game) => Promise<void>;
  removeFromCart: (id: number) => Promise<void>;
  updateQuantity: (id: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  isCartOpen: boolean;
  setIsCartOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const CartContext = createContext<CartContextType>({
  cartItems: [],
  totalItems: 0,
  subtotal: 0,
  tax: 0,
  total: 0,
  addToCart: async () => {},
  removeFromCart: async () => {},
  updateQuantity: async () => {},
  clearCart: async () => {},
  isCartOpen: false,
  setIsCartOpen: () => {},
});

export const useCart = () => useContext(CartContext);

interface CartProviderProps {
  children: React.ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { toast } = useToast();

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('gameVaultCart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Failed to parse cart from localStorage', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('gameVaultCart', JSON.stringify(cartItems));
  }, [cartItems]);

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  
  const subtotal = cartItems.reduce((total, item) => {
    const itemPrice = item.discountedPrice !== undefined ? item.discountedPrice : item.price;
    return total + (itemPrice * item.quantity);
  }, 0);
  
  const taxRate = 0.06; // 6% tax rate
  const tax = Math.round(subtotal * taxRate);
  const total = subtotal + tax;

  const addToCart = async (game: Game) => {
    try {
      // Check if the item already exists in the cart
      const existingItemIndex = cartItems.findIndex(item => item.gameId === game.id);
      
      if (existingItemIndex >= 0) {
        // Update quantity if item exists
        const updatedItems = [...cartItems];
        updatedItems[existingItemIndex].quantity += 1;
        setCartItems(updatedItems);
      } else {
        // Add new item if it doesn't exist
        const discountedPrice = game.discountPercentage ? calculateDiscountedPrice(game) : undefined;
        
        const newItem: CartItem = {
          id: Date.now(), // Use timestamp as a temporary ID
          gameId: game.id,
          title: game.title,
          price: game.price,
          discountedPrice,
          imageUrl: (game.imageUrl || '') as string,
          edition: (game.edition || 'Standard') as string,
          quantity: 1
        };
        
        setCartItems([...cartItems, newItem]);
      }
      
      toast({
        title: "Added to cart",
        description: `${game.title} has been added to your cart.`,
        duration: 2000,
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      });
    }
  };

  const removeFromCart = async (id: number) => {
    try {
      const updatedItems = cartItems.filter(item => item.id !== id);
      setCartItems(updatedItems);
      
      toast({
        title: "Removed from cart",
        description: "Item has been removed from your cart.",
        duration: 2000,
      });
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast({
        title: "Error",
        description: "Failed to remove item from cart",
        variant: "destructive",
      });
    }
  };

  const updateQuantity = async (id: number, quantity: number) => {
    try {
      if (quantity <= 0) {
        await removeFromCart(id);
        return;
      }
      
      const updatedItems = cartItems.map(item => 
        item.id === id ? { ...item, quantity } : item
      );
      
      setCartItems(updatedItems);
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast({
        title: "Error",
        description: "Failed to update quantity",
        variant: "destructive",
      });
    }
  };

  const clearCart = async () => {
    try {
      setCartItems([]);
      toast({
        title: "Cart cleared",
        description: "All items have been removed from your cart.",
        duration: 2000,
      });
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast({
        title: "Error",
        description: "Failed to clear cart",
        variant: "destructive",
      });
    }
  };

  return (
    React.createElement(CartContext.Provider, {
      value: {
        cartItems,
        totalItems,
        subtotal,
        tax,
        total,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen
      }
    }, children)
  );
};
