
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import CategoryCircles from './components/CategoryCircles';
import ProductCard from './components/ProductCard';
import { MessageCircle } from 'lucide-react';
import { getProducts, getSettings } from './services/api';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import Cart from './pages/Cart';
import Shop from './pages/Shop';
import Checkout from './pages/Checkout';
import { CartProvider } from './context/CartContext';
import ProductDetail from './pages/ProductDetail';
import OrderSuccess from './pages/OrderSuccess';
import Login from './pages/Login';
import Register from './pages/Register';
import MyOrders from './pages/MyOrders';
import DynamicPage from './pages/DynamicPage';
import ContactUs from './pages/ContactUs';
import { HelmetProvider } from 'react-helmet-async';

function App() {
  const [products, setProducts] = useState([]);
  const [settings, setSettings] = useState({});
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const prodData = await getProducts();
      const setData = await getSettings();
      setProducts(prodData);
      setSettings(setData);
      setLoading(false);
    };

    const fetchPages = async () => {
      try {
        const res = await fetch('https://brozento-backend.vercel.app/api/pages');
        const data = await res.json();
        setPages(data);
      } catch (error) {
        console.error("Error fetching pages:", error);
      }
    };

    fetchData();
    fetchPages();
  }, []);

  return (
    <HelmetProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen bg-white font-sans">
            <Routes>
              {/* Main Website Route */}
              <Route path="/" element={
                <>
                  <Navbar />
                  <HeroSection />
                  <CategoryCircles />

                  <div className="container mx-auto px-4 py-12 mb-10">
                    <div className="flex justify-between items-end mb-8 border-b pb-4">
                      <div>
                        <h2 className="text-3xl font-extrabold text-brozentoDark">
                          Trending Products
                        </h2>
                        <p className="text-gray-500 mt-1">
                          Our most loved restaurant-grade masalas
                        </p>
                      </div>
                      <Link to="/shop" className="border-2 border-brozentoDark text-brozentoDark px-5 py-2 rounded-lg font-bold hover:bg-brozentoDark hover:text-white transition text-sm hidden sm:block">
                        View All
                      </Link>
                    </div>

                    {loading ? (
                      <p className="text-center text-gray-500 py-10">
                        Loading products...
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {products.map((prod) => (
                          <ProductCard
                            key={prod._id}
                            id={prod._id}
                            title={prod.title}
                            price={`Rs ${prod.price}`}
                            oldPrice={`Rs ${prod.oldPrice}`}
                            discount={prod.discount}
                            image={prod.image}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* FOOTER WITH DYNAMIC PAGES */}
                  <footer className="bg-brozentoDark text-white py-12 text-center">
                    <div className="container mx-auto px-4">
                      <h2 className="text-3xl font-extrabold mb-4 tracking-tight">
                        {settings.siteName || "BROZENTO"}
                      </h2>
                      <p className="text-gray-400 mb-6">
                        Delivering premium restaurant masalas across Pakistan.
                      </p>

                      <div className="flex flex-wrap justify-center gap-6 mb-8">
                        {pages.map((page) => (
                          <Link
                            key={page._id}
                            to={`/page/${page.slug}`}
                            className="text-gray-300 hover:text-white transition font-medium text-sm"
                          >
                            {page.title}
                          </Link>
                        ))}
                      </div>

                      <p className="text-sm text-gray-500 border-t border-gray-800 pt-6">
                        © 2026 Brozento Pakistan. All Rights Reserved. 100% Advance Payment Policy.
                      </p>
                    </div>
                  </footer>

                  <a
                    href={`https://wa.me/${settings.whatsappNumber || '923001234567'}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="fixed bottom-6 left-6 bg-[#25D366] text-white px-5 py-3 rounded-full shadow-2xl flex items-center gap-2 font-bold hover:bg-[#128C7E] transition z-50"
                  >
                    <MessageCircle size={24} /> Order on WhatsApp
                  </a>
                </>
              } />

              {/* SHOP PAGE ROUTE */}
              <Route path="/shop" element={<Shop />} />

              {/* PRODUCT DETAIL ROUTE */}
              <Route path="/product/:id" element={<ProductDetail />} />

              {/* CART PAGE ROUTE */}
              <Route path="/cart" element={<Cart />} />

              {/* CHECKOUT PAGE ROUTE */}
              <Route path="/checkout" element={<Checkout />} />

              {/* ORDER SUCCESS ROUTE */}
              <Route path="/order-success" element={<OrderSuccess />} />

              {/* CUSTOMER LOGIN/REGISTER ROUTES */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* MY ORDERS ROUTE */}
              <Route path="/my-orders" element={<MyOrders />} />

              {/* DYNAMIC PAGES ROUTE */}
              <Route path="/page/:slug" element={<DynamicPage />} />

              {/* CONTACT US ROUTE */}
              <Route path="/contact" element={<ContactUs />} />

              {/* ADMIN LOGIN ROUTE */}
              <Route path="/admin" element={<AdminLogin />} />

              {/* ADMIN DASHBOARD ROUTE */}
              <Route path="/admin/dashboard" element={<AdminDashboard />} />

            </Routes>
          </div>
        </Router>
      </CartProvider>
    </HelmetProvider>
  );
}

export default App;
