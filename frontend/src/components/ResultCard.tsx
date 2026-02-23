import React, { useState } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, RefreshCcw, Download, Eye, EyeOff } from 'lucide-react';
import { PredictionResult } from '../services/api';

interface ResultCardProps {
  result: PredictionResult;
  onReset: () => void;
}

const getResultConfig = (prediction: PredictionResult['prediction']) => {
  switch (prediction) {
    case 'Cancer':
      return {
        icon: XCircle,
        label: 'CANCER DETECTED',
        bgClass: 'bg-red-50 border-red-100 text-red-900',
        iconClass: 'text-red-500',
        barClass: 'bg-red-500',
      };
    case 'PreCancer':
      return {
        icon: AlertTriangle,
        label: 'PRE-CANCEROUS',
        bgClass: 'bg-amber-50 border-amber-100 text-amber-900',
        iconClass: 'text-amber-500',
        barClass: 'bg-amber-500',
      };
    default:
      return {
        icon: CheckCircle2,
        label: 'NORMAL',
        bgClass: 'bg-green-50 border-green-100 text-green-900',
        iconClass: 'text-green-500',
        barClass: 'bg-green-500',
      };
  }
};

export const ResultCard: React.FC<ResultCardProps> = ({ result, onReset }) => {
  const config = getResultConfig(result.prediction);
  const Icon = config.icon;
  const [showHeatmap, setShowHeatmap] = useState(true);

  return (
    <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-8 animate-in zoom-in-95">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-xl font-extrabold text-slate-800">Analysis Report</h3>
        <div className="flex gap-2">
          <button onClick={() => window.print()} className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg text-sm font-bold">
            <Download size={14} /> PDF
          </button>
          <button onClick={onReset} className="p-2 text-slate-300 hover:text-red-500"><RefreshCcw size={18} /></button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className={`p-6 rounded-2xl border text-center ${config.bgClass}`}>
          <Icon size={48} className={`mx-auto ${config.iconClass} mb-4`} />
          <h4 className="text-3xl font-black">{config.label}</h4>
        </div>

        <div className="flex flex-col justify-center">
          <span className="text-[10px] font-black uppercase text-slate-400">Confidence</span>
          <span className="text-4xl font-black text-slate-800">{(result.confidence * 100).toFixed(1)}%</span>
          <div className="h-3 w-full bg-slate-100 rounded-full mt-4 overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ${config.barClass}`}
              style={{ width: `${result.confidence * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Probability Breakdown */}
      <div className="mt-8 pt-6 border-t border-slate-100">
        <span className="text-[10px] font-black uppercase text-slate-400 block mb-4">Probability Breakdown</span>
        <div className="space-y-3">
          {(['Normal', 'PreCancer', 'Cancer'] as const).map((label) => (
            <div key={label} className="flex items-center gap-4">
              <span className="text-sm font-bold text-slate-600 w-24">{label}</span>
              <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full ${label === 'Cancer' ? 'bg-red-400' : label === 'PreCancer' ? 'bg-amber-400' : 'bg-green-400'}`}
                  style={{ width: `${result.probabilities[label] * 100}%` }}
                />
              </div>
              <span className="text-sm font-bold text-slate-800 w-16 text-right">
                {(result.probabilities[label] * 100).toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Grad-CAM Activation Map */}
      {result.gradcam_image && (
        <div className="mt-8 pt-6 border-t border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-[10px] font-black uppercase text-slate-400 block">Grad-CAM Activation Map</span>
              <span className="text-[10px] text-slate-400 mt-0.5 block">Highlighted regions indicate areas most influential to the diagnosis</span>
            </div>
            <button
              onClick={() => setShowHeatmap(!showHeatmap)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-bold text-slate-600 transition-colors"
            >
              {showHeatmap ? <EyeOff size={13} /> : <Eye size={13} />}
              {showHeatmap ? 'Hide' : 'Show'}
            </button>
          </div>

          {showHeatmap && (
            <div className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800 p-3">
              <div className="flex items-center gap-2 mb-3 px-1">
                <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Model Attention — {result.prediction}
                </span>
              </div>
              <div className="relative rounded-lg overflow-hidden bg-black flex items-center justify-center">
                <img
                  src={`data:image/png;base64,${result.gradcam_image}`}
                  alt="Grad-CAM heatmap overlay"
                  className="max-w-full h-auto object-contain"
                />
              </div>
              {/* Color legend */}
              <div className="flex items-center justify-between mt-3 px-1">
                <span className="text-[9px] font-bold text-slate-500 uppercase">Low Activation</span>
                <div className="flex-1 mx-3 h-2 rounded-full" style={{
                  background: 'linear-gradient(to right, #0000ff, #00ffff, #00ff00, #ffff00, #ff0000)'
                }} />
                <span className="text-[9px] font-bold text-slate-500 uppercase">High Activation</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};