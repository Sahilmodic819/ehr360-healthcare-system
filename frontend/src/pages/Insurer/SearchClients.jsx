// frontend/src/pages/Insurer/SearchClients.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import api from '../../utils/api';

export default function SearchClients() {
  const [searchTerm, setSearchTerm] = useState('');
  const [clients, setClients] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchFilter, setSearchFilter] = useState('all');

  useEffect(() => {
    async function loadClients() {
      try {
        const res = await api.get('/api/insurers/clients');
        setClients(res.data);
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
            joinDate: '2024-01-15',
            address: '123 Main St, City, State 12345'
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
            joinDate: '2024-02-20',
            address: '456 Oak Ave, City, State 12346'
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
            joinDate: '2024-03-10',
            address: '789 Pine St, City, State 12347'
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
            joinDate: '2025-08-01',
            address: '321 Elm St, City, State 12348'
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
            joinDate: '2024-01-05',
            address: '987 Oak Lane, City, State 12349'
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
            joinDate: '2024-04-12',
            address: '555 Maple Dr, City, State 12350'
          },
          {
            _id: 'demo7',
            fullName: 'Lisa Chen',
            email: 'lisa.chen@email.com',
            phone: '+1-555-0135',
            aabhaId: 'AABHA007',
            dateOfBirth: '1988-09-14',
            gender: 'Female',
            policyNumber: 'POL-2024-007',
            policyType: 'Comprehensive Health',
            premiumAmount: 18000,
            riskLevel: 'Medium',
            status: 'Inactive',
            lastClaim: '2025-05-15',
            totalClaims: 4,
            claimAmount: 67000,
            medicalHistory: ['Migraine', 'Anxiety'],
            joinDate: '2024-06-18',
            address: '777 Cedar St, City, State 12351'
          }
        ];
        
        setClients(mockClients);
      } finally {
        setLoading(false);
      }
    }
    loadClients();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSearchResults([]);
      return;
    }

    let filteredClients = clients;
    
    // Apply search filter first
    if (searchFilter === 'active') {
      filteredClients = clients.filter(c => c.status === 'Active');
    } else if (searchFilter === 'highrisk') {
      filteredClients = clients.filter(c => c.riskLevel === 'High');
    } else if (searchFilter === 'recent') {
      filteredClients = clients.filter(c => c.lastClaim && 
        new Date(c.lastClaim) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      );
    }

    // Then apply search term
    const filtered = filteredClients.filter(client =>
      client.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone?.includes(searchTerm) ||
      client.aabhaId?.includes(searchTerm) ||
      client.policyNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.policyType?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setSearchResults(filtered);
  }, [searchTerm, clients, searchFilter]);

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
            <h1 className="text-3xl font-bold text-gray-900">Search Clients</h1>
            <p className="mt-2 text-gray-600">Find and manage client information</p>
          </div>

          {/* Search Bar */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                  Search Clients
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-400 text-xl">🔍</span>
                  </div>
                  <input
                    type="text"
                    id="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by name, email, phone, AABHA ID, or policy number..."
                    className="block w-full pl-12 pr-3 py-3 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div className="md:w-48">
                <label htmlFor="filter" className="block text-sm font-medium text-gray-700 mb-2">
                  Filter By
                </label>
                <select
                  id="filter"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="block w-full py-3 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Clients</option>
                  <option value="active">Active Only</option>
                  <option value="highrisk">High Risk</option>
                  <option value="recent">Recent Claims</option>
                </select>
              </div>
            </div>
          </div>

          {/* Search Results */}
          {searchTerm.trim() !== '' && (
            <div className="bg-white rounded-lg shadow-md">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Search Results ({searchResults.length})
                </h3>
                {searchTerm && (
                  <p className="text-sm text-gray-600 mt-1">
                    Searching for: "{searchTerm}"
                  </p>
                )}
              </div>
              
              {searchResults.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {searchResults.map((client) => (
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
                            <p className="text-sm text-gray-500">{client.phone}</p>
                            <p className="text-sm text-gray-500">
                              AABHA: {client.aabhaId} • Policy: {client.policyNumber}
                            </p>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="flex items-center space-x-4 mb-2">
                            <div className="text-sm">
                              <p className="text-gray-500">Age</p>
                              <p className="font-semibold">{calculateAge(client.dateOfBirth)}</p>
                            </div>
                            <div className="text-sm">
                              <p className="text-gray-500">Policy Type</p>
                              <p className="font-semibold">{client.policyType}</p>
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
                              <p className="text-gray-500">Status</p>
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                client.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                                {client.status}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex space-x-2">
                            <Link
                              to={`/insurer/client/${client._id}`}
                              className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                            >
                              View Details
                            </Link>
                            <button className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors">
                              Contact
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Premium</p>
                          <p className="font-medium">₹{client.premiumAmount?.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Total Claims</p>
                          <p className="font-medium">{client.totalClaims}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Last Claim</p>
                          <p className="font-medium">{formatDate(client.lastClaim)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Join Date</p>
                          <p className="font-medium">{formatDate(client.joinDate)}</p>
                        </div>
                      </div>
                      
                      {client.medicalHistory?.length > 0 && (
                        <div className="mt-3">
                          <p className="text-sm text-gray-500">Medical History:</p>
                          <p className="text-sm font-medium">{client.medicalHistory.join(', ')}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <span className="text-4xl mb-4 block">🔍</span>
                  <p className="text-gray-500">No clients found matching your search criteria.</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Try adjusting your search terms or filters.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Instructions */}
          {searchTerm.trim() === '' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-medium text-blue-900 mb-3">🔍 Search Instructions</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Enter a name, email, or phone number to search for clients</li>
                <li>• Search by AABHA ID or policy number for specific records</li>
                <li>• Use filters to narrow down your search results</li>
                <li>• Search is case-insensitive and supports partial matches</li>
                <li>• Click "View Details" to see complete client information</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}