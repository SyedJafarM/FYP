import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/common/Sidebar';
import Navbar from './components/common/Navbar';
import DashboardPage from './pages/DashboardPage';
import ManageProductsPage from './pages/ManageProductsPage';
import ManageCategoriesPage from './pages/ManageCategoriesPage';
import OrdersPage from './pages/OrdersPage';
import AddProductPage from './pages/AddProductPage';
import EditProductPage from './pages/EditProductPage';
import ReportsPage from './pages/ReportsPage';
import AdminProfilePage from './pages/AdminProfilePage'; // ✅ Admin profile

const AdminPanel = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <div className="p-6">
          <Routes>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/manage-products" element={<ManageProductsPage />} />
            <Route path="/manage-categories" element={<ManageCategoriesPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/add-product" element={<AddProductPage />} />
            <Route path="/edit-product/:id" element={<EditProductPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/profile" element={<AdminProfilePage />} /> {/* ✅ Profile route */}
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
