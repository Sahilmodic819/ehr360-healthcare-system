// frontend/src/pages/Doctor/MyPatients.jsx
import React, { useEffect, useState } from 'react';
import api from '../../utils/api';

export default function MyPatients(){
  const [doc, setDoc] = useState(null);
  useEffect(()=>{ async function load(){ try{ const res = await api.get('/api/doctors/me'); setDoc(res.data);}catch(e){console.error(e);} } load(); },[]);
  return (
    <div className="p-6">
      <h2 className="text-xl font-bold">My Patients</h2>
      <div className="mt-4">
        {(doc?.patients || []).map(p=>(
          <div key={p._id} className="p-3 bg-white rounded shadow mb-2">
            <div className="font-bold">{p.fullName}</div>
            <div>D.O.B: {p.dob ? new Date(p.dob).toLocaleDateString() : '-'}</div>
            <a className="text-blue-600" href={`/doctor/patient/${p._id}`}>View</a>
          </div>
        ))}
      </div>
    </div>
  )
}
