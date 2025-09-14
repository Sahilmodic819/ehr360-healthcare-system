
// frontend/src/pages/Patient/PatientDashboard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function PatientDashboard(){
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold">Patient Dashboard</h2>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <Link to="/patient/symptoms" className="p-4 bg-white rounded shadow">Symptom Tracker</Link>
        <Link to="/patient/records" className="p-4 bg-white rounded shadow">Medical Records</Link>
        <Link to="/patient/labs" className="p-4 bg-white rounded shadow">Lab Reports</Link>
        <Link to="/patient/immunizations" className="p-4 bg-white rounded shadow">Immunization Records</Link>
        <Link to="/patient/medications" className="p-4 bg-white rounded shadow">Medications</Link>
        <Link to="/patient/insurance" className="p-4 bg-white rounded shadow">Insurance</Link>
      </div>
      <div className="mt-6">
        <button onClick={()=>window.location.href='/'} className="btn">Back to Home</button>
      </div>
    </div>
  )
}
