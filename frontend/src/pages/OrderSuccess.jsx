import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import Navbar from '../components/Navbar';

const OrderSuccess = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
        <CheckCircle size={80} className="text-green-500 mb-6" />
        <h1 className="text-4xl font-extrabold text-brozentoDark mb-4">Order Placed Successfully!</h1>
        <p className="text-gray-600 mb-8 max-w-md">
          Thank you for shopping with Brozento. Your order has been received. Our team will contact you shortly for payment verification (100% Advance).
        </p>
        <Link to="/" className="bg-brozentoRed text-white font-bold px-8 py-3 rounded-lg hover:bg-red-700 transition">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;