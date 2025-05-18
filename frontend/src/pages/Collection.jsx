// Collection.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams, Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Collection = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sort, setSort] = useState('default');
  const [visibleCount, setVisibleCount] = useState(8);
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');

  const categoryId = searchParams.get('categoryId');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const url = categoryId
          ? `http://localhost:5000/api/products?category=${categoryId}`
          : `http://localhost:5000/api/products`;
        const res = await axios.get(url);

        let sorted = res.data;
        if (sort === 'low') sorted.sort((a, b) => a.price - b.price);
        if (sort === 'high') sorted.sort((a, b) => b.price - a.price);
        if (sort === 'name') sorted.sort((a, b) => a.name.localeCompare(b.name));

        setProducts(sorted);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, [categoryId, sort]);

  useEffect(() => {
    const filtered = products.filter(p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchQuery, products]);

  return (
    <div className="bg-background text-gray-900 min-h-screen flex flex-col">
      <Navbar />

      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Products ({filteredProducts.length})</h1>
          <nav className="text-sm text-gray-500">
            <Link to="/" className="hover:underline">Home</Link> / <span className="text-gray-700 font-medium">Collection</span>
          </nav>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <div className="relative w-full md:w-1/3">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border px-4 py-2 rounded w-full"
            />
            <Search className="absolute right-3 top-3 text-gray-400" size={18} />
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border rounded px-4 py-2"
          >
            <option value="default">Sort by</option>
            <option value="low">Price: Low to High</option>
            <option value="high">Price: High to Low</option>
            <option value="name">Name: A-Z</option>
          </select>
        </div>

        {filteredProducts.length === 0 ? (
          <p>No products found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.slice(0, visibleCount).map((product) => (
              <Link
                to={`/product/${product.id}`}
                key={product.id}
                className="border rounded shadow p-4 hover:shadow-md transition block"
              >
                <img
                  src={`http://localhost:5000/uploads/${product.image}`}
                  alt={product.name}
                  className="h-48 w-full object-cover mb-2 rounded"
                />
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p className="text-blue-600 font-bold">CAD ${product.price}</p>
              </Link>
            ))}
          </div>
        )}

        {visibleCount < filteredProducts.length && (
          <div className="text-center mt-8">
            <button
              onClick={() => setVisibleCount((prev) => prev + 8)}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Load More
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Collection;
