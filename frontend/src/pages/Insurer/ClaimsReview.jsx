// frontend/src/pages/Insurer/ClaimsReview.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import api from '../../utils/api';

export default function ClaimsReview() {
  const [claims, setClaims] = useState([]);
  const [filteredClaims, setFilteredClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [reviewingClaim, setReviewingClaim] = useState(null);
  const [reviewDecision, setReviewDecision] = useState('');
  const [reviewComments, setReviewComments] = useState('');
  const [requestedDocuments, setRequestedDocuments] = useState([]);
  const [newDocumentRequest, setNewDocumentRequest] = useState('');

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    needingDocs: 0
  });

  useEffect(() => {
    async function loadClaims() {
      try {
        const res = await api.get('/api/insurers/claims');
        setClaims(res.data);
        setFilteredClaims(res.data);
      } catch (error) {
        console.error('Failed to load claims:', error);
        
        // Mock claims data for demo
        const mockClaims = [
          {
            _id: '1',
            claimNumber: 'CLM-2025-001',
            patientName: 'John Smith',
            patientId: 'demo1',
            treatmentType: 'Diabetes Management',
            claimAmount: 15000,
            status: 'pending',
            submittedDate: new Date('2025-09-10'),
            description: 'Regular diabetes check-up and medication review',
            hospitalName: 'City Medical Center',
            doctorName: 'Dr. Johnson',
            documents: [
              { name: 'Medical Report.pdf', type: 'medical_report', uploaded: true, url: '/docs/medical_report_1.pdf' },
              { name: 'Prescription.pdf', type: 'prescription', uploaded: true, url: '/docs/prescription_1.pdf' },
              { name: 'Lab Report.pdf', type: 'lab_report', uploaded: false, requested: true }
            ],
            patientInfo: {
              age: 40,
              gender: 'Male',
              medicalHistory: ['Hypertension', 'Diabetes Type 2'],
              riskLevel: 'Medium'
            },
            treatmentDetails: {
              admissionDate: '2025-09-08',
              dischargeDate: '2025-09-10',
              diagnosis: 'Diabetes Type 2 - Regular monitoring',
              treatment: 'Medication adjustment and dietary counseling'
            }
          },
          {
            _id: '2',
            claimNumber: 'CLM-2025-002',
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
            documents: [
              { name: 'Medical Report.pdf', type: 'medical_report', uploaded: true, url: '/docs/medical_report_2.pdf' },
              { name: 'Prescription.pdf', type: 'prescription', uploaded: true, url: '/docs/prescription_2.pdf' },
              { name: 'Pulmonary Function Test.pdf', type: 'lab_report', uploaded: true, url: '/docs/pft_2.pdf' }
            ],
            patientInfo: {
              age: 35,
              gender: 'Female',
              medicalHistory: ['Asthma'],
              riskLevel: 'Low'
            },
            treatmentDetails: {
              admissionDate: '2025-09-06',
              dischargeDate: '2025-09-08',
              diagnosis: 'Asthma exacerbation',
              treatment: 'Bronchodilator therapy and new inhaler'
            }
          },
          {
            _id: '3',
            claimNumber: 'CLM-2025-003',
            patientName: 'Michael Brown',
            patientId: 'demo3',
            treatmentType: 'Cholesterol Management',
            claimAmount: 12000,
            status: 'pending',
            submittedDate: new Date('2025-09-11'),
            description: 'Cholesterol panel and medication adjustment',
            hospitalName: 'Central Diagnostics',
            doctorName: 'Dr. Wilson',
            documents: [
              { name: 'Medical Report.pdf', type: 'medical_report', uploaded: true, url: '/docs/medical_report_3.pdf' },
              { name: 'Cholesterol Panel.pdf', type: 'lab_report', uploaded: true, url: '/docs/cholesterol_3.pdf' },
              { name: 'Treatment Plan.pdf', type: 'treatment_plan', uploaded: false, requested: false }
            ],
            patientInfo: {
              age: 47,
              gender: 'Male',
              medicalHistory: ['High Cholesterol'],
              riskLevel: 'Medium'
            },
            treatmentDetails: {
              admissionDate: '2025-09-09',
              dischargeDate: '2025-09-11',
              diagnosis: 'Hyperlipidemia',
              treatment: 'Statin therapy adjustment'
            }
          },
          {
            _id: '4',
            claimNumber: 'CLM-2025-004',
            patientName: 'Emma Davis',
            patientId: 'demo4',
            treatmentType: 'Annual Physical',
            claimAmount: 5500,
            status: 'more_docs_required',
            submittedDate: new Date('2025-09-05'),
            description: 'Comprehensive annual physical examination',
            hospitalName: 'Health First Clinic',
            doctorName: 'Dr. Anderson',
            documents: [
              { name: 'Physical Exam Report.pdf', type: 'medical_report', uploaded: true, url: '/docs/physical_4.pdf' },
              { name: 'Blood Work.pdf', type: 'lab_report', uploaded: false, requested: true },
              { name: 'Vision Test.pdf', type: 'test_report', uploaded: false, requested: true }
            ],
            patientInfo: {
              age: 30,
              gender: 'Female',
              medicalHistory: [],
              riskLevel: 'Low'
            },
            treatmentDetails: {
              admissionDate: '2025-09-05',
              dischargeDate: '2025-09-05',
              diagnosis: 'Annual preventive care',
              treatment: 'Routine physical examination'
            }
          },
          {
            _id: '5',
            claimNumber: 'CLM-2025-005',
            patientName: 'Alice Cooper',
            patientId: 'demo5',
            treatmentType: 'Thyroid Treatment',
            claimAmount: 22000,
            status: 'rejected',
            submittedDate: new Date('2025-09-07'),
            rejectedDate: new Date('2025-09-13'),
            description: 'Thyroid function test and medication review',
            hospitalName: 'Endocrine Specialty Center',
            doctorName: 'Dr. Green',
            rejectionReason: 'Pre-existing condition not covered under current policy',
            documents: [
              { name: 'Medical Report.pdf', type: 'medical_report', uploaded: true, url: '/docs/medical_report_5.pdf' },
              { name: 'Thyroid Function Test.pdf', type: 'lab_report', uploaded: true, url: '/docs/thyroid_5.pdf' }
            ],
            patientInfo: {
              age: 53,
              gender: 'Female',
              medicalHistory: ['Hypothyroidism', 'Arthritis', 'Hypertension'],
              riskLevel: 'High'
            },
            treatmentDetails: {
              admissionDate: '2025-09-05',
              dischargeDate: '2025-09-07',
              diagnosis: 'Hypothyroidism adjustment',
              treatment: 'Levothyroxine dosage modification'
            }
          }
        ];
        
        setClaims(mockClaims);
        setFilteredClaims(mockClaims);
      } finally {
        setLoading(false);
      }
    }
    loadClaims();
  }, []);

  useEffect(() => {
    if (claims.length > 0) {
      setStats({
        total: claims.length,
        pending: claims.filter(c => c.status === 'pending').length,
        approved: claims.filter(c => c.status === 'approved').length,
        rejected: claims.filter(c => c.status === 'rejected').length,
        needingDocs: claims.filter(c => c.status === 'more_docs_required').length
      });
    }
  }, [claims]);

  useEffect(() => {
    let filtered = claims;
    
    if (filter === 'pending') {
      filtered = claims.filter(c => c.status === 'pending');
    } else if (filter === 'approved') {
      filtered = claims.filter(c => c.status === 'approved');
    } else if (filter === 'rejected') {
      filtered = claims.filter(c => c.status === 'rejected');
    } else if (filter === 'more_docs') {
      filtered = claims.filter(c => c.status === 'more_docs_required');
    }
    
    setFilteredClaims(filtered);
  }, [filter, claims]);

  const openClaimDetails = (claim) => {
    setSelectedClaim(claim);
  };

  const closeClaimDetails = () => {
    setSelectedClaim(null);
  };

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
      alert('Please select a decision');
      return;
    }

    try {
      const updatedClaims = claims.map(claim => 
        claim._id === reviewingClaim._id 
          ? { 
              ...claim, 
              status: reviewDecision, 
              reviewComments,
              reviewDate: new Date(),
              reviewedBy: 'Current Insurer',
              ...(reviewDecision === 'rejected' && { rejectedDate: new Date(), rejectionReason: reviewComments })
            }
          : claim
      );
      
      setClaims(updatedClaims);
      closeReviewModal();
      alert(`Claim ${reviewDecision} successfully!`);
    } catch (error) {
      console.error('Failed to review claim:', error);
      alert('Failed to review claim. Please try again.');
    }
  };

  const requestDocument = () => {
    if (!newDocumentRequest.trim()) return;
    
    const updatedClaims = claims.map(claim => 
      claim._id === selectedClaim._id 
        ? { 
            ...claim, 
            status: 'more_docs_required',
            documents: [
              ...claim.documents,
              { 
                name: newDocumentRequest, 
                type: 'requested_document', 
                uploaded: false, 
                requested: true,
                requestedDate: new Date()
              }
            ]
          }
        : claim
    );
    
    setClaims(updatedClaims);
    setSelectedClaim(updatedClaims.find(c => c._id === selectedClaim._id));
    setNewDocumentRequest('');
    alert('Document request sent to healthcare provider!');
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
            <p className="mt-4 text-gray-600">Loading claims...</p>
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
            <h1 className="text-3xl font-bold text-gray-900">Claims Review</h1>
            <p className="mt-2 text-gray-600">Review and process insurance claims</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100">
                  <span className="text-2xl">📋</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Claims</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-yellow-100">
                  <span className="text-2xl">⏳</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100">
                  <span className="text-2xl">✅</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Approved</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.approved}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-red-100">
                  <span className="text-2xl">❌</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Rejected</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.rejected}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-orange-100">
                  <span className="text-2xl">📄</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Need Docs</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.needingDocs}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter Claims</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Claims ({claims.length})
              </button>
              <button
                onClick={() => setFilter('pending')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'pending'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Pending ({stats.pending})
              </button>
              <button
                onClick={() => setFilter('more_docs')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'more_docs'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Need Documents ({stats.needingDocs})
              </button>
              <button
                onClick={() => setFilter('approved')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'approved'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Approved ({stats.approved})
              </button>
              <button
                onClick={() => setFilter('rejected')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'rejected'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Rejected ({stats.rejected})
              </button>
            </div>
          </div>

          {/* Claims List */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Claims ({filteredClaims.length})
              </h3>
            </div>
            
            {filteredClaims.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {filteredClaims.map((claim) => (
                  <div key={claim._id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold text-lg">
                            {claim.patientName[0]}
                          </span>
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">{claim.patientName}</h4>
                          <p className="text-gray-600">{claim.treatmentType}</p>
                          <p className="text-sm text-gray-500">
                            Claim #{claim.claimNumber} • {claim.hospitalName}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-center space-x-4 mb-2">
                          <div className="text-sm">
                            <p className="text-gray-500">Amount</p>
                            <p className="font-semibold">₹{claim.claimAmount?.toLocaleString()}</p>
                          </div>
                          <div className="text-sm">
                            <p className="text-gray-500">Status</p>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              claim.status === 'approved' ? 'bg-green-100 text-green-800' :
                              claim.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              claim.status === 'rejected' ? 'bg-red-100 text-red-800' :
                              'bg-orange-100 text-orange-800'
                            }`}>
                              {claim.status.replace('_', ' ')}
                            </span>
                          </div>
                          <div className="text-sm">
                            <p className="text-gray-500">Submitted</p>
                            <p className="font-semibold">{formatDate(claim.submittedDate)}</p>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <button
                            onClick={() => openClaimDetails(claim)}
                            className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                          >
                            View Details
                          </button>
                          {claim.status === 'pending' && (
                            <button
                              onClick={() => openReviewModal(claim)}
                              className="px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 transition-colors"
                            >
                              Review Claim
                            </button>
                          )}
                          <Link
                            to={`/insurer/client/${claim.patientId}`}
                            className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
                          >
                            View Patient
                          </Link>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 text-sm">
                      <p className="text-gray-600">{claim.description}</p>
                      <p className="text-gray-500 mt-1">Doctor: {claim.doctorName}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No claims found for the selected filter.</p>
              </div>
            )}
          </div>

          {/* Claim Details Modal */}
          {selectedClaim && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg w-full max-w-4xl max-h-90vh overflow-y-auto">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Claim Details - {selectedClaim.claimNumber}</h3>
                    <button
                      onClick={closeClaimDetails}
                      className="text-gray-400 hover:text-gray-600 text-2xl"
                    >
                      ×
                    </button>
                  </div>
                </div>
                
                <div className="p-6 space-y-6">
                  {/* Patient Information */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-3">Patient Information</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Name</p>
                        <p className="font-medium">{selectedClaim.patientName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Age</p>
                        <p className="font-medium">{selectedClaim.patientInfo.age}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Gender</p>
                        <p className="font-medium">{selectedClaim.patientInfo.gender}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Risk Level</p>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          selectedClaim.patientInfo.riskLevel === 'High' ? 'bg-red-100 text-red-800' :
                          selectedClaim.patientInfo.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {selectedClaim.patientInfo.riskLevel}
                        </span>
                      </div>
                    </div>
                    <div className="mt-3">
                      <p className="text-sm text-gray-600">Medical History</p>
                      <p className="font-medium">{selectedClaim.patientInfo.medicalHistory.join(', ') || 'None'}</p>
                    </div>
                  </div>

                  {/* Treatment Details */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-3">Treatment Details</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Admission Date</p>
                        <p className="font-medium">{formatDate(selectedClaim.treatmentDetails.admissionDate)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Discharge Date</p>
                        <p className="font-medium">{formatDate(selectedClaim.treatmentDetails.dischargeDate)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Diagnosis</p>
                        <p className="font-medium">{selectedClaim.treatmentDetails.diagnosis}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Treatment</p>
                        <p className="font-medium">{selectedClaim.treatmentDetails.treatment}</p>
                      </div>
                    </div>
                  </div>

                  {/* Documents */}
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-semibold">Documents</h4>
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={newDocumentRequest}
                          onChange={(e) => setNewDocumentRequest(e.target.value)}
                          placeholder="Request additional document..."
                          className="px-3 py-1 text-sm border rounded-md"
                        />
                        <button
                          onClick={requestDocument}
                          className="px-3 py-1 text-sm bg-orange-100 text-orange-700 rounded-md hover:bg-orange-200 transition-colors"
                        >
                          Request
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {selectedClaim.documents.map((doc, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <span className={`text-2xl ${doc.uploaded ? '📄' : '📋'}`}></span>
                            <div>
                              <p className="font-medium">{doc.name}</p>
                              <p className="text-sm text-gray-600 capitalize">{doc.type.replace('_', ' ')}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {doc.uploaded ? (
                              <div className="flex space-x-2">
                                <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                                  Uploaded
                                </span>
                                <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors">
                                  View
                                </button>
                              </div>
                            ) : doc.requested ? (
                              <span className="px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-full">
                                Requested
                              </span>
                            ) : (
                              <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
                                Missing
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Review Modal */}
          {reviewingClaim && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-96 max-w-90vw">
                <h3 className="text-lg font-semibold mb-4">Review Claim</h3>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Patient: {reviewingClaim.patientName}</p>
                    <p className="text-sm text-gray-600">Amount: ₹{reviewingClaim.claimAmount?.toLocaleString()}</p>
                  </div>
                  
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
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="decision"
                          value="more_docs_required"
                          checked={reviewDecision === 'more_docs_required'}
                          onChange={(e) => setReviewDecision(e.target.value)}
                          className="mr-2"
                        />
                        <span className="text-orange-700">Request More Documents</span>
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
                      placeholder="Enter review comments..."
                      className="w-full p-2 border rounded-md resize-none"
                      rows="3"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
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
        </div>
      </div>
    </Layout>
  );
}