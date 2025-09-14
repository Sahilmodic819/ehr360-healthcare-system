// frontend/src/pages/Auth/InsurerRegister.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function InsurerRegister(){
  const [form,setForm] = useState({ fullName:'', email:'', aabhaId:'', aadharNo:'', phone:'', irdaiNo:'', agencyCode:'', password:'', confirmPassword:''});
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(import.meta.env.VITE_API_BASE + '/api/auth/register/insurer', form);
      alert('Registered successfully');
      nav('/insurer');
    } catch (err) {
      alert(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">INSURER REGISTRATION</h2>
      <form onSubmit={submit} className="space-y-3">
        <label>Full Name</label><input className="input" name="fullName" value={form.fullName} onChange={e=>setForm({...form,fullName:e.target.value})} />
        <label>Email</label><input className="input" name="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} />
        <label>AABHA ID</label><input className="input" name="aabhaId" value={form.aabhaId} onChange={e=>setForm({...form,aabhaId:e.target.value})} />
        <label>Aadhar No</label><input className="input" name="aadharNo" value={form.aadharNo} onChange={e=>setForm({...form,aadharNo:e.target.value})} />
        <label>Phone</label><input className="input" name="phone" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} />
        <label>IRDAI Agent Reg No.</label><input className="input" name="irdaiNo" value={form.irdaiNo} onChange={e=>setForm({...form,irdaiNo:e.target.value})} />
        <label>Agency Code</label><input className="input" name="agencyCode" value={form.agencyCode} onChange={e=>setForm({...form,agencyCode:e.target.value})} />
        <label>Password</label><input type="password" className="input" name="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} />
        <label>Confirm Password</label><input type="password" className="input" name="confirmPassword" value={form.confirmPassword} onChange={e=>setForm({...form,confirmPassword:e.target.value})} />
        <button className="btn">REGISTER</button>
      </form>
    </div>
  )
}
