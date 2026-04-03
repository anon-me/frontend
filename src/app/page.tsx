'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/contexts/authStore';
import { useRouter } from 'next/navigation';

const features = [
  {
    icon: '✏️',
    title: 'Rich Text Editor',
    desc: 'Bold, headings, lists, code blocks, images, task lists — everything in a clean, distraction-free editor.',
    color: '#4f46e5',
    gradient: 'from-indigo-500/10 to-indigo-500/5',
    border: 'group-hover:border-indigo-300/60',
  },
  {
    icon: '👥',
    title: 'Friends & Sharing',
    desc: 'Add friends by email, share notes with one click. Control who can view and who can edit.',
    color: '#059669',
    gradient: 'from-emerald-500/10 to-emerald-500/5',
    border: 'group-hover:border-emerald-300/60',
  },
  {
    icon: '⚡',
    title: 'Real-time Collaboration',
    desc: 'See edits as they happen. Work on the same note with your team — no refreshing needed.',
    color: '#e11d48',
    gradient: 'from-rose-500/10 to-rose-500/5',
    border: 'group-hover:border-rose-300/60',
  },
  {
    icon: '📁',
    title: 'Cloud File Storage',
    desc: 'Upload files and attach them to notes. Powered by Cloudflare R2 — fast and secure.',
    color: '#d97706',
    gradient: 'from-amber-500/10 to-amber-500/5',
    border: 'group-hover:border-amber-300/60',
  },
  {
    icon: '🔒',
    title: 'Permission Control',
    desc: 'Owner keeps full access. Collaborators get view or edit access — you decide.',
    color: '#7c3aed',
    gradient: 'from-violet-500/10 to-violet-500/5',
    border: 'group-hover:border-violet-300/60',
  },
  {
    icon: '💳',
    title: 'Premium via API Nepal',
    desc: 'Upgrade through eSewa, Khalti, IME Pay. Get 5GB storage and file sharing.',
    color: '#db2777',
    gradient: 'from-pink-500/10 to-pink-500/5',
    border: 'group-hover:border-pink-300/60',
  },
];

