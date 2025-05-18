import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { AuthContext } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useContext(AuthContext);
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState(null);

  const fetchProduct = async () => {
    try {
      const { data } = await API.get(`/products/${id}`);
      setProduct(data);
    } catch (err) {
      console.error('Fetch product error:', err);
      setError('Product not found');
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }
    if (!product) return;

    setIsAdding(true);
    try {
      // 👇👇👇 yahan sirf product.id bhejna hai
      await addToCart(product.id);
      alert('Added to cart!');
    } catch (error) {
      console.error('Add to cart error:', error);
      alert('Failed to add to cart.');
    }
    setIsAdding(false);
  };

  if (error) return <div className="text-center text-red-600 py-20">{error}</div>;
  if (!product) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-10 flex-1">
        <nav className="text-sm text-gray-500 mb-4">
          <Link to="/">Home</Link> / <Link to="/collection">Collection</Link> / {product.name}
        </nav>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid md:grid-cols-2 gap-12 bg-white p-6 rounded-lg shadow-lg"
        >
          <motion.img
            src={`http://localhost:5000/uploads/${product.image}`}
            alt={product.name}

            className="rounded-lg w-full object-cover"
            whileHover={{ scale: 1.05 }}
          />
          <div>
            <h1 className="text-4xl font-bold">{product.name}</h1>
            <p className="text-2xl text-blue-700 my-4">CAD ${product.price}</p> 
            <p className="text-lg">{product.description}</p>
            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
            >
              {isAdding ? 'Adding...' : 'Add to Cart'}
            </button>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetail;
