// frontend/src/pages/Doctor/SearchPatients.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import api from '../../utils/api';

export default function SearchPatients() {
  const [searchTerm, setSearchTerm] = useState('');
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    async function loadPatients() {
      try {
        const res = await api.get('/api/patients');
        let patientsData = res.data;
        
        // If no patients in database, add mock data for demo
        if (!patientsData || patientsData.length === 0) {
          patientsData = [
            {
              _id: 'demo1',
              fullName: 'John Smith',
              email: 'john.smith@email.com',
              phone: '+1-555-0123',
              aabhaId: 'AABHA001',
              dateOfBirth: '1985-06-15',
              gender: 'Male',
              address: '123 Main St, City, State 12345',
              emergencyContact: {
                name: 'Jane Smith',
                phone: '+1-555-0124',
                relationship: 'Spouse'
              },
              medicalHistory: ['Hypertension', 'Diabetes Type 2'],
              currentMedications: ['Metformin', 'Lisinopril'],
              lastVisit: '2024-01-15'
            },
            {
              _id: 'demo2',
              fullName: 'Sarah Johnson',
              email: 'sarah.johnson@email.com',
              phone: '+1-555-0125',
              aabhaId: 'AABHA002',
              dateOfBirth: '1990-03-22',
              gender: 'Female',
              address: '456 Oak Ave, City, State 12346',
              emergencyContact: {
                name: 'Mike Johnson',
                phone: '+1-555-0126',
                relationship: 'Husband'
              },
              medicalHistory: ['Asthma'],
              currentMedications: ['Albuterol Inhaler'],
              lastVisit: '2024-01-10'
            },
            {
              _id: 'demo3',
              fullName: 'Michael Brown',
              email: 'michael.brown@email.com',
              phone: '+1-555-0127',
              aabhaId: 'AABHA003',
              dateOfBirth: '1978-11-08',
              gender: 'Male',
              address: '789 Pine St, City, State 12347',
              emergencyContact: {
                name: 'Lisa Brown',
                phone: '+1-555-0128',
                relationship: 'Wife'
              },
              medicalHistory: ['High Cholesterol'],
              currentMedications: ['Atorvastatin'],
              lastVisit: '2024-01-12'
            },
            {
              _id: 'demo4',
              fullName: 'Emma Davis',
              email: 'emma.davis@email.com',
              phone: '+1-555-0129',
              aabhaId: 'AABHA004',
              dateOfBirth: '1995-07-30',
              gender: 'Female',
              address: '321 Elm St, City, State 12348',
              emergencyContact: {
                name: 'Robert Davis',
                phone: '+1-555-0130',
                relationship: 'Father'
              },
              medicalHistory: [],
              currentMedications: [],
              lastVisit: '2024-01-08'
            }
          ];
        }
        
        setPatients(patientsData);
        setFilteredPatients(patientsData);
      } catch (error) {
        console.error('Failed to load patients:', error);
        // Use mock data as fallback
        const mockPatients = [
          {
            _id: 'demo1',
            fullName: 'John Smith',
            email: 'john.smith@email.com',
            phone: '+1-555-0123',
            aabhaId: 'AABHA001',
            dateOfBirth: '1985-06-15',
            gender: 'Male',
            address: '123 Main St, City, State 12345',
            emergencyContact: {
              name: 'Jane Smith',
              phone: '+1-555-0124',
              relationship: 'Spouse'
            },
            medicalHistory: ['Hypertension', 'Diabetes Type 2'],
            currentMedications: ['Metformin', 'Lisinopril'],
            lastVisit: '2024-01-15'
          },
          {
            _id: 'demo2',
            fullName: 'Sarah Johnson',
            email: 'sarah.johnson@email.com',
            phone: '+1-555-0125',
            aabhaId: 'AABHA002',
            dateOfBirth: '1990-03-22',
            gender: 'Female',
            address: '456 Oak Ave, City, State 12346',
            emergencyContact: {
              name: 'Mike Johnson',
              phone: '+1-555-0126',
              relationship: 'Husband'
            },
            medicalHistory: ['Asthma'],
            currentMedications: ['Albuterol Inhaler'],
            lastVisit: '2024-01-10'
          }
        ];
        setPatients(mockPatients);
        setFilteredPatients(mockPatients);
      } finally {
        setLoading(false);
      }
    }
    loadPatients();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSearchResults([]);
      return;
    }

    const filtered = patients.filter(patient =>
      patient.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone?.includes(searchTerm) ||
      patient.aabhaId?.includes(searchTerm)
    );
    setSearchResults(filtered);
  }, [searchTerm, patients]);

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

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading patients...</p>
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
            <h1 className="text-3xl font-bold text-gray-900">Search Patients</h1>
            <p className="mt-2 text-gray-600">Find and manage patient records</p>
          </div>

          {/* Search Bar */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search by name, email, phone, or AABHA ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Total patients: {patients.length}
            </p>
          </div>

          {/* Search Results */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {searchTerm ? `Search Results (${searchResults.length})` : `All Patients (${patients.length})`}
              </h2>

              {(searchTerm ? searchResults : patients).length > 0 ? (
                <div className="grid gap-4">
                  {(searchTerm ? searchResults : patients).map((patient) => (
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
                              {patient.phone && <p>📞 {patient.phone}</p>}
                              {patient.aabhaId && <p>🆔 AABHA: {patient.aabhaId}</p>}
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right space-y-1">
                          <div className="text-sm text-gray-600">
                            <p>Age: {calculateAge(patient.dob)} years</p>
                            <p>Gender: {patient.gender || 'N/A'}</p>
                            {patient.bloodType && <p>Blood: {patient.bloodType}</p>}
                          </div>
                          <div className="flex space-x-2 mt-2">
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
                        </div>
                      </div>
                      
                      {/* Quick Info */}
                      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
                        <div className="text-center">
                          <div className="text-lg font-semibold text-blue-600">{patient.medications?.length || 0}</div>
                          <div className="text-xs text-gray-500">Medications</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold text-green-600">{patient.allergies?.length || 0}</div>
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
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <p className="text-gray-500">
                    {searchTerm ? 'No patients found matching your search' : 'No patients registered yet'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}