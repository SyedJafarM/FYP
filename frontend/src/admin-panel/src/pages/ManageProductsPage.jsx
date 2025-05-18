import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ManageProductsPage = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`http://localhost:5000/api/products/${productId}`);
        setProducts(products.filter(product => product.id !== productId));
        alert('Product deleted successfully!');
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product. Please try again.');
      }
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Products</h1>
      <Link to="/admin/add-product" className="bg-blue-500 text-white px-4 py-2 rounded mb-4 inline-block">
        Add Product
      </Link>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">Name</th>
              <th className="p-2">Description</th>
              <th className="p-2">Price</th>
              <th className="p-2">Quantity</th>
              <th className="p-2">Category</th>
              <th className="p-2">Image</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id} className="border-b">
                <td className="p-2">{product.name}</td>
                <td className="p-2">{product.description}</td>
                <td className="p-2">CAD {product.price.toLocaleString()}</td>
                <td className="p-2">{product.quantity}</td>
                <td className="p-2">{product.category_name}</td>
                <td className="p-2">
                  <img 
                    src={`http://localhost:5000/uploads/${product.image}`} 
                    alt={product.name} 
                    className="w-16 h-16 object-cover rounded"
                  />
                </td>
                <td className="p-2">
                  <Link 
                    to={`/admin/edit-product/${product.id}`} 
                    className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                  >
                    Edit
                  </Link>
                  <button 
                    onClick={() => handleDelete(product.id)} 
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageProductsPage;