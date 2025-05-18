import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const EditProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    category_id: '',
    image: null,
    imagePreview: null
  });

  const [categories, setCategories] = useState([]);

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/products/${id}`);
        console.log('Product Data:', response.data);

        const productData = Array.isArray(response.data) ? response.data[0] : response.data;

        setProduct({
          ...productData,
          imagePreview: productData.image ? `http://localhost:5000/uploads/${productData.image}` : null
        });
      } catch (error) {
        console.error('Error fetching product:', error);
        alert('Failed to fetch product. Please try again.');
      }
    };

    fetchProduct();
  }, [id]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  // Handle file change for image upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProduct({
        ...product,
        image: file,
        imagePreview: URL.createObjectURL(file)
      });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('description', product.description);
    formData.append('price', product.price);
    formData.append('quantity', product.quantity);
    formData.append('category_id', product.category_id);
    if (product.image) {
      formData.append('image', product.image);
    }

    try {
      const response = await axios.put(`http://localhost:5000/api/products/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.status === 200) {
        alert('Product updated successfully!');
        navigate('/admin/manage-products');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product. Please try again.');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Product</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
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

        {/* Category Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select
            value={product.category_id}
            onChange={(e) => setProduct({ ...product, category_id: e.target.value })}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Product Image</label>
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full p-2 border rounded"
          />
          {product.imagePreview && (
            <div className="mt-4">
              <img src={product.imagePreview} alt="Product Preview" className="w-32 h-32 object-cover rounded" />
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Update Product
        </button>
      </form>
    </div>
  );
};

export default EditProductPage;
