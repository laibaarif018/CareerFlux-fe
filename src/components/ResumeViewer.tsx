// ResumeViewer.tsx
import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc =
  `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PdfViewerProps {
  fileUrl: string;          // ✅ THIS IS REQUIRED
  onClose: () => void;      // ✅ THIS IS REQUIRED
}

export default function ResumeViewer({ fileUrl, onClose }: PdfViewerProps) {
  const [numPages, setNumPages] = useState(0);

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-slate-800 p-4 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
        <button
          onClick={onClose}
          className="mb-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Close
        </button>
        <Document
          file={fileUrl}
          onLoadSuccess={(pdf) => setNumPages(pdf.numPages)}
        >
          {Array.from({ length: numPages }, (_, i) => (
            <Page
              key={i}
              pageNumber={i + 1}
              renderTextLayer={false}
              renderAnnotationLayer={false}
            />
          ))}
        </Document>
      </div>
    </div>
  );
}
