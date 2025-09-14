
// frontend/src/App.jsx
import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Landing from './pages/Landing'
import Login from './pages/Auth/Login'
import PatientRegister from './pages/Auth/PatientRegister'
import PatientDashboard from './pages/Patient/PatientDashboard'
import SymptomTracker from './pages/Patient/SymptomTracker'
import MedicalRecords from './pages/Patient/MedicalRecords'
import LabReports from './pages/Patient/LabReports'
import Immunizations from './pages/Patient/Immunizations'
import Medications from './pages/Patient/Medications'
import Allergies from './pages/Patient/Allergies'
import OngoingTreatments from './pages/Patient/OngoingTreatments'
import InsurancePage from './pages/Patient/Insurance'
import PatientProfile from './pages/Patient/PatientProfile'

import MyPatients from './pages/Doctor/MyPatients'
import SearchPatients from './pages/Doctor/SearchPatients'
import PatientDetail from './pages/Doctor/PatientDetail'
import InsuranceRequests from './pages/Doctor/InsuranceRequests'

import MyClients from './pages/Insurer/MyClients'
import SearchClients from './pages/Insurer/SearchClients'
import ClaimsReview from './pages/Insurer/ClaimsReview'
import RiskAnalysis from './pages/Insurer/RiskAnalysis'


export default function App(){
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="p-4 bg-white shadow">
        <Link to="/" className="font-bold mr-4">EHR360</Link>
        <Link to="/login" className="mr-2">Login</Link>
        <Link to="/register/patient">Register</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Landing/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register/patient" element={<PatientRegister/>} />
        <Route path="/dashboard" element={<PatientDashboard/>} />
      
        <Route path="/patient/symptoms" element={<SymptomTracker/>} />
        <Route path="/patient/records" element={<MedicalRecords/>} />
        <Route path="/patient/labs" element={<LabReports/>} />
        <Route path="/patient/immunizations" element={<Immunizations/>} />
        <Route path="/patient/medications" element={<Medications/>} />
        <Route path="/patient/allergies" element={<Allergies/>} />
        <Route path="/patient/treatments" element={<OngoingTreatments/>} />
        <Route path="/patient/insurance" element={<InsurancePage/>} />
        <Route path="/patient/profile" element={<PatientProfile/>} />

        <Route path="/doctor/patients" element={<MyPatients/>} />
        <Route path="/doctor/search" element={<SearchPatients/>} />
        <Route path="/doctor/patient/:id" element={<PatientDetail/>} />
        <Route path="/doctor/insurance-requests" element={<InsuranceRequests/>} />

        <Route path="/insurer/clients" element={<MyClients/>} />
        <Route path="/insurer/search" element={<SearchClients/>} />
        <Route path="/insurer/claims" element={<ClaimsReview/>} />
        <Route path="/insurer/risk" element={<RiskAnalysis/>} />

      </Routes>
    </div>
  )
}
