// frontend/src/pages/Patient/MedicalRecords.jsx
import React, { useEffect, useState } from 'react';
import api from '../../utils/api';

export default function MedicalRecords(){
  const [patient, setPatient] = useState(null);
  const userId = localStorage.getItem('ehr_userId') || null;

  useEffect(()=>{ async function load(){
    try {
      const res = await api.get(`/api/patients/${userId}`);
      setPatient(res.data);
    } catch(e){ console.error(e); }
  } load(); }, [userId]);

  if(!patient) return <div className="p-6">Loading...</div>;
  return (
    <div className="p-6">
      <h2 className="text-xl font-bold">Medical Records</h2>
      <div className="mt-4 bg-white p-4 rounded shadow">
        <p><strong>Name:</strong> {patient.fullName}</p>
        <p><strong>D.O.B:</strong> {patient.dob ? new Date(patient.dob).toLocaleDateString() : '-'}</p>
        <p><strong>Emergency Contacts:</strong></p>
        <ul>{(patient.emergencyContacts || []).map((c,i)=>(<li key={i}>{c.name} - {c.phone}</li>))}</ul>
      </div>
    </div>
  )
}
