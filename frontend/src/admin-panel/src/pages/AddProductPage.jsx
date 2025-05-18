import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddProductPage = () => {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    category_id: '',
    image: null,
    imagePreview: null,
  });

  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  // Fetch categories from backend
  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle file change for product image upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProduct({
        ...product,
        image: file,
        imagePreview: URL.createObjectURL(file),
      });
    }
  };

  // Handle form submission for product
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!product.name || !product.price || !product.quantity || !product.category_id) {
      alert('Name, price, quantity, and category are required');
      return;
    }

    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('description', product.description);
    formData.append('price', product.price);
    formData.append('quantity', product.quantity);
    formData.append('category_id', product.category_id);
    formData.append('image', product.image);

    try {
      const response = await axios.post('http://localhost:5000/api/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        alert('Product added successfully!');
        navigate('/admin/manage-products');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product. Please try again.');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Add New Product</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Product Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Product Name</label>
          <input
            type="text"
            placeholder="Product Name"
            value={product.name}
            onChange={(e) => setProduct({ ...product, name: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            placeholder="Product Description"
            value={product.description}
            onChange={(e) => setProduct({ ...product, description: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Price</label>
          <input
            type="number"
            placeholder="Price"
            value={product.price}
            onChange={(e) => setProduct({ ...product, price: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Quantity</label>
          <input
            type="number"
            placeholder="Quantity"
            value={product.quantity}
            onChange={(e) => setProduct({ ...product, quantity: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* Category Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select
            value={product.category_id}
            onChange={(e) => setProduct({ ...product, category_id: e.target.value })}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Product Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Product Image</label>
          <input type="file" onChange={handleFileChange} className="w-full p-2 border rounded" required />
          {product.imagePreview && (
            <img src={product.imagePreview} alt="Product Preview" className="w-32 h-32 object-cover rounded mt-2" />
          )}
        </div>

        {/* Submit Button */}
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProductPage;
