import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Brain,
    Search,
    Activity,
    AlertCircle,
    Database,
    ShieldCheck,
    ArrowLeft,
} from 'lucide-react';
import { UploadBox } from '../components/UploadBox';
import { PreviewImage } from '../components/PreviewImage';
import { ResultCard } from '../components/ResultCard';
import { runInference, PredictionResult } from '../services/api';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const [patientId, setPatientId] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<PredictionResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (file: File) => {
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
        setResult(null);
    };

    const handleAnalyze = async () => {
        if (!selectedFile) return;
        setIsAnalyzing(true);
        setError(null);
        try {
            const data = await runInference(selectedFile, patientId);
            setResult(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F4F6FA] text-slate-900 font-sans">
            <nav className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-50 shadow-sm">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/')}
                            className="flex items-center gap-1.5 text-sm font-semibold text-slate-400 hover:text-teal-600 transition-colors"
                        >
                            <ArrowLeft size={16} />
                            Home
                        </button>
                        <div className="w-px h-6 bg-slate-200" />
                        <div className="flex items-center gap-3">
                            <div className="bg-teal-600 p-2 rounded-lg">
                                <Brain className="text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold">
                                    OncoMouth <span className="text-teal-600">AI</span>
                                </h1>
                                <p className="text-[10px] uppercase font-bold text-slate-400">MLflow v1.0.4</p>
                            </div>
                        </div>
                    </div>
                    <div className="hidden md:flex gap-6 text-[10px] font-bold text-slate-400 uppercase">
                        <div className="flex items-center gap-1.5">
                            <Database size={14} /> OncomouthModel:v1
                        </div>
                        <div className="flex items-center gap-1.5 text-teal-600">
                            <ShieldCheck size={14} /> HIPAA Secure
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-5 space-y-6">
                    <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-4">
                            Patient Identification
                        </label>
                        <div className="relative mb-6">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                type="text"
                                placeholder="Patient Reference ID"
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-500"
                                value={patientId}
                                onChange={(e) => setPatientId(e.target.value)}
                            />
                        </div>

                        <UploadBox
                            selectedFile={selectedFile}
                            onFileChange={handleFileChange}
                            isAnalyzing={isAnalyzing}
                        />

                        <button
                            onClick={handleAnalyze}
                            disabled={!selectedFile || isAnalyzing}
                            className={`w-full mt-6 py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all
                ${isAnalyzing || !selectedFile
                                    ? 'bg-slate-200 text-slate-400'
                                    : 'bg-teal-600 text-white hover:bg-teal-700 shadow-lg'
                                }`}
                        >
                            {isAnalyzing ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <Activity size={20} />
                            )}
                            {isAnalyzing ? 'Processing Inference...' : 'Request AI Diagnosis'}
                        </button>
                    </section>

                    {error && (
                        <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-start gap-3 text-red-700">
                            <AlertCircle size={20} />
                            <p className="text-sm font-medium">{error}</p>
                        </div>
                    )}
                </div>

                <div className="lg:col-span-7 space-y-6">
                    <PreviewImage previewUrl={previewUrl} isAnalyzing={isAnalyzing} />
                    {result && <ResultCard result={result} onReset={() => setResult(null)} />}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
