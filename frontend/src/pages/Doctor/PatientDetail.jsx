// frontend/src/pages/Doctor/PatientDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import api from '../../utils/api';

export default function PatientDetail() {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [newPrescription, setNewPrescription] = useState({ medication: '', dosage: '', instructions: '', duration: '' });
  const [newDiagnosis, setNewDiagnosis] = useState({ condition: '', severity: '', notes: '', date: new Date().toISOString().split('T')[0] });
  const [updatingTreatment, setUpdatingTreatment] = useState(null);
  const [treatmentUpdate, setTreatmentUpdate] = useState({ status: '', notes: '' });

  useEffect(() => {
    async function loadPatient() {
      try {
        const res = await api.get(`/api/patients/${id}`);
        setPatient(res.data);
      } catch (error) {
        console.error('Failed to load patient:', error);
        
        // Create dynamic mock patient data based on ID
        const mockPatients = {
          'demo1': {
            _id: 'demo1',
            fullName: 'John Smith',
            email: 'john.smith@email.com',
            phone: '+1-555-0123',
            dob: '1985-06-15',
            gender: 'Male',
            bloodType: 'O+',
            aabhaId: 'AABHA001',
            address: '123 Main St, City, State 12345',
            emergencyContacts: [
              { name: 'Jane Smith', phone: '+1-555-0124', relationship: 'Spouse' }
            ],
            medications: [
              { name: 'Metformin', prescribedBy: 'Dr. Johnson', startDate: '2025-09-01', current: true },
              { name: 'Lisinopril', prescribedBy: 'Dr. Johnson', startDate: '2025-08-15', current: true }
            ],
            allergies: ['Penicillin', 'Peanuts'],
            medicalHistory: ['Hypertension', 'Diabetes Type 2'],
            currentMedications: ['Metformin', 'Lisinopril'],
            labReports: [
              { date: '2025-09-10', reportName: 'Blood Sugar Test', reportType: 'Blood Work', fileLink: '/reports/blood_sugar.pdf' },
              { date: '2025-09-05', reportName: 'Lipid Profile', reportType: 'Blood Work', fileLink: '/reports/lipid.pdf' }
            ],
            ongoingTreatments: [
              { name: 'Diabetes Management', doctor: 'Dr. Johnson', notes: 'Regular monitoring required', startDate: '2025-08-01', status: 'active' }
            ],
            symptoms: [
              { date: '2025-09-12', note: 'Mild headache and fatigue' }
            ],
            lastVisit: '2024-01-15'
          },
          'demo2': {
            _id: 'demo2',
            fullName: 'Sarah Johnson',
            email: 'sarah.johnson@email.com',
            phone: '+1-555-0125',
            dob: '1990-03-22',
            gender: 'Female',
            bloodType: 'A+',
            aabhaId: 'AABHA002',
            address: '456 Oak Ave, City, State 12346',
            emergencyContacts: [
              { name: 'Mike Johnson', phone: '+1-555-0126', relationship: 'Husband' }
            ],
            medications: [
              { name: 'Albuterol Inhaler', prescribedBy: 'Dr. Smith', startDate: '2025-08-20', current: true }
            ],
            allergies: ['Dust', 'Pollen'],
            medicalHistory: ['Asthma'],
            currentMedications: ['Albuterol Inhaler'],
            labReports: [
              { date: '2025-09-08', reportName: 'Pulmonary Function Test', reportType: 'Respiratory', fileLink: '/reports/pft.pdf' }
            ],
            ongoingTreatments: [
              { name: 'Asthma Management', doctor: 'Dr. Smith', notes: 'Use inhaler as needed', startDate: '2025-08-01', status: 'active' }
            ],
            symptoms: [
              { date: '2025-09-10', note: 'Occasional shortness of breath' }
            ],
            lastVisit: '2024-01-10'
          },
          'demo3': {
            _id: 'demo3',
            fullName: 'Michael Brown',
            email: 'michael.brown@email.com',
            phone: '+1-555-0127',
            dob: '1978-11-08',
            gender: 'Male',
            bloodType: 'B+',
            aabhaId: 'AABHA003',
            address: '789 Pine St, City, State 12347',
            emergencyContacts: [
              { name: 'Lisa Brown', phone: '+1-555-0128', relationship: 'Wife' }
            ],
            medications: [
              { name: 'Atorvastatin', prescribedBy: 'Dr. Wilson', startDate: '2025-08-10', current: true }
            ],
            allergies: ['Shellfish'],
            medicalHistory: ['High Cholesterol'],
            currentMedications: ['Atorvastatin'],
            labReports: [
              { date: '2025-09-06', reportName: 'Cholesterol Panel', reportType: 'Blood Work', fileLink: '/reports/cholesterol.pdf' }
            ],
            ongoingTreatments: [
              { name: 'Cholesterol Management', doctor: 'Dr. Wilson', notes: 'Diet and exercise recommended', startDate: '2025-08-01', status: 'active' }
            ],
            symptoms: [
              { date: '2025-09-08', note: 'No current symptoms' }
            ],
            lastVisit: '2024-01-12'
          },
          'demo4': {
            _id: 'demo4',
            fullName: 'Emma Davis',
            email: 'emma.davis@email.com',
            phone: '+1-555-0129',
            dob: '1995-07-30',
            gender: 'Female',
            bloodType: 'AB+',
            aabhaId: 'AABHA004',
            address: '321 Elm St, City, State 12348',
            emergencyContacts: [
              { name: 'Robert Davis', phone: '+1-555-0130', relationship: 'Father' }
            ],
            medications: [],
            allergies: [],
            medicalHistory: [],
            currentMedications: [],
            labReports: [
              { date: '2025-09-01', reportName: 'Annual Physical', reportType: 'General', fileLink: '/reports/annual.pdf' }
            ],
            ongoingTreatments: [],
            symptoms: [
              { date: '2025-09-05', note: 'Regular checkup - feeling well' }
            ],
            lastVisit: '2024-01-08'
          },
          'P001': {
            _id: 'P001',
            fullName: 'Alice Cooper',
            email: 'alice.cooper@email.com',
            phone: '+1-555-0131',
            dob: '1982-12-12',
            gender: 'Female',
            bloodType: 'O-',
            aabhaId: 'AABHA005',
            address: '555 Maple Dr, City, State 12349',
            emergencyContacts: [
              { name: 'Tom Cooper', phone: '+1-555-0132', relationship: 'Husband' }
            ],
            medications: [
              { name: 'Levothyroxine', prescribedBy: 'Dr. Green', startDate: '2025-08-25', current: true }
            ],
            allergies: ['Latex'],
            medicalHistory: ['Hypothyroidism'],
            currentMedications: ['Levothyroxine'],
            labReports: [
              { date: '2025-09-11', reportName: 'Thyroid Function Test', reportType: 'Endocrine', fileLink: '/reports/thyroid.pdf' }
            ],
            ongoingTreatments: [
              { name: 'Thyroid Management', doctor: 'Dr. Green', notes: 'Monthly monitoring', startDate: '2025-08-01', status: 'active' }
            ],
            symptoms: [
              { date: '2025-09-09', note: 'Energy levels improving' }
            ],
            lastVisit: '2024-01-05'
          }
        };

        // Use the patient data for the specific ID, or default to John Smith if ID not found
        const patientData = mockPatients[id] || mockPatients['demo1'];
        setPatient(patientData);
      } finally {
        setLoading(false);
      }
    }
    loadPatient();
  }, [id]);

  const addPrescription = async () => {
    if (!newPrescription.medication || !newPrescription.dosage) {
      alert('Please fill in medication and dosage');
      return;
    }

    try {
      const updatedMedications = [...(patient.medications || []), {
        ...newPrescription,
        prescribedBy: 'Dr. Current',
        startDate: new Date().toISOString().split('T')[0],
        current: true
      }];
      
      setPatient(prev => ({ ...prev, medications: updatedMedications }));
      setNewPrescription({ medication: '', dosage: '', instructions: '', duration: '' });
      alert('Prescription added successfully');
    } catch (error) {
      console.error('Failed to add prescription:', error);
      alert('Failed to add prescription');
    }
  };

  const addDiagnosis = async () => {
    if (!newDiagnosis.condition) {
      alert('Please enter a condition');
      return;
    }

    try {
      const updatedDiagnoses = [...(patient.diagnoses || []), newDiagnosis];
      setPatient(prev => ({ ...prev, diagnoses: updatedDiagnoses }));
      setNewDiagnosis({ condition: '', severity: '', notes: '', date: new Date().toISOString().split('T')[0] });
      alert('Diagnosis added successfully');
    } catch (error) {
      console.error('Failed to add diagnosis:', error);
      alert('Failed to add diagnosis');
    }
  };

  const updateTreatmentStatus = async (treatmentIndex) => {
    if (!treatmentUpdate.status) {
      alert('Please select a status');
      return;
    }

    try {
      const updatedTreatments = [...patient.ongoingTreatments];
      updatedTreatments[treatmentIndex] = {
        ...updatedTreatments[treatmentIndex],
        status: treatmentUpdate.status,
        notes: treatmentUpdate.notes || updatedTreatments[treatmentIndex].notes,
        lastUpdated: new Date().toISOString()
      };
      
      setPatient(prev => ({ ...prev, ongoingTreatments: updatedTreatments }));
      setUpdatingTreatment(null);
      setTreatmentUpdate({ status: '', notes: '' });
      alert('Treatment status updated successfully');
    } catch (error) {
      console.error('Failed to update treatment:', error);
      alert('Failed to update treatment');
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
  };

  const calculateAge = (dob) => {
    if (!dob) return 'N/A';
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading patient details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!patient) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-red-600 font-medium">Patient not found</p>
            <Link to="/doctor/patients" className="mt-4 inline-block text-blue-600 hover:text-blue-700">
              ← Back to Patients
            </Link>
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
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{patient.fullName}</h1>
                <p className="mt-2 text-gray-600">Patient ID: {patient.aabhaId || patient._id}</p>
              </div>
              <div className="flex space-x-3">
                <button 
                  onClick={() => window.open(`tel:${patient.phone}`, '_self')}
                  className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                >
                  📞 Call Patient
                </button>
                <Link 
                  to="/doctor/patients" 
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  ← Back to Patients
                </Link>
              </div>
            </div>
          </div>

          {/* Patient Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
              <div className="flex items-center">
                <div className="text-2xl mr-3">🎂</div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Age</p>
                  <p className="text-xl font-bold text-blue-600">{calculateAge(patient.dob)} years</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
              <div className="flex items-center">
                <div className="text-2xl mr-3">🩸</div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Blood Type</p>
                  <p className="text-xl font-bold text-red-600">{patient.bloodType || 'N/A'}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
              <div className="flex items-center">
                <div className="text-2xl mr-3">💊</div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Medications</p>
                  <p className="text-xl font-bold text-green-600">{patient.medications?.length || 0}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
              <div className="flex items-center">
                <div className="text-2xl mr-3">🩺</div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Active Treatments</p>
                  <p className="text-xl font-bold text-purple-600">{patient.ongoingTreatments?.filter(t => t.status !== 'completed').length || 0}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="bg-white rounded-lg shadow-md mb-8">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {['overview', 'medications', 'treatments', 'diagnoses', 'reports'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-4 text-sm font-medium border-b-2 transition-colors capitalize ${
                      activeTab === tab
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Personal Information */}
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Email</label>
                          <p className="text-gray-900">{patient.email}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Phone</label>
                          <p className="text-gray-900">{patient.phone}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Date of Birth</label>
                          <p className="text-gray-900">{formatDate(patient.dob)}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Gender</label>
                          <p className="text-gray-900 capitalize">{patient.gender}</p>
                        </div>
                      </div>
                    </div>

                    {/* Emergency Contacts */}
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contacts</h3>
                      {patient.emergencyContacts && patient.emergencyContacts.length > 0 ? (
                        <div className="space-y-3">
                          {patient.emergencyContacts.map((contact, index) => (
                            <div key={index} className="bg-white p-3 rounded-lg border">
                              <p className="font-medium text-gray-900">{contact.name}</p>
                              <p className="text-sm text-gray-600">{contact.relationship || 'Emergency Contact'}</p>
                              <p className="text-sm text-blue-600">{contact.phone}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500">No emergency contacts added</p>
                      )}
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Symptoms</h3>
                    {patient.symptoms && patient.symptoms.length > 0 ? (
                      <div className="space-y-3">
                        {patient.symptoms.slice(-3).map((symptom, index) => (
                          <div key={index} className="bg-white p-3 rounded-lg border">
                            <div className="flex justify-between items-start">
                              <p className="text-gray-900">{symptom.note}</p>
                              <span className="text-sm text-gray-500">{formatDate(symptom.date)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No recent symptoms recorded</p>
                    )}
                  </div>
                </div>
              )}

              {/* Medications Tab */}
              {activeTab === 'medications' && (
                <div className="space-y-6">
                  {/* Add New Prescription */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-blue-900 mb-4">Add New Prescription</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Medication Name *</label>
                        <input
                          type="text"
                          value={newPrescription.medication}
                          onChange={(e) => setNewPrescription({...newPrescription, medication: e.target.value})}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="e.g., Metformin"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Dosage *</label>
                        <input
                          type="text"
                          value={newPrescription.dosage}
                          onChange={(e) => setNewPrescription({...newPrescription, dosage: e.target.value})}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="e.g., 500mg twice daily"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Instructions</label>
                        <input
                          type="text"
                          value={newPrescription.instructions}
                          onChange={(e) => setNewPrescription({...newPrescription, instructions: e.target.value})}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="e.g., Take with food"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                        <input
                          type="text"
                          value={newPrescription.duration}
                          onChange={(e) => setNewPrescription({...newPrescription, duration: e.target.value})}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="e.g., 30 days"
                        />
                      </div>
                    </div>
                    <button
                      onClick={addPrescription}
                      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Add Prescription
                    </button>
                  </div>

                  {/* Current Medications */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Medications</h3>
                    {patient.medications && patient.medications.length > 0 ? (
                      <div className="space-y-3">
                        {patient.medications.map((med, index) => (
                          <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium text-gray-900">{med.name}</h4>
                                <p className="text-sm text-gray-600">Prescribed by: {med.prescribedBy}</p>
                                <p className="text-sm text-gray-600">Start Date: {formatDate(med.startDate)}</p>
                                {med.dosage && <p className="text-sm text-gray-600">Dosage: {med.dosage}</p>}
                                {med.instructions && <p className="text-sm text-gray-600">Instructions: {med.instructions}</p>}
                              </div>
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                med.current ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                                {med.current ? 'Active' : 'Stopped'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No medications prescribed</p>
                    )}
                  </div>
                </div>
              )}

              {/* Treatments Tab */}
              {activeTab === 'treatments' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">Treatment Management</h3>
                  {patient.ongoingTreatments && patient.ongoingTreatments.length > 0 ? (
                    <div className="space-y-4">
                      {patient.ongoingTreatments.map((treatment, index) => (
                        <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h4 className="font-medium text-gray-900">{treatment.name}</h4>
                              <p className="text-sm text-gray-600">Started: {formatDate(treatment.startDate)}</p>
                              <p className="text-sm text-gray-600">Notes: {treatment.notes}</p>
                            </div>
                            <span className={`px-3 py-1 text-xs rounded-full ${
                              treatment.status === 'active' ? 'bg-green-100 text-green-800' :
                              treatment.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {treatment.status || 'Active'}
                            </span>
                          </div>
                          
                          {updatingTreatment === index ? (
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <h5 className="font-medium text-gray-900 mb-3">Update Treatment Status</h5>
                              <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                  <select
                                    value={treatmentUpdate.status}
                                    onChange={(e) => setTreatmentUpdate({...treatmentUpdate, status: e.target.value})}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  >
                                    <option value="">Select status</option>
                                    <option value="active">Active</option>
                                    <option value="on-hold">On Hold</option>
                                    <option value="completed">Completed</option>
                                    <option value="discontinued">Discontinued</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Update Notes</label>
                                  <input
                                    type="text"
                                    value={treatmentUpdate.notes}
                                    onChange={(e) => setTreatmentUpdate({...treatmentUpdate, notes: e.target.value})}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Additional notes..."
                                  />
                                </div>
                              </div>
                              <div className="flex space-x-2 mt-4">
                                <button
                                  onClick={() => updateTreatmentStatus(index)}
                                  className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                >
                                  Update
                                </button>
                                <button
                                  onClick={() => setUpdatingTreatment(null)}
                                  className="px-3 py-1 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => setUpdatingTreatment(index)}
                              className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                            >
                              Update Status
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No ongoing treatments</p>
                  )}
                </div>
              )}

              {/* Diagnoses Tab */}
              {activeTab === 'diagnoses' && (
                <div className="space-y-6">
                  {/* Add New Diagnosis */}
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-purple-900 mb-4">Add New Diagnosis</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Condition *</label>
                        <input
                          type="text"
                          value={newDiagnosis.condition}
                          onChange={(e) => setNewDiagnosis({...newDiagnosis, condition: e.target.value})}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          placeholder="e.g., Type 2 Diabetes"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
                        <select
                          value={newDiagnosis.severity}
                          onChange={(e) => setNewDiagnosis({...newDiagnosis, severity: e.target.value})}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        >
                          <option value="">Select severity</option>
                          <option value="Mild">Mild</option>
                          <option value="Moderate">Moderate</option>
                          <option value="Severe">Severe</option>
                          <option value="Critical">Critical</option>
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                        <textarea
                          value={newDiagnosis.notes}
                          onChange={(e) => setNewDiagnosis({...newDiagnosis, notes: e.target.value})}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          rows="3"
                          placeholder="Additional notes about the diagnosis..."
                        />
                      </div>
                    </div>
                    <button
                      onClick={addDiagnosis}
                      className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Add Diagnosis
                    </button>
                  </div>

                  {/* Current Diagnoses */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Diagnoses</h3>
                    {patient.diagnoses && patient.diagnoses.length > 0 ? (
                      <div className="space-y-3">
                        {patient.diagnoses.map((diagnosis, index) => (
                          <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium text-gray-900">{diagnosis.condition}</h4>
                                <p className="text-sm text-gray-600">Severity: {diagnosis.severity}</p>
                                <p className="text-sm text-gray-600">Date: {formatDate(diagnosis.date)}</p>
                                {diagnosis.notes && <p className="text-sm text-gray-600 mt-2">{diagnosis.notes}</p>}
                              </div>
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                diagnosis.severity === 'Critical' ? 'bg-red-100 text-red-800' :
                                diagnosis.severity === 'Severe' ? 'bg-orange-100 text-orange-800' :
                                diagnosis.severity === 'Moderate' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {diagnosis.severity || 'Mild'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No diagnoses recorded</p>
                    )}
                  </div>
                </div>
              )}

              {/* Reports Tab */}
              {activeTab === 'reports' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">Medical Reports & Documents</h3>
                  
                  {/* Lab Reports */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Lab Reports</h4>
                    {patient.labReports && patient.labReports.length > 0 ? (
                      <div className="grid md:grid-cols-2 gap-4">
                        {patient.labReports.map((report, index) => (
                          <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h5 className="font-medium text-gray-900">{report.reportName}</h5>
                                <p className="text-sm text-gray-600">{report.reportType}</p>
                                <p className="text-sm text-gray-600">{formatDate(report.date)}</p>
                              </div>
                              <button className="text-blue-600 hover:text-blue-700">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No lab reports available</p>
                    )}
                  </div>

                  {/* Immunizations */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Immunizations</h4>
                    {patient.immunizations && patient.immunizations.length > 0 ? (
                      <div className="space-y-3">
                        {patient.immunizations.map((immunization, index) => (
                          <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-center">
                              <div>
                                <h5 className="font-medium text-gray-900">{immunization.vaccine}</h5>
                                <p className="text-sm text-gray-600">{formatDate(immunization.date)}</p>
                              </div>
                              <button className="text-green-600 hover:text-green-700">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No immunization records</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}