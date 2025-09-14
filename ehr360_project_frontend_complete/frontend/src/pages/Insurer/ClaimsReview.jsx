// frontend/src/pages/Insurer/ClaimsReview.jsx
import React, { useEffect, useState } from 'react';
import api from '../../utils/api';

export default function ClaimsReview(){
  const [claims, setClaims] = useState([]);
  useEffect(()=>{ async function load(){ try{ const res = await api.get('/api/insurers/claims'); setClaims(res.data);}catch(e){console.error(e);} } load(); },[]);
  const resolve = async (id, action) => {
    const message = prompt('Optional message to include');
    await api.post(`/api/insurers/claims/${id}/resolve`, { action, message });
    alert('Updated'); const res = await api.get('/api/insurers/claims'); setClaims(res.data);
  };
  return (
    <div className="p-6">
      <h2 className="text-xl font-bold">Claims Review</h2>
      <div className="mt-4">
        {claims.map(c=>(<div key={c._id} className="p-3 bg-white rounded shadow mb-2">
          <div className="font-bold">{c.treatment} - {c.status}</div>
          <div>Patient: {c.patientId?.fullName || '—'}</div>
          <div className="mt-2">
            <button className="btn mr-2" onClick={()=>resolve(c._id,'approve')}>Approve</button>
            <button className="btn mr-2" onClick={()=>resolve(c._id,'reject')}>Reject</button>
            <button className="btn" onClick={()=>resolve(c._id,'more_docs')}>Request Docs</button>
          </div>
        </div>))}
      </div>
    </div>
  )
}
