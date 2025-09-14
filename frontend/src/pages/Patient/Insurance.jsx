// frontend/src/pages/Patient/Insurance.jsx
import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { Link } from 'react-router-dom';
import api from '../../utils/api';

export default function Insurance(){
  const [patient, setPatient] = useState(null);
  const [claims, setClaims] = useState([]);
  const [stats, setStats] = useState({ total: 0, approved: 0, pending: 0, approvedAmount: 0 });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [policyFile, setPolicyFile] = useState(null);
  const userId = localStorage.getItem('ehr_userId') || null;

  useEffect(() => { 
    async function load(){ 
      try{ 
        setLoading(true);
        const res = await api.get(`/api/patients/${userId}`); 
        setPatient(res.data); 
        // Get patient's claims
        const claimsRes = await api.get(`/api/claims/patient/${userId}`);
        setClaims(claimsRes.data || []);
      } catch(e) { 
        console.error('Failed to load insurance data:', e); 
      } finally {
        setLoading(false);
      }
    } 
    if (userId) {
      load(); 
    }
  }, [userId]);

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch(status?.toLowerCase()) {
      case 'approved': return '✅';
      case 'pending': return '⏳';
      case 'rejected': return '❌';
      case 'processing': return '🔄';
      default: return '📄';
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const getClaimStats = () => {
    const total = claims.length;
    const approved = claims.filter(c => c.status === 'approved').length;
    const pending = claims.filter(c => c.status === 'pending').length;
    const approvedAmount = claims
      .filter(c => c.status === 'approved')
      .reduce((sum, c) => sum + (parseFloat(c.claimAmount) || 0), 0);
    
    return { total, approved, pending, approvedAmount };
  };

  const claimStats = getClaimStats();

  const uploadPolicyDocument = async (e) => {
    e.preventDefault();
    if (!policyFile) {
      alert('Please select a policy document to upload');
      return;
    }

    setUploadingDoc(true);
    const formData = new FormData();
    formData.append('policyDocument', policyFile);
    formData.append('userId', userId);

    try {
      const res = await api.post('/api/uploads/policy-document', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      alert('Policy document uploaded successfully');
      setPolicyFile(null);
      document.getElementById('policy-input').value = '';
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload policy document. Please try again.');
    } finally {
      setUploadingDoc(false);
    }
  };

  const handlePolicyFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        alert('File size must be less than 10MB');
        return;
      }
      if (!file.type.includes('pdf') && !file.type.includes('image')) {
        alert('Please upload a PDF or image file');
        return;
      }
      setPolicyFile(file);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading insurance information...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Insurance Management</h1>
            <p className="mt-2 text-gray-600">Manage your insurance claims and view coverage details</p>
          </div>

          {/* Tab Navigation */}
          <div className="bg-white rounded-lg shadow-md mb-8">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'overview'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('claims')}
                  className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'claims'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  My Claims
                </button>
                <button
                  onClick={() => setActiveTab('coverage')}
                  className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'coverage'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Coverage Details
                </button>
              </nav>
            </div>

            <div className="p-6">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Statistics Cards */}
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <div className="flex items-center">
                        <div className="text-2xl mr-3">📊</div>
                        <div>
                          <div className="text-2xl font-bold text-blue-600">{claimStats.total}</div>
                          <div className="text-sm text-blue-800">Total Claims</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <div className="flex items-center">
                        <div className="text-2xl mr-3">✅</div>
                        <div>
                          <div className="text-2xl font-bold text-green-600">{claimStats.approved}</div>
                          <div className="text-sm text-green-800">Approved</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                      <div className="flex items-center">
                        <div className="text-2xl mr-3">⏳</div>
                        <div>
                          <div className="text-2xl font-bold text-yellow-600">{claimStats.pending}</div>
                          <div className="text-sm text-yellow-800">Pending</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                      <div className="flex items-center">
                        <div className="text-2xl mr-3">💰</div>
                        <div>
                          <div className="text-lg font-bold text-purple-600">{formatCurrency(claimStats.approvedAmount)}</div>
                          <div className="text-sm text-purple-800">Approved Amount</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      <Link to="/patient/create-claim" className="block p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow text-left">
                        <div className="text-xl mb-2">🆕</div>
                        <div className="font-medium text-gray-900">New Claim</div>
                        <div className="text-sm text-gray-600">Submit a new insurance claim</div>
                      </Link>
                      
                      <button onClick={() => setActiveTab('claims')} className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow text-left">
                        <div className="text-xl mb-2">📋</div>
                        <div className="font-medium text-gray-900">Track Claims</div>
                        <div className="text-sm text-gray-600">Check status of your claims</div>
                      </button>
                      
                      <button className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow text-left">
                        <div className="text-xl mb-2">📞</div>
                        <div className="font-medium text-gray-900">Support</div>
                        <div className="text-sm text-gray-600">Contact insurance support</div>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Claims Tab */}
              {activeTab === 'claims' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Insurance Claims History</h3>
                    <span className="text-sm text-gray-500">{claims.length} total claims</span>
                  </div>

                  {claims.length > 0 ? (
                    <div className="space-y-4">
                      {claims
                        .sort((a, b) => new Date(b.submissionDate || b.createdAt) - new Date(a.submissionDate || a.createdAt))
                        .map((claim, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center mb-2">
                                <span className="text-xl mr-3">{getStatusIcon(claim.status)}</span>
                                <div>
                                  <h4 className="font-semibold text-gray-900">{claim.treatmentType || 'Medical Treatment'}</h4>
                                  <p className="text-sm text-gray-600">Claim ID: {claim._id?.slice(-8) || 'N/A'}</p>
                                </div>
                              </div>
                              
                              <div className="grid md:grid-cols-3 gap-4 text-sm">
                                <div>
                                  <span className="font-medium text-gray-500">Hospital:</span>
                                  <p className="text-gray-900">{claim.hospitalName || 'N/A'}</p>
                                </div>
                                <div>
                                  <span className="font-medium text-gray-500">Treatment Date:</span>
                                  <p className="text-gray-900">{claim.treatmentDate ? formatDate(claim.treatmentDate) : 'N/A'}</p>
                                </div>
                                <div>
                                  <span className="font-medium text-gray-500">Claim Amount:</span>
                                  <p className="text-gray-900 font-semibold">{formatCurrency(claim.claimAmount || 0)}</p>
                                </div>
                              </div>
                            </div>
                            
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(claim.status)}`}>
                              {claim.status || 'Unknown'}
                            </span>
                          </div>
                          
                          {claim.description && (
                            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                              <span className="text-sm font-medium text-gray-500 block mb-1">Description:</span>
                              <p className="text-sm text-gray-700">{claim.description}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m-6 4h6m4-10V6a1 1 0 00-1-1H3a1 1 0 00-1 1v8a1 1 0 001 1h1m4-10V6a1 1 0 011-1h2a1 1 0 011 1v4" />
                      </svg>
                      <p className="text-gray-500">No insurance claims found</p>
                      <p className="text-sm text-gray-400 mt-1">Submit your first claim to get started</p>
                    </div>
                  )}
                </div>
              )}

              {/* Coverage Tab */}
              {activeTab === 'coverage' && (
                <div className="space-y-6">
                  {/* Upload Policy Document */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Insurance Policy</h3>
                    <form onSubmit={uploadPolicyDocument} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Policy Document (PDF, JPG, PNG)
                        </label>
                        <input
                          id="policy-input"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={handlePolicyFileChange}
                          className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Upload your insurance policy document (max 10MB)
                        </p>
                      </div>
                      
                      {policyFile && (
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex items-center">
                            <div className="text-blue-600 mr-2">📄</div>
                            <div>
                              <p className="text-sm font-medium text-blue-900">{policyFile.name}</p>
                              <p className="text-xs text-blue-700">
                                {(policyFile.size / (1024 * 1024)).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {policyFile && (
                        <button
                          type="submit"
                          disabled={uploadingDoc}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          {uploadingDoc ? 'Uploading...' : 'Upload Policy Document'}
                        </button>
                      )}
                    </form>
                  </div>

                  {/* Coverage Information */}
                  <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                    <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Insurance Coverage Details</h3>
                    <p className="text-gray-500 mb-4">Upload your policy documents to view detailed coverage information</p>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">• Policy terms and conditions</p>
                      <p className="text-sm text-gray-600">• Coverage limits and deductibles</p>
                      <p className="text-sm text-gray-600">• Network providers and benefits</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Information Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-medium text-blue-900 mb-3">💡 Claim Tips</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Keep all medical receipts and bills</li>
                <li>• Submit claims within the policy time limits</li>
                <li>• Provide complete and accurate information</li>
                <li>• Follow up on pending claims regularly</li>
              </ul>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="font-medium text-green-900 mb-3">📞 Need Help?</h3>
              <div className="text-sm text-green-800 space-y-2">
                <p>Contact our insurance support team:</p>
                <p className="font-medium">📧 insurance@ehr360.com</p>
                <p className="font-medium">📞 1800-123-4567</p>
                <p>Available 24/7 for assistance</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

