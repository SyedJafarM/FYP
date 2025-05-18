import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../contexts/AuthContext';

const Orders = () => {
  const { user } = useAuth(); // ✅ Get current logged-in user
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.email) {
        setLoading(false);
        return;
      }
      try {
        const res = await API.get(`/orders?email=${encodeURIComponent(user.email)}`);
        setOrders(res.data);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  return (
    <div className="bg-white text-gray-800 min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-10 flex-1">
        <h1 className="text-3xl font-bold mb-6">My Orders</h1>

        {loading ? (
          <p className="text-center">Loading...</p>
        ) : orders.length === 0 ? (
          <p className="text-gray-600 text-center">No orders yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 border text-left">#</th>
                  <th className="p-3 border text-left">Name</th>
                  <th className="p-3 border text-left">Email</th>
                  <th className="p-3 border text-left">Address</th>
                  <th className="p-3 border text-left">Total</th>
                  <th className="p-3 border text-left">Date</th>
                  <th className="p-3 border text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, idx) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="p-3 border">{idx + 1}</td>
                    <td className="p-3 border">{order.name}</td>
                    <td className="p-3 border">{order.email}</td>
                    <td className="p-3 border">{order.address}</td>
                    <td className="p-3 border">CAD ${parseFloat(order.total_price || 0).toFixed(2)}</td>
                    <td className="p-3 border">{order.created_at ? new Date(order.created_at).toLocaleDateString() : '-'}</td>
                    <td className="p-3 border capitalize">{order.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Orders;
