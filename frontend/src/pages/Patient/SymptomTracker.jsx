// frontend/src/pages/Patient/SymptomTracker.jsx
import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import api from '../../utils/api';

export default function SymptomTracker(){
  const [symptoms, setSymptoms] = useState([]);
  const [form, setForm] = useState({ date: '', note: '', severity: 'mild' });
  const [loading, setLoading] = useState(false);
  const userId = localStorage.getItem('ehr_userId') || null;

  useEffect(() => { 
    async function load(){
      try {
        if (!userId) return;
        const pRes = await api.get(`/api/patients/${userId}`);
        setSymptoms(pRes.data.symptoms || []);
      } catch(e) { 
        console.error('Failed to load symptoms:', e); 
      }
    } 
    load(); 
  }, [userId]);

  const add = async (e) => {
    e.preventDefault();
    if (!form.note.trim()) return;
    
    setLoading(true);
    try {
      await api.post(`/api/patients/${userId}/symptoms`, form);
      alert('Symptom logged successfully');
      const res = await api.get(`/api/patients/${userId}`);
      setSymptoms(res.data.symptoms || []);
      setForm({ date: '', note: '', severity: 'mild' });
    } catch(err) { 
      alert(err.response?.data?.error || 'Failed to add symptom'); 
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'severe': return 'bg-red-100 text-red-800 border-red-200';
      case 'moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'mild': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityIcon = (severity) => {
    switch(severity) {
      case 'severe': return '🔴';
      case 'moderate': return '🟡';
      case 'mild': return '🟢';
      default: return '⚪';
    }
  };

  // Get today's date for max attribute
  const today = new Date().toISOString().split('T')[0];
  
  // Get date 30 days ago for min attribute
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const minDate = thirtyDaysAgo.toISOString().split('T')[0];

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Symptom Tracker</h1>
            <p className="mt-2 text-gray-600">Log and monitor your daily symptoms to track your health patterns</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Add Symptom Form */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Log New Symptom</h2>
                <form onSubmit={add} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                    <input 
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={form.date} 
                      onChange={e => setForm({...form, date: e.target.value})}
                      min={minDate}
                      max={today}
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">Must be within the last 30 days</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Severity</label>
                    <select 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={form.severity} 
                      onChange={e => setForm({...form, severity: e.target.value})}
                    >
                      <option value="mild">🟢 Mild</option>
                      <option value="moderate">🟡 Moderate</option>
                      <option value="severe">🔴 Severe</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Symptom Description</label>
                    <textarea 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows="4"
                      placeholder="Describe your symptoms in detail..."
                      value={form.note} 
                      onChange={e => setForm({...form, note: e.target.value})}
                      required
                    />
                  </div>
                  
                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? 'Logging...' : 'Log Symptom'}
                  </button>
                </form>
              </div>
            </div>

            {/* Symptoms List */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Symptom History</h2>
                  <div className="text-sm text-gray-500">
                    {symptoms.length} symptom{symptoms.length !== 1 ? 's' : ''} logged
                  </div>
                </div>
                
                {symptoms.length > 0 ? (
                  <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
                    {symptoms
                      .sort((a, b) => new Date(b.date) - new Date(a.date))
                      .map((symptom, index) => (
                      <div key={index} className={`p-4 rounded-lg border-l-4 ${getSeverityColor(symptom.severity)}`}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <span className="mr-2">{getSeverityIcon(symptom.severity)}</span>
                              <span className="font-medium text-gray-900 capitalize">{symptom.severity} Severity</span>
                              <span className="ml-auto text-sm text-gray-500">
                                {new Date(symptom.date).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </span>
                            </div>
                            <p className="text-gray-700 leading-relaxed">{symptom.note}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <p className="text-gray-500">No symptoms logged yet</p>
                    <p className="text-sm text-gray-400 mt-1">Start tracking your symptoms using the form on the left</p>
                  </div>
                )}
              </div>

              {/* Quick Tips */}
              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-2">💡 Tracking Tips</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Log symptoms as soon as you notice them for accuracy</li>
                  <li>• Be specific about location, intensity, and triggers</li>
                  <li>• Note any activities or foods that might be related</li>
                  <li>• Track patterns over time to discuss with your doctor</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

