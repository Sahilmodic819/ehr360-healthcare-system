// frontend/src/pages/Insurer/RiskAnalysis.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import api from '../../utils/api';
import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  LineChart, 
  Line,
  ScatterChart,
  Scatter
} from 'recharts';

const COLORS = ["#22c55e", "#facc15", "#ef4444"];
const AGE_COLORS = ["#0284c7", "#06b6d4", "#8b5cf6", "#ef4444"];

export default function RiskAnalysis() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedView, setSelectedView] = useState('overview');
  const [riskAnalytics, setRiskAnalytics] = useState({
    riskDistribution: [],
    ageRiskAnalysis: [],
    conditionRisk: [],
    claimTrends: [],
    riskFactors: []
  });

  useEffect(() => {
    async function loadRiskData() {
      try {
        const res = await api.get('/api/insurers/risk-analysis');
        setClients(res.data);
      } catch (error) {
        console.error('Failed to load risk analysis data:', error);
        
        // Mock client data for risk analysis
        const mockClients = [
          {
            _id: 'demo1',
            fullName: 'John Smith',
            age: 40,
            gender: 'Male',
            riskLevel: 'Medium',
            medicalHistory: ['Hypertension', 'Diabetes Type 2'],
            totalClaims: 3,
            claimAmount: 45000,
            premiumAmount: 15000,
            lifestyle: { smoking: false, drinking: 'occasional', exercise: 'regular' },
            bmi: 28.5,
            chronicConditions: 2
          },
          {
            _id: 'demo2',
            fullName: 'Sarah Johnson',
            age: 35,
            gender: 'Female',
            riskLevel: 'Low',
            medicalHistory: ['Asthma'],
            totalClaims: 1,
            claimAmount: 8500,
            premiumAmount: 8000,
            lifestyle: { smoking: false, drinking: 'never', exercise: 'regular' },
            bmi: 22.1,
            chronicConditions: 1
          },
          {
            _id: 'demo3',
            fullName: 'Michael Brown',
            age: 47,
            gender: 'Male',
            riskLevel: 'Medium',
            medicalHistory: ['High Cholesterol'],
            totalClaims: 2,
            claimAmount: 32000,
            premiumAmount: 25000,
            lifestyle: { smoking: false, drinking: 'moderate', exercise: 'light' },
            bmi: 26.8,
            chronicConditions: 1
          },
          {
            _id: 'demo4',
            fullName: 'Emma Davis',
            age: 30,
            gender: 'Female',
            riskLevel: 'Low',
            medicalHistory: [],
            totalClaims: 0,
            claimAmount: 0,
            premiumAmount: 6000,
            lifestyle: { smoking: false, drinking: 'never', exercise: 'regular' },
            bmi: 21.5,
            chronicConditions: 0
          },
          {
            _id: 'demo5',
            fullName: 'Alice Cooper',
            age: 53,
            gender: 'Female',
            riskLevel: 'High',
            medicalHistory: ['Hypothyroidism', 'Arthritis', 'Hypertension'],
            totalClaims: 5,
            claimAmount: 125000,
            premiumAmount: 35000,
            lifestyle: { smoking: false, drinking: 'never', exercise: 'light' },
            bmi: 31.2,
            chronicConditions: 3
          },
          {
            _id: 'demo6',
            fullName: 'Robert Wilson',
            age: 45,
            gender: 'Male',
            riskLevel: 'Low',
            medicalHistory: [],
            totalClaims: 2,
            claimAmount: 18500,
            premiumAmount: 20000,
            lifestyle: { smoking: false, drinking: 'occasional', exercise: 'regular' },
            bmi: 24.3,
            chronicConditions: 0
          },
          {
            _id: 'demo7',
            fullName: 'Lisa Chen',
            age: 37,
            gender: 'Female',
            riskLevel: 'Medium',
            medicalHistory: ['Migraine', 'Anxiety'],
            totalClaims: 4,
            claimAmount: 67000,
            premiumAmount: 18000,
            lifestyle: { smoking: false, drinking: 'moderate', exercise: 'light' },
            bmi: 25.7,
            chronicConditions: 2
          },
          {
            _id: 'demo8',
            fullName: 'David Kim',
            age: 58,
            gender: 'Male',
            riskLevel: 'High',
            medicalHistory: ['Diabetes Type 2', 'Heart Disease', 'Hypertension'],
            totalClaims: 7,
            claimAmount: 185000,
            premiumAmount: 42000,
            lifestyle: { smoking: true, drinking: 'moderate', exercise: 'none' },
            bmi: 32.1,
            chronicConditions: 3
          },
          {
            _id: 'demo9',
            fullName: 'Jennifer Martinez',
            age: 29,
            gender: 'Female',
            riskLevel: 'Low',
            medicalHistory: [],
            totalClaims: 1,
            claimAmount: 3500,
            premiumAmount: 5500,
            lifestyle: { smoking: false, drinking: 'never', exercise: 'regular' },
            bmi: 20.8,
            chronicConditions: 0
          },
          {
            _id: 'demo10',
            fullName: 'Thomas Anderson',
            age: 62,
            gender: 'Male',
            riskLevel: 'High',
            medicalHistory: ['Diabetes Type 2', 'Arthritis', 'High Cholesterol', 'Hypertension'],
            totalClaims: 9,
            claimAmount: 245000,
            premiumAmount: 48000,
            lifestyle: { smoking: true, drinking: 'moderate', exercise: 'light' },
            bmi: 29.8,
            chronicConditions: 4
          }
        ];
        
        setClients(mockClients);
      } finally {
        setLoading(false);
      }
    }
    loadRiskData();
  }, []);

  useEffect(() => {
    if (clients.length > 0) {
      // Risk Distribution
      const riskCounts = clients.reduce((acc, client) => {
        acc[client.riskLevel] = (acc[client.riskLevel] || 0) + 1;
        return acc;
      }, {});
      
      const riskDistribution = Object.entries(riskCounts).map(([level, count]) => ({
        name: level,
        value: count,
        percentage: ((count / clients.length) * 100).toFixed(1)
      }));

      // Age vs Risk Analysis
      const ageGroups = {
        '20-30': clients.filter(c => c.age >= 20 && c.age <= 30),
        '31-40': clients.filter(c => c.age >= 31 && c.age <= 40),
        '41-50': clients.filter(c => c.age >= 41 && c.age <= 50),
        '51-60': clients.filter(c => c.age >= 51 && c.age <= 60),
        '60+': clients.filter(c => c.age > 60)
      };

      const ageRiskAnalysis = Object.entries(ageGroups).map(([ageGroup, groupClients]) => {
        const lowRisk = groupClients.filter(c => c.riskLevel === 'Low').length;
        const mediumRisk = groupClients.filter(c => c.riskLevel === 'Medium').length;
        const highRisk = groupClients.filter(c => c.riskLevel === 'High').length;
        
        return {
          ageGroup,
          low: lowRisk,
          medium: mediumRisk,
          high: highRisk,
          total: groupClients.length,
          avgClaims: groupClients.length > 0 ? (groupClients.reduce((sum, c) => sum + c.totalClaims, 0) / groupClients.length).toFixed(1) : 0
        };
      });

      // Condition Risk Analysis
      const conditionCounts = {};
      clients.forEach(client => {
        client.medicalHistory.forEach(condition => {
          if (!conditionCounts[condition]) {
            conditionCounts[condition] = { count: 0, totalClaims: 0, totalAmount: 0 };
          }
          conditionCounts[condition].count++;
          conditionCounts[condition].totalClaims += client.totalClaims;
          conditionCounts[condition].totalAmount += client.claimAmount;
        });
      });

      const conditionRisk = Object.entries(conditionCounts)
        .map(([condition, data]) => ({
          condition,
          clients: data.count,
          avgClaims: (data.totalClaims / data.count).toFixed(1),
          avgAmount: Math.round(data.totalAmount / data.count),
          riskScore: Math.min(100, Math.round((data.totalClaims / data.count) * 10 + (data.totalAmount / data.count) / 1000))
        }))
        .sort((a, b) => b.riskScore - a.riskScore);

      // Claim vs Premium Analysis (Scatter)
      const claimTrends = clients.map(client => ({
        name: client.fullName,
        premium: client.premiumAmount,
        claims: client.claimAmount,
        risk: client.riskLevel,
        ratio: client.premiumAmount > 0 ? (client.claimAmount / client.premiumAmount * 100).toFixed(1) : 0
      }));

      // Risk Factors Analysis
      const riskFactors = [
        {
          factor: 'Age > 50',
          highRiskClients: clients.filter(c => c.age > 50 && c.riskLevel === 'High').length,
          totalClients: clients.filter(c => c.age > 50).length,
          impact: 'High'
        },
        {
          factor: 'Multiple Chronic Conditions',
          highRiskClients: clients.filter(c => c.chronicConditions >= 2 && c.riskLevel === 'High').length,
          totalClients: clients.filter(c => c.chronicConditions >= 2).length,
          impact: 'Very High'
        },
        {
          factor: 'BMI > 30',
          highRiskClients: clients.filter(c => c.bmi > 30 && c.riskLevel === 'High').length,
          totalClients: clients.filter(c => c.bmi > 30).length,
          impact: 'Medium'
        },
        {
          factor: 'Smoking',
          highRiskClients: clients.filter(c => c.lifestyle?.smoking && c.riskLevel === 'High').length,
          totalClients: clients.filter(c => c.lifestyle?.smoking).length,
          impact: 'High'
        },
        {
          factor: 'No Exercise',
          highRiskClients: clients.filter(c => c.lifestyle?.exercise === 'none' && c.riskLevel === 'High').length,
          totalClients: clients.filter(c => c.lifestyle?.exercise === 'none').length,
          impact: 'Medium'
        }
      ];

      setRiskAnalytics({
        riskDistribution,
        ageRiskAnalysis,
        conditionRisk,
        claimTrends,
        riskFactors
      });
    }
  }, [clients]);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading risk analysis...</p>
          </div>
        </div>
      </Layout>
    );
  }

  const totalClients = clients.length;
  const highRiskClients = clients.filter(c => c.riskLevel === 'High').length;
  const avgClaimsPerClient = totalClients > 0 ? (clients.reduce((sum, c) => sum + c.totalClaims, 0) / totalClients).toFixed(1) : 0;
  const totalClaimAmount = clients.reduce((sum, c) => sum + c.claimAmount, 0);

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Risk Analysis Dashboard</h1>
            <p className="mt-2 text-gray-600">Analyze client risk profiles and claims patterns</p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100">
                  <span className="text-2xl">👥</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Clients</p>
                  <p className="text-2xl font-bold text-gray-900">{totalClients}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-red-100">
                  <span className="text-2xl">⚠️</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">High Risk Clients</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {highRiskClients} <span className="text-sm text-gray-500">({((highRiskClients/totalClients)*100).toFixed(1)}%)</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-yellow-100">
                  <span className="text-2xl">📊</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Avg Claims/Client</p>
                  <p className="text-2xl font-bold text-gray-900">{avgClaimsPerClient}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100">
                  <span className="text-2xl">💰</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Claims Value</p>
                  <p className="text-2xl font-bold text-gray-900">₹{(totalClaimAmount/1000000).toFixed(1)}M</p>
                </div>
              </div>
            </div>
          </div>

          {/* View Selection */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Analysis Views</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedView('overview')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedView === 'overview'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Risk Overview
              </button>
              <button
                onClick={() => setSelectedView('age')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedView === 'age'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Age Analysis
              </button>
              <button
                onClick={() => setSelectedView('conditions')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedView === 'conditions'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Medical Conditions
              </button>
              <button
                onClick={() => setSelectedView('claims')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedView === 'claims'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Claims Analysis
              </button>
              <button
                onClick={() => setSelectedView('factors')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedView === 'factors'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Risk Factors
              </button>
            </div>
          </div>

          {/* Risk Overview */}
          {selectedView === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Level Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie 
                      data={riskAnalytics.riskDistribution} 
                      dataKey="value" 
                      nameKey="name" 
                      outerRadius={100} 
                      label={({name, percentage}) => `${name}: ${percentage}%`}
                    >
                      {riskAnalytics.riskDistribution.map((entry, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">High Risk Client Details</h3>
                <div className="space-y-3">
                  {clients.filter(c => c.riskLevel === 'High').map((client) => (
                    <div key={client._id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{client.fullName}</p>
                        <p className="text-sm text-gray-600">
                          Age: {client.age} • Claims: {client.totalClaims} • ₹{client.claimAmount?.toLocaleString()}
                        </p>
                        <p className="text-xs text-red-600">
                          {client.medicalHistory.slice(0, 2).join(', ')}
                          {client.medicalHistory.length > 2 && '...'}
                        </p>
                      </div>
                      <Link
                        to={`/insurer/client/${client._id}`}
                        className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                      >
                        View
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Age Analysis */}
          {selectedView === 'age' && (
            <div className="space-y-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Distribution by Age Group</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={riskAnalytics.ageRiskAnalysis}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="ageGroup" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="low" stackId="a" fill="#22c55e" name="Low Risk" />
                    <Bar dataKey="medium" stackId="a" fill="#facc15" name="Medium Risk" />
                    <Bar dataKey="high" stackId="a" fill="#ef4444" name="High Risk" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Average Claims by Age Group</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={riskAnalytics.ageRiskAnalysis}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="ageGroup" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="avgClaims" stroke="#0284c7" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Medical Conditions Analysis */}
          {selectedView === 'conditions' && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Medical Conditions Risk Analysis</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Condition
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Affected Clients
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Avg Claims/Client
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Avg Claim Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Risk Score
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {riskAnalytics.conditionRisk.map((condition, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {condition.condition}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {condition.clients}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {condition.avgClaims}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ₹{condition.avgAmount?.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  condition.riskScore >= 70 ? 'bg-red-500' :
                                  condition.riskScore >= 40 ? 'bg-yellow-500' :
                                  'bg-green-500'
                                }`}
                                style={{ width: `${condition.riskScore}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-600">{condition.riskScore}/100</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Claims Analysis */}
          {selectedView === 'claims' && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Claims vs Premium Analysis</h3>
              <ResponsiveContainer width="100%" height={400}>
                <ScatterChart data={riskAnalytics.claimTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="premium" name="Premium" unit="₹" />
                  <YAxis dataKey="claims" name="Claims" unit="₹" />
                  <Tooltip 
                    cursor={{ strokeDasharray: '3 3' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white p-3 border rounded shadow">
                            <p className="font-medium">{data.name}</p>
                            <p className="text-sm">Premium: ₹{data.premium?.toLocaleString()}</p>
                            <p className="text-sm">Claims: ₹{data.claims?.toLocaleString()}</p>
                            <p className="text-sm">Ratio: {data.ratio}%</p>
                            <p className="text-sm">Risk: {data.risk}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Scatter name="Clients" dataKey="claims" fill="#0284c7" />
                </ScatterChart>
              </ResponsiveContainer>
              
              <div className="mt-4 text-sm text-gray-600">
                <p><strong>Analysis:</strong> Points above the diagonal line indicate clients with claims exceeding their premiums.</p>
                <p>Higher positions indicate higher claim amounts, requiring premium adjustments or policy reviews.</p>
              </div>
            </div>
          )}

          {/* Risk Factors */}
          {selectedView === 'factors' && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Factor Analysis</h3>
              <div className="space-y-4">
                {riskAnalytics.riskFactors.map((factor, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900">{factor.factor}</h4>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        factor.impact === 'Very High' ? 'bg-red-100 text-red-800' :
                        factor.impact === 'High' ? 'bg-orange-100 text-orange-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {factor.impact} Impact
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">High Risk Clients</p>
                        <p className="font-medium text-lg">{factor.highRiskClients}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Total with Factor</p>
                        <p className="font-medium text-lg">{factor.totalClients}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Risk Correlation</p>
                        <p className="font-medium text-lg">
                          {factor.totalClients > 0 ? ((factor.highRiskClients / factor.totalClients) * 100).toFixed(1) : 0}%
                        </p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            factor.totalClients > 0 && (factor.highRiskClients / factor.totalClients) >= 0.7 ? 'bg-red-500' :
                            factor.totalClients > 0 && (factor.highRiskClients / factor.totalClients) >= 0.4 ? 'bg-yellow-500' :
                            'bg-green-500'
                          }`}
                          style={{ 
                            width: `${factor.totalClients > 0 ? (factor.highRiskClients / factor.totalClients) * 100 : 0}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
            <h3 className="font-medium text-blue-900 mb-3">📊 Risk Management Recommendations</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Consider premium adjustments for clients with high claim-to-premium ratios</li>
              <li>• Implement wellness programs for clients with lifestyle risk factors</li>
              <li>• Provide additional coverage options for clients with multiple chronic conditions</li>
              <li>• Review and update risk assessment criteria based on medical condition analysis</li>
              <li>• Focus on preventive care programs for high-risk age groups</li>
              <li>• Consider policy modifications for clients showing concerning claim patterns</li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
}