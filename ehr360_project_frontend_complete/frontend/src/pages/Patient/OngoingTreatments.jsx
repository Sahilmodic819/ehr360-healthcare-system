// frontend/src/pages/Patient/OngoingTreatments.jsx
import React, { useEffect, useState } from 'react';
import api from '../../utils/api';

export default function OngoingTreatments(){
  const [patient, setPatient] = useState(null);
  const [form, setForm] = useState({ name:'', doctor:'', notes:'', startDate:'' });
  const userId = localStorage.getItem('ehr_userId') || null;

  useEffect(()=>{ async function load(){ try{ const res = await api.get(`/api/patients/${userId}`); setPatient(res.data);}catch(e){console.error(e);} } load(); },[userId]);

  const add = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/api/patients/${userId}/treatments`, form);
      alert('Added'); const p = await api.get(`/api/patients/${userId}`); setPatient(p.data); setForm({name:'',doctor:'',notes:'',startDate:''});
    } catch(err){ alert(err.response?.data?.error || 'Failed'); }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold">Ongoing Treatments</h2>
      <form onSubmit={add} className="max-w-md mt-4 bg-white p-4 rounded shadow space-y-3">
        <label>Treatment Name</label><input className="input" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
        <label>Doctor</label><input className="input" value={form.doctor} onChange={e=>setForm({...form,doctor:e.target.value})} />
        <label>Start Date</label><input type="date" className="input" value={form.startDate} onChange={e=>setForm({...form,startDate:e.target.value})} />
        <label>Notes</label><textarea className="input" value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} />
        <button className="btn">Add</button>
      </form>

      <div className="mt-6">
        <h3 className="font-bold">Ongoing</h3>
        <ul className="mt-2 space-y-2">
          {(patient?.ongoingTreatments || []).map((t,i)=>(
            <li key={i} className="p-3 bg-white rounded shadow">
              <div className="text-sm text-gray-600">{t.name} - {t.doctor}</div>
              <div>{t.notes}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
