// frontend/src/pages/Patient/CreateClaim.jsx
import React, { useState } from 'react';
import axios from 'axios';

export default function CreateClaim(){
  const [form,setForm] = useState({ treatment:'', diagnosis:'', claimDate:'', driveLink:'' });
  const [file, setFile] = useState(null);
  const submit = async (e) => {
    e.preventDefault();
    try {
      let claimDocs = [];
      if (file) {
        const fd = new FormData();
        fd.append('reportPdf', file);
        fd.append('reportName', file.name);
        fd.append('date', form.claimDate);
        const res = await axios.post(import.meta.env.VITE_API_BASE + '/api/labs/placeholder_user/upload?storage=local', fd, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        claimDocs.push(res.data.fileLink);
      } else if (form.driveLink) {
        claimDocs.push(form.driveLink);
      }
      await axios.post(import.meta.env.VITE_API_BASE + '/api/claims', { patientId: 'placeholder_patient_id', treatment: form.treatment, diagnosis: form.diagnosis, claimDate: form.claimDate, claimDocs });
      alert('Claim submitted');
    } catch (err) {
      alert(err.response?.data?.error || 'Claim failed');
    }
  };
  return (
    <div className="max-w-md mx-auto mt-6 bg-white p-6 rounded shadow">
      <h3 className="font-bold mb-3">Create Insurance Claim</h3>
      <form onSubmit={submit} className="space-y-3">
        <label>Treatment</label>
        <input className="input" value={form.treatment} onChange={e=>setForm({...form,treatment:e.target.value})} />
        <label>Diagnosis</label>
        <input className="input" value={form.diagnosis} onChange={e=>setForm({...form,diagnosis:e.target.value})} />
        <label>Claim Date</label>
        <input type="date" className="input" value={form.claimDate} onChange={e=>setForm({...form,claimDate:e.target.value})} />
        <label>Attach PDF (or leave blank to use Drive link)</label>
        <input type="file" accept="application/pdf" onChange={e=>setFile(e.target.files[0])} />
        <label>Or paste Google Drive shareable link</label>
        <input className="input" value={form.driveLink} onChange={e=>setForm({...form,driveLink:e.target.value})} />
        <button className="btn">Submit Claim</button>
      </form>
    </div>
  );
}
