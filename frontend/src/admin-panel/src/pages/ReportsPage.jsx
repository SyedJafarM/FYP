import React, { useEffect, useState } from 'react';
import API from '../../../api/axios';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar
} from 'recharts';

const ReportsPage = () => {
  const [monthlyData, setMonthlyData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [topCustomers, setTopCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchReports = async () => {
    try {
      setLoading(true);
      const query = startDate && endDate ? `?startDate=${startDate}&endDate=${endDate}` : '';
      const [monthlyRes, productsRes, customersRes] = await Promise.all([
        API.get(`/reports/monthly${query}`),
        API.get('/reports/top-products'),
        API.get('/reports/top-customers')
      ]);
      setMonthlyData(Array.isArray(monthlyRes.data) ? monthlyRes.data : []);
      setTopProducts(Array.isArray(productsRes.data) ? productsRes.data : []);
      setTopCustomers(Array.isArray(customersRes.data) ? customersRes.data : []);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleFilter = () => {
    fetchReports();
  };

  const exportToCSV = () => {
    const headers = ['Month', 'Year', 'Order Count', 'Total Revenue'];
    const rows = monthlyData.map(row => [
      row.month || '',
      row.year || '',
      row.orderCount || 0,
      row.totalRevenue || 0
    ]);

    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += headers.join(',') + '\r\n';
    rows.forEach(row => {
      csvContent += row.join(',') + '\r\n';
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'monthly_report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(monthlyData.map(row => ({
      Month: row.month,
      Year: row.year,
      Orders: row.orderCount,
      Revenue: row.totalRevenue
    })));

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Monthly Report');

    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    saveAs(data, "monthly_report.xlsx");
  };

  const totalOrders = monthlyData.reduce((sum, month) => sum + (month.orderCount || 0), 0);
  const totalRevenue = monthlyData.reduce((sum, month) => sum + (parseFloat(month.totalRevenue) || 0), 0);
  const avgOrderValue = totalOrders ? (totalRevenue / totalOrders).toFixed(2) : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg font-semibold animate-pulse">Loading Reports...</div>
      </div>
    );
  }

  return (
    <div className="p-6 animate-fadeIn">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Business Reports</h1>

      {/* Filter & Export Buttons */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-4 md:space-y-0">
        <div className="flex gap-4">
          <input
            type="date"
            className="border rounded p-2"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <input
            type="date"
            className="border rounded p-2"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <button
            onClick={handleFilter}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Filter
          </button>
        </div>

        <div className="flex gap-4">
          <button
            onClick={exportToCSV}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Export CSV
          </button>
          <button
            onClick={exportToExcel}
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
          >
            Export Excel
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[{ label: "Total Orders", value: totalOrders, color: "text-indigo-600" },
        { label: "Total Revenue", value: `$${totalRevenue.toFixed(2)}`, color: "text-green-600" },
        { label: "Avg Order Value", value: `$${avgOrderValue}`, color: "text-blue-600" }]
          .map((card, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center transform hover:scale-105 transition-transform duration-300">
              <div className={`text-2xl font-bold ${card.color}`}>{card.value}</div>
              <div className="text-gray-500">{card.label}</div>
            </div>
          ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-lg font-bold mb-4">Monthly Revenue</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="totalRevenue" stroke="#4f46e5" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-lg font-bold mb-4">Monthly Orders</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="orderCount" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Products & Customers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-lg font-bold mb-4">Top Selling Products</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-600">
              <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                <tr>
                  <th className="px-6 py-3">Product</th>
                  <th className="px-6 py-3">Units Sold</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.length > 0 ? (
                  topProducts.map((product, index) => (
                    <tr key={index} className="bg-white border-b hover:bg-gray-100">
                      <td className="px-6 py-4">{product.Product?.name || 'Unknown Product'}</td>
                      <td className="px-6 py-4">{product.totalSold}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="px-6 py-4" colSpan="2">No products found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-lg font-bold mb-4">Top Customers</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-600">
              <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                <tr>
                  <th className="px-6 py-3">Customer</th>
                  <th className="px-6 py-3">Total Orders</th>
                </tr>
              </thead>
              <tbody>
                {topCustomers.length > 0 ? (
                  topCustomers.map((customer, index) => (
                    <tr key={index} className="bg-white border-b hover:bg-gray-100">
                      <td className="px-6 py-4">{customer.email}</td>
                      <td className="px-6 py-4">{customer.ordersCount}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="px-6 py-4" colSpan="2">No customers found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
