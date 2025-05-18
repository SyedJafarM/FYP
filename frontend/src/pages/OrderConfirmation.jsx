import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../contexts/AuthContext';

const OrderConfirmation = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        if (!user) return;
        const res = await API.get(`/orders/${id}?email=${user.email}`);
        setOrder(res.data);
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('Failed to fetch order details');
      }
    };
    fetchOrder();
  }, [id, user]);

  if (error) return <div className="text-center text-red-500 py-20">{error}</div>;
  if (!order) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-10 flex-1 text-center">
        <h1 className="text-3xl font-bold mb-6 text-green-600">Thank you for your order!</h1>
        <p className="text-lg mb-4">Order ID: <strong>{order.id}</strong></p>
        <p className="text-lg mb-4">Status: <strong>{order.status}</strong></p>
        <p className="text-lg mb-8">Total Paid: <strong>CAD ${order.total_price}</strong></p>

        <Link 
          to="/collection"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Continue Shopping
        </Link>
      </div>
      <Footer />
    </div>
  );
};

export default OrderConfirmation;
