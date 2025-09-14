// frontend/src/pages/Auth/InsurerRegister.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../utils/api';

export default function InsurerRegister(){
  const [form,setForm] = useState({ fullName:'', email:'', aabhaId:'', aadharNo:'', phone:'', irdaiNo:'', agencyCode:'', password:'', confirmPassword:''});
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      console.log('Submitting insurer registration:', form);
      const res = await api.post('/api/auth/register/insurer', form);
      console.log('Registration successful:', res.data);
      alert('Registered successfully');
      nav('/login');
    } catch (err) {
      console.error('Registration error:', err);
      console.error('Error response:', err.response?.data);
      alert(err.response?.data?.error || 'Registration failed');
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
          <h2 className="text-2xl font-bold text-center mb-6">INSURER REGISTRATION</h2>
          
          {/* Registration Type Links */}
          <div className="flex justify-center space-x-4 mb-6 text-sm">
            <Link to="/register/patient" className="text-gray-500 hover:text-blue-600">Patient</Link>
            <Link to="/register/doctor" className="text-gray-500 hover:text-blue-600">Doctor</Link>
            <span className="text-blue-600 font-medium border-b-2 border-blue-600 pb-1">Insurer</span>
          </div>
          
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Full Name</label>
              <input className="input w-full" name="fullName" value={form.fullName} onChange={e=>setForm({...form,fullName:e.target.value})} required />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Email</label>
              <input className="input w-full" type="email" name="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">AABHA ID</label>
              <input className="input w-full" name="aabhaId" value={form.aabhaId} onChange={e=>setForm({...form,aabhaId:e.target.value})} required />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Aadhar No</label>
              <input className="input w-full" name="aadharNo" value={form.aadharNo} onChange={e=>setForm({...form,aadharNo:e.target.value})} required />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Phone</label>
              <input className="input w-full" name="phone" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} required />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">IRDAI Agent Reg No.</label>
              <input className="input w-full" name="irdaiNo" value={form.irdaiNo} onChange={e=>setForm({...form,irdaiNo:e.target.value})} required />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Agency Code</label>
              <input className="input w-full" name="agencyCode" value={form.agencyCode} onChange={e=>setForm({...form,agencyCode:e.target.value})} required />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Password</label>
              <input type="password" className="input w-full" name="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Confirm Password</label>
              <input type="password" className="input w-full" name="confirmPassword" value={form.confirmPassword} onChange={e=>setForm({...form,confirmPassword:e.target.value})} required />
            </div>
            <button className="btn w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors">REGISTER</button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-gray-600">Already have an account? <Link to="/login" className="text-blue-600 hover:text-blue-800">Login here</Link></p>
          </div>
        </div>
      </div>
    </div>
  )
}
