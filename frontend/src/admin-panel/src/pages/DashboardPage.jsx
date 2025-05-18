import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DashboardPage = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    newUsers: 0,
    fulfillmentRate: 0,
    pending: 0,
    delivered: 0,
    lowStockCount: 0,
    recentOrders: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          summary,
          newUsers,
          fulfillment,
          statusRatio,
          lowStock,
          recentOrders
        ] = await Promise.all([
          axios.get('/api/reports/summary'),
          axios.get('/api/reports/new-users-week'),
          axios.get('/api/reports/fulfillment-rate'),
          axios.get('/api/reports/status-ratio'),
          axios.get('/api/reports/low-stock'),
          axios.get('/api/reports/recent-orders'),
        ]);

        setStats(prev => ({
          ...prev,
          ...summary.data,
          newUsers: newUsers.data?.newUsers || 0,
          fulfillmentRate: fulfillment.data?.fulfillmentRate || 0,
          pending: statusRatio.data?.pending || 0,
          delivered: statusRatio.data?.delivered || 0,
          lowStockCount: Array.isArray(lowStock.data) ? lowStock.data.length : 0,
          recentOrders: Array.isArray(recentOrders.data) ? recentOrders.data : [],
        }));
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-6 space-y-10">
      <h1 className="text-3xl font-bold mb-4">Dashboard Overview</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <Card title="Total Products" value={stats.totalProducts} color="bg-blue-600" />
        <Card title="Total Orders" value={stats.totalOrders} color="bg-green-600" />
        <Card title="Total Revenue" value={`CAD ${Number(stats.totalRevenue).toLocaleString()}`} color="bg-purple-600" />
        <Card title="New Users (7d)" value={stats.newUsers} color="bg-pink-600" />
        <Card title="Fulfillment Rate" value={`${stats.fulfillmentRate}%`} color="bg-yellow-600" />
        <Card title="Low Stock Items" value={stats.lowStockCount} color="bg-red-600" />
        <Card title="Pending Orders" value={stats.pending} color="bg-orange-600" />
        <Card title="Delivered Orders" value={stats.delivered} color="bg-teal-600" />
      </div>

      {/* Recent Orders */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Recent Orders</h2>
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-2">Order ID</th>
                <th className="px-4 py-2">Customer</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Total</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(stats.recentOrders) && stats.recentOrders.length > 0 ? (
                stats.recentOrders.map((order) => (
                  <tr key={order.id} className="border-t even:bg-gray-50">
                    <td className="px-4 py-2">{order.id}</td>
                    <td className="px-4 py-2">{order.name}</td>
                    <td className="px-4 py-2">{order.email}</td>
                    <td className="px-4 py-2">CAD {Number(order.total_price).toFixed(2)}</td>
                    <td className="px-4 py-2 capitalize">{order.status}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-gray-500">No recent orders found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const Card = ({ title, value, color }) => (
  <div className={`${color} text-white p-6 rounded-xl shadow hover:scale-105 transform transition`}>
    <h2 className="text-lg font-medium">{title}</h2>
    <p className="text-3xl font-bold">{value}</p>
  </div>
);

export default DashboardPage;
