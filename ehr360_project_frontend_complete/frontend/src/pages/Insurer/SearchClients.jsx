// frontend/src/pages/Insurer/SearchClients.jsx
import React, { useState } from 'react';
import api from '../../utils/api';

export default function SearchClients(){
  const [q, setQ] = useState('');
  const [results, setResults] = useState([]);
  const search = async () => {
    try {
      const res = await api.get(`/api/doctors/search-patients?q=${encodeURIComponent(q)}`);
      setResults(res.data);
    } catch(e){ alert('Search failed'); }
  };
  return (
    <div className="p-6">
      <h2 className="text-xl font-bold">Search Clients</h2>
      <div className="mt-4 max-w-md">
        <input className="input" value={q} onChange={e=>setQ(e.target.value)} placeholder="Name or Aadhar" />
        <button className="btn mt-2" onClick={search}>Search</button>
      </div>
      <div className="mt-4">
        {results.map(r=>(<div key={r._id} className="p-3 bg-white rounded shadow mb-2">{r.fullName} - <button className="text-blue-600" onClick={async ()=>{ await api.post('/api/insurers/add-client',{patientId:r._id}); alert('Added');}}>Add</button></div>))}
      </div>
    </div>
  )
}
