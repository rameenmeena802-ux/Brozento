import React, { useEffect, useState } from 'react';
import { Search, Heart, ShoppingCart, Menu, User, LogOut, Package } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { getSettings } from '../services/api';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const [settings, setSettings] = useState({});
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { getCartCount } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    getSettings().then(data => setSettings(data));
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/shop?search=${searchTerm}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b">
      
      {/* MARQUEE NOTIFICATION BAR - DYNAMIC COLORS */}
      <div 
        className="py-1.5 overflow-hidden"
        style={{ 
          backgroundColor: settings.topBarBgColor || '#1a1a1a', 
          color: settings.topBarTextColor || '#ffffff' 
        }}
      >
        <div className="marquee-container">
          <div className="marquee-text font-medium text-xs tracking-wide">
            {settings.topBarText || "100% Advance Payment • Free Delivery All Over Pakistan"}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button className="lg:hidden text-brozentoDark"><Menu size={24} /></button>
          <Link to="/" className="flex items-center gap-2">
            {settings.logoUrl ? (
              <img src={settings.logoUrl} alt="Logo" className="h-10" />
            ) : (
              <div className="w-10 h-10 bg-brozentoRed rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md">B</div>
            )}
            <h1 className="text-2xl font-extrabold text-brozentoDark tracking-tight hidden sm:block">{settings.siteName || "BROZENTO"}</h1>
          </Link>
        </div>

    

        <nav className="hidden lg:flex items-center gap-8 font-semibold text-gray-700 text-sm">
          <Link to="/" className="hover:text-brozentoRed transition">Home</Link>
          <Link to="/shop" className="hover:text-brozentoRed transition">Shop All</Link>
          <Link to="/contact" className="hover:text-brozentoRed transition">Contact</Link> {/* YEH NAYA HAI */}
        </nav>

        <div className="flex items-center gap-4">
          <form onSubmit={handleSearch} className="hidden md:flex items-center bg-gray-100 rounded-full px-3 py-2 w-64 border border-transparent focus-within:border-brozentoRed transition">
            <Search size={18} className="text-gray-500" />
            <input 
              type="text" 
              placeholder="Search masalas..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent outline-none ml-2 w-full text-sm text-gray-700" 
            />
          </form>
          
          {user ? (
            <div className="flex items-center gap-2">
              <Link to="/my-orders" className="text-gray-600 hover:text-brozentoRed hidden sm:block" title="My Orders">
                <Package size={22} />
              </Link>
              <span className="text-sm font-semibold text-gray-700 hidden sm:block">Hi, {user.name.split(' ')[0]}</span>
              <button onClick={handleLogout} className="text-gray-600 hover:text-brozentoRed">
                <LogOut size={22} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="text-gray-600 hover:text-brozentoRed hidden sm:block">
              <User size={22} />
            </Link>
          )}

          <button className="text-gray-600 hover:text-brozentoRed relative"><Heart size={22} /></button>
          
          <Link to="/cart" className="relative text-gray-600 hover:text-brozentoRed">
            <ShoppingCart size={22} />
            <span className="absolute -top-2 -right-2 bg-brozentoRed text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
              {getCartCount()}
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;