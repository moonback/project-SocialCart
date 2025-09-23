import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product } from '../lib/supabase';
import toast from 'react-hot-toast';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, variants?: Record<string, string>) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
  getCartItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Charger le panier depuis localStorage au montage
  useEffect(() => {
    const savedCart = localStorage.getItem('shopping-cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setItems(parsedCart);
      } catch (error) {
        console.error('Erreur lors du chargement du panier:', error);
        localStorage.removeItem('shopping-cart');
      }
    }
  }, []);

  // Sauvegarder le panier dans localStorage à chaque changement
  useEffect(() => {
    localStorage.setItem('shopping-cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (product: Product, variants: Record<string, string> = {}) => {
    const existingItem = items.find(
      item => item.product.id === product.id &&
      JSON.stringify(item.selected_variants) === JSON.stringify(variants)
    );

    if (existingItem) {
      updateQuantity(existingItem.id, existingItem.quantity + 1);
    } else {
      const newItem: CartItem = {
        id: `${product.id}-${Date.now()}`,
        product,
        quantity: 1,
        selected_variants: variants,
      };
      setItems(prev => [...prev, newItem]);
      toast.success('Ajouté au panier !');
    }
  };

  const removeFromCart = (itemId: string) => {
    setItems(prev => prev.filter(item => item.id !== itemId));
    toast.success('Retiré du panier');
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setItems(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem('shopping-cart');
    toast.success('Panier vidé');
  };

  const total = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // Fonction pour récupérer le nombre d'articles depuis localStorage
  const getCartItemCount = () => {
    const savedCart = localStorage.getItem('shopping-cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        return parsedCart.reduce((sum: number, item: CartItem) => sum + item.quantity, 0);
      } catch (error) {
        return 0;
      }
    }
    return 0;
  };

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      total,
      itemCount,
      getCartItemCount,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}