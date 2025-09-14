// frontend/src/pages/Insurer/MyClients.jsx
import React, { useEffect, useState } from 'react';
import api from '../../utils/api';

export default function MyClients(){
  const [profile, setProfile] = useState(null);
  useEffect(()=>{ async function load(){ try{ const res = await api.get('/api/insurers/me'); setProfile(res.data);}catch(e){console.error(e);} } load(); },[]);
  return (
    <div className="p-6">
      <h2 className="text-xl font-bold">My Clients</h2>
      <div className="mt-4">
        {(profile?.clients || []).map(c=>(<div key={c._id} className="p-3 bg-white rounded shadow mb-2">{c.fullName} - <a href={`/insurer/client/${c._id}`} className="text-blue-600">View</a></div>))}
      </div>
    </div>
  )
}
