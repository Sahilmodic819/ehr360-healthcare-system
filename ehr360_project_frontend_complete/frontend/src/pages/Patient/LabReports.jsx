// frontend/src/pages/Patient/LabReports.jsx
import React, { useEffect, useState } from 'react';
import api from '../../utils/api';

export default function LabReports(){
  const [patient, setPatient] = useState(null);
  const [file, setFile] = useState(null);
  const [date, setDate] = useState('');
  const userId = localStorage.getItem('ehr_userId') || null;

  useEffect(()=>{ async function load(){
    try {
      const res = await api.get(`/api/patients/${userId}`);
      setPatient(res.data);
    } catch(e){ console.error(e); }
  } load(); }, [userId]);

  const upload = async (e) => {
    e.preventDefault();
    if (!file) return alert('Select a PDF');
    const fd = new FormData();
    fd.append('reportPdf', file);
    fd.append('reportName', file.name);
    fd.append('date', date);
    try {
      const res = await api.post(`/api/labs/${userId}/upload`, fd, { headers: {'Content-Type':'multipart/form-data'} });
      alert('Uploaded');
      const p = await api.get(`/api/patients/${userId}`);
      setPatient(p.data);
      setFile(null); setDate('');
    } catch(err){ alert(err.response?.data?.error || 'Upload failed'); }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold">Lab Reports</h2>
      <form onSubmit={upload} className="max-w-md mt-4 bg-white p-4 rounded shadow space-y-3">
        <label>Date</label>
        <input type="date" className="input" value={date} onChange={e=>setDate(e.target.value)} required />
        <label>PDF</label>
        <input type="file" accept="application/pdf" onChange={e=>setFile(e.target.files[0])} />
        <button className="btn">Upload Report</button>
      </form>

      <div className="mt-6">
        <h3 className="font-bold">Reports</h3>
        <ul className="mt-2 space-y-2">
          {(patient?.labReports || []).map((r,i)=>(
            <li key={i} className="p-3 bg-white rounded shadow">
              <div className="text-sm text-gray-600">{new Date(r.date).toLocaleDateString()}</div>
              <div>{r.reportName} - <a className="text-blue-600" href={r.fileLink} target="_blank" rel="noreferrer">View PDF</a></div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
