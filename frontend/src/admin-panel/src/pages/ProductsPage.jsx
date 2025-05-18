import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);

  // Fetch products
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

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product.id} className="border rounded-lg p-4 shadow-lg bg-white">
            <img
              src={`http://localhost:5000/uploads/${product.image}`}
              alt={product.name}
              className="w-full h-48 object-cover mb-4 rounded-md"
            />
            <h2 className="text-xl font-semibold">{product.name}</h2>
            <p className="text-gray-600">{product.description}</p>
            <p className="text-lg font-bold mt-2">PKR {product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;