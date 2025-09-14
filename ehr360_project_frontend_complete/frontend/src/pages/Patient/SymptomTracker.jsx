// frontend/src/pages/Patient/SymptomTracker.jsx
import React, { useEffect, useState } from 'react';
import api from '../../utils/api';

export default function SymptomTracker(){
  const [symptoms, setSymptoms] = useState([]);
  const [form, setForm] = useState({ date:'', note:''});
  const userId = localStorage.getItem('ehr_userId') || null;

  useEffect(()=>{ async function load(){
    try {
      // fetch patient by userId
      const pRes = await api.get(`/api/patients/${userId}`);
      setSymptoms(pRes.data.symptoms || []);
    } catch(e){ console.error(e); }
  } load(); }, [userId]);

  const add = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/api/patients/${userId}/symptoms`, form);
      alert('Added');
      const res = await api.get(`/api/patients/${userId}`);
      setSymptoms(res.data.symptoms || []);
      setForm({ date:'', note:'' });
    } catch(err){ alert(err.response?.data?.error || 'Failed'); }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold">Symptom Tracker</h2>
      <form onSubmit={add} className="max-w-md mt-4 bg-white p-4 rounded shadow space-y-3">
        <label>Date (within 30 days)</label>
        <input type="date" className="input" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} required />
        <label>Note</label>
        <textarea className="input" value={form.note} onChange={e=>setForm({...form,note:e.target.value})} required />
        <button className="btn">Add Symptom</button>
      </form>

      <div className="mt-6">
        <h3 className="font-bold">Recent Symptoms</h3>
        <ul className="mt-2 space-y-2">
          {symptoms.map((s,i)=>(
            <li key={i} className="p-3 bg-white rounded shadow">
              <div className="text-sm text-gray-600">{new Date(s.date).toLocaleDateString()}</div>
              <div>{s.note}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
