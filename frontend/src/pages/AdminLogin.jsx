import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Check karein ke user admin hai ya nahi
      if (data.user.role !== 'admin') {
        throw new Error('You are not authorized as Admin');
      }

      // ADMIN TOKEN save karein (adminToken)
      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminUser', JSON.stringify(data.user));

      alert('Admin Login Successful!');
      navigate('/admin/dashboard');
      
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 font-sans">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-extrabold text-brozentoDark text-center mb-6">Admin Login</h2>
        
        {error && <p className="text-red-500 text-center mb-4 text-sm bg-red-50 py-2 rounded">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-brozentoRed" placeholder="admin@brozento.com" required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-brozentoRed" placeholder="admin123" required />
          </div>
          <button type="submit" className="w-full bg-brozentoRed text-white font-bold py-3 rounded-lg hover:bg-red-700 transition">Login</button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;