// frontend/src/pages/Patient/Insurance.jsx
import React, { useEffect, useState } from 'react';
import api from '../../utils/api';

export default function Insurance(){
  const [patient, setPatient] = useState(null);
  const [claims, setClaims] = useState([]);
  const userId = localStorage.getItem('ehr_userId') || null;

  useEffect(()=>{ async function load(){ try{ const res = await api.get(`/api/patients/${userId}`); setPatient(res.data); const c = await api.get('/api/claims/insurer/placeholder'); setClaims(c.data || []);}catch(e){console.error(e);} } load(); },[userId]);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold">Insurance</h2>
      <p className="mt-2">Insurance status & claims</p>
      <div className="mt-4">
        <h3 className="font-bold">My Claims</h3>
        <ul className="mt-2 space-y-2">
          {claims.map((c,i)=>(<li key={i} className="p-3 bg-white rounded shadow">{c.treatment} - {c.status}</li>))}
        </ul>
      </div>
    </div>
  )
}
