import React, { useEffect, useState } from 'react';
import axios from 'axios';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [selectedStatuses, setSelectedStatuses] = useState({});
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [processingOrderId, setProcessingOrderId] = useState(null);

  const statusOptions = ['pending', 'confirmed', 'shipped', 'out for delivery', 'delivered', 'cancelled'];

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const toggleExpand = (orderId) => {
    setExpandedOrderId(prev => (prev === orderId ? null : orderId));
  };

  const handleSelectChange = (orderId, newStatus) => {
    setSelectedStatuses((prev) => ({ ...prev, [orderId]: newStatus }));
  };

  const handleStatusUpdate = async (orderId) => {
    const newStatus = selectedStatuses[orderId];
    if (!newStatus) {
      alert('Please select a status first.');
      return;
    }

    try {
      setUpdatingOrderId(orderId);
      const res = await axios.patch(`http://localhost:5000/api/orders/${orderId}/status`, { status: newStatus });

      setOrders(prev => prev.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
      setSelectedStatuses(prev => ({ ...prev, [orderId]: '' }));

      if (res.data.emailStatus === 'success') {
        alert('✅ Status updated and Email sent successfully!');
      } else {
        alert('⚠️ Status updated but Email sending failed!');
      }

    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update order status.');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleDownloadInvoice = async (orderId) => {
    try {
      setProcessingOrderId(orderId);
      const response = await axios.get(`http://localhost:5000/api/orders/${orderId}/invoice`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice_${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading invoice:', error);
      alert('Failed to download invoice.');
    } finally {
      setProcessingOrderId(null);
    }
  };

  const handleViewInvoice = async (orderId) => {
    try {
      setProcessingOrderId(orderId);
      const response = await axios.get(`http://localhost:5000/api/orders/${orderId}/invoice`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      window.open(url, '_blank');
    } catch (error) {
      console.error('Error viewing invoice:', error);
      alert('Failed to view invoice.');
    } finally {
      setProcessingOrderId(null);
    }
  };

  if (loading) return <div className="text-center py-10 text-xl font-semibold">Loading orders...</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">Manage Orders</h1>
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse shadow rounded-lg overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3 border">#</th>
              <th className="p-3 border">Customer</th>
              <th className="p-3 border">Email</th>
              <th className="p-3 border">Total</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border">Update Status</th>
              <th className="p-3 border">Actions</th>
              <th className="p-3 border">Expand</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, idx) => (
              <React.Fragment key={order.id}>
                <tr className="hover:bg-gray-50">
                  <td className="p-3 border">{idx + 1}</td>
                  <td className="p-3 border">{order.name}</td>
                  <td className="p-3 border">{order.email}</td>
                  <td className="p-3 border">CAD ${parseFloat(order.total_price || 0).toFixed(2)}</td>
                  <td className="p-3 border capitalize">{order.status}</td>
                  <td className="p-3 border">
                    <select
                      className="border rounded p-2 w-full"
                      value={selectedStatuses[order.id] || ''}
                      onChange={(e) => handleSelectChange(order.id, e.target.value)}
                    >
                      <option value="">Select Status</option>
                      {statusOptions.map((option) => (
                        <option key={option} value={option}>
                          {option.charAt(0).toUpperCase() + option.slice(1)}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-3 border space-y-2 flex flex-col items-center">
                    <button
                      onClick={() => handleStatusUpdate(order.id)}
                      disabled={updatingOrderId === order.id}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded w-full disabled:opacity-50"
                    >
                      {updatingOrderId === order.id ? 'Updating...' : 'Update'}
                    </button>
                    <button
                      onClick={() => handleDownloadInvoice(order.id)}
                      disabled={processingOrderId === order.id}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded w-full disabled:opacity-50"
                    >
                      {processingOrderId === order.id ? 'Downloading...' : 'Download Invoice'}
                    </button>
                    <button
                      onClick={() => handleViewInvoice(order.id)}
                      disabled={processingOrderId === order.id}
                      className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded w-full disabled:opacity-50"
                    >
                      {processingOrderId === order.id ? 'Opening...' : 'View Invoice'}
                    </button>
                  </td>
                  <td className="p-3 border text-center">
                    <button
                      onClick={() => toggleExpand(order.id)}
                      className="text-blue-600 hover:underline"
                    >
                      {expandedOrderId === order.id ? 'Hide' : 'View'}
                    </button>
                  </td>
                </tr>

                {expandedOrderId === order.id && (
                  <tr className="bg-gray-50">
                    <td colSpan="8" className="p-4">
                      <h3 className="text-lg font-semibold mb-3">Ordered Items:</h3>
                      <table className="w-full table-auto">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="p-2 border">Product</th>
                            <th className="p-2 border">Quantity</th>
                            <th className="p-2 border">Price</th>
                            <th className="p-2 border">Subtotal</th>
                          </tr>
                        </thead>
                        <tbody>
                          {order.OrderItems?.map(item => (
                            <tr key={item.id}>
                              <td className="p-2 border">{item.Product?.name}</td>
                              <td className="p-2 border">{item.quantity}</td>
                              <td className="p-2 border">${parseFloat(item.price).toFixed(2)}</td>
                              <td className="p-2 border">${(item.price * item.quantity).toFixed(2)}</td>
                            </tr>
                          )) || <tr><td colSpan="4" className="text-center">No items found</td></tr>}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersPage;
