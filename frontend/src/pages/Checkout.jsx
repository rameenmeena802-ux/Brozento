import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';
import { CheckCircle, Smartphone, Building, Truck, Upload } from 'lucide-react';

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    email: '', // YEH NAYA ADD HUA HAI
    address: '',
    city: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('JazzCash');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [cities, setCities] = useState([]);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [selectedCityCharge, setSelectedCityCharge] = useState(null);

  // Screenshot Upload States
  const [screenshot, setScreenshot] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/cities');
        const data = await res.json();
        setCities(data);
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };
    fetchCities();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCityChange = (e) => {
    const cityName = e.target.value;
    setFormData({ ...formData, city: cityName });
    
    const cityData = cities.find(c => c.cityName === cityName);
    if (cityData) {
      setDeliveryFee(cityData.deliveryCharge);
      setSelectedCityCharge(cityData.deliveryCharge);
    } else {
      setDeliveryFee(0);
      setSelectedCityCharge(null);
    }
  };

  // Screenshot upload function (Cloudinary use karein)
  const uploadScreenshot = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);
    try {
      const res = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Upload failed');
      setUploading(false);
      return data.imageUrl;
    } catch (error) {
      alert(`Screenshot Upload Error: ${error.message}`);
      setUploading(false);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    if (!formData.city) {
      alert('Please select your city for delivery.');
      return;
    }

    let screenshotUrl = '';
    if (screenshot) {
      screenshotUrl = await uploadScreenshot(screenshot);
      if (!screenshotUrl) return;
    } else {
      alert('Please upload payment screenshot!');
      return;
    }

    setIsSubmitting(true);

    const orderData = {
      ...formData,
      items: cartItems.map(item => ({
        productId: item._id,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      })),
      totalAmount: getCartTotal() + deliveryFee,
      deliveryCharges: deliveryFee,
      paymentMethod,
      paymentScreenshot: screenshotUrl,
      paymentStatus: 'Pending',
      orderStatus: 'Pending'
    };

    try {
      const res = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (res.ok) {
        alert('Order Placed Successfully! We will verify your payment and contact you.');
        clearCart();
        navigate('/order-success'); 
      } else {
        alert('Failed to place order.');
      }
    } catch (error) {
      console.error(error);
      alert('Something went wrong.');
    }
    setIsSubmitting(false);
  };

  const paymentOptions = [
    { 
      id: 'JazzCash', 
      label: 'JazzCash', 
      icon: <Smartphone size={20} />, 
      details: 'JazzCash Number: 0301-7654321 (Title: Brozento)' 
    },
    { 
      id: 'EasyPaisa', 
      label: 'EasyPaisa', 
      icon: <Smartphone size={20} />, 
      details: 'EasyPaisa Number: 0300-1234567 (Title: Brozento)' 
    },
    { 
      id: 'Bank', 
      label: 'Bank Transfer', 
      icon: <Building size={20} />, 
      details: 'Meezan Bank: PK00 MEZN 0000 0000 0000 (Title: Brozento)' 
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-extrabold text-brozentoDark mb-8 text-center">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md">
            <form onSubmit={handleSubmit}>
              
              <h2 className="text-xl font-bold mb-4 border-b pb-2">Shipping Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <input type="text" name="customerName" placeholder="Full Name" required value={formData.customerName} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-brozentoRed" />
                <input type="text" name="phone" placeholder="Phone Number (03xx-xxxxxxx)" required value={formData.phone} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-brozentoRed" />
                
                {/* EMAIL FIELD - YEH NAYA ADD HUA HAI */}
                <input type="email" name="email" placeholder="Email Address (for order confirmation)" required value={formData.email} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-brozentoRed md:col-span-2" />
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-600 mb-1">Select City</label>
                  <select name="city" required value={formData.city} onChange={handleCityChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-brozentoRed bg-white">
                    <option value="">-- Select Your City --</option>
                    {cities.map((city) => (
                      <option key={city._id} value={city.cityName}>
                        {city.cityName} (Rs {city.deliveryCharge})
                      </option>
                    ))}
                  </select>
                </div>

                <textarea name="address" placeholder="Complete Address (House #, Street, Area)" required value={formData.address} onChange={handleChange} rows="3" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-brozentoRed md:col-span-2"></textarea>
              </div>

              <h2 className="text-xl font-bold mb-4 border-b pb-2">Payment Method (100% Advance)</h2>
              <div className="space-y-3 mb-6">
                {paymentOptions.map((option) => (
                  <label key={option.id} className={`flex flex-col p-4 rounded-lg border-2 cursor-pointer transition ${paymentMethod === option.id ? 'border-brozentoRed bg-red-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <div className="flex items-center gap-3">
                      <input type="radio" name="payment" value={option.id} checked={paymentMethod === option.id} onChange={(e) => setPaymentMethod(e.target.value)} className="hidden" />
                      <div className={`p-2 rounded-full ${paymentMethod === option.id ? 'bg-brozentoRed text-white' : 'bg-gray-100 text-gray-500'}`}>{option.icon}</div>
                      <p className="font-bold text-gray-800">{option.label}</p>
                      {paymentMethod === option.id && <CheckCircle className="ml-auto text-brozentoRed" size={24} />}
                    </div>
                    {paymentMethod === option.id && (
                      <p className="text-sm text-gray-600 mt-2 ml-11 font-semibold">{option.details}</p>
                    )}
                  </label>
                ))}
              </div>

              {/* Screenshot Upload Section */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
                <h3 className="text-lg font-bold text-blue-800 mb-2 flex items-center gap-2"><Upload size={20} /> Upload Payment Screenshot</h3>
                <p className="text-sm text-blue-700 mb-3">Please transfer the amount to the selected account and upload the screenshot here.</p>
                <input type="file" accept="image/*" onChange={(e) => setScreenshot(e.target.files[0])} className="w-full text-sm border p-2 rounded bg-white" required />
              </div>

              <button type="submit" disabled={isSubmitting || uploading} className="w-full bg-brozentoRed text-white font-bold py-3 rounded-lg hover:bg-red-700 transition disabled:bg-gray-400">
                {uploading ? 'Uploading Screenshot...' : isSubmitting ? 'Placing Order...' : 'Place Order'}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-md h-max sticky top-6">
            <h2 className="text-xl font-bold mb-4 border-b pb-4">Your Order</h2>
            <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
              {cartItems.map((item) => (
                <div key={item._id} className="flex justify-between text-sm">
                  <span className="text-gray-600">{item.title} x {item.quantity}</span>
                  <span className="font-semibold">Rs {item.price * item.quantity}</span>
                </div>
              ))}
            </div>
            
            <div className="border-t pt-3 space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>Rs {getCartTotal()}</span>
              </div>
              <div className="flex justify-between text-gray-600 items-center">
                <span className="flex items-center gap-1"><Truck size={16} /> Delivery Charges</span>
                <span className={deliveryFee > 0 ? "font-bold text-gray-800" : "text-gray-400"}>
                  {selectedCityCharge !== null ? `Rs ${deliveryFee}` : 'Select City'}
                </span>
              </div>
              <div className="flex justify-between font-bold text-xl border-t pt-3 mt-2">
                <span>Total</span>
                <span className="text-brozentoRed">Rs {getCartTotal() + deliveryFee}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;