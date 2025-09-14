// frontend/src/pages/Doctor/SearchPatients.jsx
import React, { useState } from 'react';
import api from '../../utils/api';

export default function SearchPatients(){
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
      <h2 className="text-xl font-bold">Search Patients</h2>
      <div className="mt-4 max-w-md">
        <input className="input" value={q} onChange={e=>setQ(e.target.value)} placeholder="Name or Aadhar" />
        <button className="btn mt-2" onClick={search}>Search</button>
      </div>
      <div className="mt-4">
        {results.map(r=>(<div key={r._id} className="p-3 bg-white rounded shadow mb-2">{r.fullName} - <a href={`/doctor/patient/${r._id}`} className="text-blue-600">View</a></div>))}
      </div>
    </div>
  )
}
