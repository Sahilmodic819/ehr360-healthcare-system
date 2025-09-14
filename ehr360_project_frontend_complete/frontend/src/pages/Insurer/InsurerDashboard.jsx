// frontend/src/pages/Insurer/InsurerDashboard.jsx
import React from 'react';

export default function InsurerDashboard(){
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold">Insurer Dashboard</h2>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="p-4 bg-white rounded shadow"><a href="/insurer/clients" className="block">My Clients</a></div>
        <div className="p-4 bg-white rounded shadow"><a href="/insurer/search" className="block">Search Clients</a></div>
        <div className="p-4 bg-white rounded shadow"><a href="/insurer/claims" className="block">Claims Review</a></div>
        <div className="p-4 bg-white rounded shadow"><a href="/insurer/risk" className="block">Risk Analysis</a></div>
      </div>
      <div className="mt-6">
        <button onClick={()=>window.location.href='/'} className="btn">Back to Home</button>
      </div>
    </div>
  )
}
