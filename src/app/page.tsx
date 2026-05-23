'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/contexts/authStore';
import { useRouter } from 'next/navigation';
import { FileEdit, Users2, Zap, CloudUpload, ShieldCheck, Target } from 'lucide-react';

const features = [
  {
    icon: FileEdit,
    title: 'Rich Academic Editor',
    desc: 'Distraction-free rich text editor with full support for headings, bold/italic, code blocks, checklists, and images.',
    color: 'text-indigo-600',
    bg: 'bg-indigo-50/50',
  },
  {
    icon: Users2,
    title: 'Peer Connections & Friends',
    desc: 'Connect with peers by username, send direct friend requests, and manage your cooperative academic circle.',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50/50',
  },
  {
    icon: Zap,
    title: 'Real-time WebRTC Collaboration',
    desc: 'Real-time peer-to-peer collaboration. See changes, text inputs, and focus indicators instantly as they happen.',
    color: 'text-rose-600',
    bg: 'bg-rose-50/50',
  },
  {
    icon: CloudUpload,
    title: 'Secure Cloud Attachments',
    desc: 'Attach reference slides, research files, and PDF materials to notes instantly. Powered by Cloudflare R2.',
    color: 'text-amber-600',
    bg: 'bg-amber-50/50',
  },
  {
    icon: ShieldCheck,
    title: 'Granular Sharing Controls',
    desc: 'Keep complete ownership of your work. Share with specific peers and assign view-only or full editor access.',
    color: 'text-violet-600',
    bg: 'bg-violet-50/50',
  },
  {
    icon: Target,
    title: 'ADHD DopaCompanion Focus',
    desc: 'A revolutionary study sprint workspace. Celebrate tiny academic achievements with positive dopamine rewards and confetti.',
    color: 'text-pink-600',
    bg: 'bg-pink-50/50',
  },
];

