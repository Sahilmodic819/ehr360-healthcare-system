// frontend/src/pages/Insurer/MyClients.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import api from '../../utils/api';

export default function MyClients() {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    highrisk: 0,
    newthismonth: 0
  });

  useEffect(() => {
    async function loadClients() {
      try {
        const res = await api.get('/api/insurers/clients');
        setClients(res.data);
        setFilteredClients(res.data);
      } catch (error) {
        console.error('Failed to load clients:', error);
        
        // Mock client data for demo
        const mockClients = [
          {
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
            lastClaim: '2025-08-15',
            totalClaims: 3,
            claimAmount: 45000,
            medicalHistory: ['Hypertension', 'Diabetes Type 2'],
            joinDate: '2024-01-15'
          },
          {
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
            lastClaim: '2025-07-10',
            totalClaims: 1,
            claimAmount: 8500,
            medicalHistory: ['Asthma'],
            joinDate: '2024-02-20'
          },
          {
            _id: 'demo3',
            fullName: 'Michael Brown',
            email: 'michael.brown@email.com',
            phone: '+1-555-0127',
            aabhaId: 'AABHA003',
            dateOfBirth: '1978-11-08',
            gender: 'Male',
            policyNumber: 'POL-2024-003',
            policyType: 'Premium Health',
            premiumAmount: 25000,
            riskLevel: 'Medium',
            status: 'Active',
            lastClaim: '2025-09-01',
            totalClaims: 2,
            claimAmount: 32000,
            medicalHistory: ['High Cholesterol'],
            joinDate: '2024-03-10'
          },
          {
            _id: 'demo4',
            fullName: 'Emma Davis',
            email: 'emma.davis@email.com',
            phone: '+1-555-0129',
            aabhaId: 'AABHA004',
            dateOfBirth: '1995-07-30',
            gender: 'Female',
            policyNumber: 'POL-2024-004',
            policyType: 'Basic Health',
            premiumAmount: 6000,
            riskLevel: 'Low',
            status: 'Active',
            lastClaim: null,
            totalClaims: 0,
            claimAmount: 0,
            medicalHistory: [],
            joinDate: '2025-08-01'
          },
          {
            _id: 'demo5',
            fullName: 'Alice Cooper',
            email: 'alice.cooper@email.com',
            phone: '+1-555-0131',
            aabhaId: 'AABHA005',
            dateOfBirth: '1972-12-12',
            gender: 'Female',
            policyNumber: 'POL-2024-005',
            policyType: 'Senior Health',
            premiumAmount: 35000,
            riskLevel: 'High',
            status: 'Active',
            lastClaim: '2025-09-05',
            totalClaims: 5,
            claimAmount: 125000,
            medicalHistory: ['Hypothyroidism', 'Arthritis', 'Hypertension'],
            joinDate: '2024-01-05'
          },
          {
            _id: 'demo6',
            fullName: 'Robert Wilson',
            email: 'robert.wilson@email.com',
            phone: '+1-555-0133',
            aabhaId: 'AABHA006',
            dateOfBirth: '1980-04-18',
            gender: 'Male',
            policyNumber: 'POL-2024-006',
            policyType: 'Family Health',
            premiumAmount: 20000,
            riskLevel: 'Low',
            status: 'Active',
            lastClaim: '2025-06-20',
            totalClaims: 2,
            claimAmount: 18500,
            medicalHistory: ['None'],
            joinDate: '2024-04-12'
          }
        ];
        
        setClients(mockClients);
        setFilteredClients(mockClients);
      } finally {
        setLoading(false);
      }
    }
    loadClients();
  }, []);

  useEffect(() => {
    if (clients.length > 0) {
      const newClients = clients.filter(c => 
        new Date(c.joinDate) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      );
      
      setStats({
        total: clients.length,
        active: clients.filter(c => c.status === 'Active').length,
        highrisk: clients.filter(c => c.riskLevel === 'High').length,
        newthismonth: newClients.length
      });
    }
  }, [clients]);

  useEffect(() => {
    let filtered = clients;
    
    if (filter === 'active') {
      filtered = clients.filter(c => c.status === 'Active');
    } else if (filter === 'highrisk') {
      filtered = clients.filter(c => c.riskLevel === 'High');
    } else if (filter === 'recent') {
      filtered = clients.filter(c => c.lastClaim && 
        new Date(c.lastClaim) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      );
    }
    
    setFilteredClients(filtered);
  }, [filter, clients]);

  const formatDate = (date) => {
    if (!date) return 'Never';
    return new Date(date).toLocaleDateString();
  };

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

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading clients...</p>
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
            <h1 className="text-3xl font-bold text-gray-900">My Clients</h1>
            <p className="mt-2 text-gray-600">Manage your client portfolio and policies</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100">
                  <span className="text-2xl">👥</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Clients</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100">
                  <span className="text-2xl">✅</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Policies</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-red-100">
                  <span className="text-2xl">⚠️</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">High Risk</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.highrisk}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100">
                  <span className="text-2xl">🆕</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">New This Month</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.newthismonth}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter Clients</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Clients ({clients.length})
              </button>
              <button
                onClick={() => setFilter('active')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'active'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Active ({stats.active})
              </button>
              <button
                onClick={() => setFilter('highrisk')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'highrisk'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                High Risk ({stats.highrisk})
              </button>
              <button
                onClick={() => setFilter('recent')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'recent'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Recent Claims
              </button>
            </div>
          </div>

          {/* Clients List */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Client Portfolio ({filteredClients.length})
              </h3>
            </div>
            
            {filteredClients.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {filteredClients.map((client) => (
                  <div key={client._id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold text-lg">
                            {client.fullName[0]}
                          </span>
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">{client.fullName}</h4>
                          <p className="text-gray-600">{client.email}</p>
                          <p className="text-sm text-gray-500">
                            Policy: {client.policyNumber} • {client.policyType}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-center space-x-4">
                          <div className="text-sm">
                            <p className="text-gray-500">Age</p>
                            <p className="font-semibold">{calculateAge(client.dateOfBirth)}</p>
                          </div>
                          <div className="text-sm">
                            <p className="text-gray-500">Premium</p>
                            <p className="font-semibold">₹{client.premiumAmount?.toLocaleString()}</p>
                          </div>
                          <div className="text-sm">
                            <p className="text-gray-500">Risk Level</p>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              client.riskLevel === 'High' ? 'bg-red-100 text-red-800' :
                              client.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {client.riskLevel}
                            </span>
                          </div>
                          <div className="text-sm">
                            <p className="text-gray-500">Claims</p>
                            <p className="font-semibold">{client.totalClaims}</p>
                          </div>
                        </div>
                        
                        <div className="mt-4 flex space-x-2">
                          <Link
                            to={`/insurer/client/${client._id}`}
                            className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                          >
                            View Details
                          </Link>
                          <button className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
                            Contact
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Last Claim</p>
                        <p className="font-medium">{formatDate(client.lastClaim)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Total Claim Amount</p>
                        <p className="font-medium">₹{client.claimAmount?.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Medical History</p>
                        <p className="font-medium">
                          {client.medicalHistory?.length > 0 
                            ? client.medicalHistory.join(', ') 
                            : 'None'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No clients found for the selected filter.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}