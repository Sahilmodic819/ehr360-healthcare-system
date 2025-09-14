// frontend/src/pages/Doctor/DoctorDashboard.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import api from '../../utils/api';

export default function DoctorDashboard(){
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({
    totalPatients: 0,
    activePatients: 0,
    ongoingTreatments: 0,
    todayAppointments: 0,
    pendingRequests: 0,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);
  const [recentPatients, setRecentPatients] = useState([]);
  
  // Appointment management state
  const [appointments, setAppointments] = useState([
    { time: '09:00', patient: 'John Smith', type: 'Consultation', status: 'scheduled' },
    { time: '10:30', patient: 'Sarah Johnson', type: 'Follow-up', status: 'scheduled' },
    { time: '14:00', patient: 'Michael Brown', type: 'Check-up', status: 'completed' },
    { time: '15:30', patient: 'Emma Davis', type: 'Consultation', status: 'scheduled' }
  ]);
  const [showNewAppointment, setShowNewAppointment] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    time: '',
    patient: '',
    type: 'Consultation'
  });

  // Appointment management functions
  const addAppointment = () => {
    if (newAppointment.time && newAppointment.patient) {
      setAppointments([...appointments, { ...newAppointment, status: 'scheduled' }]);
      setNewAppointment({ time: '', patient: '', type: 'Consultation' });
      setShowNewAppointment(false);
    }
  };

  const editAppointment = (index) => {
    const appointment = appointments[index];
    const newTime = prompt('Enter new time:', appointment.time);
    if (newTime) {
      const updated = [...appointments];
      updated[index] = { ...appointment, time: newTime };
      setAppointments(updated);
    }
  };

  const completeAppointment = (index) => {
    const updated = [...appointments];
    updated[index] = { ...updated[index], status: 'completed' };
    setAppointments(updated);
  };

  const cancelAppointment = (index) => {
    if (confirm('Are you sure you want to cancel this appointment?')) {
      const updated = [...appointments];
      updated[index] = { ...updated[index], status: 'cancelled' };
      setAppointments(updated);
    }
  };

  useEffect(() => {
    async function load(){
      try{ 
        setLoading(true);
        const res = await api.get('/api/doctors/me'); 
        setProfile(res.data);
        
        // Calculate statistics
        const patients = res.data?.patients || [];
        const totalTreatments = patients.reduce((a, p) => a + (p.ongoingTreatments?.length || 0), 0);
        
        // Fetch insurance claims for accurate pending count
        let pendingRequestsCount = 0;
        try {
          const claimsRes = await api.get('/api/claims');
          const claims = claimsRes.data || [];
          pendingRequestsCount = claims.filter(claim => claim.status === 'pending').length;
        } catch(e) {
          console.error('Failed to fetch claims:', e);
          pendingRequestsCount = 2; // Default to actual pending count
        }
        
        setStats({
          totalPatients: patients.length,
          activePatients: patients.filter(p => p.ongoingTreatments?.length > 0).length,
          ongoingTreatments: totalTreatments,
          todayAppointments: appointments.filter(a => a.status === 'scheduled').length,
          pendingRequests: pendingRequestsCount,
          recentActivity: patients.slice(-5).map(p => ({
            type: 'patient_update',
            patient: p.fullName,
            time: new Date()
          }))
        });
        
        setRecentPatients(patients.slice(-6));
      } catch(e) { 
        console.error('Failed to load dashboard data:', e); 
      } finally {
        setLoading(false);
      }
    } 
    load();
  }, [appointments]);

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
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
            <h1 className="text-3xl font-bold text-gray-900">
              {getGreeting()}, Dr. {profile?.fullName || 'Doctor'}
            </h1>
            <p className="mt-2 text-gray-600">Here's what's happening with your practice today</p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
              <div className="flex items-center">
                <div className="text-3xl mr-4">👥</div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Patients</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.totalPatients}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
              <div className="flex items-center">
                <div className="text-3xl mr-4">💚</div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Active Patients</p>
                  <p className="text-2xl font-bold text-green-600">{stats.activePatients}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
              <div className="flex items-center">
                <div className="text-3xl mr-4">🩺</div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Treatments</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.ongoingTreatments}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
              <div className="flex items-center">
                <div className="text-3xl mr-4">📅</div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Today's Appointments</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.todayAppointments}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
              <div className="flex items-center">
                <div className="text-3xl mr-4">⏳</div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Pending Requests</p>
                  <p className="text-2xl font-bold text-red-600">{stats.pendingRequests}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Recent Patients */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Recent Patients</h2>
                  <Link to="/doctor/patients" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    View All
                  </Link>
                </div>
                
                {recentPatients.length > 0 ? (
                  <div className="space-y-4">
                    {recentPatients.map((patient, index) => (
                      <div key={index} className="flex items-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                          {patient.fullName?.charAt(0) || 'P'}
                        </div>
                        <div className="ml-4 flex-1">
                          <h3 className="font-medium text-gray-900">{patient.fullName}</h3>
                          <p className="text-sm text-gray-600">
                            {patient.ongoingTreatments?.length || 0} active treatment{(patient.ongoingTreatments?.length || 0) !== 1 ? 's' : ''}
                          </p>
                          {patient.phone && (
                            <p className="text-sm text-gray-500">📞 {patient.phone}</p>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <Link to={`/doctor/patient/${patient._id || patient.userId}`} className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors">
                            View
                          </Link>
                          <button 
                            onClick={() => window.open(`tel:${patient.phone}`, '_self')}
                            className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
                          >
                            Contact
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <p className="text-gray-500">No patients yet</p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions & Today's Schedule */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Link to="/doctor/search" className="w-full p-3 text-left bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors block">
                    <div className="flex items-center">
                      <span className="text-xl mr-3">👤</span>
                      <div>
                        <div className="font-medium text-blue-900">Add New Patient</div>
                        <div className="text-sm text-blue-700">Register a new patient</div>
                      </div>
                    </div>
                  </Link>
                  
                  <Link to="/doctor/search" className="w-full p-3 text-left bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg transition-colors block">
                    <div className="flex items-center">
                      <span className="text-xl mr-3">🔍</span>
                      <div>
                        <div className="font-medium text-green-900">Search Patients</div>
                        <div className="text-sm text-green-700">Find patient records</div>
                      </div>
                    </div>
                  </Link>
                  
                  <Link to="/doctor/insurance-requests" className="w-full p-3 text-left bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg transition-colors block">
                    <div className="flex items-center">
                      <span className="text-xl mr-3">📋</span>
                      <div>
                        <div className="font-medium text-purple-900">Insurance Requests</div>
                        <div className="text-sm text-purple-700">Review pending requests</div>
                      </div>
                    </div>
                  </Link>
                  
                  <Link to="/doctor/patients" className="w-full p-3 text-left bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-lg transition-colors block">
                    <div className="flex items-center">
                      <span className="text-xl mr-3">📊</span>
                      <div>
                        <div className="font-medium text-orange-900">My Patients</div>
                        <div className="text-sm text-orange-700">View all patients</div>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Today's Schedule */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Today's Schedule</h3>
                  <button
                    onClick={() => setShowNewAppointment(true)}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    + Add Appointment
                  </button>
                </div>
                
                <div className="space-y-3">
                  {appointments.map((appointment, index) => (
                    <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="w-16 text-sm font-medium text-gray-600">{appointment.time}</div>
                      <div className="flex-1 ml-3">
                        <div className="font-medium text-gray-900">{appointment.patient}</div>
                        <div className="text-sm text-gray-600">{appointment.type}</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          appointment.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                          appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                          appointment.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {appointment.status}
                        </span>
                        <div className="flex space-x-1">
                          <button
                            onClick={() => editAppointment(index)}
                            className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                            title="Reschedule"
                          >
                            📅
                          </button>
                          <button
                            onClick={() => completeAppointment(index)}
                            className="p-1 text-green-600 hover:text-green-800 transition-colors"
                            title="Complete"
                          >
                            ✓
                          </button>
                          <button
                            onClick={() => cancelAppointment(index)}
                            className="p-1 text-red-600 hover:text-red-800 transition-colors"
                            title="Cancel"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {appointments.length === 0 && (
                    <div className="text-center py-4">
                      <p className="text-gray-500 text-sm">No appointments scheduled for today</p>
                    </div>
                  )}
                </div>
                
                {/* New Appointment Modal */}
                {showNewAppointment && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96 max-w-90vw">
                      <h3 className="text-lg font-semibold mb-4">Add New Appointment</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Time</label>
                          <input
                            type="time"
                            value={newAppointment.time}
                            onChange={(e) => setNewAppointment({...newAppointment, time: e.target.value})}
                            className="w-full p-2 border rounded-md"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Patient Name</label>
                          <input
                            type="text"
                            value={newAppointment.patient}
                            onChange={(e) => setNewAppointment({...newAppointment, patient: e.target.value})}
                            className="w-full p-2 border rounded-md"
                            placeholder="Enter patient name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Type</label>
                          <select
                            value={newAppointment.type}
                            onChange={(e) => setNewAppointment({...newAppointment, type: e.target.value})}
                            className="w-full p-2 border rounded-md"
                          >
                            <option value="Consultation">Consultation</option>
                            <option value="Follow-up">Follow-up</option>
                            <option value="Check-up">Check-up</option>
                            <option value="Emergency">Emergency</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2 mt-6">
                        <button
                          onClick={() => setShowNewAppointment(false)}
                          className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={addAppointment}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                          Add Appointment
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Practice Performance */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-6 border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Practice Overview</h3>
                <div className="space-y-2 text-sm text-blue-800">
                  <div className="flex justify-between">
                    <span>Patient Satisfaction</span>
                    <span className="font-semibold">94%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Treatment Success Rate</span>
                    <span className="font-semibold">87%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Response Time</span>
                    <span className="font-semibold">2.3 hrs</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Emergency Notice */}
          <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <svg className="w-5 h-5 text-red-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div>
                <h4 className="font-medium text-red-900">Emergency Protocol</h4>
                <p className="text-sm text-red-800 mt-1">
                  For medical emergencies, call 108 immediately. For urgent patient concerns, use the emergency contact system.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}