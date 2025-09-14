// frontend/src/pages/Patient/Medications.jsx
import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import api from '../../utils/api';

export default function Medications(){
  const [patient, setPatient] = useState(null);
  const [form, setForm] = useState({ name:'', prescribedBy:'', startDate:'', current:true});
  const [loading, setLoading] = useState(false);
  const userId = localStorage.getItem('ehr_userId') || null;

  useEffect(() => { 
    async function load() { 
      try { 
        if (!userId) return;
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
    if (!form.name.trim() || !form.prescribedBy.trim()) return;
    
    setLoading(true);
    try {
      await api.post(`/api/patients/${userId}/medications`, form);
      alert('Medication added successfully');
      const p = await api.get(`/api/patients/${userId}`); 
      setPatient(p.data); 
      setForm({name:'',prescribedBy:'',startDate:'',current:true});
    } catch(err) { 
      alert(err.response?.data?.error || 'Failed to add medication'); 
    } finally {
      setLoading(false);
    }
  };

  const toggleMedication = async (index) => {
    try {
      const medication = patient.medications[index];
      await api.put(`/api/patients/${userId}/medications/${index}`, {
        ...medication,
        current: !medication.current
      });
      const p = await api.get(`/api/patients/${userId}`); 
      setPatient(p.data);
    } catch(err) {
      alert(err.response?.data?.error || 'Failed to update medication');
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Medications</h1>
            <p className="mt-2 text-gray-600">Track your current and past medications</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Add Medication Form */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Medication</h2>
                <form onSubmit={add} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Medication Name</label>
                    <input 
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Amoxicillin 500mg"
                      value={form.name} 
                      onChange={e => setForm({...form, name: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Prescribed By</label>
                    <input 
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Dr. Smith"
                      value={form.prescribedBy} 
                      onChange={e => setForm({...form, prescribedBy: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                    <input 
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={form.startDate} 
                      onChange={e => setForm({...form, startDate: e.target.value})}
                    />
                  </div>
                  
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="current"
                      checked={form.current} 
                      onChange={e => setForm({...form, current: e.target.checked})}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="current" className="ml-2 text-sm text-gray-700">Currently taking</label>
                  </div>
                  
                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? 'Adding...' : 'Add Medication'}
                  </button>
                </form>
              </div>
            </div>

            {/* Medications List */}
            <div className="lg:col-span-2">
              {/* Current Medications */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  Current Medications
                </h2>
                
                {!patient ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-gray-500">Loading medications...</p>
                  </div>
                ) : patient.medications?.filter(m => m.current).length > 0 ? (
                  <div className="space-y-4">
                    {patient.medications.filter(m => m.current).map((med, index) => (
                      <div key={index} className="border border-green-200 rounded-lg p-4 bg-green-50">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{med.name}</h3>
                            <p className="text-sm text-gray-600 mt-1">Prescribed by: {med.prescribedBy}</p>
                            {med.startDate && (
                              <p className="text-sm text-gray-500 mt-1">
                                Started: {new Date(med.startDate).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => toggleMedication(patient.medications.indexOf(med))}
                            className="ml-4 px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                          >
                            Mark as Stopped
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                    <p className="text-gray-500">No current medications</p>
                  </div>
                )}
              </div>

              {/* Past Medications */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <div className="w-3 h-3 bg-gray-400 rounded-full mr-3"></div>
                  Past Medications
                </h2>
                
                {patient?.medications?.filter(m => !m.current).length > 0 ? (
                  <div className="space-y-4">
                    {patient.medications.filter(m => !m.current).map((med, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-700">{med.name}</h3>
                            <p className="text-sm text-gray-600 mt-1">Prescribed by: {med.prescribedBy}</p>
                            {med.startDate && (
                              <p className="text-sm text-gray-500 mt-1">
                                Started: {new Date(med.startDate).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => toggleMedication(patient.medications.indexOf(med))}
                            className="ml-4 px-3 py-1 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                          >
                            Mark as Current
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No past medications</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

