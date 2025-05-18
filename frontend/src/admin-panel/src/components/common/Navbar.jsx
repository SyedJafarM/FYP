import React from 'react';

const Navbar = () => {
  return (
    <div className="bg-white shadow p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="Search..."
          className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="text-gray-700 font-semibold">Admin</div>
      </div>
    </div>
  );
};

export default Navbar;
