
// frontend/src/pages/Auth/Login.jsx
import React, { useState } from 'react';
import api, { setAuthToken } from '../../utils/api';
import { useNavigate } from 'react-router-dom';

export default function Login(){
  const [form,setForm] = useState({ email:'', password:''});
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/api/auth/login', form);
      // simple redirect: in full app you'd save token/session
      const token = res.data.token; const role = res.data.role; if (token) { localStorage.setItem('ehr_token', token); setAuthToken(token);} if (role === 'doctor') nav('/doctor'); else if (role === 'insurer') nav('/insurer'); else nav('/dashboard');
    } catch (err) {
      alert(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">LOGIN</h2>
      <form onSubmit={submit} className="space-y-3">
        <label>Email</label>
        <input className="input" name="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} />
        <label>Password</label>
        <input type="password" className="input" name="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} />
        <button className="btn">LOGIN</button>
      </form>
    </div>
  )
}
