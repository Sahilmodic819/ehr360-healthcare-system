// frontend/src/pages/Doctor/DoctorDashboard.jsx
import React from 'react';

export default function DoctorDashboard(){
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold">Doctor Dashboard</h2>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="p-4 bg-white rounded shadow"><a href="/doctor/patients" className="block">My Patients</a></div>
        <div className="p-4 bg-white rounded shadow"><a href="/doctor/search" className="block">Search Patients</a></div>
        <div className="p-4 bg-white rounded shadow"><a href="/doctor/insurance-requests" className="block">Insurance Requests</a></div>
        <div className="p-4 bg-white rounded shadow">Update History</div>
      </div>
      <div className="mt-6">
        <button onClick={()=>window.location.href='/'} className="btn">Back to Home</button>
      </div>
    </div>
  )
}
