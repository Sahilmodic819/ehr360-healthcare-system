// frontend/src/pages/Patient/OngoingTreatments.jsx
import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import api from '../../utils/api';

export default function OngoingTreatments(){
  const [patient, setPatient] = useState(null);
  const [form, setForm] = useState({ name: '', doctor: '', notes: '', startDate: '' });
  const [loading, setLoading] = useState(false);
  const userId = localStorage.getItem('ehr_userId') || null;

  useEffect(() => { 
    async function load(){ 
      try { 
        const res = await api.get(`/api/patients/${userId}`); 
        setPatient(res.data);
      } catch(e) { 
        console.error('Failed to load treatments:', e); 
      } 
    } 
    if (userId) {
      load(); 
    }
  }, [userId]);

  const add = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    
    setLoading(true);
    try {
      await api.post(`/api/patients/${userId}/treatments`, form);
      alert('Treatment added successfully');
      const p = await api.get(`/api/patients/${userId}`); 
      setPatient(p.data); 
      setForm({ name: '', doctor: '', notes: '', startDate: '' });
    } catch(err) { 
      alert(err.response?.data?.error || 'Failed to add treatment'); 
    } finally {
      setLoading(false);
    }
  };

  const getTreatmentIcon = (name) => {
    const treatmentName = name.toLowerCase();
    if (treatmentName.includes('therapy') || treatmentName.includes('rehab')) return '🏥';
    if (treatmentName.includes('surgery') || treatmentName.includes('operation')) return '⚕️';
    if (treatmentName.includes('medication') || treatmentName.includes('drug')) return '💊';
    if (treatmentName.includes('physical') || treatmentName.includes('exercise')) return '🏃‍♂️';
    if (treatmentName.includes('diet') || treatmentName.includes('nutrition')) return '🥗';
    if (treatmentName.includes('mental') || treatmentName.includes('counseling')) return '🧠';
    return '🩺';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateDuration = (startDate) => {
    const start = new Date(startDate);
    const now = new Date();
    const diffTime = Math.abs(now - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''}`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} month${months !== 1 ? 's' : ''}`;
    } else {
      const years = Math.floor(diffDays / 365);
      const remainingMonths = Math.floor((diffDays % 365) / 30);
      return `${years} year${years !== 1 ? 's' : ''}${remainingMonths > 0 ? `, ${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}` : ''}`;
    }
  };

  // Get today's date for max attribute
  const today = new Date().toISOString().split('T')[0];

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Ongoing Treatments</h1>
            <p className="mt-2 text-gray-600">Track your current medical treatments and therapies</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Add Treatment Form */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Treatment</h2>
                <form onSubmit={add} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Treatment Name</label>
                    <input 
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Physical Therapy, Chemotherapy"
                      value={form.name} 
                      onChange={e => setForm({...form, name: e.target.value})}
                      required 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Treating Doctor</label>
                    <input 
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Dr. John Smith"
                      value={form.doctor} 
                      onChange={e => setForm({...form, doctor: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                    <input 
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={form.startDate} 
                      onChange={e => setForm({...form, startDate: e.target.value})}
                      max={today}
                      required 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Treatment Notes</label>
                    <textarea 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows="4"
                      placeholder="Treatment details, frequency, goals, etc."
                      value={form.notes} 
                      onChange={e => setForm({...form, notes: e.target.value})}
                    />
                  </div>
                  
                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? 'Adding...' : 'Add Treatment'}
                  </button>
                </form>
              </div>
            </div>

            {/* Treatments List */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Active Treatments</h2>
                  <div className="text-sm text-gray-500">
                    {patient?.ongoingTreatments?.length || 0} active treatment{(patient?.ongoingTreatments?.length || 0) !== 1 ? 's' : ''}
                  </div>
                </div>
                
                {patient?.ongoingTreatments && patient.ongoingTreatments.length > 0 ? (
                  <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
                    {patient.ongoingTreatments
                      .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
                      .map((treatment, index) => (
                      <div key={index} className="p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center mb-3">
                              <span className="text-2xl mr-3">{getTreatmentIcon(treatment.name)}</span>
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900">{treatment.name}</h3>
                                {treatment.doctor && (
                                  <p className="text-sm text-gray-600">
                                    Treating Doctor: <span className="font-medium">{treatment.doctor}</span>
                                  </p>
                                )}
                              </div>
                            </div>
                            
                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                              <div>
                                <span className="text-sm font-medium text-gray-500">Start Date</span>
                                <p className="text-gray-900">{formatDate(treatment.startDate)}</p>
                              </div>
                              <div>
                                <span className="text-sm font-medium text-gray-500">Duration</span>
                                <p className="text-gray-900">{calculateDuration(treatment.startDate)}</p>
                              </div>
                            </div>
                            
                            {treatment.notes && (
                              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                                <span className="text-sm font-medium text-gray-500 block mb-1">Treatment Details</span>
                                <p className="text-gray-700 text-sm leading-relaxed">{treatment.notes}</p>
                              </div>
                            )}
                          </div>
                          
                          <div className="ml-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Active
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                    <p className="text-gray-500">No ongoing treatments recorded</p>
                    <p className="text-sm text-gray-400 mt-1">Add your current treatments using the form on the left</p>
                  </div>
                )}
              </div>

              {/* Treatment Tips */}
              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-2">💡 Treatment Management Tips</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Keep detailed notes about your treatment progress</li>
                  <li>• Track any side effects or changes in symptoms</li>
                  <li>• Maintain regular communication with your healthcare team</li>
                  <li>• Don't hesitate to ask questions about your treatment plan</li>
                </ul>
              </div>

              {/* Emergency Notice */}
              <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex">
                  <svg className="w-5 h-5 text-red-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <div>
                    <h4 className="font-medium text-red-900">Important</h4>
                    <p className="text-sm text-red-800 mt-1">
                      Never stop or modify your treatments without consulting your healthcare provider first. 
                      Contact your doctor immediately if you experience any concerning symptoms.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

