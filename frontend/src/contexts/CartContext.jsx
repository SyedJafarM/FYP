import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import API from '../api/axios';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);

  const fetchCart = async () => {
    if (!user) return;
    try {
      const { data } = await API.get(`/cart/${user.id}`);
      if (data.success) {
        setCart(data.data.map(item => ({
          id: item.Product.id,
          name: item.Product.name,
          price: item.Product.price,
          image: item.Product.image,
          quantity: item.quantity
        })));
      } else {
        setCart([]);
      }
    } catch (error) {
      console.error('Fetch cart error:', error);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    if (!user) return;
    try {
      await API.post('/cart', { user_id: user.id, product_id: productId, quantity });
      await fetchCart();
    } catch (error) {
      console.error('Add to cart error:', error);
    }
  };

  const updateCartItemQuantity = async (productId, quantity) => {
    if (!user) return;
    try {
      await API.patch(`/cart/${user.id}`, { product_id: productId, quantity });
      await fetchCart();
    } catch (error) {
      console.error('Update quantity error:', error);
    }
  };

  const clearCart = async () => {
    if (!user) return;
    try {
      await API.delete(`/cart/${user.id}`);
      setCart([]);
    } catch (error) {
      console.error('Clear cart error:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCart([]);
    }
  }, [user]);

  return (
    <CartContext.Provider value={{ cart, addToCart, updateCartItemQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
