// frontend/src/pages/Doctor/InsuranceRequests.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import api from '../../utils/api';

export default function InsuranceRequests() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });
  const [reviewingClaim, setReviewingClaim] = useState(null);
  const [reviewDecision, setReviewDecision] = useState('');
  const [reviewComments, setReviewComments] = useState('');

  // Claim review functions
  const openReviewModal = (claim) => {
    setReviewingClaim(claim);
    setReviewDecision('');
    setReviewComments('');
  };

  const closeReviewModal = () => {
    setReviewingClaim(null);
    setReviewDecision('');
    setReviewComments('');
  };

  const submitReview = async () => {
    if (!reviewDecision) {
      alert('Please select a decision (approve or reject)');
      return;
    }

    try {
      // Update the claim status
      const updatedClaims = claims.map(claim => 
        claim._id === reviewingClaim._id 
          ? { 
              ...claim, 
              status: reviewDecision, 
              reviewComments,
              reviewDate: new Date(),
              reviewedBy: 'Dr. Current User'
            }
          : claim
      );
      
      setClaims(updatedClaims);
      
      // Update stats
      const newStats = {
        total: updatedClaims.length,
        pending: updatedClaims.filter(c => c.status === 'pending').length,
        approved: updatedClaims.filter(c => c.status === 'approved').length,
        rejected: updatedClaims.filter(c => c.status === 'rejected').length
      };
      setStats(newStats);
      
      closeReviewModal();
      alert(`Claim ${reviewDecision} successfully!`);
    } catch (error) {
      console.error('Failed to review claim:', error);
      alert('Failed to review claim. Please try again.');
    }
  };

  useEffect(() => {
    async function loadInsuranceRequests() {
      try {
        // For demo purposes, we'll create some mock data
        // In a real app, this would fetch from API
        const mockClaims = [
          {
            _id: '1',
            patientName: 'John Smith',
            patientId: 'demo1',
            treatmentType: 'Diabetes Management',
            claimAmount: 15000,
            status: 'pending',
            submittedDate: new Date('2025-09-10'),
            description: 'Regular diabetes check-up and medication review',
            hospitalName: 'City Medical Center',
            doctorName: 'Dr. Johnson',
            insurerName: 'HealthCare Plus'
          },
          {
            _id: '2',
            patientName: 'Sarah Johnson',
            patientId: 'demo2',
            treatmentType: 'Asthma Treatment',
            claimAmount: 8500,
            status: 'approved',
            submittedDate: new Date('2025-09-08'),
            approvedDate: new Date('2025-09-12'),
            description: 'Pulmonary function test and inhaler prescription',
            hospitalName: 'Metro Hospital',
            doctorName: 'Dr. Smith',
            insurerName: 'MediCare Insurance'
          },
          {
            _id: '3',
            patientName: 'Michael Brown',
            patientId: 'demo3',
            treatmentType: 'Cholesterol Management',
            claimAmount: 12000,
            status: 'pending',
            submittedDate: new Date('2025-09-11'),
            description: 'Cholesterol panel and medication adjustment',
            hospitalName: 'Central Diagnostics',
            doctorName: 'Dr. Wilson',
            insurerName: 'Star Insurance'
          },
          {
            _id: '4',
            patientName: 'Emma Davis',
            patientId: 'demo4',
            treatmentType: 'Annual Physical',
            claimAmount: 5500,
            status: 'approved',
            submittedDate: new Date('2025-09-05'),
            approvedDate: new Date('2025-09-09'),
            description: 'Comprehensive annual physical examination',
            hospitalName: 'Health First Clinic',
            doctorName: 'Dr. Anderson',
            insurerName: 'Quick Health'
          }
        ];

        setClaims(mockClaims);
        
        // Calculate stats
        const newStats = {
          total: mockClaims.length,
          pending: mockClaims.filter(c => c.status === 'pending').length,
          approved: mockClaims.filter(c => c.status === 'approved').length,
          rejected: mockClaims.filter(c => c.status === 'rejected').length
        };
        setStats(newStats);
        
      } catch (error) {
        console.error('Failed to load insurance requests:', error);
      } finally {
        setLoading(false);
      }
    }
    loadInsuranceRequests();
  }, []);

  const getFilteredClaims = () => {
    if (filter === 'all') return claims;
    return claims.filter(claim => claim.status === filter);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredClaims = getFilteredClaims();

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading insurance requests...</p>
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
            <h1 className="text-3xl font-bold text-gray-900">Insurance Requests</h1>
            <p className="mt-2 text-gray-600">Review and manage insurance claim requests</p>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
              <div className="flex items-center">
                <div className="text-2xl mr-3">📊</div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Requests</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
              <div className="flex items-center">
                <div className="text-2xl mr-3">⏳</div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
              <div className="flex items-center">
                <div className="text-2xl mr-3">✅</div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Approved</p>
                  <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
              <div className="flex items-center">
                <div className="text-2xl mr-3">❌</div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Rejected</p>
                  <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'all' 
                    ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Requests ({stats.total})
              </button>
              <button
                onClick={() => setFilter('pending')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'pending' 
                    ? 'bg-yellow-100 text-yellow-700 border border-yellow-300' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Pending ({stats.pending})
              </button>
              <button
                onClick={() => setFilter('approved')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'approved' 
                    ? 'bg-green-100 text-green-700 border border-green-300' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Approved ({stats.approved})
              </button>
              <button
                onClick={() => setFilter('rejected')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'rejected' 
                    ? 'bg-red-100 text-red-700 border border-red-300' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Rejected ({stats.rejected})
              </button>
            </div>
          </div>

          {/* Claims List */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {filter === 'all' && `All Insurance Requests (${filteredClaims.length})`}
                {filter === 'pending' && `Pending Requests (${filteredClaims.length})`}
                {filter === 'approved' && `Approved Requests (${filteredClaims.length})`}
                {filter === 'rejected' && `Rejected Requests (${filteredClaims.length})`}
              </h2>

              {filteredClaims.length > 0 ? (
                <div className="space-y-4">
                  {filteredClaims.map((claim) => (
                    <div key={claim._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                            {claim.patientName.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{claim.patientName}</h3>
                            <p className="text-sm text-gray-600">Patient ID: {claim.patientId}</p>
                            <p className="text-sm text-gray-600">Treatment: {claim.treatmentType}</p>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(claim.status)}`}>
                            {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
                          </span>
                          <p className="text-lg font-semibold text-gray-900 mt-2">{formatCurrency(claim.claimAmount)}</p>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Hospital</p>
                          <p className="text-gray-900">{claim.hospitalName}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Attending Doctor</p>
                          <p className="text-gray-900">{claim.doctorName}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Insurance Provider</p>
                          <p className="text-gray-900">{claim.insurerName}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Submitted Date</p>
                          <p className="text-gray-900">{formatDate(claim.submittedDate)}</p>
                        </div>
                      </div>

                      {claim.description && (
                        <div className="mb-4">
                          <p className="text-sm font-medium text-gray-500 mb-1">Description</p>
                          <p className="text-gray-700 text-sm bg-gray-50 p-3 rounded-lg">{claim.description}</p>
                        </div>
                      )}

                      {claim.status === 'approved' && claim.approvedDate && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                          <p className="text-sm text-green-800">
                            ✅ Approved on {formatDate(claim.approvedDate)}
                          </p>
                        </div>
                      )}

                      {claim.status === 'rejected' && claim.rejectionReason && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                          <p className="text-sm text-red-800">
                            ❌ Rejected: {claim.rejectionReason}
                          </p>
                          {claim.rejectedDate && (
                            <p className="text-xs text-red-600 mt-1">
                              Rejected on {formatDate(claim.rejectedDate)}
                            </p>
                          )}
                        </div>
                      )}

                      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                        <div className="text-sm text-gray-500">
                          Claim ID: #{claim._id}
                        </div>
                        <div className="flex space-x-2">
                          <Link 
                            to={`/doctor/patient/${claim.patientId}`}
                            className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                          >
                            View Patient
                          </Link>
                          {claim.status === 'pending' && (
                            <button 
                              onClick={() => openReviewModal(claim)}
                              className="px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 transition-colors"
                            >
                              Review Claim
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-gray-500">
                    {filter === 'all' && 'No insurance requests found'}
                    {filter === 'pending' && 'No pending requests'}
                    {filter === 'approved' && 'No approved requests'}
                    {filter === 'rejected' && 'No rejected requests'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Information */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-medium text-blue-900 mb-3">💡 Insurance Request Guidelines</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Review all claim details carefully before approval</li>
              <li>• Ensure all medical documentation is complete and accurate</li>
              <li>• Contact patients directly for any missing information</li>
              <li>• Follow up on pending requests within 24-48 hours</li>
              <li>• Coordinate with insurance providers for faster processing</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Review Claim Modal */}
      {reviewingClaim && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-90vw max-h-90vh overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Review Insurance Claim</h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Patient</label>
                <p className="text-gray-900">{reviewingClaim.patientName}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Treatment Type</label>
                <p className="text-gray-900">{reviewingClaim.treatmentType}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Claim Amount</label>
                <p className="text-gray-900">₹{reviewingClaim.claimAmount?.toLocaleString()}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <p className="text-gray-900 text-sm">{reviewingClaim.description}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Hospital</label>
                <p className="text-gray-900">{reviewingClaim.hospitalName}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Insurer</label>
                <p className="text-gray-900">{reviewingClaim.insurerName}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Decision</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="decision"
                      value="approved"
                      checked={reviewDecision === 'approved'}
                      onChange={(e) => setReviewDecision(e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-green-700">Approve Claim</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="decision"
                      value="rejected"
                      checked={reviewDecision === 'rejected'}
                      onChange={(e) => setReviewDecision(e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-red-700">Reject Claim</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Comments {reviewDecision === 'rejected' && <span className="text-red-500">*</span>}
                </label>
                <textarea
                  value={reviewComments}
                  onChange={(e) => setReviewComments(e.target.value)}
                  placeholder={reviewDecision === 'rejected' ? 'Please provide reason for rejection...' : 'Optional comments...'}
                  className="w-full p-2 border rounded-md resize-none"
                  rows="3"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={closeReviewModal}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={submitReview}
                disabled={!reviewDecision || (reviewDecision === 'rejected' && !reviewComments.trim())}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}

    </Layout>
  );
}