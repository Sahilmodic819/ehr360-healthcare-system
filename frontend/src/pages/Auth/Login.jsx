
// frontend/src/pages/Auth/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api, { setAuthToken } from '../../utils/api';

export default function Login(){
  const [form, setForm] = useState({ email:'', password:''});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      console.log('Attempting login with:', { email: form.email });
      const res = await api.post('/api/auth/login', form);
      console.log('Login response:', res.data);
      const { token, role, userId } = res.data;
      
      // Store authentication data
      localStorage.setItem('ehr_token', token);
      localStorage.setItem('ehr_role', role);
      localStorage.setItem('ehr_userId', userId);
      localStorage.setItem('ehr_email', form.email);
      
      console.log('Stored userId:', userId);
      console.log('Stored role:', role);
      
      // Set API auth token
      setAuthToken(token);
      
      // Redirect based on role
      switch (role) {
        case 'doctor':
          navigate('/doctor/dashboard');
          break;
        case 'insurer':
          navigate('/insurer/dashboard');
          break;
        default:
          navigate('/patient/dashboard');
      }
    } catch (err) {
      console.error('Login error:', err);
      console.error('Error response:', err.response?.data);
      alert(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-md mx-auto">
        {/* Navigation */}
        <div className="mb-6 text-center">
          <Link to="/" className="text-blue-600 hover:text-blue-800 font-medium">
            ← Back to Home
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">EHR</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
            <p className="text-gray-600 mt-2">Sign in to your EHR 360 account</p>
          </div>
          
          <form onSubmit={submit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input 
                type="email"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter your email"
                value={form.email} 
                onChange={e => setForm({...form, email: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input 
                type="password"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter your password"
                value={form.password} 
                onChange={e => setForm({...form, password: e.target.value})}
              />
            </div>
            
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          
          <div className="mt-8 text-center space-y-4">
            <div className="text-sm text-gray-600">
              Don't have an account?
            </div>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <Link 
                to="/register/patient" 
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Register as Patient
              </Link>
              <Link 
                to="/register/doctor" 
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Register as Doctor
              </Link>
              <Link 
                to="/register/insurer" 
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Register as Insurer
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
