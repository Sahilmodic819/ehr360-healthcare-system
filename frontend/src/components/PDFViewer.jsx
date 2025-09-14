// frontend/src/components/PDFViewer.jsx
import React from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function PDFViewer({ url }){
  if (!url) return <div>No document</div>;
  return (
    <div className="border rounded p-2 bg-white">
      <Document file={url}>
        <Page pageNumber={1} />
      </Document>
    </div>
  )
}
