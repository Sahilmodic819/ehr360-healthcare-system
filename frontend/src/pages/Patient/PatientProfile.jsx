// frontend/src/pages/Patient/PatientProfile.jsx
import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import api from '../../utils/api';

export default function PatientProfile(){
  const [patient, setPatient] = useState(null);
  const [file, setFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(localStorage.getItem('ehr_avatar') || null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [editingContact, setEditingContact] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', phone: '', relationship: '' });
  const userId = localStorage.getItem('ehr_userId') || null;

  useEffect(() => { 
    async function load(){ 
      try { 
        setLoading(true);
        const res = await api.get(`/api/patients/${userId}`); 
        setPatient(res.data);
        setEditForm(res.data);
      } catch(e) { 
        console.error('Failed to load profile:', e); 
      } finally {
        setLoading(false);
      }
    } 
    if (userId) {
      load(); 
    }
  }, [userId]);

  const upload = async (e) => {
    e.preventDefault();
    if (!file) return alert('Please select an image');
    
    setUploading(true);
    const fd = new FormData(); 
    fd.append('avatar', file);
    
    try {
      const res = await api.post('/api/uploads/avatar/me', fd, { 
        headers: {'Content-Type':'multipart/form-data'} 
      });
      const avatar = res.data.avatar;
      setAvatarPreview(avatar); 
      localStorage.setItem('ehr_avatar', avatar);
      alert('Avatar uploaded successfully');
      setFile(null);
      document.getElementById('avatar-input').value = '';
    } catch(err) { 
      alert('Upload failed. Please try again.'); 
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
        alert('File size must be less than 5MB');
        return;
      }
      setFile(selectedFile);
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setAvatarPreview(e.target.result);
      reader.readAsDataURL(selectedFile);
    }
  };

  const formatDate = (date) => {
    if (!date) return 'Not specified';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateAge = (dob) => {
    if (!dob) return 'N/A';
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const addEmergencyContact = async (e) => {
    e.preventDefault();
    if (!newContact.name || !newContact.phone) {
      alert('Name and phone number are required');
      return;
    }

    try {
      const currentContacts = patient.emergencyContacts || [];
      const updatedContacts = [...currentContacts, newContact];
      
      const res = await api.put(`/api/patients/${userId}`, {
        emergencyContacts: updatedContacts
      });
      
      setPatient(res.data);
      setNewContact({ name: '', phone: '', relationship: '' });
      setEditingContact(false);
      alert('Emergency contact added successfully');
    } catch (error) {
      console.error('Failed to add emergency contact:', error);
      alert('Failed to add emergency contact. Please try again.');
    }
  };

  const removeEmergencyContact = async (index) => {
    try {
      const currentContacts = patient.emergencyContacts || [];
      const updatedContacts = currentContacts.filter((_, i) => i !== index);
      
      const res = await api.put(`/api/patients/${userId}`, {
        emergencyContacts: updatedContacts
      });
      
      setPatient(res.data);
      alert('Emergency contact removed successfully');
    } catch (error) {
      console.error('Failed to remove emergency contact:', error);
      alert('Failed to remove emergency contact. Please try again.');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading profile...</p>
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
            <p className="text-red-600 font-medium">Failed to load profile</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <p className="mt-2 text-gray-600">Manage your personal information and preferences</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Profile Picture & Basic Info */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="text-center">
                  <div className="relative mx-auto w-32 h-32 mb-4">
                    {avatarPreview ? (
                      <img 
                        src={avatarPreview} 
                        alt="Profile" 
                        className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center border-4 border-gray-200">
                        <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  <h2 className="text-xl font-semibold text-gray-900 mb-1">{patient.fullName}</h2>
                  <p className="text-gray-600 mb-4">Patient ID: {patient.aabhaId || 'Not set'}</p>
                  
                  <form onSubmit={upload} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Update Profile Picture</label>
                      <input 
                        id="avatar-input"
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileChange}
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                      <p className="text-xs text-gray-500 mt-1">JPG, PNG up to 5MB</p>
                    </div>
                    
                    {file && (
                      <button 
                        type="submit"
                        disabled={uploading}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {uploading ? 'Uploading...' : 'Upload Photo'}
                      </button>
                    )}
                  </form>
                </div>
              </div>
            </div>

            {/* Detailed Information */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
                  <button
                    onClick={() => setEditing(!editing)}
                    className="inline-flex items-center px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    {editing ? 'Cancel' : 'Edit'}
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
                    <p className="text-gray-900 font-medium">{patient.fullName || 'Not specified'}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Date of Birth</label>
                    <p className="text-gray-900">{formatDate(patient.dob)}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Age</label>
                    <p className="text-gray-900">{calculateAge(patient.dob)} years</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Gender</label>
                    <p className="text-gray-900 capitalize">{patient.gender || 'Not specified'}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Blood Type</label>
                    <p className="text-gray-900">{patient.bloodType || 'Not specified'}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Phone Number</label>
                    <p className="text-gray-900">{patient.phone || 'Not specified'}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Aadhaar Number</label>
                    <p className="text-gray-900">{patient.aadharNo || 'Not specified'}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">AABHA ID</label>
                    <p className="text-gray-900">{patient.aabhaId || 'Not specified'}</p>
                  </div>
                </div>

                {/* Emergency Contacts */}
                <div className="mt-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Emergency Contacts</h3>
                    <button
                      onClick={() => setEditingContact(!editingContact)}
                      className="inline-flex items-center px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Add Contact
                    </button>
                  </div>
                  
                  {editingContact && (
                    <form onSubmit={addEmergencyContact} className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <h4 className="font-medium text-gray-900 mb-3">Add Emergency Contact</h4>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Name*</label>
                          <input
                            type="text"
                            value={newContact.name}
                            onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Phone*</label>
                          <input
                            type="tel"
                            value={newContact.phone}
                            onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
                          <select
                            value={newContact.relationship}
                            onChange={(e) => setNewContact({...newContact, relationship: e.target.value})}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="">Select...</option>
                            <option value="Spouse">Spouse</option>
                            <option value="Parent">Parent</option>
                            <option value="Child">Child</option>
                            <option value="Sibling">Sibling</option>
                            <option value="Friend">Friend</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <button
                          type="submit"
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
                        >
                          Add Contact
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingContact(false);
                            setNewContact({ name: '', phone: '', relationship: '' });
                          }}
                          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                  
                  {patient.emergencyContacts && patient.emergencyContacts.length > 0 ? (
                    <div className="space-y-3">
                      {patient.emergencyContacts.map((contact, index) => (
                        <div key={index} className="p-4 bg-red-50 border border-red-200 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900">{contact.name}</p>
                              <p className="text-sm text-gray-600">{contact.relationship || 'Emergency Contact'}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <p className="text-red-600 font-medium">📞 {contact.phone}</p>
                              <button
                                onClick={() => removeEmergencyContact(index)}
                                className="text-red-600 hover:text-red-800"
                                title="Remove contact"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 bg-gray-50 rounded-lg">
                      <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      <p className="text-gray-500 text-sm">No emergency contacts added</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Account Security */}
              <div className="bg-white rounded-lg shadow-md p-6 mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Account & Privacy</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                      <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                    </div>
                    <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors">
                      Enable
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Privacy Settings</p>
                      <p className="text-sm text-gray-600">Control who can access your medical information</p>
                    </div>
                    <button className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
                      Manage
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Download Data</p>
                      <p className="text-sm text-gray-600">Export your complete medical records</p>
                    </div>
                    <button className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors">
                      Export
                    </button>
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