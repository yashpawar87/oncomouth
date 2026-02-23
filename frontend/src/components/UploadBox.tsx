import React, { useRef } from 'react';
import { Upload } from 'lucide-react';

interface UploadBoxProps {
  selectedFile: File | null;
  onFileChange: (file: File) => void;
  isAnalyzing: boolean;
}

export const UploadBox: React.FC<UploadBoxProps> = ({ selectedFile, onFileChange, isAnalyzing }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileChange(file);
  };

  return (
    <div 
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file) onFileChange(file);
      }}
      onClick={() => !isAnalyzing && fileInputRef.current?.click()}
      className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-all cursor-pointer
        ${selectedFile ? 'border-teal-400 bg-teal-50/50' : 'border-slate-200 hover:border-teal-400 hover:bg-slate-50'}`}
    >
      <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} accept="image/*" />
      <div className={`p-4 rounded-full mb-4 ${selectedFile ? 'bg-teal-100 text-teal-600' : 'bg-slate-100 text-slate-400'}`}>
        <Upload size={32} />
      </div>
      <p className="text-center">
        <span className="font-bold text-slate-700 block">{selectedFile ? selectedFile.name : 'Upload Oral MRI Scan'}</span>
        <span className="text-sm text-slate-400 block mt-1">Supports PNG, JPG, or T2-Weighted snapshots</span>
      </p>
    </div>
  );
};