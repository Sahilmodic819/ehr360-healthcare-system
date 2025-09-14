// frontend/src/pages/Patient/CreateClaim.jsx
import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import api from '../../utils/api';

export default function CreateClaim() {
  const [form, setForm] = useState({
    treatmentType: '',
    hospitalName: '',
    doctorName: '',
    treatmentDate: '',
    claimAmount: '',
    description: '',
    receipts: null
  });
  const [loading, setLoading] = useState(false);
  const [insurers, setInsurers] = useState([]);
  const [selectedInsurer, setSelectedInsurer] = useState('');
  const userId = localStorage.getItem('ehr_userId') || null;

  useEffect(() => {
    async function loadInsurers() {
      try {
        const res = await api.get('/api/insurers');
        setInsurers(res.data);
      } catch (e) {
        console.error('Failed to load insurers:', e);
      }
    }
    loadInsurers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedInsurer) {
      alert('Please select an insurance provider');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('patientId', userId);
    formData.append('insurerId', selectedInsurer);
    formData.append('treatmentType', form.treatmentType);
    formData.append('hospitalName', form.hospitalName);
    formData.append('doctorName', form.doctorName);
    formData.append('treatmentDate', form.treatmentDate);
    formData.append('claimAmount', form.claimAmount);
    formData.append('description', form.description);
    
    if (form.receipts) {
      for (let i = 0; i < form.receipts.length; i++) {
        formData.append('receipts', form.receipts[i]);
      }
    }

    try {
      await api.post('/api/claims', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Insurance claim submitted successfully!');
      setForm({
        treatmentType: '',
        hospitalName: '',
        doctorName: '',
        treatmentDate: '',
        claimAmount: '',
        description: '',
        receipts: null
      });
      setSelectedInsurer('');
      document.getElementById('receipts-input').value = '';
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to submit claim');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files.length > 5) {
      alert('You can upload maximum 5 files');
      e.target.value = '';
      return;
    }
    
    for (let file of files) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        alert('Each file must be less than 10MB');
        e.target.value = '';
        return;
      }
    }
    
    setForm({ ...form, receipts: files });
  };

  const getTreatmentTypes = () => [
    'Consultation',
    'Emergency Treatment',
    'Surgery',
    'Diagnostic Tests',
    'Medication',
    'Physiotherapy',
    'Dental Treatment',
    'Eye Care',
    'Maternity Care',
    'Mental Health',
    'Preventive Care',
    'Other'
  ];

  // Get today's date for max attribute
  const today = new Date().toISOString().split('T')[0];

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Create Insurance Claim</h1>
            <p className="mt-2 text-gray-600">Submit a new insurance claim for medical expenses</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Insurance Provider Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Insurance Provider <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedInsurer}
                  onChange={(e) => setSelectedInsurer(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select Insurance Provider</option>
                  {insurers.map((insurer) => (
                    <option key={insurer._id} value={insurer._id}>
                      {insurer.companyName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Treatment Information */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Treatment Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={form.treatmentType}
                    onChange={(e) => setForm({ ...form, treatmentType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select Treatment Type</option>
                    {getTreatmentTypes().map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Treatment Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={form.treatmentDate}
                    onChange={(e) => setForm({ ...form, treatmentDate: e.target.value })}
                    max={today}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hospital/Clinic Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.hospitalName}
                    onChange={(e) => setForm({ ...form, hospitalName: e.target.value })}
                    placeholder="Enter hospital or clinic name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Doctor Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.doctorName}
                    onChange={(e) => setForm({ ...form, doctorName: e.target.value })}
                    placeholder="Dr. John Smith"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Claim Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Claim Amount (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  value={form.claimAmount}
                  onChange={(e) => setForm({ ...form, claimAmount: e.target.value })}
                  placeholder="0.00"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Treatment Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows="4"
                  placeholder="Provide detailed description of the treatment, diagnosis, and any relevant medical information..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Supporting Documents
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400 transition-colors">
                  <div className="space-y-1 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label htmlFor="receipts-input" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                        <span>Upload receipts and bills</span>
                        <input 
                          id="receipts-input"
                          type="file" 
                          multiple 
                          accept=".pdf,.jpg,.jpeg,.png" 
                          onChange={handleFileChange}
                          className="sr-only" 
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PDF, JPG, PNG up to 10MB each (max 5 files)</p>
                  </div>
                </div>
                
                {form.receipts && form.receipts.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Files:</h4>
                    <div className="space-y-2">
                      {Array.from(form.receipts).map((file, index) => (
                        <div key={index} className="flex items-center p-2 bg-blue-50 border border-blue-200 rounded-lg">
                          <svg className="w-4 h-4 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span className="text-sm text-blue-900">{file.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Submitting Claim...' : 'Submit Insurance Claim'}
                </button>
              </div>
            </form>
          </div>

          {/* Information Card */}
          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="font-medium text-yellow-900 mb-3">📋 Required Documents</h3>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• Original medical bills and receipts</li>
              <li>• Prescription from the treating doctor</li>
              <li>• Diagnostic test reports (if applicable)</li>
              <li>• Discharge summary (for hospitalization)</li>
              <li>• Any other relevant medical documents</li>
            </ul>
            <p className="text-sm text-yellow-800 mt-3 font-medium">
              Note: Processing time is typically 7-14 business days after submission.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}