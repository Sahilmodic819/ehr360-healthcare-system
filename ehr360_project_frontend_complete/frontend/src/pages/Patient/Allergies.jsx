// frontend/src/pages/Patient/Allergies.jsx
import React, { useEffect, useState } from 'react';
import api from '../../utils/api';

export default function Allergies(){
  const [patient, setPatient] = useState(null);
  const [allergy, setAllergy] = useState('');
  const userId = localStorage.getItem('ehr_userId') || null;

  useEffect(()=>{ async function load(){ try{ const res = await api.get(`/api/patients/${userId}`); setPatient(res.data);}catch(e){console.error(e);} } load(); },[userId]);

  const add = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/api/patients/${userId}/allergies`, { allergy });
      alert('Added'); const p = await api.get(`/api/patients/${userId}`); setPatient(p.data); setAllergy('');
    } catch(err){ alert(err.response?.data?.error || 'Failed'); }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold">Allergies</h2>
      <form onSubmit={add} className="max-w-md mt-4 bg-white p-4 rounded shadow space-y-3">
        <label>Allergy</label><input className="input" value={allergy} onChange={e=>setAllergy(e.target.value)} />
        <button className="btn">Add</button>
      </form>

      <div className="mt-6">
        <h3 className="font-bold">Allergies</h3>
        <ul className="mt-2 space-y-2">
          {(patient?.allergies || []).map((a,i)=>(<li key={i} className="p-3 bg-white rounded shadow">{a}</li>))}
        </ul>
      </div>
    </div>
  )
}
