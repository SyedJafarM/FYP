import React from 'react';
import { useCart } from '../contexts/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Cart = () => {
  const { cart, clearCart, updateCartItemQuantity } = useCart();
  const navigate = useNavigate();

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    updateCartItemQuantity(itemId, newQuantity);
  };

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="bg-white text-gray-800 min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-10 flex-1">
        <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

        {cart.length === 0 ? (
          <div className="text-center">
            <p className="text-lg">Your cart is empty.</p>
            <Link to="/collection" className="text-blue-600 hover:underline mt-4 inline-block">Shop Now</Link>
          </div>
        ) : (
          <>
            <div className="space-y-6">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center justify-between border p-4 rounded shadow-sm">
                  <div className="flex items-center gap-4">
                    <img src={`http://localhost:5000/uploads/${item.image}`} alt={item.name} className="w-24 h-24 object-cover rounded" />
                    <div>
                      <h2 className="text-lg font-semibold">{item.name}</h2>
                      <p className="text-gray-600">Price: CAD ${item.price}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          className="px-2 py-1 bg-gray-200 rounded"
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          className="px-2 py-1 bg-gray-200 rounded"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-right mt-8">
              <h2 className="text-2xl font-bold mb-4">Total: CAD ${total.toFixed(2)}</h2>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => navigate('/place-order')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
                >
                  Checkout
                </button>
                <button
                  onClick={clearCart}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Cart;
