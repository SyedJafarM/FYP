import React, { useEffect, useState } from 'react';
import API from '../../../api/axios';

const AdminProfilePage = () => {
  const [admin, setAdmin] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const adminId = localStorage.getItem('adminId');

  useEffect(() => {
    if (!adminId) return;
    API.get(`/admin/${adminId}`)
      .then(res => {
        setAdmin(res.data);
        setName(res.data.name || '');
        setEmail(res.data.email || '');
      })
      .catch(() => alert('Failed to load profile'));
  }, [adminId]);

  const handleUpdateProfile = () => {
    if (!name || !email) return alert('Name and email are required');
    API.put(`/admin/${adminId}`, { name, email })
      .then(res => {
        alert('✅ Profile updated');
        setAdmin(res.data);
      })
      .catch(() => alert('❌ Update failed'));
  };

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword) return alert('Both fields are required');
    API.put(`/admin/change-password/${adminId}`, { currentPassword, newPassword })
      .then(() => {
        alert('✅ Password changed');
        setCurrentPassword('');
        setNewPassword('');
      })
      .catch((err) => {
        alert(err.response?.data?.message || '❌ Password change failed');
      });
  };

  if (!adminId) return <div className="p-6 text-red-600">Admin not logged in</div>;
  if (!admin) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 space-y-6 max-w-xl">
      <h2 className="text-2xl font-bold">Admin Profile</h2>

      <div className="space-y-4">
        <div>
          <label className="block font-medium">Name</label>
          <input
            className="border p-2 w-full rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label className="block font-medium">Email</label>
          <input
            className="border p-2 w-full rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button onClick={handleUpdateProfile} className="bg-blue-600 text-white px-4 py-2 rounded">
          Update Profile
        </button>
      </div>

      <div className="pt-8 border-t">
        <h3 className="text-xl font-semibold mb-2">Change Password</h3>
        <input
          className="border p-2 w-full mb-2 rounded"
          type="password"
          placeholder="Current Password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
        <input
          className="border p-2 w-full mb-4 rounded"
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button onClick={handleChangePassword} className="bg-green-600 text-white px-4 py-2 rounded">
          Change Password
        </button>
      </div>
    </div>
  );
};

export default AdminProfilePage;
