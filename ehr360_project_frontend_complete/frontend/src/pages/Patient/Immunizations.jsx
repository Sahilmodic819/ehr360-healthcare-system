// frontend/src/pages/Patient/Immunizations.jsx
import React, { useEffect, useState } from 'react';
import api from '../../utils/api';

export default function Immunizations(){
  const [patient, setPatient] = useState(null);
  const [form, setForm] = useState({ date:'', vaccine:'', documentLink:''});
  const userId = localStorage.getItem('ehr_userId') || null;

  useEffect(()=>{ async function load(){ try{ const res = await api.get(`/api/patients/${userId}`); setPatient(res.data);}catch(e){console.error(e);} } load(); },[userId]);

  const add = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/api/patients/${userId}/immunizations`, form);
      alert('Added'); const p = await api.get(`/api/patients/${userId}`); setPatient(p.data); setForm({date:'',vaccine:'',documentLink:''});
    } catch(err){ alert(err.response?.data?.error || 'Failed'); }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold">Immunization Records</h2>
      <form onSubmit={add} className="max-w-md mt-4 bg-white p-4 rounded shadow space-y-3">
        <label>Date</label><input type="date" className="input" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} required />
        <label>Vaccine</label><input className="input" value={form.vaccine} onChange={e=>setForm({...form,vaccine:e.target.value})} />
        <label>Document Link (Google Drive)</label><input className="input" value={form.documentLink} onChange={e=>setForm({...form,documentLink:e.target.value})} />
        <button className="btn">Add</button>
      </form>

      <div className="mt-6">
        <h3 className="font-bold">Immunizations</h3>
        <ul className="mt-2 space-y-2">
          {(patient?.immunizations || []).map((r,i)=>(
            <li key={i} className="p-3 bg-white rounded shadow">
              <div className="text-sm text-gray-600">{new Date(r.date).toLocaleDateString()}</div>
              <div>{r.vaccine} - {r.documentLink ? <a href={r.documentLink} target="_blank" rel="noreferrer">View</a> : '-'}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
