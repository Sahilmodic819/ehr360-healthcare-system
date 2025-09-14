// frontend/src/pages/Doctor/PatientDetail.jsx
import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import { useParams } from 'react-router-dom';

export default function PatientDetail(){
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  useEffect(()=>{ async function load(){ try{ const res = await api.get(`/api/doctors/patient/${id}`); setPatient(res.data);}catch(e){console.error(e);} } load(); },[id]);
  if(!patient) return <div className="p-6">Loading...</div>;
  return (
    <div className="p-6">
      <h2 className="text-xl font-bold">Patient: {patient.fullName}</h2>
      <div className="mt-4 bg-white p-4 rounded shadow">
        <p><strong>D.O.B:</strong> {patient.dob ? new Date(patient.dob).toLocaleDateString() : '-'}</p>
        <p><strong>Allergies:</strong> {(patient.allergies || []).join(', ')}</p>
        <p><strong>Ongoing:</strong> {(patient.ongoingTreatments || []).map(t=>t.name).join(', ')}</p>
        <div className="mt-3">
          <h4 className="font-bold">Symptoms (last 30 days)</h4>
          <ul>{(patient.symptoms||[]).map((s,i)=>(<li key={i}>{new Date(s.date).toLocaleDateString()}: {s.note}</li>))}</ul>
        </div>
      </div>
    </div>
  )
}
