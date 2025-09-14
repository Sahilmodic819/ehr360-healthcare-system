// frontend/src/pages/Doctor/MyPatients.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import api from '../../utils/api';

export default function MyPatients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    async function loadMyPatients() {
      try {
        const res = await api.get('/api/doctors/me');
        setPatients(res.data?.patients || []);
      } catch (error) {
        console.error('Failed to load patients:', error);
      } finally {
        setLoading(false);
      }
    }
    loadMyPatients();
  }, []);

  const getFilteredPatients = () => {
    let filtered = [...patients];
    
    switch (filter) {
      case 'active':
        filtered = filtered.filter(p => p.ongoingTreatments?.length > 0);
        break;
      case 'recent':
        filtered = filtered.filter(p => {
          const lastUpdate = new Date(p.updatedAt || p.createdAt);
          const daysSince = (new Date() - lastUpdate) / (1000 * 60 * 60 * 24);
          return daysSince <= 7;
        });
        break;
      default:
        break;
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return (a.fullName || '').localeCompare(b.fullName || '');
        case 'recent':
          return new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt);
        case 'treatments':
          return (b.ongoingTreatments?.length || 0) - (a.ongoingTreatments?.length || 0);
        default:
          return 0;
      }
    });

    return filtered;
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
  };

  const calculateAge = (dob) => {
    if (!dob) return 'N/A';
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const filteredPatients = getFilteredPatients();

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your patients...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Patients</h1>
            <p className="mt-2 text-gray-600">Manage and monitor your patient records</p>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
              <div className="flex items-center">
                <div className="text-2xl mr-3">👥</div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Patients</p>
                  <p className="text-2xl font-bold text-blue-600">{patients.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
              <div className="flex items-center">
                <div className="text-2xl mr-3">💚</div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Active Treatments</p>
                  <p className="text-2xl font-bold text-green-600">
                    {patients.filter(p => p.ongoingTreatments?.length > 0).length}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
              <div className="flex items-center">
                <div className="text-2xl mr-3">📋</div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Recent Updates</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {patients.filter(p => {
                      const lastUpdate = new Date(p.updatedAt || p.createdAt);
                      const daysSince = (new Date() - lastUpdate) / (1000 * 60 * 60 * 24);
                      return daysSince <= 7;
                    }).length}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
              <div className="flex items-center">
                <div className="text-2xl mr-3">🩺</div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Treatments</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {patients.reduce((sum, p) => sum + (p.ongoingTreatments?.length || 0), 0)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Controls */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === 'all' 
                      ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All Patients ({patients.length})
                </button>
                <button
                  onClick={() => setFilter('active')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === 'active' 
                      ? 'bg-green-100 text-green-700 border border-green-300' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Active Treatments ({patients.filter(p => p.ongoingTreatments?.length > 0).length})
                </button>
                <button
                  onClick={() => setFilter('recent')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === 'recent' 
                      ? 'bg-purple-100 text-purple-700 border border-purple-300' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Recent Updates
                </button>
              </div>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="name">Sort by Name</option>
                <option value="recent">Sort by Recent</option>
                <option value="treatments">Sort by Treatments</option>
              </select>
            </div>
          </div>

          {/* Patient List */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {filter === 'all' && `All Patients (${filteredPatients.length})`}
                {filter === 'active' && `Patients with Active Treatments (${filteredPatients.length})`}
                {filter === 'recent' && `Recently Updated Patients (${filteredPatients.length})`}
              </h2>

              {filteredPatients.length > 0 ? (
                <div className="space-y-4">
                  {filteredPatients.map((patient) => (
                    <div key={patient._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                            {patient.fullName?.charAt(0) || 'P'}
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">{patient.fullName}</h3>
                            <div className="text-sm text-gray-600 space-y-1">
                              <p>📧 {patient.email}</p>
                              <p>🎂 Age: {calculateAge(patient.dob)} • Gender: {patient.gender || 'N/A'}</p>
                              {patient.phone && <p>📞 {patient.phone}</p>}
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="flex space-x-2 mb-2">
                            <Link 
                              to={`/doctor/patient/${patient._id || patient.userId}`}
                              className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                            >
                              View Details
                            </Link>
                            <button 
                              onClick={() => window.open(`tel:${patient.phone}`, '_self')}
                              className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
                            >
                              Call
                            </button>
                          </div>
                          <div className="text-xs text-gray-500">
                            Last updated: {formatDate(patient.updatedAt || patient.createdAt)}
                          </div>
                        </div>
                      </div>
                      
                      {/* Patient Overview */}
                      <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-4 pt-4 border-t border-gray-100">
                        <div className="text-center">
                          <div className="text-lg font-semibold text-blue-600">{patient.medications?.length || 0}</div>
                          <div className="text-xs text-gray-500">Medications</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold text-red-600">{patient.allergies?.length || 0}</div>
                          <div className="text-xs text-gray-500">Allergies</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold text-purple-600">{patient.labReports?.length || 0}</div>
                          <div className="text-xs text-gray-500">Lab Reports</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold text-orange-600">{patient.ongoingTreatments?.length || 0}</div>
                          <div className="text-xs text-gray-500">Treatments</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold text-green-600">{patient.immunizations?.length || 0}</div>
                          <div className="text-xs text-gray-500">Immunizations</div>
                        </div>
                      </div>
                      
                      {/* Active Treatments */}
                      {patient.ongoingTreatments && patient.ongoingTreatments.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Active Treatments:</h4>
                          <div className="flex flex-wrap gap-2">
                            {patient.ongoingTreatments.slice(0, 3).map((treatment, index) => (
                              <span key={index} className="px-2 py-1 text-xs bg-orange-100 text-orange-700 rounded-full">
                                {treatment.name}
                              </span>
                            ))}
                            {patient.ongoingTreatments.length > 3 && (
                              <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                                +{patient.ongoingTreatments.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <p className="text-gray-500">
                    {filter === 'all' && 'No patients assigned to you yet'}
                    {filter === 'active' && 'No patients with active treatments'}
                    {filter === 'recent' && 'No recent patient updates'}
                  </p>
                  <Link 
                    to="/doctor/search" 
                    className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Search for Patients
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}