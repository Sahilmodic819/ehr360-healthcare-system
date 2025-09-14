// frontend/src/pages/Patient/PatientProfile.jsx
import React, { useEffect, useState } from 'react';
import api from '../../utils/api';

export default function PatientProfile(){
  const [patient, setPatient] = useState(null);
  const userId = localStorage.getItem('ehr_userId') || null;
  useEffect(()=>{ async function load(){ try{ const res = await api.get(`/api/patients/${userId}`); setPatient(res.data); localStorage.setItem('ehr_userId', res.data.userId || userId);}catch(e){console.error(e);} } load(); },[userId]);
  if(!patient) return <div className="p-6">Loading...</div>;
  return (
    <div className="p-6">
      <h2 className="text-xl font-bold">Profile</h2>
      <div className="mt-4 bg-white p-4 rounded shadow">
        <p><strong>Name:</strong> {patient.fullName}</p>
        <p><strong>Aadhaar:</strong> {patient.aadharNo}</p>
        <p><strong>AABHA:</strong> {patient.aabhaId}</p>
        <p><strong>Phone:</strong> {patient.phone}</p>
      </div>
    </div>
  )
}