const stats = [
  { value: '12k+', label: 'Notes Authored' },
  { value: '850+', label: 'Active Learners' },
  { value: '99.98%', label: 'Uptime SLA' },
  { value: '< 250ms', label: 'API Response' },
];

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthStore();
  const [scrolled, setScrolled] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [animatedCursorText, setAnimatedCursorText] = useState('Action items to discuss with the team');
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/dashboard/notes');
    }
  }, [isLoading, isAuthenticated, router]);

  // Auto-rotate feature highlight
  useEffect(() => {
    const t = setInterval(() => setActiveFeature(p => (p + 1) % features.length), 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-500/15 selection:text-indigo-900 overflow-x-hidden font-sans">
      
      {/* ── NAVBAR ── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 lg:px-20 py-4 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-xl shadow-[0_2px_20px_-8px_rgba(0,0,0,0.08)] border-b border-slate-200/40' : 'bg-transparent'}`}>
        <Link href="/" className="flex items-center gap-1.5 group">
          <span className="text-[28px] font-black tracking-tighter bg-gradient-to-br from-[#3525cd] to-[#4f46e5] bg-clip-text text-transparent group-hover:opacity-90 transition-opacity font-headline">NotExA</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-10">
          <a href="#features" className="text-[14px] font-bold text-slate-500 hover:text-indigo-600 transition-colors duration-200">Features</a>
          <Link href="/auth/login" className="text-[14px] font-bold text-slate-500 hover:text-indigo-600 transition-colors duration-200">Sign In</Link>
          <Link href="/auth/register" className="px-6 py-2.5 bg-gradient-to-br from-[#3525cd] to-[#4f46e5] text-white rounded-xl text-sm font-bold shadow-md hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200">
            Get Started Free →
          </Link>
        </div>
        
        <div className="md:hidden flex gap-2">
          <Link href="/auth/login" className="px-4 py-2 text-sm font-bold text-slate-600">Login</Link>
          <Link href="/auth/register" className="px-4 py-2 bg-gradient-to-br from-[#3525cd] to-[#4f46e5] text-white rounded-xl text-sm font-bold shadow">Sign Up</Link>
        </div>
      </nav>

      {/* ── HERO SECTION ── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center pt-32 pb-24 px-6 lg:px-20 overflow-hidden">
        {/* Glow meshes */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 65%)' }} />
          <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.05) 0%, transparent 65%)' }} />
          <div className="absolute top-[35%] left-[25%] w-[500px] h-[500px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(236,72,153,0.04) 0%, transparent 65%)' }} />
          
          {/* Subtle grid background */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.035]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="hero-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#6366f1" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hero-grid)" />
          </svg>
        </div>

        <div className="max-w-[1400px] mx-auto grid lg:grid-cols-2 gap-16 lg:gap-24 items-center relative z-10 w-full">
          {/* Left Hero Content */}
          <div className="max-w-[620px]">
            {/* New Announcement Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-100/60 mb-8 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600" />
              </span>
              Now with AI-Powered Summaries
            </div>

            <h1 className="text-[clamp(44px,5.2vw,76px)] font-black leading-[1.03] tracking-[-3px] text-slate-900 mb-6">
              Interactive study<br />notebooks for<br />
              <span className="bg-gradient-to-br from-[#3525cd] to-[#4f46e5] bg-clip-text text-transparent font-headline">brilliant minds.</span>
            </h1>

            <p className="text-[18px] text-slate-500 leading-relaxed mb-10 max-w-[520px] font-medium">
              Author beautiful notes, collaborate on live documents, and study with custom AI tools — all in an ecosystem made for productivity.
            </p>

            <div className="flex flex-wrap gap-4 mb-16">
              <Link href="/auth/register" className="inline-flex items-center gap-3 px-8 py-4.5 bg-gradient-to-br from-[#3525cd] to-[#4f46e5] text-white rounded-2xl text-base font-extrabold shadow-xl hover:-translate-y-1 hover:shadow-2xl transition-all duration-300">
                Start Learning Free
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </Link>
              <a href="#features" className="inline-flex items-center gap-3 px-8 py-4.5 bg-white text-slate-700 border border-slate-200/80 rounded-2xl text-base font-bold hover:border-slate-300 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300">
                Explore Features
              </a>
            </div>

            {/* Premium stats panel */}
            <div className="grid grid-cols-4 gap-6 pt-10 border-t border-slate-200/60">
              {stats.map((s) => (
                <div key={s.label}>
                  <div className="text-[25px] font-black text-slate-900 tracking-tight leading-none mb-1.5">{s.value}</div>
                  <div className="text-[12px] font-semibold text-slate-500 leading-tight">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Hero - Interactive Live Editor Mockup */}
          <div className="relative hidden lg:flex items-center justify-center">
            <style>{`
              @keyframes floatCard { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-14px) rotate(0.5deg)} }
              @keyframes cursorBlink { 0%,100%{opacity:1} 50%{opacity:0} }
              @keyframes slideUpFade { from{opacity:0;transform:translateY(25px)} to{opacity:1;transform:translateY(0)} }
            `}</style>

            {/* Main Interactive Editor Shell */}
            <div className="animate-[floatCard_7s_ease-in-out_infinite] relative">
              {/* Outer shadow card */}
              <div className="bg-white rounded-[32px] border border-slate-200/80 shadow-[0_35px_85px_-10px_rgba(30,41,59,0.12)] p-7 w-[500px] relative">
                
                {/* Window header dots */}
                <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
                  <div className="w-3 h-3 rounded-full bg-rose-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  <span className="ml-auto text-[11px] font-mono text-slate-400 font-bold">physics-notes.md</span>
                </div>

                {/* Toolbar */}
                <div className="flex gap-2 mb-6 flex-wrap">
                  {['B', 'I', 'U', 'H₁', 'H₂', '≡', '☐', '🔗', '🖼'].map((t, i) => (
                    <span 
                      key={i} 
                      className={`w-8.5 h-8.5 rounded-xl flex items-center justify-center text-[13px] font-extrabold transition-all cursor-default ${i === 0 ? 'bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] text-white shadow-md shadow-indigo-500/20' : 'bg-slate-50 text-slate-500 border border-slate-200/60 hover:bg-slate-100'}`}
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* Main Content */}
                <div className="text-[23px] font-black text-slate-900 mb-3 tracking-tight">Quantum Superposition</div>
                <div className="text-[14.5px] text-slate-500 leading-relaxed mb-6 font-medium">
                  At the core of quantum mechanics, a system exists in <span className="bg-indigo-50 border border-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded-md font-semibold text-[13.5px]">multiple states simultaneously</span> until observed.
                  <br/><br/>
                  Key research areas for final exam:
                  <span className="inline-block w-0.5 h-[17px] bg-indigo-600 ml-1.5 align-text-bottom" style={{ animation: 'cursorBlink 1.1s step-end infinite' }} />
                </div>

                {/* Tasks lists */}
                <div className="space-y-3">
                  {['Review Schrodinger wave equations', 'Plot probability distribution plots'].map((task, i) => (
                    <div key={i} className="flex items-center gap-3 text-[14px]">
                      <div className={`w-5.5 h-5.5 rounded-lg border flex items-center justify-center shrink-0 transition-colors ${i === 0 ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-200 bg-slate-50'}`}>
                        {i === 0 && <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                      </div>
                      <span className={i === 0 ? 'line-through text-slate-400 font-bold' : 'text-slate-700 font-bold'}>{task}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating Element 1: Active Collaborators badge */}
              <div className="absolute -bottom-6 -left-10 bg-white rounded-2xl px-4.5 py-3.5 flex items-center gap-3.5 shadow-[0_15px_40px_-5px_rgba(30,41,59,0.15)] border border-slate-200/80 animate-[slideUpFade_0.6s_ease_0.3s_both]">
                <div className="flex -space-x-3">
                  {['#6366f1', '#10b981', '#f43f5e'].map((c, i) => (
                    <div key={i} className="w-9 h-9 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-black shadow-sm" style={{ background: c }}>
                      {['P', 'E', 'N'][i]}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="text-[13px] font-extrabold text-slate-800">3 editing live</div>
                  <div className="text-[10px] text-emerald-500 font-extrabold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                    WebRTC active
                  </div>
                </div>
              </div>

              {/* Floating Element 2: AI Summarized badge */}
              <div className="absolute -top-6 -right-8 bg-white rounded-2xl px-4.5 py-3.5 shadow-[0_15px_40px_-5px_rgba(30,41,59,0.15)] border border-slate-200/80 flex items-center gap-3 animate-[slideUpFade_0.6s_ease_0s_both]">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3525cd] to-[#4f46e5] flex items-center justify-center text-lg shadow-md shadow-indigo-500/10">✨</div>
                <div>
                  <div className="text-[12.5px] font-black text-slate-800">AI Summary</div>
                  <div className="text-[11px] text-slate-400 font-bold">Highlights synthesized</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ACCESSIBILITY / CORE FEATURES ── */}
      <section id="features" className="py-24 lg:py-32 px-6 lg:px-20 bg-white">
        <div className="max-w-[1400px] mx-auto">
          
          <div className="flex items-center gap-2 text-[12px] font-black text-indigo-600 uppercase tracking-[3px] mb-5">
            <div className="w-5 h-0.5 bg-indigo-500 rounded" />
            Core Architecture
          </div>
          
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
            <h2 className="text-[clamp(34px,3.8vw,54px)] font-black tracking-[-2px] leading-[1.05] text-slate-900">
              Purpose built for<br />better research.
            </h2>
            <p className="text-[17px] text-slate-500 max-w-[420px] leading-relaxed font-semibold">
              Distraction-free workspace featuring instant cloud collaboration, structured document organization, and smart helper tools.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f, i) => {
              const IconComponent = f.icon;
              return (
                <div
                  key={i}
                  className="group bg-white border border-slate-100 rounded-2xl p-7.5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_-12px_rgba(15,23,42,0.05)] hover:border-slate-200/80 flex flex-col items-start"
                >
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-5.5 ${f.bg} ${f.color} shadow-sm border border-slate-100`}>
                    <IconComponent size={20} strokeWidth={2.2} />
                  </div>
                  <h3 className="text-[17px] font-bold tracking-tight text-slate-900 mb-2.5 transition-colors group-hover:text-indigo-600">{f.title}</h3>
                  <p className="text-[13.5px] text-slate-500 leading-relaxed font-medium">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FOCUS ADVICE & QUOTE ── */}
      <section className="py-24 lg:py-32 px-6 lg:px-20 bg-slate-900 text-white relative overflow-hidden">
        {/* Colorful gradient backdrop blurs */}
        <div className="absolute top-[-30%] right-[-15%] w-[800px] h-[800px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 65%)' }} />
        <div className="absolute bottom-[-30%] left-[-15%] w-[800px] h-[800px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(236,72,153,0.08) 0%, transparent 65%)' }} />

        <div className="max-w-[1000px] mx-auto text-center relative z-10">
          <span className="text-[12px] font-black uppercase tracking-[3px] text-indigo-400 mb-6 inline-block">ADHD focus optimized</span>
          <h2 className="text-[clamp(32px,4.5vw,52px)] font-black tracking-[-2px] leading-tight mb-8">
            "Your focus is your superpower. Celebrate small steps every single day."
          </h2>
          <p className="text-[17px] text-slate-400 max-w-[620px] mx-auto leading-relaxed font-semibold mb-12">
            NotExA integrates scientific micro-rewards to praise learning progress. Break complex research topics into tiny, highly visual checklists.
          </p>
          <div className="flex justify-center">
            <Link href="/auth/register" className="px-8 py-4 bg-gradient-to-br from-[#3525cd] to-[#4f46e5] text-white rounded-2xl text-base font-extrabold shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all">
              Initialize Your First Sprint
            </Link>
          </div>
        </div>
      </section>

      {/* ── PERSISTENT CTA SECTION ── */}
      <section className="py-24 lg:py-32 px-6 lg:px-20 relative overflow-hidden bg-slate-50">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[450px] rounded-full" style={{ background: 'radial-gradient(ellipse, rgba(99,102,241,0.06) 0%, transparent 65%)' }} />
        </div>
        
        <div className="max-w-[800px] mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 mb-8 shadow-sm">
            🎓 Free Collaborative Workspace
          </div>
          
          <h2 className="text-[clamp(38px,4.5vw,60px)] font-black tracking-[-2.5px] text-slate-950 mb-6 leading-[1.05]">
            Ready to explore<br />better note-taking?
          </h2>
          
          <p className="text-[17.5px] text-slate-500 leading-relaxed mb-10 max-w-[550px] mx-auto font-medium">
            Join the community of students and researchers using NotExA to collaborate, capture ideas, and lock in concepts instantly.
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/auth/register" className="inline-flex items-center gap-3 px-9 py-4 bg-gradient-to-br from-[#3525cd] to-[#4f46e5] text-white rounded-2xl text-base font-black shadow-xl hover:-translate-y-1 hover:shadow-2xl transition-all duration-300">
              Start Free Account
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </Link>
            <Link href="/auth/login" className="inline-flex items-center gap-3 px-9 py-4 bg-white text-slate-800 border border-slate-200 rounded-2xl text-base font-bold hover:border-slate-300 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-slate-200/60 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-20 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="text-[20px] font-black tracking-tighter bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">NotExA</span>
            <span className="text-slate-300 text-sm mx-2">·</span>
            <p className="text-[13px] text-slate-400 font-bold">© 2026 College Minor Project</p>
          </div>
          
          <div className="flex gap-8">
            <a href="#" className="text-[13px] font-bold text-slate-400 hover:text-indigo-600 transition-colors">Privacy Policy</a>
            <a href="#" className="text-[13px] font-bold text-slate-400 hover:text-indigo-600 transition-colors">Terms of Service</a>
            <a href="#" className="text-[13px] font-bold text-slate-400 hover:text-indigo-600 transition-colors">Documentation</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
