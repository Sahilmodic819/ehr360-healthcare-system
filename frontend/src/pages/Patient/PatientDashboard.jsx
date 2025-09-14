// frontend/src/pages/Patient/PatientDashboard.jsx
import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { Link } from 'react-router-dom';
import api from '../../utils/api';

export default function PatientDashboard(){
  const [patient, setPatient] = useState(null);
  const [stats, setStats] = useState({
    symptoms: 0,
    medications: 0,
    allergies: 0,
    reports: 0
  });
  const userId = localStorage.getItem('ehr_userId');

  useEffect(() => {
    async function loadPatientData() {
      try {
        if (!userId) {
          console.log('No userId found in localStorage');
          return;
        }
        console.log('Loading patient data for userId:', userId);
        const res = await api.get(`/api/patients/${userId}`);
        const patientData = res.data;
        console.log('Patient data loaded:', patientData);
        setPatient(patientData);
        
        // Calculate stats
        setStats({
          symptoms: patientData.symptoms?.length || 0,
          medications: patientData.medications?.filter(m => m.current)?.length || 0,
          allergies: patientData.allergies?.length || 0,
          reports: patientData.labReports?.length || 0
        });
      } catch (error) {
        console.error('Failed to load patient data:', error);
        console.error('Error response:', error.response?.data);
      }
    }
    
    loadPatientData();
  }, [userId]);

  const dashboardCards = [
    {
      title: 'Symptom Tracker',
      description: 'Track your daily symptoms and monitor your health',
      icon: '🩺',
      link: '/patient/symptoms',
      color: 'bg-blue-500',
      count: stats.symptoms,
      countLabel: 'symptoms logged'
    },
    {
      title: 'Medical Records',
      description: 'View and manage your complete medical history',
      icon: '📋',
      link: '/patient/records',
      color: 'bg-green-500',
      count: patient?.medicalRecords?.length || 0,
      countLabel: 'records'
    },
    {
      title: 'Lab Reports',
      description: 'Upload and view your laboratory test results',
      icon: '🧪',
      link: '/patient/labs',
      color: 'bg-purple-500',
      count: stats.reports,
      countLabel: 'lab reports'
    },
    {
      title: 'Medications',
      description: 'Manage your current and past medications',
      icon: '💊',
      link: '/patient/medications',
      color: 'bg-red-500',
      count: stats.medications,
      countLabel: 'current medications'
    },
    {
      title: 'Allergies',
      description: 'Keep track of your allergies and sensitivities',
      icon: '⚠️',
      link: '/patient/allergies',
      color: 'bg-orange-500',
      count: stats.allergies,
      countLabel: 'allergies'
    },
    {
      title: 'Immunizations',
      description: 'Track your vaccination history',
      icon: '💉',
      link: '/patient/immunizations',
      color: 'bg-indigo-500',
      count: patient?.immunizations?.length || 0,
      countLabel: 'immunizations'
    },
    {
      title: 'Ongoing Treatments',
      description: 'Monitor your current treatments and therapies',
      icon: '🏥',
      link: '/patient/treatments',
      color: 'bg-teal-500',
      count: patient?.ongoingTreatments?.length || 0,
      countLabel: 'treatments'
    },
    {
      title: 'Insurance',
      description: 'Manage insurance claims and coverage',
      icon: '🛡️',
      link: '/patient/insurance',
      color: 'bg-yellow-500',
      count: patient?.insuranceStatus?.length || 0,
      countLabel: 'claims'
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back{patient?.fullName ? `, ${patient.fullName}` : ''}!
            </h1>
            <p className="mt-2 text-gray-600">
              Manage your health information and track your wellness journey
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <div className="flex items-center">
                <div className="text-2xl">💊</div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Active Medications</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.medications}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <div className="flex items-center">
                <div className="text-2xl">⚠️</div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Allergies</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.allergies}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <div className="flex items-center">
                <div className="text-2xl">🧪</div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Lab Reports</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.reports}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <div className="flex items-center">
                <div className="text-2xl">🩺</div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Symptoms Logged</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.symptoms}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Dashboard Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {dashboardCards.map((card, index) => (
              <Link
                key={index}
                to={card.link}
                className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center text-white text-xl font-bold shadow-lg`}>
                      {card.icon}
                    </div>
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {card.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                    {card.description}
                  </p>
                  
                  <div className="flex items-center text-sm">
                    <span className="font-semibold text-gray-900">{card.count}</span>
                    <span className="text-gray-500 ml-1">{card.countLabel}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mt-12 bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <Link 
                to="/patient/symptoms"
                className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white mr-3">
                  📝
                </div>
                <div>
                  <p className="font-medium text-gray-900">Log Symptoms</p>
                  <p className="text-sm text-gray-600">Record how you're feeling today</p>
                </div>
              </Link>
              
              <Link 
                to="/patient/labs"
                className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
              >
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center text-white mr-3">
                  📄
                </div>
                <div>
                  <p className="font-medium text-gray-900">Upload Lab Report</p>
                  <p className="text-sm text-gray-600">Add new test results</p>
                </div>
              </Link>
              
              <Link 
                to="/patient/profile"
                className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
              >
                <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center text-white mr-3">
                  👤
                </div>
                <div>
                  <p className="font-medium text-gray-900">Update Profile</p>
                  <p className="text-sm text-gray-600">Manage your information</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}