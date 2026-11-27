import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const ContactUs = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('https://brozento-backend.vercel.app/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />
      <div className="container mx-auto px-4 py-16 max-w-5xl">
        <h1 className="text-4xl font-extrabold text-brozentoDark text-center mb-12">Contact Us</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
            <p className="text-gray-600 mb-8">Have a question about our products or your order? We're here to help!</p>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="bg-red-50 p-3 rounded-full text-brozentoRed"><Phone size={24} /></div>
                <div>
                  <p className="font-semibold text-gray-800">Phone / WhatsApp</p>
                  <p className="text-gray-600">+92 300 1234567</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-red-50 p-3 rounded-full text-brozentoRed"><Mail size={24} /></div>
                <div>
                  <p className="font-semibold text-gray-800">Email</p>
                  <p className="text-gray-600">info@brozento.pk</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-red-50 p-3 rounded-full text-brozentoRed"><MapPin size={24} /></div>
                <div>
                  <p className="font-semibold text-gray-800">Address</p>
                  <p className="text-gray-600">Karachi, Pakistan</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold mb-6">Send a Message</h2>
            
            {status === 'success' && (
              <div className="bg-green-50 text-green-700 p-3 rounded-lg mb-4 text-sm">Message sent successfully! We will get back to you soon.</div>
            )}
            {status === 'error' && (
              <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4 text-sm">Something went wrong. Please try again.</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Your Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-brozentoRed" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Your Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-brozentoRed" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Message</label>
                <textarea name="message" value={formData.message} onChange={handleChange} required rows="4" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-brozentoRed"></textarea>
              </div>
              <button type="submit" className="w-full bg-brozentoRed text-white font-bold py-3 rounded-lg hover:bg-red-700 transition flex justify-center items-center gap-2">
                <Send size={18} /> Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;