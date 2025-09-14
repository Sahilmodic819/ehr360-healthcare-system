// frontend/src/pages/Patient/LabReports.jsx
import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import PDFViewer from '../../components/PDFViewer';
import api from '../../utils/api';

export default function LabReports(){
  const [patient, setPatient] = useState(null);
  const [file, setFile] = useState(null);
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const userId = localStorage.getItem('ehr_userId') || null;

  useEffect(() => { 
    async function load(){
      try {
        setLoading(true);
        const res = await api.get(`/api/patients/${userId}`);
        setPatient(res.data);
      } catch(e){ 
        console.error('Failed to load lab reports:', e); 
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
    if (!file) return alert('Please select a PDF file');
    
    setUploadLoading(true);
    const fd = new FormData();
    fd.append('reportPdf', file);
    fd.append('reportName', file.name);
    fd.append('date', date);
    
    try {
      await api.post(`/api/labs/${userId}/upload`, fd, { 
        headers: {'Content-Type':'multipart/form-data'} 
      });
      alert('Lab report uploaded successfully');
      const p = await api.get(`/api/patients/${userId}`);
      setPatient(p.data);
      setFile(null); 
      setDate('');
      document.getElementById('file-input').value = '';
    } catch(err){ 
      alert(err.response?.data?.error || 'Upload failed'); 
    } finally {
      setUploadLoading(false);
    }
  };

  const getFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading lab reports...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Lab Reports</h1>
            <p className="mt-2 text-gray-600">Upload and manage your laboratory test results</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Upload Form */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload New Report</h2>
                <form onSubmit={upload} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Report Date</label>
                    <input 
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={date} 
                      onChange={e => setDate(e.target.value)}
                      max={today}
                      required 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">PDF Report</label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400 transition-colors">
                      <div className="space-y-1 text-center">
                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <div className="flex text-sm text-gray-600">
                          <label htmlFor="file-input" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                            <span>Upload a file</span>
                            <input 
                              id="file-input"
                              type="file" 
                              accept="application/pdf" 
                              onChange={e => setFile(e.target.files[0])}
                              className="sr-only" 
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PDF up to 10MB</p>
                      </div>
                    </div>
                    {file && (
                      <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center text-sm">
                          <svg className="w-4 h-4 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span className="text-blue-900 font-medium">{file.name}</span>
                        </div>
                        <div className="text-xs text-blue-700 mt-1">
                          {getFileSize(file.size)}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <button 
                    type="submit"
                    disabled={uploadLoading || !file || !date}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {uploadLoading ? 'Uploading...' : 'Upload Report'}
                  </button>
                </form>
              </div>
            </div>

            {/* Reports List */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Your Lab Reports</h2>
                  <div className="text-sm text-gray-500">
                    {patient?.labReports?.length || 0} report{(patient?.labReports?.length || 0) !== 1 ? 's' : ''}
                  </div>
                </div>
                
                {patient?.labReports && patient.labReports.length > 0 ? (
                  <div className="space-y-4">
                    {patient.labReports
                      .sort((a, b) => new Date(b.date) - new Date(a.date))
                      .map((report, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              <h3 className="font-medium text-gray-900">{report.reportName}</h3>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">
                              Report Date: {formatDate(report.date)}
                            </p>
                            <div className="flex space-x-3">
                              <button
                                onClick={() => setSelectedReport(selectedReport === report ? null : report)}
                                className="inline-flex items-center px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                              >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                {selectedReport === report ? 'Hide' : 'View'}
                              </button>
                              <a
                                href={report.fileLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-3 py-1 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
                              >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Download
                              </a>
                            </div>
                          </div>
                        </div>
                        
                        {selectedReport === report && (
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <PDFViewer url={report.fileLink} />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-gray-500">No lab reports uploaded yet</p>
                    <p className="text-sm text-gray-400 mt-1">Upload your first report using the form on the left</p>
                  </div>
                )}
              </div>

              {/* Information Card */}
              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-2">📋 About Lab Reports</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Upload PDF files of your laboratory test results</li>
                  <li>• Keep track of all your medical tests in one place</li>
                  <li>• Share reports easily with your healthcare providers</li>
                  <li>• All files are securely stored and encrypted</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

