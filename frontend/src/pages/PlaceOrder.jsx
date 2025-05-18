import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const PlaceOrder = () => {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.email?.split('@')[0] || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    postalCode: ''
  });

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleConfirmOrder = async () => {
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    const { name, email, address, city, postalCode, phone } = formData;
    if (!name || !email || !address || !city || !postalCode || !phone) {
      alert('Please fill all fields.');
      return;
    }

    try {
      setLoading(true);

      const fullAddress = `${address}, ${city}, ${postalCode}`;

      const { data } = await API.post('/orders', {
        name,
        email, // email backend me jaega
        address: fullAddress,
        items: cart,
        total_price: total
      });

      clearCart();
      alert('Order placed successfully!');
      navigate(`/order-confirmation/${data.orderId}`);
    } catch (error) {
      console.error('Order placement error:', error);
      alert('Failed to place order.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white text-gray-800 min-h-screen flex flex-col">
      <Navbar />

      <div className="container mx-auto px-4 py-10 flex-1">
        <h1 className="text-3xl font-bold mb-6">Place Your Order</h1>

        {cart.length === 0 ? (
          <p>Your cart is empty. Please add some items first.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-10">
            {/* Shipping Information Form */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
              <div className="space-y-4">
                {/* ✅ Name editable */}
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                  className="w-full border p-3 rounded"
                />
                {/* ✅ Email non-editable */}
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="w-full border p-3 rounded bg-gray-200 cursor-not-allowed"
                />
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  className="w-full border p-3 rounded"
                />
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Street Address"
                  className="w-full border p-3 rounded"
                />
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="City"
                  className="w-full border p-3 rounded"
                />
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  placeholder="Postal Code"
                  className="w-full border p-3 rounded"
                />
              </div>

              <button
                onClick={handleConfirmOrder}
                disabled={loading}
                className="mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded w-full"
              >
                {loading ? 'Placing Order...' : 'Confirm Order'}
              </button>
            </div>

            {/* Cart Summary */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center justify-between border p-4 rounded shadow-sm">
                    <div className="flex items-center gap-4">
                      <img
                        src={`http://localhost:5000/uploads/${item.image}`}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div>
                        <h3 className="text-lg">{item.name}</h3>
                        <p className="text-gray-500 text-sm">Quantity: {item.quantity}</p>
                      </div>
                    </div>
                    <div className="font-semibold">CAD ${(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 mt-6 flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span>CAD ${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default PlaceOrder;