const stats = [
  { value: '10k+', label: 'Notes Created' },
  { value: '500+', label: 'Active Users' },
  { value: '99.9%', label: 'Uptime' },
  { value: '< 1s', label: 'Load Time' },
];

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthStore();
  const [scrolled, setScrolled] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
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
    const t = setInterval(() => setActiveFeature(p => (p + 1) % features.length), 3000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0a0f1e]" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif" }}>

      {/* ── NAVBAR ── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 lg:px-16 py-4 transition-all duration-500 ${scrolled ? 'bg-white/80 backdrop-blur-2xl shadow-sm border-b border-slate-200/60' : 'bg-transparent'}`}>
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-gradient-to-br from-[#4f46e5] to-[#6d63ff] rounded-[10px] flex items-center justify-center text-white font-black text-base shadow-lg shadow-indigo-500/30">N</div>
          <span className="text-[21px] font-bold tracking-tight">NotExA</span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-[14px] font-semibold text-slate-500 hover:text-slate-900 transition-colors duration-200">Features</a>
          <a href="#pricing" className="text-[14px] font-semibold text-slate-500 hover:text-slate-900 transition-colors duration-200">Pricing</a>
          <Link href="/auth/login" className="text-[14px] font-semibold text-slate-500 hover:text-slate-900 transition-colors duration-200">Sign In</Link>
          <Link href="/auth/register" className="px-5 py-2.5 bg-gradient-to-br from-[#4f46e5] to-[#6d63ff] text-white rounded-full text-sm font-bold shadow-md shadow-indigo-500/25 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-300">
            Get Started Free →
          </Link>
        </div>
        <div className="md:hidden flex gap-3">
          <Link href="/auth/login" className="px-4 py-2 text-sm font-semibold text-slate-600">Login</Link>
          <Link href="/auth/register" className="px-4 py-2 bg-[#4f46e5] text-white rounded-full text-sm font-bold shadow shadow-indigo-500/30">Sign Up</Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center pt-28 pb-20 px-6 lg:px-16 overflow-hidden">
        {/* Background mesh */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-20%] right-[-10%] w-[700px] h-[700px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(79,70,229,0.12) 0%, transparent 65%)' }} />
          <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(5,150,105,0.08) 0%, transparent 65%)' }} />
          <div className="absolute top-[40%] left-[35%] w-[400px] h-[400px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(219,39,119,0.06) 0%, transparent 65%)' }} />
          {/* Grid */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.025]" xmlns="http://www.w3.org/2000/svg">
            <defs><pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse"><path d="M 60 0 L 0 0 0 60" fill="none" stroke="#0a0f1e" strokeWidth="1"/></pattern></defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="max-w-[1320px] mx-auto grid lg:grid-cols-2 gap-16 lg:gap-24 items-center relative z-10 w-full">
          {/* Left */}
          <div className="max-w-[600px]">
            {/* Live badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[13px] font-semibold text-indigo-600 bg-indigo-50 border border-indigo-100 mb-7 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              Now with AI-powered summarization
            </div>

            <h1 className="text-[clamp(44px,5.5vw,72px)] font-black leading-[1.05] tracking-[-2.5px] mb-6">
              Notes that<br />bring teams<br />
              <span className="bg-gradient-to-r from-[#4f46e5] via-[#6d63ff] to-[#818cf8] bg-clip-text text-transparent">together.</span>
            </h1>

            <p className="text-[18px] text-slate-500 leading-[1.7] mb-10 max-w-[500px] font-medium">
              Create beautiful notes, share them with friends, and collaborate in real-time. Simple, fast, and built for the way you think.
            </p>

            <div className="flex flex-wrap gap-4 mb-14">
              <Link href="/auth/register" className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-br from-[#4f46e5] to-[#6d63ff] text-white rounded-2xl text-[16px] font-bold shadow-xl shadow-indigo-500/30 hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/40 transition-all duration-300">
                Start for Free
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </Link>
              <a href="#features" className="inline-flex items-center gap-3 px-8 py-4 bg-white text-slate-800 border border-slate-200 rounded-2xl text-[16px] font-bold hover:border-slate-300 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300">
                See Features
              </a>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-4 gap-5 pt-8 border-t border-slate-200/60">
              {stats.map((s) => (
                <div key={s.label}>
                  <div className="text-2xl font-black text-slate-900 tracking-tight">{s.value}</div>
                  <div className="text-[12px] font-semibold text-slate-500 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Live editor mockup */}
          <div className="relative hidden lg:flex items-center justify-center">
            <style>{`
              @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
              @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
              @keyframes slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
            `}</style>

            {/* Main card */}
            <div className="animate-[float_7s_ease-in-out_infinite] relative">
              <div className="bg-white/90 backdrop-blur-xl rounded-[28px] border border-slate-200/80 shadow-[0_32px_80px_rgba(10,15,30,0.12)] p-7 w-[480px]">
                {/* Titlebar */}
                <div className="flex items-center gap-2 mb-5 pb-4 border-b border-slate-100">
                  <div className="w-3 h-3 rounded-full bg-[#ff6b6b]" />
                  <div className="w-3 h-3 rounded-full bg-[#ffb347]" />
                  <div className="w-3 h-3 rounded-full bg-[#22c997]" />
                  <span className="ml-auto text-[12px] font-mono text-slate-400">sprint-planning.md</span>
                </div>
                {/* Toolbar */}
                <div className="flex gap-1.5 mb-6 flex-wrap">
                  {['B', 'I', 'U', 'H₁', 'H₂', '≡', '☐', '🔗', '🖼'].map((t, i) => (
                    <span key={i} className={`min-w-[32px] h-8 px-2 rounded-xl flex items-center justify-center text-[13px] font-bold transition-all ${i === 0 ? 'bg-gradient-to-br from-[#4f46e5] to-[#6d63ff] text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>{t}</span>
                  ))}
                </div>
                {/* Content */}
                <div className="text-[22px] font-bold mb-3 tracking-tight">Sprint Planning Q4</div>
                <div className="text-[15px] text-slate-500 leading-relaxed mb-5">
                  Key priorities include <span className="bg-yellow-200/80 text-yellow-900 px-1.5 py-0.5 rounded-md text-[14px] font-medium">launching the mobile app</span> and improving the onboarding flow.
                  <br/><br/>
                  Action items to discuss with the team
                  <span className="inline-block w-0.5 h-[18px] bg-[#4f46e5] ml-0.5 align-text-bottom" style={{ animation: 'blink 1.1s step-end infinite' }} />
                </div>
                {/* Task items */}
                <div className="space-y-2.5">
                  {['Design new onboarding screens', 'Write API docs'].map((task, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-[14px]">
                      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 ${i === 0 ? 'bg-[#4f46e5] border-[#4f46e5]' : 'border-slate-300'}`}>
                        {i === 0 && <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                      </div>
                      <span className={i === 0 ? 'line-through text-slate-400' : 'text-slate-700 font-medium'}>{task}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating: Collaborators */}
              <div className="absolute -bottom-6 -left-10 bg-white rounded-2xl px-4 py-3 flex items-center gap-3 shadow-[0_12px_40px_rgba(10,15,30,0.12)] border border-slate-200/80 animate-[slideUp_0.6s_ease_0.3s_both]">
                <div className="flex -space-x-2.5">
                  {['#4f46e5','#22c997','#e11d48'].map((c, i) => (
                    <div key={i} className="w-9 h-9 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold shadow-sm" style={{ background: c }}>
                      {['R','S','A'][i]}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="text-[13px] font-bold text-slate-800">3 collaborators</div>
                  <div className="text-[11px] text-emerald-500 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                    Editing live
                  </div>
                </div>
              </div>

              {/* Floating: AI badge */}
              <div className="absolute -top-5 -right-8 bg-white rounded-2xl px-4 py-3 shadow-[0_12px_40px_rgba(10,15,30,0.12)] border border-slate-200/80 flex items-center gap-2.5 animate-[slideUp_0.6s_ease_0s_both]">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-lg shadow-md">🪄</div>
                <div>
                  <div className="text-[12px] font-bold text-slate-800">AI Summarized</div>
                  <div className="text-[11px] text-slate-400 font-medium">3 key points found</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-28 lg:py-36 px-6 lg:px-16">
        <div className="max-w-[1320px] mx-auto">
          <div className="flex items-center gap-2 text-[12px] font-black text-indigo-600 uppercase tracking-[3px] mb-5">
            <div className="w-5 h-0.5 bg-indigo-500 rounded" />
            Features
          </div>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
            <h2 className="text-[clamp(34px,4vw,52px)] font-black tracking-[-2px] leading-[1.1]">
              Everything you need<br />to take better notes.
            </h2>
            <p className="text-[17px] text-slate-500 max-w-[400px] leading-[1.7] font-medium">
              From quick thoughts to full team projects — NotExA gives you the tools without getting in your way.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <div
                key={i}
                onMouseEnter={() => setActiveFeature(i)}
                className={`group relative bg-white border rounded-[24px] p-8 transition-all duration-500 cursor-default overflow-hidden ${i === activeFeature ? 'border-slate-300/60 shadow-xl -translate-y-1' : 'border-slate-200/60 hover:-translate-y-1 hover:shadow-xl hover:border-slate-300/60'}`}
              >
                {/* gradient fill */}
                <div className={`absolute inset-0 bg-gradient-to-br ${f.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${i === activeFeature ? 'opacity-100' : ''}`} />
                {/* accent top bar */}
                <div className="absolute top-0 left-6 right-6 h-[2px] rounded-b-full transition-all duration-500 scale-x-0 group-hover:scale-x-100 origin-left" style={{ background: f.color, ...(i === activeFeature ? { transform: 'scaleX(1)' } : {}) }} />

                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-sm transition-transform duration-500 group-hover:scale-110" style={{ background: `${f.color}18` }}>
                    {f.icon}
                  </div>
                  <h3 className="text-[19px] font-bold tracking-tight mb-3">{f.title}</h3>
                  <p className="text-[15px] text-slate-500 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="py-28 lg:py-36 px-6 lg:px-16 bg-[#0a0f1e] text-white relative overflow-hidden">
        {/* bg orbs */}
        <div className="absolute top-[-20%] right-[-15%] w-[700px] h-[700px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(79,70,229,0.15) 0%, transparent 65%)' }} />
        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(5,150,105,0.1) 0%, transparent 65%)' }} />

        <div className="max-w-[1320px] mx-auto relative z-10">
          <div className="flex items-center gap-2 text-[12px] font-black text-indigo-400 uppercase tracking-[3px] mb-5">
            <div className="w-5 h-0.5 bg-indigo-400 rounded" />
            Pricing
          </div>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
            <h2 className="text-[clamp(34px,4vw,52px)] font-black tracking-[-2px] leading-[1.1]">Simple, honest pricing.</h2>
            <p className="text-[17px] text-white/50 max-w-[380px] leading-[1.7] font-medium">Start free. Upgrade when you need more space and features.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-[860px]">
            {/* Free */}
            <div className="rounded-[28px] p-9 border border-white/10 bg-white/5 backdrop-blur-sm hover:-translate-y-1 transition-all duration-300 hover:border-white/20 hover:bg-white/8">
              <div className="text-[11px] font-black uppercase tracking-[3px] text-white/40 mb-3">Free</div>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-[18px] font-bold text-white/60">Rs.</span>
                <span className="text-6xl font-black tracking-[-3px]">0</span>
              </div>
              <div className="text-[14px] text-white/35 font-medium mb-8">For personal notes and getting started</div>
              <ul className="space-y-4 mb-9">
                {['Unlimited notes', 'Share with friends', 'Rich text editor', '50 MB storage', 'Real-time collaboration'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-[15px] text-white/75 font-medium">
                    <span className="w-5 h-5 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-[10px] shrink-0 text-white/60">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/auth/register" className="block w-full py-4 text-center rounded-2xl text-[15px] font-bold bg-white/8 border border-white/15 text-white hover:bg-white/15 hover:border-white/25 transition-all duration-300">
                Get Started Free
              </Link>
            </div>

            {/* Premium */}
            <div className="rounded-[28px] p-9 relative bg-gradient-to-br from-[#4f46e5] via-[#5b52f0] to-[#6d63ff] shadow-[0_24px_80px_rgba(79,70,229,0.4)] hover:-translate-y-1 transition-all duration-300">
              <div className="absolute -top-3.5 right-7 bg-gradient-to-r from-emerald-400 to-emerald-500 text-[#0a0f1e] text-[11px] font-black px-4 py-1.5 rounded-full shadow-lg tracking-wide uppercase">
                Most Popular
              </div>
              <div className="text-[11px] font-black uppercase tracking-[3px] text-white/60 mb-3">Premium</div>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-[18px] font-bold text-white/70">Rs.</span>
                <span className="text-6xl font-black tracking-[-3px]">199</span>
                <span className="text-[15px] font-medium text-white/40">/mo</span>
              </div>
              <div className="text-[14px] text-white/50 font-medium mb-8">For teams and serious note-takers</div>
              <ul className="space-y-4 mb-9">
                {['Everything in Free', '5 GB cloud storage', 'File sharing in notes', 'AI features (Summarize, Quiz)', 'Priority support'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-[15px] text-white/90 font-medium">
                    <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px] shrink-0">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/auth/register" className="block w-full py-4 text-center rounded-2xl text-[15px] font-bold bg-white text-[#4f46e5] hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(0,0,0,0.25)] transition-all duration-300">
                Upgrade to Premium
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-28 lg:py-36 px-6 lg:px-16 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full" style={{ background: 'radial-gradient(ellipse, rgba(79,70,229,0.07) 0%, transparent 65%)' }} />
        </div>
        <div className="max-w-[700px] mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[13px] font-semibold text-indigo-600 bg-indigo-50 border border-indigo-100 mb-8">
            ✨ Free to start — no credit card required
          </div>
          <h2 className="text-[clamp(36px,4.5vw,56px)] font-black tracking-[-2px] mb-5 leading-[1.08]">
            Ready to take<br />better notes?
          </h2>
          <p className="text-[18px] text-slate-500 leading-relaxed mb-10 font-medium">
            Join NotExA today and unlock a smarter, faster way to capture, share, and collaborate on ideas.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/auth/register" className="inline-flex items-center gap-3 px-9 py-4 bg-gradient-to-br from-[#4f46e5] to-[#6d63ff] text-white rounded-2xl text-[16px] font-bold shadow-xl shadow-indigo-500/30 hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/40 transition-all duration-300">
              Create Your Account
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </Link>
            <Link href="/auth/login" className="inline-flex items-center gap-3 px-9 py-4 bg-white text-slate-800 border border-slate-200 rounded-2xl text-[16px] font-bold hover:border-slate-300 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-slate-200/60 max-w-[1320px] mx-auto px-6 lg:px-16 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-gradient-to-br from-[#4f46e5] to-[#6d63ff] rounded-lg flex items-center justify-center text-white font-black text-xs shadow-md shadow-indigo-500/30">N</div>
          <span className="text-[14px] font-bold text-slate-500">NotExA</span>
          <span className="text-slate-300 text-sm mx-2">·</span>
          <p className="text-[13px] text-slate-400 font-medium">© 2026 College Minor Project</p>
        </div>
        <div className="flex gap-7">
          <a href="#" className="text-[13px] font-semibold text-slate-400 hover:text-slate-900 transition-colors duration-200">Privacy Policy</a>
          <a href="#" className="text-[13px] font-semibold text-slate-400 hover:text-slate-900 transition-colors duration-200">Terms</a>
          <a href="#" className="text-[13px] font-semibold text-slate-400 hover:text-slate-900 transition-colors duration-200">Contact</a>
        </div>
      </footer>
    </div>
  );
}
