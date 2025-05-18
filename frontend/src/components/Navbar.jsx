import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { ShoppingCart } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        
        {/* Left - Logo */}
        <div className="flex items-center">
          <Link to="/" className="text-2xl font-bold text-blue-700">
            ECONEST
          </Link>
        </div>

        {/* Center - Menu */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-gray-600 hover:text-blue-600">Home</Link>
          <Link to="/collection" className="text-gray-600 hover:text-blue-600">Collection</Link>
          <Link to="/about" className="text-gray-600 hover:text-blue-600">About</Link>
          <Link to="/contact" className="text-gray-600 hover:text-blue-600">Contact</Link>
        </div>

        {/* Right - Auth and Cart */}
        <div className="flex items-center space-x-4">
          {!user ? (
            <>
              <Link to="/login" className="text-gray-600 hover:text-blue-600">Login</Link>
              <Link to="/register" className="text-gray-600 hover:text-blue-600">Register</Link>
            </>
          ) : (
            <>
              <Link to="/orders" className="text-gray-600 hover:text-blue-600">Orders</Link>
              <span className="text-gray-700">Hi, {user.email.split('@')[0]}</span>
              <button onClick={handleLogout} className="text-red-500 hover:underline">Logout</button>
            </>
          )}
          
          <Link to="/cart" className="relative">
            <ShoppingCart className="h-6 w-6 text-gray-700" />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-2 py-0.5">
                {cart.length}
              </span>
            )}
          </Link>
        </div>

      </div>
    </nav>
  );
}
