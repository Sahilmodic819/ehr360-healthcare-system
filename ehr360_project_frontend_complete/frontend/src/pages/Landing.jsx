
// frontend/src/pages/Landing.jsx
import React from 'react'
import { Link } from 'react-router-dom'
export default function Landing(){
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">EHR 360</h1>
      <p className="mt-2">Your Health, Your Data, Your Power</p>
      <div className="mt-4">
        <Link to="/login" className="btn mr-2">Login</Link>
        <Link to="/register/patient" className="btn">Register as Patient</Link>
      </div>
    </div>
  )
}
