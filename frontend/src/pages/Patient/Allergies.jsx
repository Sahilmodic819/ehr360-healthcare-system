// frontend/src/pages/Patient/Allergies.jsx
import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import api from '../../utils/api';

export default function Allergies(){
  const [patient, setPatient] = useState(null);
  const [allergy, setAllergy] = useState('');
  const [loading, setLoading] = useState(false);
  const userId = localStorage.getItem('ehr_userId') || null;

  useEffect(() => { 
    async function load() { 
      try { 
        if (!userId) {
          console.error('No user ID found');
          return;
        }
        const res = await api.get(`/api/patients/${userId}`); 
        setPatient(res.data);
      } catch(e) {
        console.error('Failed to load patient data:', e);
      } 
    } 
    load(); 
  }, [userId]);

  const add = async (e) => {
    e.preventDefault();
    if (!allergy.trim()) return;
    
    setLoading(true);
    try {
      await api.post(`/api/patients/${userId}/allergies`, { allergy });
      alert('Allergy added successfully');
      const p = await api.get(`/api/patients/${userId}`); 
      setPatient(p.data); 
      setAllergy('');
    } catch(err) { 
      alert(err.response?.data?.error || 'Failed to add allergy'); 
    } finally {
      setLoading(false);
    }
  };

  const removeAllergy = async (index) => {
    try {
      await api.delete(`/api/patients/${userId}/allergies/${index}`);
      alert('Allergy removed successfully');
      const p = await api.get(`/api/patients/${userId}`); 
      setPatient(p.data);
    } catch(err) {
      alert(err.response?.data?.error || 'Failed to remove allergy');
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Allergies Management</h1>
            <p className="mt-2 text-gray-600">Manage your known allergies and sensitivities</p>
          </div>

          {/* Add Allergy Form */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Allergy</h2>
            <form onSubmit={add} className="flex gap-4">
              <div className="flex-1">
                <input 
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter allergy (e.g., Penicillin, Peanuts, Pollen)"
                  value={allergy} 
                  onChange={e => setAllergy(e.target.value)}
                  required
                />
              </div>
              <button 
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Adding...' : 'Add Allergy'}
              </button>
            </form>
          </div>

          {/* Allergies List */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Allergies</h2>
            
            {!patient ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-500">Loading allergies...</p>
              </div>
            ) : patient.allergies && patient.allergies.length > 0 ? (
              <div className="grid gap-4">
                {patient.allergies.map((allergyItem, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                      <span className="font-medium text-gray-900">{allergyItem}</span>
                    </div>
                    <button
                      onClick={() => removeAllergy(index)}
                      className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-100 transition-colors"
                      title="Remove allergy"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-gray-500">No allergies recorded</p>
                <p className="text-sm text-gray-400 mt-1">Add your first allergy using the form above</p>
              </div>
            )}
          </div>

          {/* Important Notice */}
          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex">
              <svg className="w-5 h-5 text-yellow-600 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div>
                <h3 className="font-medium text-yellow-800">Important Medical Information</h3>
                <p className="text-sm text-yellow-700 mt-1">
                  Always inform healthcare providers about your allergies before any treatment or medication. 
                  Keep this information updated and accurate.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

