import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Brain,
  CheckCircle2,
  AlertCircle,
  XCircle,
  ArrowRight,
  PlayCircle,
  Upload,
  Zap,
  ClipboardCheck,
  Cpu,
  Database,
  ShieldCheck,
  Microscope,
  Sparkles,
  BarChart3,
  Eye,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Intersection-observer fade-in                                     */
/* ------------------------------------------------------------------ */
function useFadeIn() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('fade-in-visible');
          io.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

const FadeIn: React.FC<{ children: React.ReactNode; className?: string; delay?: string }> = ({
  children,
  className = '',
  delay = '0ms',
}) => {
  const ref = useFadeIn();
  return (
    <div ref={ref} className={`fade-in-section ${className}`} style={{ transitionDelay: delay }}>
      {children}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Live Model Analytics Card (right side of hero)                    */
/* ------------------------------------------------------------------ */
const AnalyticsCard: React.FC = () => (
  <div className="analytics-card bg-white rounded-2xl shadow-2xl shadow-slate-200/60 border border-slate-100 p-6 w-full max-w-sm">
    {/* Traffic light dots + label */}
    <div className="flex items-center justify-between mb-6">
      <div className="flex gap-1.5">
        <div className="w-3 h-3 rounded-full bg-red-400" />
        <div className="w-3 h-3 rounded-full bg-amber-400" />
        <div className="w-3 h-3 rounded-full bg-green-400" />
      </div>
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
        Live Model Analytics
      </span>
    </div>

    {/* Classification items */}
    <div className="space-y-0">
      {/* Normal Tissue */}
      <div className="flex items-center gap-4 py-4 border-b border-slate-100">
        <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0">
          <CheckCircle2 size={20} className="text-emerald-500" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-800">Normal Tissue</h4>
          <p className="text-xs text-slate-400 mt-0.5">Baseline healthy mucosa detection</p>
        </div>
      </div>

      {/* Leukoplakia */}
      <div className="flex items-center gap-4 py-4 border-b border-slate-100">
        <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0">
          <AlertCircle size={20} className="text-amber-500" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-800">Leukoplakia</h4>
          <p className="text-xs text-slate-400 mt-0.5">Pre-cancerous white lesion flagging</p>
        </div>
      </div>

      {/* Squamous Carcinoma */}
      <div className="flex items-center gap-4 py-4">
        <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
          <XCircle size={20} className="text-red-400" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-800">Squamous Carcinoma</h4>
          <p className="text-xs text-slate-400 mt-0.5">Malignant structure segmentation</p>
        </div>
      </div>
    </div>
  </div>
);

/* ------------------------------------------------------------------ */
/*  Feature Card                                                      */
/* ------------------------------------------------------------------ */
interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureProps> = ({ icon, title, description }) => (
  <div className="group bg-white rounded-2xl border border-slate-100 p-7 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1">
    <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110">
      {icon}
    </div>
    <h3 className="text-base font-extrabold text-slate-800 mb-2">{title}</h3>
    <p className="text-sm text-slate-400 leading-relaxed">{description}</p>
  </div>
);

/* ------------------------------------------------------------------ */
/*  Step Card                                                         */
/* ------------------------------------------------------------------ */
interface StepProps {
  step: number;
  icon: React.ReactNode;
  title: string;
  description: string;
}

const StepCard: React.FC<StepProps> = ({ step, icon, title, description }) => (
  <div className="relative flex flex-col items-center text-center">
    <div className="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-lg shadow-slate-900/15 mb-5">
      {icon}
    </div>
    <span className="absolute -top-3 -right-2 w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 text-xs font-black flex items-center justify-center ring-4 ring-white">
      {step}
    </span>
    <h4 className="text-base font-extrabold text-slate-800 mb-1.5">{title}</h4>
    <p className="text-sm text-slate-400 max-w-[220px]">{description}</p>
  </div>
);

/* ------------------------------------------------------------------ */
/*  Stat Pill                                                         */
/* ------------------------------------------------------------------ */
const StatPill: React.FC<{ value: string; label: string }> = ({ value, label }) => (
  <div className="flex flex-col items-center px-6">
    <span className="text-2xl md:text-3xl font-black text-slate-800">{value}</span>
    <span className="text-[11px] font-bold uppercase text-slate-400 mt-1 tracking-wide">{label}</span>
  </div>
);

/* ================================================================== */
/*  HOME PAGE                                                         */
/* ================================================================== */
const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans overflow-x-hidden">
      {/* ---- Navbar ---- */}
      <nav className="bg-white/90 backdrop-blur-md border-b border-slate-100 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-slate-900 p-2.5 rounded-xl">
              <Brain className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight">
                OncoMouth <span className="text-indigo-600">AI</span>
              </h1>
              <p className="text-[9px] uppercase font-bold text-slate-400 tracking-[0.15em]">
                Clinical Decision Support
              </p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-semibold text-slate-400 hover:text-slate-800 transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-sm font-semibold text-slate-400 hover:text-slate-800 transition-colors">
              Pipeline
            </a>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 transition-all"
            >
              Launch Dashboard
            </button>
          </div>
        </div>
      </nav>

      {/* ---- Hero ---- */}
      <section className="relative py-20 md:py-32 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left — Text */}
          <div>
            <FadeIn>
              <h2 className="hero-headline text-5xl md:text-6xl lg:text-[4.25rem] font-black leading-[1.05] tracking-tight mb-8">
                Accelerating{' '}
                <span className="hero-accent-text">
                  Oral Cancer
                </span>
                <br />
                Detection.
              </h2>
            </FadeIn>

            <FadeIn delay="100ms">
              <p className="text-lg text-slate-400 max-w-lg leading-relaxed mb-10">
                A high-precision clinical decision support system utilizing
                EfficientNet-B3 architectures to identify mucosal pathologies
                from high-resolution medical photography.
              </p>
            </FadeIn>

            <FadeIn delay="200ms">
              <div className="flex flex-wrap items-center gap-4">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="group px-8 py-4 rounded-xl bg-slate-900 text-white text-sm font-bold shadow-lg shadow-slate-900/15 hover:shadow-xl hover:shadow-slate-900/20 transition-all duration-300 flex items-center gap-3 hover:-translate-y-0.5"
                >
                  Launch Diagnostics
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                </button>
                <a
                  href="#how-it-works"
                  className="px-8 py-4 rounded-xl border border-slate-200 text-slate-600 text-sm font-bold hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center gap-2.5"
                >
                  <PlayCircle size={16} />
                  Research Paper
                </a>
              </div>
            </FadeIn>
          </div>

          {/* Right — Analytics Card */}
          <FadeIn delay="150ms" className="flex justify-center lg:justify-end">
            <AnalyticsCard />
          </FadeIn>
        </div>
      </section>

      {/* ---- Stats bar ---- */}
      <FadeIn>
        <section className="max-w-4xl mx-auto mb-24 px-6">
          <div className="bg-slate-50 rounded-2xl border border-slate-100 py-8 px-6 flex flex-wrap justify-center gap-8">
            <StatPill value="3" label="Detection Classes" />
            <div className="w-px bg-slate-200 hidden sm:block" />
            <StatPill value="300×300" label="Input Resolution" />
            <div className="w-px bg-slate-200 hidden sm:block" />
            <StatPill value="T = 1.2" label="Temperature Scaling" />
            <div className="w-px bg-slate-200 hidden sm:block" />
            <StatPill value="B3" label="EfficientNet Backbone" />
          </div>
        </section>
      </FadeIn>

      {/* ---- Features ---- */}
      <section id="features" className="max-w-7xl mx-auto px-6 pb-24">
        <FadeIn>
          <div className="text-center mb-14">
            <span className="text-[11px] font-black uppercase text-indigo-600 tracking-[0.2em]">
              Capabilities
            </span>
            <h3 className="text-3xl md:text-4xl font-black text-slate-800 mt-3">
              Clinical-Grade AI, Right in Your Browser
            </h3>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <FadeIn delay="0ms">
            <FeatureCard
              icon={<Cpu size={22} className="text-white" />}
              title="EfficientNet-B3"
              description="State-of-the-art convolutional backbone via timm, fine-tuned on oral pathology datasets."
            />
          </FadeIn>
          <FadeIn delay="80ms">
            <FeatureCard
              icon={<Eye size={22} className="text-white" />}
              title="Grad-CAM Explainability"
              description="Visual heatmap overlay showing exactly which regions influenced the AI's diagnostic decision."
            />
          </FadeIn>
          <FadeIn delay="160ms">
            <FeatureCard
              icon={<Database size={22} className="text-white" />}
              title="MLflow Registry"
              description="Versioned model artifacts tracked through MLflow for reproducible experiments and serving."
            />
          </FadeIn>
          <FadeIn delay="240ms">
            <FeatureCard
              icon={<ShieldCheck size={22} className="text-white" />}
              title="HIPAA-Secure"
              description="All inference runs locally. No patient data ever leaves your environment — privacy by design."
            />
          </FadeIn>
        </div>
      </section>

      {/* ---- How it works ---- */}
      <section id="how-it-works" className="bg-slate-50 border-y border-slate-100 py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <div className="text-center mb-16">
              <span className="text-[11px] font-black uppercase text-indigo-600 tracking-[0.2em]">
                Pipeline
              </span>
              <h3 className="text-3xl md:text-4xl font-black text-slate-800 mt-3">
                Three Steps to a Diagnosis
              </h3>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-8 left-[16.67%] right-[16.67%] h-0.5 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200" />

            <FadeIn delay="0ms">
              <StepCard
                step={1}
                icon={<Upload size={26} />}
                title="Upload Scan"
                description="Drag & drop or browse for an oral MRI / photograph (PNG, JPG)."
              />
            </FadeIn>
            <FadeIn delay="120ms">
              <StepCard
                step={2}
                icon={<Zap size={26} />}
                title="AI Analysis"
                description="EfficientNet-B3 processes the image with temperature-calibrated inference + Grad-CAM."
              />
            </FadeIn>
            <FadeIn delay="240ms">
              <StepCard
                step={3}
                icon={<ClipboardCheck size={26} />}
                title="Get Results"
                description="Ranked probabilities, confidence scores, and an activation heatmap — instantly."
              />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ---- CTA Banner ---- */}
      <FadeIn>
        <section className="max-w-5xl mx-auto px-6 py-24">
          <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-12 md:p-16 text-center">
            {/* Decorative subtle rings */}
            <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full border border-white/5" />
            <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full border border-white/5" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-indigo-500/5" />

            <Microscope size={36} className="text-white/40 mx-auto mb-6" />
            <h3 className="text-2xl md:text-4xl font-black text-white mb-4">
              Ready to Screen a Patient?
            </h3>
            <p className="text-slate-400 text-base md:text-lg max-w-xl mx-auto mb-8">
              Open the diagnostics dashboard, upload an oral scan, and receive an AI diagnosis
              with Grad-CAM visualization in seconds.
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              className="group inline-flex items-center gap-3 px-10 py-4 rounded-xl bg-white text-slate-900 text-sm font-bold shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-0.5"
            >
              Launch Dashboard
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </section>
      </FadeIn>

      {/* ---- Footer ---- */}
      <footer className="border-t border-slate-100 bg-white py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-400">
          <div className="flex items-center gap-2 font-bold text-slate-500">
            <Brain size={16} className="text-slate-400" />
            OncoMouth AI · v1.0.4
          </div>
          <p className="text-xs">EfficientNet-B3 · PyTorch · MLflow · FastAPI · React</p>
          <p className="text-xs">For research & clinical decision support only.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
