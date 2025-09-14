// frontend/src/pages/Insurer/InsurerDashboard.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import Layout from '../../components/Layout';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const COLORS = ["#0284c7", "#22c55e", "#ef4444", "#facc15"];

export default function InsurerDashboard() {
  const [profile, setProfile] = useState(null);
  const [claims, setClaims] = useState([]);
  const [stats, setStats] = useState({
    totalClients: 0,
    totalClaims: 0,
    pendingClaims: 0,
    approvedClaims: 0,
    rejectedClaims: 0,
    totalClaimsValue: 0,
    averageClaimValue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get('/api/insurers/me');
        setProfile(res.data);
        const c = await api.get('/api/insurers/claims');
        setClaims(c.data);
      } catch (e) {
        console.error(e);
        // Mock data for demo
        const mockClaims = [
          { _id: '1', patientName: 'John Smith', claimAmount: 15000, status: 'pending', submittedDate: new Date('2025-09-10') },
          { _id: '2', patientName: 'Sarah Johnson', claimAmount: 8500, status: 'approved', submittedDate: new Date('2025-09-08') },
          { _id: '3', patientName: 'Michael Brown', claimAmount: 12000, status: 'pending', submittedDate: new Date('2025-09-11') },
          { _id: '4', patientName: 'Emma Davis', claimAmount: 5500, status: 'approved', submittedDate: new Date('2025-09-05') },
          { _id: '5', patientName: 'Alice Cooper', claimAmount: 22000, status: 'rejected', submittedDate: new Date('2025-09-07') },
          { _id: '6', patientName: 'Robert Wilson', claimAmount: 18500, status: 'approved', submittedDate: new Date('2025-09-09') }
        ];
        setClaims(mockClaims);
        setProfile({
          fullName: 'HealthCare Plus Insurance',
          email: 'test.insurer@example.com',
          companyType: 'Health Insurance',
          clients: mockClaims.map(c => ({ name: c.patientName, status: 'active' }))
        });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  useEffect(() => {
    if (claims.length > 0) {
      const totalClaimsValue = claims.reduce((sum, claim) => sum + claim.claimAmount, 0);
      setStats({
        totalClients: profile?.clients?.length || claims.length,
        totalClaims: claims.length,
        pendingClaims: claims.filter(c => c.status === 'pending').length,
        approvedClaims: claims.filter(c => c.status === 'approved').length,
        rejectedClaims: claims.filter(c => c.status === 'rejected').length,
        totalClaimsValue: totalClaimsValue,
        averageClaimValue: totalClaimsValue / claims.length
      });
    }
  }, [claims, profile]);

  const chartData = [
    { name: "Approved", value: stats.approvedClaims },
    { name: "Pending", value: stats.pendingClaims },
    { name: "Rejected", value: stats.rejectedClaims },
  ];

  const monthlyData = [
    { month: 'Jul', claims: 45, amount: 450000 },
    { month: 'Aug', claims: 52, amount: 520000 },
    { month: 'Sep', claims: 38, amount: 380000 },
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
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
            <h1 className="text-3xl font-bold text-gray-900">
              {getGreeting()}, {profile?.fullName?.split(' ')[0] || 'HealthCare Plus'}! 👋
            </h1>
            <p className="mt-2 text-gray-600">Here's your insurance dashboard overview</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100">
                  <span className="text-2xl">👥</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Clients</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalClients}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100">
                  <span className="text-2xl">📋</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Claims</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalClaims}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-yellow-100">
                  <span className="text-2xl">⏳</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending Claims</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pendingClaims}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100">
                  <span className="text-2xl">💰</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Claim Value</p>
                  <p className="text-2xl font-bold text-gray-900">₹{stats.totalClaimsValue?.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Charts and Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Claims Status Chart */}
            <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Claims Status Overview</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie 
                    data={chartData} 
                    dataKey="value" 
                    nameKey="name" 
                    outerRadius={100} 
                    label={({name, value}) => `${name}: ${value}`}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Quick Actions */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link 
                  to="/insurer/claims" 
                  className="w-full p-3 text-left bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors block"
                >
                  <div className="flex items-center">
                    <span className="text-xl mr-3">📋</span>
                    <div>
                      <div className="font-medium text-blue-900">Review Claims</div>
                      <div className="text-sm text-blue-700">{stats.pendingClaims} pending reviews</div>
                    </div>
                  </div>
                </Link>

                <Link 
                  to="/insurer/clients" 
                  className="w-full p-3 text-left bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg transition-colors block"
                >
                  <div className="flex items-center">
                    <span className="text-xl mr-3">👥</span>
                    <div>
                      <div className="font-medium text-green-900">My Clients</div>
                      <div className="text-sm text-green-700">Manage client portfolio</div>
                    </div>
                  </div>
                </Link>

                <Link 
                  to="/insurer/search" 
                  className="w-full p-3 text-left bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg transition-colors block"
                >
                  <div className="flex items-center">
                    <span className="text-xl mr-3">🔍</span>
                    <div>
                      <div className="font-medium text-purple-900">Search Clients</div>
                      <div className="text-sm text-purple-700">Find client information</div>
                    </div>
                  </div>
                </Link>

                <Link 
                  to="/insurer/risk" 
                  className="w-full p-3 text-left bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-lg transition-colors block"
                >
                  <div className="flex items-center">
                    <span className="text-xl mr-3">📊</span>
                    <div>
                      <div className="font-medium text-orange-900">Risk Analysis</div>
                      <div className="text-sm text-orange-700">Assess client risk profiles</div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Monthly Trends */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Claims Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="claims" fill="#0284c7" name="Number of Claims" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Recent Activity */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Claims Activity</h3>
            <div className="space-y-3">
              {claims.slice(0, 5).map((claim, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold">{claim.patientName[0]}</span>
                    </div>
                    <div className="ml-3">
                      <p className="font-medium text-gray-900">{claim.patientName}</p>
                      <p className="text-sm text-gray-600">₹{claim.claimAmount?.toLocaleString()} claim</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      claim.status === 'approved' ? 'bg-green-100 text-green-800' :
                      claim.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {claim.status}
                    </span>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(claim.submittedDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}