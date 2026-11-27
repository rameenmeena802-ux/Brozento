import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, PlusCircle, Edit, Trash2, X, ShoppingBag, Package, Truck, Settings as SettingsIcon, Layers, Upload, FileText, Mail, Star, BarChart3 } from 'lucide-react';

const AdminDashboard = () => {
  // Default tab ab 'dashboard' hai
  const [activeTab, setActiveTab] = useState('dashboard');

  // Dashboard Stats State
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalProducts: 0,
    totalCustomers: 0
  });

  // Product States
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [oldPrice, setOldPrice] = useState('');
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [video, setVideo] = useState(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [category, setCategory] = useState('Special');
  const [uploading, setUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  // Order States
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  // Shipping (City) States
  const [cities, setCities] = useState([]);
  const [cityName, setCityName] = useState('');
  const [deliveryCharge, setDeliveryCharge] = useState('');

  // Category States
  const [categories, setCategories] = useState([]);
  const [catName, setCatName] = useState('');
  const [catImage, setCatImage] = useState('');

  // Page States
  const [pages, setPages] = useState([]);
  const [pageTitle, setPageTitle] = useState('');
  const [pageSlug, setPageSlug] = useState('');
  const [pageContent, setPageContent] = useState('');
  const [editPageId, setEditPageId] = useState(null);

  // Message States
  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(true);

  // Review States
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  // Settings States
  const [siteSettings, setSiteSettings] = useState({
    siteName: '',
    logoUrl: '',
    topBarText: '',
    topBarBgColor: '#1a1a1a',
    topBarTextColor: '#ffffff',
    heroTitle: '',
    heroSubtitle: '',
    heroTitleColor: '#ffffff',
    heroBgColor: '#c40000',
    heroImages: [],
    heroVideoUrl: '',
    whatsappNumber: ''
  });

  const navigate = useNavigate();
  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    if (!token) {
      navigate('/admin');
    } else {
      fetchStats();
      fetchProducts();
      fetchOrders();
      fetchCities();
      fetchCategories();
      fetchPages();
      fetchMessages();
      fetchReviews();
      fetchSettings();
    }
  }, [token, navigate]);

  const fetchStats = async () => {
    try {
      const res = await fetch('https://brozento-backend.vercel.app/api/analytics');
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch('https://brozento-backend.vercel.app/api/products');
      const data = await res.json();
      setProducts(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch('https://brozento-backend.vercel.app/api/orders');
      const data = await res.json();
      setOrders(data);
      setOrdersLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCities = async () => {
    try {
      const res = await fetch('https://brozento-backend.vercel.app/api/cities');
      const data = await res.json();
      setCities(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('https://brozento-backend.vercel.app/api/categories');
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchPages = async () => {
    try {
      const res = await fetch('https://brozento-backend.vercel.app/api/pages');
      const data = await res.json();
      setPages(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await fetch('https://brozento-backend.vercel.app/api/contact');
      const data = await res.json();
      setMessages(data);
      setMessagesLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await fetch('https://brozento-backend.vercel.app/api/reviews');
      const data = await res.json();
      setReviews(data);
      setReviewsLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch('https://brozento-backend.vercel.app/api/settings');
      const data = await res.json();
      setSiteSettings(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin');
  };

  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);
    try {
      const res = await fetch('https://brozento-backend.vercel.app/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Upload failed');
      setUploading(false);
      return data.imageUrl;
    } catch (error) {
      alert(`Upload Error: ${error.message}`);
      setUploading(false);
      return null;
    }
  };

  const resetForm = () => {
    setTitle(''); setPrice(''); setOldPrice(''); setImage(null); setImageUrl(''); setVideo(null); setVideoUrl('');
    setIsEditing(false);
    setEditId(null);
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!image && !imageUrl && !video && !videoUrl && !isEditing) {
      alert('Please select an image or video');
      return;
    }

    let finalImageUrl = imageUrl;
    let finalVideoUrl = videoUrl;

    if (image) {
      finalImageUrl = await uploadImageToCloudinary(image);
      if (!finalImageUrl) return;
    }
    if (video) {
      finalVideoUrl = await uploadImageToCloudinary(video);
      if (!finalVideoUrl) return;
    }

    let discountStr = "";
    if (oldPrice && price && oldPrice > price) {
      discountStr = `-${Math.round(((oldPrice - price) / oldPrice) * 100)}%`;
    }

    const productData = {
      title,
      price: Number(price),
      oldPrice: Number(oldPrice) || 0,
      discount: discountStr,
      image: finalImageUrl,
      video: finalVideoUrl,
      category,
    };

    try {
      const url = isEditing ? `https://brozento-backend.vercel.app/api/products/${editId}` : 'https://brozento-backend.vercel.app/api/products';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });

      if (res.ok) {
        alert(isEditing ? 'Product Updated Successfully!' : 'Product Added Successfully!');
        resetForm();
        fetchProducts();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await fetch(`https://brozento-backend.vercel.app/api/products/${id}`, { method: 'DELETE' });
        fetchProducts();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleEdit = (product) => {
    setIsEditing(true);
    setEditId(product._id);
    setTitle(product.title);
    setPrice(product.price);
    setOldPrice(product.oldPrice);
    setImageUrl(product.image);
    setVideoUrl(product.video);
    setCategory(product.category);
    window.scrollTo(0, 0);
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await fetch(`https://brozento-backend.vercel.app/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchOrders();
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddCity = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('https://brozento-backend.vercel.app/api/cities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cityName, deliveryCharge: Number(deliveryCharge) }),
      });
      
      if (res.ok) {
        alert('City Added!');
        setCityName('');
        setDeliveryCharge('');
        fetchCities();
      } else {
        const data = await res.json();
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteCity = async (id) => {
    if (window.confirm("Delete this city?")) {
      await fetch(`https://brozento-backend.vercel.app/api/cities/${id}`, { method: 'DELETE' });
      fetchCities();
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('https://brozento-backend.vercel.app/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: catName, image: catImage }),
      });
      if (res.ok) {
        alert('Category Added!');
        setCatName('');
        setCatImage('');
        fetchCategories();
      } else {
        const data = await res.json();
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm("Delete this category?")) {
      await fetch(`https://brozento-backend.vercel.app/api/categories/${id}`, { method: 'DELETE' });
      fetchCategories();
    }
  };

  const handleAddPage = async (e) => {
    e.preventDefault();
    try {
      const method = editPageId ? 'PUT' : 'POST';
      const url = editPageId
        ? `https://brozento-backend.vercel.app/api/pages/${editPageId}`
        : 'https://brozento-backend.vercel.app/api/pages';

      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: pageTitle, slug: pageSlug, content: pageContent }),
      });

      if (res.ok) {
        alert(editPageId ? 'Page Updated!' : 'Page Added!');
        setPageTitle(''); setPageSlug(''); setPageContent(''); setEditPageId(null);
        fetchPages();
      } else {
        const data = await res.json();
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeletePage = async (id) => {
    if (window.confirm("Delete this page?")) {
      await fetch(`https://brozento-backend.vercel.app/api/pages/${id}`, { method: 'DELETE' });
      fetchPages();
    }
  };

  const handleEditPage = (page) => {
    setEditPageId(page._id);
    setPageTitle(page.title);
    setPageSlug(page.slug);
    setPageContent(page.content);
    window.scrollTo(0, 0);
  };

  const handleDeleteMessage = async (id) => {
    if (window.confirm("Delete this message?")) {
      await fetch(`https://brozento-backend.vercel.app/api/contact/${id}`, { method: 'DELETE' });
      fetchMessages();
    }
  };

  const handleDeleteReview = async (id) => {
    if (window.confirm("Delete this review?")) {
      await fetch(`https://brozento-backend.vercel.app/api/reviews/${id}`, { method: 'DELETE' });
      fetchReviews();
    }
  };

  const handleUpdateSettings = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('https://brozento-backend.vercel.app/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(siteSettings),
      });
      if (res.ok) {
        alert('Settings Updated Successfully!');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <nav className="bg-white shadow-sm border-b px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-extrabold text-brozentoDark">Brozento Admin</h1>
        <button onClick={handleLogout} className="flex items-center gap-2 text-red-600 font-semibold hover:text-red-800">
          <LogOut size={18} /> Logout
        </button>
      </nav>

      {/* TABS */}
      <div className="container mx-auto px-6 pt-6 flex gap-4 border-b overflow-x-auto">
        {/* DASHBOARD TAB */}
        <button onClick={() => setActiveTab('dashboard')} className={`pb-3 px-2 font-bold flex items-center gap-2 whitespace-nowrap ${activeTab === 'dashboard' ? 'text-brozentoRed border-b-2 border-brozentoRed' : 'text-gray-500'}`}>
          <BarChart3 size={20} /> Dashboard
        </button>
        <button onClick={() => setActiveTab('products')} className={`pb-3 px-2 font-bold flex items-center gap-2 whitespace-nowrap ${activeTab === 'products' ? 'text-brozentoRed border-b-2 border-brozentoRed' : 'text-gray-500'}`}>
          <Package size={20} /> Products
        </button>
        <button onClick={() => setActiveTab('orders')} className={`pb-3 px-2 font-bold flex items-center gap-2 whitespace-nowrap ${activeTab === 'orders' ? 'text-brozentoRed border-b-2 border-brozentoRed' : 'text-gray-500'}`}>
          <ShoppingBag size={20} /> Orders ({orders.length})
        </button>
        <button onClick={() => setActiveTab('shipping')} className={`pb-3 px-2 font-bold flex items-center gap-2 whitespace-nowrap ${activeTab === 'shipping' ? 'text-brozentoRed border-b-2 border-brozentoRed' : 'text-gray-500'}`}>
          <Truck size={20} /> Shipping
        </button>
        <button onClick={() => setActiveTab('categories')} className={`pb-3 px-2 font-bold flex items-center gap-2 whitespace-nowrap ${activeTab === 'categories' ? 'text-brozentoRed border-b-2 border-brozentoRed' : 'text-gray-500'}`}>
          <Layers size={20} /> Categories
        </button>
        <button onClick={() => setActiveTab('pages')} className={`pb-3 px-2 font-bold flex items-center gap-2 whitespace-nowrap ${activeTab === 'pages' ? 'text-brozentoRed border-b-2 border-brozentoRed' : 'text-gray-500'}`}>
          <FileText size={20} /> Pages
        </button>
        <button onClick={() => setActiveTab('messages')} className={`pb-3 px-2 font-bold flex items-center gap-2 whitespace-nowrap ${activeTab === 'messages' ? 'text-brozentoRed border-b-2 border-brozentoRed' : 'text-gray-500'}`}>
          <Mail size={20} /> Messages ({messages.length})
        </button>
        <button onClick={() => setActiveTab('reviews')} className={`pb-3 px-2 font-bold flex items-center gap-2 whitespace-nowrap ${activeTab === 'reviews' ? 'text-brozentoRed border-b-2 border-brozentoRed' : 'text-gray-500'}`}>
          <Star size={20} /> Reviews ({reviews.length})
        </button>
        <button onClick={() => setActiveTab('settings')} className={`pb-3 px-2 font-bold flex items-center gap-2 whitespace-nowrap ${activeTab === 'settings' ? 'text-brozentoRed border-b-2 border-brozentoRed' : 'text-gray-500'}`}>
          <SettingsIcon size={20} /> Settings
        </button>
      </div>

      {/* DASHBOARD TAB CONTENT */}
      {activeTab === 'dashboard' && (
        <div className="container mx-auto p-6">
          <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <p className="text-gray-500 text-sm font-semibold">Total Sales</p>
              <h3 className="text-3xl font-extrabold text-brozentoRed mt-2">Rs {stats.totalSales}</h3>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <p className="text-gray-500 text-sm font-semibold">Total Orders</p>
              <h3 className="text-3xl font-extrabold text-blue-600 mt-2">{stats.totalOrders}</h3>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <p className="text-gray-500 text-sm font-semibold">Pending Orders</p>
              <h3 className="text-3xl font-extrabold text-yellow-600 mt-2">{stats.pendingOrders}</h3>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <p className="text-gray-500 text-sm font-semibold">Total Products</p>
              <h3 className="text-3xl font-extrabold text-green-600 mt-2">{stats.totalProducts}</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-lg mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-gray-600">Total Customers</span>
                  <span className="font-bold text-brozentoDark">{stats.totalCustomers}</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-gray-600">Pending Orders</span>
                  <span className="font-bold text-yellow-600">{stats.pendingOrders}</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-gray-600">Delivered Orders</span>
                  <span className="font-bold text-green-600">{stats.totalOrders - stats.pendingOrders}</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-lg mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setActiveTab('products')} className="bg-blue-50 text-blue-700 p-4 rounded-lg font-semibold hover:bg-blue-100 transition text-center">
                  Add Product
                </button>
                <button onClick={() => setActiveTab('orders')} className="bg-yellow-50 text-yellow-700 p-4 rounded-lg font-semibold hover:bg-yellow-100 transition text-center">
                  View Orders
                </button>
                <button onClick={() => setActiveTab('pages')} className="bg-purple-50 text-purple-700 p-4 rounded-lg font-semibold hover:bg-purple-100 transition text-center">
                  Add Page
                </button>
                <button onClick={() => setActiveTab('settings')} className="bg-gray-100 text-gray-700 p-4 rounded-lg font-semibold hover:bg-gray-200 transition text-center">
                  Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PRODUCTS TAB */}
      {activeTab === 'products' && (
        <div className="container mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-md h-max sticky top-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                {isEditing ? <Edit size={20} /> : <PlusCircle size={20} />} 
                {isEditing ? 'Edit Product' : 'Add New Product'}
              </h2>
              {isEditing && (
                <button onClick={resetForm} className="text-gray-500 hover:text-red-500"><X size={20} /></button>
              )}
            </div>

            <form onSubmit={handleAddProduct} className="space-y-4">
              <input type="text" placeholder="Product Title" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full px-3 py-2 border rounded" />
              <div className="grid grid-cols-2 gap-2">
                <input type="number" placeholder="Price (Rs)" value={price} onChange={(e) => setPrice(e.target.value)} required className="w-full px-3 py-2 border rounded" />
                <input type="number" placeholder="Old Price" value={oldPrice} onChange={(e) => setOldPrice(e.target.value)} className="w-full px-3 py-2 border rounded" />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Upload Image</label>
                <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} className="w-full text-sm" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Upload Video</label>
                <input type="file" accept="video/*" onChange={(e) => setVideo(e.target.files[0])} className="w-full text-sm" />
              </div>
              
              <button type="submit" disabled={uploading} className={`w-full text-white font-bold py-2 rounded transition disabled:bg-gray-400 ${isEditing ? 'bg-blue-600 hover:bg-blue-700' : 'bg-brozentoRed hover:bg-red-700'}`}>
                {uploading ? 'Uploading...' : isEditing ? 'Update Product' : 'Add Product'}
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-bold mb-4">All Products ({products.length})</h2>
            {loading ? <p>Loading...</p> : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-100 border-b">
                      <th className="p-3 text-sm font-semibold">Media</th>
                      <th className="p-3 text-sm font-semibold">Title</th>
                      <th className="p-3 text-sm font-semibold">Price</th>
                      <th className="p-3 text-sm font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((prod) => (
                      <tr key={prod._id} className="border-b hover:bg-gray-50">
                        <td className="p-3">
                          {prod.image ? <img src={prod.image} alt="" className="w-12 h-12 object-cover rounded" /> : <span className="text-xs text-gray-400">No Image</span>}
                        </td>
                        <td className="p-3 font-medium">{prod.title}</td>
                        <td className="p-3 text-brozentoRed font-bold">Rs {prod.price}</td>
                        <td className="p-3 flex gap-2">
                          <button onClick={() => handleEdit(prod)} className="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"><Edit size={16} /></button>
                          <button onClick={() => handleDelete(prod._id)} className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200"><Trash2 size={16} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ORDERS TAB */}
      {activeTab === 'orders' && (
        <div className="container mx-auto p-6">
          <h2 className="text-2xl font-bold mb-6">Recent Orders</h2>
          {ordersLoading ? <p>Loading orders...</p> : orders.length === 0 ? <p className="text-gray-500">No orders yet.</p> : (
            <div className="grid grid-cols-1 gap-4">
              {orders.map((order) => (
                <div key={order._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex flex-col md:flex-row justify-between mb-4 border-b pb-4 gap-4">
                    <div>
                      <h3 className="font-bold text-lg text-brozentoDark">Order #{order._id.slice(-6).toUpperCase()}</h3>
                      <p className="text-sm text-gray-500">Date: {new Date(order.createdAt).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{order.customerName}</p>
                      <p className="text-sm text-gray-500">{order.phone} | {order.city}</p>
                      <p className="text-sm text-gray-500">{order.address}</p>
                    </div>
                    <div>
                      <p className="font-bold text-brozentoRed text-xl">Rs {order.totalAmount}</p>
                      <p className="text-sm font-semibold text-gray-600">Payment: {order.paymentMethod}</p>
                    </div>
                    <div>
                      <select value={order.orderStatus} onChange={(e) => updateOrderStatus(order._id, e.target.value)} className="border p-2 rounded-lg bg-gray-50 font-semibold text-sm">
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg">
                        {item.image && <img src={item.image} alt="" className="w-10 h-10 object-cover rounded" />}
                        <div>
                          <p className="text-sm font-semibold">{item.title}</p>
                          <p className="text-xs text-gray-500">Qty: {item.quantity} x Rs {item.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {order.paymentScreenshot && (
                    <div className="mt-4 bg-blue-50 p-3 rounded-lg border border-blue-200">
                      <p className="text-sm font-semibold text-gray-700 mb-2">Payment Screenshot:</p>
                      <a href={order.paymentScreenshot} target="_blank" rel="noopener noreferrer">
                        <img src={order.paymentScreenshot} alt="Payment Screenshot" className="w-32 h-32 object-cover rounded-lg border-2 border-blue-400 shadow-sm hover:opacity-80 transition" />
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SHIPPING TAB */}
      {activeTab === 'shipping' && (
        <div className="container mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-md h-max sticky top-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><PlusCircle size={20} /> Add New City</h2>
            <form onSubmit={handleAddCity} className="space-y-4">
              <input type="text" placeholder="City Name (e.g. Karachi)" value={cityName} onChange={(e) => setCityName(e.target.value)} required className="w-full px-3 py-2 border rounded" />
              <input type="number" placeholder="Delivery Charge (Rs)" value={deliveryCharge} onChange={(e) => setDeliveryCharge(e.target.value)} required className="w-full px-3 py-2 border rounded" />
              <button type="submit" className="w-full bg-brozentoRed text-white font-bold py-2 rounded hover:bg-red-700 transition">Add City</button>
            </form>
          </div>

          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-bold mb-4">Delivery Charges by City ({cities.length})</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100 border-b">
                    <th className="p-3 text-sm font-semibold">City</th>
                    <th className="p-3 text-sm font-semibold">Delivery Charge</th>
                    <th className="p-3 text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cities.map((city) => (
                    <tr key={city._id} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium">{city.cityName}</td>
                      <td className="p-3 font-bold text-brozentoRed">Rs {city.deliveryCharge}</td>
                      <td className="p-3">
                        <button onClick={() => handleDeleteCity(city._id)} className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200"><Trash2 size={16} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* CATEGORIES TAB */}
      {activeTab === 'categories' && (
        <div className="container mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-md h-max sticky top-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><PlusCircle size={20} /> Add New Category</h2>
            <form onSubmit={handleAddCategory} className="space-y-4">
              <input type="text" placeholder="Category Name (e.g. Broast)" value={catName} onChange={(e) => setCatName(e.target.value)} required className="w-full px-3 py-2 border rounded" />
              <div className="flex gap-2">
                <input type="text" placeholder="Category Image URL (Optional)" value={catImage} onChange={(e) => setCatImage(e.target.value)} className="w-full px-3 py-2 border rounded" />
                <label className="bg-gray-200 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-300 flex items-center justify-center">
                  <Upload size={18} />
                  <input type="file" className="hidden" accept="image/*" onChange={async (e) => {
                    if(e.target.files[0]) {
                      const url = await uploadImageToCloudinary(e.target.files[0]);
                      if(url) setCatImage(url);
                    }
                  }} />
                </label>
              </div>
              <button type="submit" className="w-full bg-brozentoRed text-white font-bold py-2 rounded hover:bg-red-700 transition">Add Category</button>
            </form>
          </div>

          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-bold mb-4">All Categories ({categories.length})</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100 border-b">
                    <th className="p-3 text-sm font-semibold">Name</th>
                    <th className="p-3 text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat) => (
                    <tr key={cat._id} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium">{cat.name}</td>
                      <td className="p-3">
                        <button onClick={() => handleDeleteCategory(cat._id)} className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200"><Trash2 size={16} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* PAGES TAB */}
      {activeTab === 'pages' && (
        <div className="container mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-md h-max sticky top-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <PlusCircle size={20} /> {editPageId ? 'Edit Page' : 'Add New Page'}
            </h2>
            <form onSubmit={handleAddPage} className="space-y-4">
              <input type="text" placeholder="Page Title (e.g. About Us)" value={pageTitle} onChange={(e) => setPageTitle(e.target.value)} required className="w-full px-3 py-2 border rounded" />
              <input type="text" placeholder="Page URL (e.g. about-us)" value={pageSlug} onChange={(e) => setPageSlug(e.target.value)} required className="w-full px-3 py-2 border rounded" />
              <textarea placeholder="Page Content (HTML ya Text likhein)" value={pageContent} onChange={(e) => setPageContent(e.target.value)} required rows="6" className="w-full px-3 py-2 border rounded"></textarea>
              
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-brozentoRed text-white font-bold py-2 rounded hover:bg-red-700 transition">
                  {editPageId ? 'Update Page' : 'Add Page'}
                </button>
                {editPageId && (
                  <button type="button" onClick={() => { setEditPageId(null); setPageTitle(''); setPageSlug(''); setPageContent(''); }} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-bold mb-4">All Pages ({pages.length})</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100 border-b">
                    <th className="p-3 text-sm font-semibold">Title</th>
                    <th className="p-3 text-sm font-semibold">URL</th>
                    <th className="p-3 text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pages.map((page) => (
                    <tr key={page._id} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium">{page.title}</td>
                      <td className="p-3 text-gray-500">/{page.slug}</td>
                      <td className="p-3 flex gap-2">
                        <button onClick={() => handleEditPage(page)} className="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"><Edit size={16} /></button>
                        <button onClick={() => handleDeletePage(page._id)} className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200"><Trash2 size={16} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MESSAGES TAB */}
      {activeTab === 'messages' && (
        <div className="container mx-auto p-6">
          <h2 className="text-2xl font-bold mb-6">Contact Messages</h2>
          {messagesLoading ? <p>Loading messages...</p> : messages.length === 0 ? <p className="text-gray-500">No messages yet.</p> : (
            <div className="grid grid-cols-1 gap-4">
              {messages.map((msg) => (
                <div key={msg._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-lg text-brozentoDark">{msg.name}</h3>
                      <p className="text-sm text-gray-500">{msg.email}</p>
                    </div>
                    <p className="text-sm text-gray-500">Date: {new Date(msg.createdAt).toLocaleString()}</p>
                  </div>
                  <p className="text-gray-700 bg-gray-50 p-4 rounded-lg mb-4">{msg.message}</p>
                  <button onClick={() => handleDeleteMessage(msg._id)} className="text-red-500 hover:text-red-700 text-sm font-semibold flex items-center gap-1">
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* REVIEWS TAB */}
      {activeTab === 'reviews' && (
        <div className="container mx-auto p-6">
          <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
          {reviewsLoading ? <p>Loading reviews...</p> : reviews.length === 0 ? <p className="text-gray-500">No reviews yet.</p> : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {reviews.map((review) => (
                <div key={review._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 bg-brozentoRed text-white rounded-full flex items-center justify-center font-bold text-sm">
                        {review.userName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{review.userName}</p>
                        <div className="flex text-brozentoGold text-xs">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={12} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "text-brozentoGold" : "text-gray-300"} />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">{review.comment}</p>
                  </div>
                  
                  <div className="flex justify-between items-center border-t pt-3 mt-3">
                    <p className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</p>
                    <button onClick={() => handleDeleteReview(review._id)} className="text-red-500 hover:text-red-700 text-sm font-semibold flex items-center gap-1">
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SETTINGS TAB */}
      {activeTab === 'settings' && (
        <div className="container mx-auto p-6 max-w-4xl">
          <div className="bg-white p-8 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><SettingsIcon size={24} /> Website Settings (Shopify Style)</h2>
            
            <form onSubmit={handleUpdateSettings} className="space-y-6">
              
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Site Name</label>
                  <input type="text" value={siteSettings.siteName || ''} onChange={(e) => setSiteSettings({...siteSettings, siteName: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Logo</label>
                  <div className="flex gap-2">
                    <input type="text" value={siteSettings.logoUrl || ''} onChange={(e) => setSiteSettings({...siteSettings, logoUrl: e.target.value})} className="w-full px-4 py-2 border rounded-lg" placeholder="https://..." />
                    <label className="bg-gray-200 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-300 flex items-center justify-center">
                      <Upload size={18} />
                      <input type="file" className="hidden" accept="image/*" onChange={async (e) => {
                        if(e.target.files[0]) {
                          const url = await uploadImageToCloudinary(e.target.files[0]);
                          if(url) setSiteSettings({...siteSettings, logoUrl: url});
                        }
                      }} />
                    </label>
                  </div>
                </div>
              </div>

              {/* Top Bar / Marquee */}
              <div className="bg-gray-50 p-4 rounded-lg border">
                <h3 className="font-bold text-gray-800 mb-2">Top Bar (Marquee)</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-3">
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Marquee Text</label>
                    <input type="text" value={siteSettings.topBarText || ''} onChange={(e) => setSiteSettings({...siteSettings, topBarText: e.target.value})} className="w-full px-3 py-2 border rounded" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Background Color</label>
                    <input type="color" value={siteSettings.topBarBgColor || '#1a1a1a'} onChange={(e) => setSiteSettings({...siteSettings, topBarBgColor: e.target.value})} className="w-full h-10 p-1 border rounded cursor-pointer" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Text Color</label>
                    <input type="color" value={siteSettings.topBarTextColor || '#ffffff'} onChange={(e) => setSiteSettings({...siteSettings, topBarTextColor: e.target.value})} className="w-full h-10 p-1 border rounded cursor-pointer" />
                  </div>
                </div>
              </div>

              {/* Hero Banner */}
              <div className="bg-gray-50 p-4 rounded-lg border">
                <h3 className="font-bold text-gray-800 mb-2">Hero Banner (Slider)</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Hero Title</label>
                    <input type="text" value={siteSettings.heroTitle || ''} onChange={(e) => setSiteSettings({...siteSettings, heroTitle: e.target.value})} className="w-full px-3 py-2 border rounded" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Hero Subtitle</label>
                    <input type="text" value={siteSettings.heroSubtitle || ''} onChange={(e) => setSiteSettings({...siteSettings, heroSubtitle: e.target.value})} className="w-full px-3 py-2 border rounded" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Title Text Color</label>
                      <input type="color" value={siteSettings.heroTitleColor || '#ffffff'} onChange={(e) => setSiteSettings({...siteSettings, heroTitleColor: e.target.value})} className="w-full h-10 p-1 border rounded cursor-pointer" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Background Color (Fallback)</label>
                      <input type="color" value={siteSettings.heroBgColor || '#c40000'} onChange={(e) => setSiteSettings({...siteSettings, heroBgColor: e.target.value})} className="w-full h-10 p-1 border rounded cursor-pointer" />
                    </div>
                  </div>
                  
                  {/* Slider Images Input */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Hero Image URLs (Comma Separated for Slider)</label>
                    <div className="flex gap-2 mb-2">
                      <textarea
                        value={siteSettings.heroImages?.join(', ') || ''}
                        onChange={(e) => setSiteSettings({...siteSettings, heroImages: e.target.value.split(',').map(url => url.trim())})}
                        rows="2"
                        className="w-full px-3 py-2 border rounded"
                        placeholder="https://image1.jpg, https://image2.jpg"
                      />
                      <label className="bg-gray-200 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-300 flex items-center justify-center h-full">
                        <Upload size={18} />
                        <input type="file" className="hidden" accept="image/*" multiple onChange={async (e) => {
                          const files = Array.from(e.target.files);
                          const urls = [];
                          for (const file of files) {
                            const url = await uploadImageToCloudinary(file);
                            if(url) urls.push(url);
                          }
                          if(urls.length > 0) {
                            const currentUrls = siteSettings.heroImages || [];
                            setSiteSettings({...siteSettings, heroImages: [...currentUrls, ...urls]});
                          }
                        }} />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Aap ek saath multiple images upload kar sakti hain (Slider ke liye).</p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Hero Video URL (Optional)</label>
                    <input type="text" value={siteSettings.heroVideoUrl || ''} onChange={(e) => setSiteSettings({...siteSettings, heroVideoUrl: e.target.value})} className="w-full px-3 py-2 border rounded" placeholder="https://..." />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">WhatsApp Number</label>
                <input type="text" value={siteSettings.whatsappNumber || ''} onChange={(e) => setSiteSettings({...siteSettings, whatsappNumber: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
              </div>

              <button type="submit" className="w-full bg-brozentoRed text-white font-bold py-3 rounded-lg hover:bg-red-700 transition mt-4">Save Settings</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;