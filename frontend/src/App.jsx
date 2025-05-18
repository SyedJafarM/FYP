import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";

import Home from "./pages/Home";
import Collection from "./pages/Collection";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import About from "./pages/About";
import Contact from "./pages/Contact";
import PlaceOrder from "./pages/PlaceOrder";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Orders from "./pages/Orders";
import OrderConfirmation from "./pages/OrderConfirmation";

import AdminPanel from "./admin-panel/src/App";
import { useAuth } from "./contexts/AuthContext";

// User-side protected route (kept for regular user auth)
function PrivateRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <div className="text-center py-20">Loading...</div>;
  return isAuthenticated ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/collection" element={<Collection />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* User Protected Routes */}
            <Route path="/cart" element={<PrivateRoute><Cart /></PrivateRoute>} />
            <Route path="/place-order" element={<PrivateRoute><PlaceOrder /></PrivateRoute>} />
            <Route path="/order-confirmation/:id" element={<PrivateRoute><OrderConfirmation /></PrivateRoute>} />
            <Route path="/orders" element={<PrivateRoute><Orders /></PrivateRoute>} />

            {/* Admin Routes - Now completely open */}
            <Route path="/admin/*" element={<AdminPanel />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}