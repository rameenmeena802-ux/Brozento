import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('https://brozento-backend.vercel.app
 Copy new URL/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      
      // Auto login after register
      localStorage.setItem('userToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />
      <div className="flex items-center justify-center py-20 px-4">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
          <h2 className="text-3xl font-extrabold text-brozentoDark text-center mb-6">Create Account</h2>
          {error && <p className="text-red-500 text-center mb-4 bg-red-50 py-2 rounded">{error}</p>}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
              <div className="flex items-center bg-gray-100 rounded-lg px-3">
                <User size={18} className="text-gray-500" />
                <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full bg-transparent px-3 py-2 outline-none text-sm" placeholder="John Doe" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
              <div className="flex items-center bg-gray-100 rounded-lg px-3">
                <Mail size={18} className="text-gray-500" />
                <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full bg-transparent px-3 py-2 outline-none text-sm" placeholder="you@example.com" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
              <div className="flex items-center bg-gray-100 rounded-lg px-3">
                <Lock size={18} className="text-gray-500" />
                <input type="password" name="password" value={formData.password} onChange={handleChange} required className="w-full bg-transparent px-3 py-2 outline-none text-sm" placeholder="••••••••" />
              </div>
            </div>
            <button type="submit" className="w-full bg-brozentoRed text-white font-bold py-3 rounded-lg hover:bg-red-700 transition flex justify-center items-center gap-2">
              Register <ArrowRight size={18} />
            </button>
          </form>
          
          <p className="text-center text-sm text-gray-500 mt-4">
            Already have an account? <Link to="/login" className="text-brozentoRed font-semibold hover:underline">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;