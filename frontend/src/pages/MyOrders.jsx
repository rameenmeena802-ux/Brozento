import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Package, ArrowLeft } from 'lucide-react';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchOrders(parsedUser.phone);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchOrders = async (phone) => {
    try {
      // Yahan hum user ke phone number se orders fetch kar rahe hain
      // Lekin user ke paas abhi phone number nahi hai, isliye hum email use karenge
      // Filhal hum saare orders fetch kar rahe hain, baad mein filter karenge
      const res = await fetch(`http://localhost:5000/api/orders`);
      const data = await res.json();
      setOrders(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Please Login to view your orders</h2>
          <Link to="/login" className="bg-brozentoRed text-white px-6 py-3 rounded-lg font-bold hover:bg-red-700 transition">
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-brozentoRed mb-6">
          <ArrowLeft size={18} /> Back to Home
        </Link>

        <h1 className="text-3xl font-extrabold text-brozentoDark mb-8 flex items-center gap-3">
          <Package size={32} /> My Orders
        </h1>

        {loading ? (
          <p className="text-center py-10">Loading orders...</p>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm">
            <Package size={64} className="text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">No Orders Yet</h2>
            <p className="text-gray-500 mb-6">You haven't placed any orders yet.</p>
            <Link to="/shop" className="bg-brozentoRed text-white px-6 py-3 rounded-lg font-bold hover:bg-red-700 transition">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex flex-col md:flex-row justify-between mb-4 border-b pb-4 gap-4">
                  <div>
                    <h3 className="font-bold text-lg text-brozentoDark">Order #{order._id.slice(-6).toUpperCase()}</h3>
                    <p className="text-sm text-gray-500">Date: {new Date(order.createdAt).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="font-bold text-brozentoRed text-xl">Rs {order.totalAmount}</p>
                    <p className="text-sm font-semibold text-gray-600">Payment: {order.paymentMethod}</p>
                  </div>
                  <div>
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                      order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-700' :
                      order.orderStatus === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                      order.orderStatus === 'Processing' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {order.orderStatus}
                    </span>
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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;