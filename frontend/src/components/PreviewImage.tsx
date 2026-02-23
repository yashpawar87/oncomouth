import React from 'react';
import { Maximize2, FileText } from 'lucide-react';

interface PreviewProps {
  previewUrl: string | null;
  isAnalyzing: boolean;
}

export const PreviewImage: React.FC<PreviewProps> = ({ previewUrl, isAnalyzing }) => {
  return (
    <div className="bg-slate-900 rounded-2xl shadow-xl border border-slate-800 p-4 overflow-hidden relative">
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isAnalyzing ? 'bg-teal-500 animate-pulse' : 'bg-slate-600'}`}></div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Scan Viewer</span>
        </div>
        <Maximize2 size={16} className="text-slate-400" />
      </div>

      <div className="relative flex items-center justify-center bg-black rounded-lg overflow-hidden min-h-[400px]">
        {previewUrl ? (
          <>
            <img src={previewUrl} alt="Scan" className="max-w-full h-full object-contain" />
            {isAnalyzing && <div className="absolute inset-0 z-20 pointer-events-none animate-scan-bar" />}
          </>
        ) : (
          <div className="text-slate-600 flex flex-col items-center gap-3">
            <FileText size={48} className="opacity-20" />
            <p className="text-sm">Awaiting diagnostic image...</p>
          </div>
        )}
      </div>
    </div>
  );
};