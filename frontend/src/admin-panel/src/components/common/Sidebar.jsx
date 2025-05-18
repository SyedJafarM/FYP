import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="bg-gray-900 text-white w-64 min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-10 text-center">Admin Panel</h1>
      <ul className="space-y-6">
        <li>
          <Link
            to="/admin/dashboard"
            className="flex items-center gap-2 hover:text-blue-400 transition-colors duration-200"
          >
            📊 Dashboard
          </Link>
        </li>
        <li>
          <Link
            to="/admin/manage-products"
            className="flex items-center gap-2 hover:text-blue-400 transition-colors duration-200"
          >
            🛍️ Manage Products
          </Link>
        </li>
        <li>
          <Link
            to="/admin/manage-categories"
            className="flex items-center gap-2 hover:text-blue-400 transition-colors duration-200"
          >
            📋 Manage Categories
          </Link>
        </li>
        <li>
          <Link
            to="/admin/orders"
            className="flex items-center gap-2 hover:text-blue-400 transition-colors duration-200"
          >
            📦 Orders
          </Link>
        </li>
        <li>
          <Link
            to="/admin/reports"
            className="flex items-center gap-2 hover:text-blue-400 transition-colors duration-200"
          >
            📑 Reports
          </Link>
        </li>
        <li>
          <Link
            to="/admin/profile"
            className="flex items-center gap-2 hover:text-blue-400 transition-colors duration-200"
          >
            👤 Profile
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
