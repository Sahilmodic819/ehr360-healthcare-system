// frontend/src/pages/Patient/Immunizations.jsx
import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import api from '../../utils/api';

export default function Immunizations(){
  const [patient, setPatient] = useState(null);
  const [form, setForm] = useState({ date: '', vaccine: '', documentLink: '' });
  const [loading, setLoading] = useState(false);
  const userId = localStorage.getItem('ehr_userId') || null;

  useEffect(() => { 
    async function load(){ 
      try { 
        const res = await api.get(`/api/patients/${userId}`); 
        setPatient(res.data);
      } catch(e) { 
        console.error('Failed to load immunizations:', e); 
      } 
    } 
    if (userId) {
      load(); 
    }
  }, [userId]);

  const add = async (e) => {
    e.preventDefault();
    if (!form.vaccine.trim()) return;
    
    setLoading(true);
    try {
      await api.post(`/api/patients/${userId}/immunizations`, form);
      alert('Immunization record added successfully');
      const p = await api.get(`/api/patients/${userId}`); 
      setPatient(p.data); 
      setForm({ date: '', vaccine: '', documentLink: '' });
    } catch(err) { 
      alert(err.response?.data?.error || 'Failed to add immunization'); 
    } finally {
      setLoading(false);
    }
  };

  const getVaccineIcon = (vaccine) => {
    const vaccineName = vaccine.toLowerCase();
    if (vaccineName.includes('covid') || vaccineName.includes('coronavirus')) return '💉';
    if (vaccineName.includes('flu') || vaccineName.includes('influenza')) return '🦠';
    if (vaccineName.includes('hepatitis')) return '🩸';
    if (vaccineName.includes('mmr') || vaccineName.includes('measles')) return '🔴';
    if (vaccineName.includes('tdap') || vaccineName.includes('tetanus')) return '⚡';
    return '💊';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get today's date for max attribute
  const today = new Date().toISOString().split('T')[0];

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Immunization Records</h1>
            <p className="mt-2 text-gray-600">Track your vaccination history and maintain up-to-date immunization records</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Add Immunization Form */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Immunization</h2>
                <form onSubmit={add} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Vaccination Date</label>
                    <input 
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={form.date} 
                      onChange={e => setForm({...form, date: e.target.value})}
                      max={today}
                      required 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Vaccine Name</label>
                    <input 
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., COVID-19, Influenza, Hepatitis B"
                      value={form.vaccine} 
                      onChange={e => setForm({...form, vaccine: e.target.value})}
                      required 
                    />
                    <p className="text-xs text-gray-500 mt-1">Enter the full vaccine name as it appears on your vaccination card</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Document Link (Optional)</label>
                    <input 
                      type="url"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="https://drive.google.com/..."
                      value={form.documentLink} 
                      onChange={e => setForm({...form, documentLink: e.target.value})}
                    />
                    <p className="text-xs text-gray-500 mt-1">Link to vaccination certificate or document</p>
                  </div>
                  
                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? 'Adding...' : 'Add Immunization'}
                  </button>
                </form>
              </div>
            </div>

            {/* Immunizations List */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Vaccination History</h2>
                  <div className="text-sm text-gray-500">
                    {patient?.immunizations?.length || 0} immunization{(patient?.immunizations?.length || 0) !== 1 ? 's' : ''} recorded
                  </div>
                </div>
                
                {patient?.immunizations && patient.immunizations.length > 0 ? (
                  <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
                    {patient.immunizations
                      .sort((a, b) => new Date(b.date) - new Date(a.date))
                      .map((immunization, index) => (
                      <div key={index} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <span className="text-xl mr-3">{getVaccineIcon(immunization.vaccine)}</span>
                              <div>
                                <h3 className="font-medium text-gray-900">{immunization.vaccine}</h3>
                                <p className="text-sm text-gray-600">
                                  Administered on {formatDate(immunization.date)}
                                </p>
                              </div>
                            </div>
                            {immunization.documentLink && (
                              <div className="mt-3">
                                <a 
                                  href={immunization.documentLink} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center px-3 py-1 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
                                >
                                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                  </svg>
                                  View Certificate
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.871 4A17.926 17.926 0 003 12c0 9.94 8.06 18 18 18a17.933 17.933 0 008-1.87M4.871 4L16.129 20M4.871 4a17.933 17.933 0 008-1.87c9.94 0 18 8.06 18 18a17.926 17.926 0 01-1.87 8M16.129 20L4.871 4" />
                    </svg>
                    <p className="text-gray-500">No immunizations recorded yet</p>
                    <p className="text-sm text-gray-400 mt-1">Add your vaccination records using the form on the left</p>
                  </div>
                )}
              </div>

              {/* Vaccination Reminders */}
              <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-medium text-yellow-900 mb-2">💉 Vaccination Reminders</h3>
                <ul className="text-sm text-yellow-800 space-y-1">
                  <li>• Annual flu shots are recommended for most adults</li>
                  <li>• COVID-19 boosters may be needed based on current guidelines</li>
                  <li>• Tdap (tetanus) boosters are recommended every 10 years</li>
                  <li>• Consult your healthcare provider for personalized vaccination schedule</li>
                </ul>
              </div>

              {/* Common Vaccines Info */}
              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-3">📋 Common Adult Vaccines</h3>
                <div className="grid md:grid-cols-2 gap-3 text-sm text-blue-800">
                  <div className="flex items-center">
                    <span className="mr-2">💉</span>
                    <span>COVID-19 (Annual/Biannual)</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">🦠</span>
                    <span>Influenza (Annual)</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">⚡</span>
                    <span>Tdap (Every 10 years)</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">🩸</span>
                    <span>Hepatitis B (Series)</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">🔴</span>
                    <span>MMR (If not immune)</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">💊</span>
                    <span>Shingles (Age 50+)</span>
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
