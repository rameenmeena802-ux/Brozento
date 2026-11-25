import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();

  if (cartItems.length === 0) {
    return (
      <div>
        <Navbar />
        <div className="min-h-[60vh] flex flex-col items-center justify-center font-sans">
          <ShoppingBag size={64} className="text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Cart is Empty</h2>
          <p className="text-gray-500 mb-6">Looks like you haven't added anything yet.</p>
          <Link to="/shop" className="bg-brozentoRed text-white px-6 py-3 rounded-lg font-bold hover:bg-red-700 transition">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-12 font-sans">
        <h1 className="text-3xl font-extrabold text-brozentoDark mb-8">Shopping Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item._id} className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <img src={item.image} alt={item.title} className="w-24 h-24 object-cover rounded-lg" />
                
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-800">{item.title}</h3>
                  <p className="text-brozentoRed font-bold">Rs {item.price}</p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                  <button onClick={() => updateQuantity(item._id, item.quantity - 1)} className="px-3 py-1 bg-gray-100 hover:bg-gray-200 font-bold">-</button>
                  <span className="px-4 font-semibold">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item._id, item.quantity + 1)} className="px-3 py-1 bg-gray-100 hover:bg-gray-200 font-bold">+</button>
                </div>

                <div className="font-bold text-lg w-24 text-right">Rs {item.price * item.quantity}</div>

                <button onClick={() => removeFromCart(item._id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition">
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-md h-max sticky top-6">
            <h2 className="text-xl font-bold mb-4 border-b pb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>Rs {getCartTotal()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="text-green-600 font-semibold">Free</span>
              </div>
              <div className="flex justify-between font-bold text-xl border-t pt-3">
                <span>Total</span>
                <span className="text-brozentoRed">Rs {getCartTotal()}</span>
              </div>
            </div>

            <Link to="/checkout" className="w-full bg-brozentoRed text-white font-bold py-3 rounded-lg hover:bg-red-700 transition flex justify-center items-center gap-2">
              Proceed to Checkout <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;