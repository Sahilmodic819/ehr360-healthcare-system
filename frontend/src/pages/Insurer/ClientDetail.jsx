// frontend/src/pages/Insurer/ClientDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../utils/api';
import Layout from '../../components/Layout';

export default function ClientDetail() {
  const { id } = useParams();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadClient() {
      try {
        const res = await api.get(`/api/insurers/client/${id}`);
        setClient(res.data);
      } catch (error) {
        console.error(error);
        
        // Mock client data based on ID
        const mockClients = {
          'demo1': {
            _id: 'demo1',
            fullName: 'John Smith',
            email: 'john.smith@email.com',
            phone: '+1-555-0123',
            aabhaId: 'AABHA001',
            dateOfBirth: '1985-06-15',
            gender: 'Male',
            policyNumber: 'POL-2024-001',
            policyType: 'Comprehensive Health',
            premiumAmount: 15000,
            riskLevel: 'Medium',
            status: 'Active',
            address: '123 Main St, City, State 12345',
            lastClaim: '2025-08-15',
            totalClaims: 3,
            claimAmount: 45000,
            medicalHistory: ['Hypertension', 'Diabetes Type 2'],
            joinDate: '2024-01-15',
            emergencyContact: {
              name: 'Jane Smith',
              phone: '+1-555-0124',
              relationship: 'Spouse'
            }
          },
          'demo2': {
            _id: 'demo2',
            fullName: 'Sarah Johnson',
            email: 'sarah.johnson@email.com',
            phone: '+1-555-0125',
            aabhaId: 'AABHA002',
            dateOfBirth: '1990-03-22',
            gender: 'Female',
            policyNumber: 'POL-2024-002',
            policyType: 'Basic Health',
            premiumAmount: 8000,
            riskLevel: 'Low',
            status: 'Active',
            address: '456 Oak Ave, City, State 12346',
            lastClaim: '2025-07-10',
            totalClaims: 1,
            claimAmount: 8500,
            medicalHistory: ['Asthma'],
            joinDate: '2024-02-20',
            emergencyContact: {
              name: 'Mike Johnson',
              phone: '+1-555-0126',
              relationship: 'Husband'
            }
          }
        };

        // Use the client data for the specific ID, or default to demo1
        const clientData = mockClients[id] || mockClients['demo1'];
        setClient(clientData);
      } finally {
        setLoading(false);
      }
    }
    loadClient();
  }, [id]);

  const calculateAge = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading client details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!client) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <span className="text-4xl mb-4 block">❌</span>
            <p className="text-gray-500">Client not found</p>
            <Link to="/insurer/clients" className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Back to Clients
            </Link>
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
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{client.fullName}</h1>
                <p className="mt-2 text-gray-600">Client Portfolio Details</p>
              </div>
              <Link
                to="/insurer/clients"
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                ← Back to Clients
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Client Information */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Full Name</p>
                    <p className="font-medium text-gray-900">{client.fullName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Age</p>
                    <p className="font-medium text-gray-900">{calculateAge(client.dateOfBirth)} years old</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Gender</p>
                    <p className="font-medium text-gray-900">{client.gender}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Date of Birth</p>
                    <p className="font-medium text-gray-900">{formatDate(client.dateOfBirth)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium text-gray-900">{client.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium text-gray-900">{client.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">AABHA ID</p>
                    <p className="font-medium text-gray-900">{client.aabhaId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Join Date</p>
                    <p className="font-medium text-gray-900">{formatDate(client.joinDate)}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-600">Address</p>
                  <p className="font-medium text-gray-900">{client.address}</p>
                </div>
              </div>

              {/* Policy Information */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Policy Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Policy Number</p>
                    <p className="font-medium text-gray-900">{client.policyNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Policy Type</p>
                    <p className="font-medium text-gray-900">{client.policyType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Premium Amount</p>
                    <p className="font-medium text-gray-900">₹{client.premiumAmount?.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      client.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {client.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Medical History */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Medical History</h3>
                {client.medicalHistory && client.medicalHistory.length > 0 ? (
                  <div className="space-y-2">
                    {client.medicalHistory.map((condition, index) => (
                      <div key={index} className="flex items-center p-3 bg-blue-50 rounded-lg">
                        <span className="text-blue-600 mr-3">🏥</span>
                        <span className="font-medium text-gray-900">{condition}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No medical history recorded</p>
                )}
              </div>

              {/* Emergency Contact */}
              {client.emergencyContact && (
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Name</p>
                      <p className="font-medium text-gray-900">{client.emergencyContact.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-medium text-gray-900">{client.emergencyContact.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Relationship</p>
                      <p className="font-medium text-gray-900">{client.emergencyContact.relationship}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Risk Assessment */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Assessment</h3>
                <div className="text-center">
                  <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center text-2xl font-bold ${
                    client.riskLevel === 'High' ? 'bg-red-100 text-red-800' :
                    client.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {client.riskLevel === 'High' ? '⚠️' : client.riskLevel === 'Medium' ? '⚡' : '✅'}
                  </div>
                  <p className="mt-2 font-semibold text-gray-900">{client.riskLevel} Risk</p>
                  <p className="text-sm text-gray-600">Based on medical history and claims</p>
                </div>
              </div>

              {/* Claims Summary */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Claims Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Claims</span>
                    <span className="font-semibold">{client.totalClaims}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Amount</span>
                    <span className="font-semibold">₹{client.claimAmount?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Claim</span>
                    <span className="font-semibold">{formatDate(client.lastClaim)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Claim Ratio</span>
                    <span className={`font-semibold ${
                      client.premiumAmount > 0 && (client.claimAmount / client.premiumAmount) > 0.8 ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {client.premiumAmount > 0 ? ((client.claimAmount / client.premiumAmount) * 100).toFixed(1) : 0}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <button className="w-full px-4 py-2 text-left bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors">
                    📞 Contact Client
                  </button>
                  <button className="w-full px-4 py-2 text-left bg-green-50 text-green-700 rounded-md hover:bg-green-100 transition-colors">
                    💰 Update Premium
                  </button>
                  <button className="w-full px-4 py-2 text-left bg-purple-50 text-purple-700 rounded-md hover:bg-purple-100 transition-colors">
                    📋 Review Policy
                  </button>
                  <Link 
                    to="/insurer/claims"
                    className="w-full px-4 py-2 text-left bg-orange-50 text-orange-700 rounded-md hover:bg-orange-100 transition-colors block"
                  >
                    📄 View Claims
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}