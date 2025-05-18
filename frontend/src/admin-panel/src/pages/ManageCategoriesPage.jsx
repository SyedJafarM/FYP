import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

// 👇 ADD YOUR BACKEND URL HERE
const BACKEND_URL = 'http://localhost:5000';

const ManageCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    image: null
  });
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/categories`);
      setCategories(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      toast.error('Failed to load categories');
      console.error('Error fetching categories:', err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const data = new FormData();
    data.append('name', formData.name);
    if (formData.image) data.append('image', formData.image);

    try {
      if (editingId) {
        await axios.put(`${BACKEND_URL}/api/categories/${editingId}`, data, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        toast.success('Category updated successfully');
      } else {
        await axios.post(`${BACKEND_URL}/api/categories`, data, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        toast.success('Category added successfully');
      }
      resetForm();
      fetchCategories();
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Operation failed';
      toast.error(errorMsg);
      console.error('Error saving category:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;

    try {
      await axios.delete(`${BACKEND_URL}/api/categories/${id}`);
      toast.success('Category deleted successfully');
      fetchCategories();
    } catch (err) {
      toast.error('Failed to delete category');
      console.error('Error deleting category:', err);
    }
  };

  const handleEdit = (category) => {
    setFormData({
      name: category.name,
      image: null
    });
    setEditingId(category.id);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      image: null
    });
    setEditingId(null);
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6">Manage Categories</h1>

      <form onSubmit={handleSubmit} className="mb-8 bg-white p-6 rounded-lg shadow">
        <div className="mb-4">
          <label className="block mb-2 font-medium">Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-medium">
            {editingId ? 'New Image (optional)' : 'Image *'}
          </label>
          <input
            type="file"
            accept="image/jpeg, image/png, image/webp"
            onChange={handleFileChange}
            className="w-full p-2 border rounded"
            required={!editingId}
          />
          <p className="text-sm text-gray-500 mt-1">
            Accepted formats: JPEG, PNG, WebP (max 5MB)
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-400"
          >
            {isLoading ? 'Processing...' : editingId ? 'Update Category' : 'Add Category'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map(category => (
          <div key={category.id} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="h-48 bg-gray-100 overflow-hidden">
              {category.image && (
                <img
                  src={`${BACKEND_URL}/uploads/${category.image}`}
                  alt={category.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = '/placeholder-image.jpg';
                  }}
                />
              )}
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg mb-3">{category.name}</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(category)}
                  className="text-sm bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
                  className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageCategoriesPage;
