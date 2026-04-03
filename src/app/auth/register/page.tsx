'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authApi } from '@/services/api';
import { useAuthStore } from '@/contexts/authStore';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.password_confirmation) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const res = await authApi.register(form);
      setAuth(res.data.user, res.data.token);
      toast.success(res.data.message || 'Registration successful!');
      router.push('/dashboard/notes');
    } catch (err: any) {
      const errors = err.response?.data?.errors;
      if (errors) {
        Object.values(errors).flat().forEach((msg: any) => toast.error(msg));
      } else {
        toast.error(err.response?.data?.message || 'Registration failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen grid lg:grid-cols-2">
      {/* Left Side: High-quality academic imagery/Illustration */}
      <section className="relative overflow-hidden flex flex-col justify-center px-8 lg:px-24 py-16 lg:py-0 bg-slate-900 min-h-[50vh] lg:min-h-screen">
        <div className="absolute inset-0 z-0">
          <img
            alt="Modern minimalist library interior with warm wood accents, large windows, and students focused on digital devices in soft natural light"
            className="w-full h-full object-cover opacity-60"
            src="https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?q=80&w=2560&auto=format&fit=crop"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#3525cd]/90 to-[#4f46e5]/80 mix-blend-multiply"></div>
        </div>
        <div className="relative z-10 max-w-xl text-white">
          <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
            <span className="material-symbols-outlined text-secondary-container" style={{ fontVariationSettings: '"FILL" 1' }}>auto_awesome</span>
            <span className="text-sm font-semibold tracking-wide uppercase">Academic Intelligence</span>
          </div>
          <h1 className="font-headline text-5xl lg:text-7xl font-extrabold tracking-tight mb-8 drop-shadow-sm leading-tight">
            Join the Sanctuary
          </h1>
          <p className="text-xl lg:text-2xl font-light text-white/90 mb-12 leading-relaxed">
            Designed for the students, NotExA provides the focus you need to excel.
          </p>
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-white">menu_book</span>
              </div>
              <div>
                <h3 className="font-headline text-xl font-bold mb-1">Deep Research Focus</h3>
                <p className="text-white/70">Distraction-free environment tailored for scholarly pursuits.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-white">insights</span>
              </div>
              <div>
                <h3 className="font-headline text-xl font-bold mb-1">Intelligent Connections</h3>
                <p className="text-white/70">Map your thoughts across multiple disciplines seamlessly.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-white">security</span>
              </div>
              <div>
                <h3 className="font-headline text-xl font-bold mb-1">Academic Integrity First</h3>
                <p className="text-white/70">Tools that support original thinking and rigorous citation.</p>
              </div>
            </div>
          </div>
        </div>
        {/* Subtle Brand Anchor in the corner */}
        <div className="absolute bottom-12 left-12 lg:left-24 z-10 flex items-center gap-3">
          <span className="text-3xl font-black text-white italic tracking-tighter">NotExA</span>
          <span className="w-1.5 h-1.5 rounded-full bg-secondary-container"></span>
          <span className="text-white/50 text-sm font-medium tracking-widest uppercase"><br /></span>
        </div>
      </section>

      {/* Right Side: Signup Form */}
      <section className="flex flex-col justify-center items-center px-8 lg:px-20 py-20 lg:py-0 bg-surface-container-lowest min-h-screen">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center pt-8 lg:pt-0">
            <h2 className="text-3xl font-headline font-bold text-on-surface mb-2 tracking-tight">Create an Account</h2>
            <p className="text-on-surface-variant text-sm font-body">Experience a new standard of academic note-taking.</p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="group">
              <label className="block text-sm font-semibold text-on-surface-variant mb-1 ml-1 group-focus-within:text-primary transition-colors" htmlFor="full_name">Full Name</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-surface-container-low border-0 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all placeholder:text-outline-variant font-medium text-sm"
                id="full_name"
                placeholder="Nisha Saud"
                type="text"
              />
            </div>
            <div className="group">
              <label className="block text-sm font-semibold text-on-surface-variant mb-1 ml-1 group-focus-within:text-primary transition-colors" htmlFor="email">Academic Email</label>
              <input
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-surface-container-low border-0 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all placeholder:text-outline-variant font-medium text-sm"
                id="email"
                placeholder="nishasaud@gmail.com"
                type="email"
              />
            </div>
            <div className="group relative">
              <label className="block text-sm font-semibold text-on-surface-variant mb-1 ml-1 group-focus-within:text-primary transition-colors" htmlFor="password">Password</label>
              <div className="relative">
                <input
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full bg-surface-container-low border-0 rounded-xl px-4 py-3 pr-12 focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all placeholder:text-outline-variant font-medium text-sm"
                  id="password"
                  placeholder="••••••••••••"
                  type={showPassword ? "text" : "password"}
                />
                <button
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-outline-variant hover:text-primary transition-colors"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="material-symbols-outlined text-xl">{showPassword ? 'visibility' : 'visibility_off'}</span>
                </button>
              </div>
            </div>

            <div className="group relative">
              <label className="block text-sm font-semibold text-on-surface-variant mb-1 ml-1 group-focus-within:text-primary transition-colors" htmlFor="password_confirmation">Confirm Password</label>
              <div className="relative">
                <input
                  required
                  value={form.password_confirmation}
                  onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })}
                  className="w-full bg-surface-container-low border-0 rounded-xl px-4 py-3 pr-12 focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all placeholder:text-outline-variant font-medium text-sm"
                  id="password_confirmation"
                  placeholder="••••••••••••"
                  type={showConfirmPassword ? "text" : "password"}
                />
                <button
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-outline-variant hover:text-primary transition-colors"
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <span className="material-symbols-outlined text-xl">{showConfirmPassword ? 'visibility' : 'visibility_off'}</span>
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                disabled={loading}
                className="w-full bg-gradient-to-br flex gap-2 justify-center items-center from-primary to-primary-container text-white py-3 px-6 rounded-full font-bold text-sm uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-[0.98] transition-all duration-200 disabled:opacity-50"
                type="submit"
              >
                {loading ? <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Create Account'}
              </button>
            </div>
            <p className="text-[11px] text-center text-on-surface-variant leading-relaxed opacity-80 pt-1">
              By clicking "Create Account", you agree to our
              <Link className="text-primary font-semibold hover:underline px-1" href="#">Terms of Service</Link> and
              <Link className="text-primary font-semibold hover:underline" href="#">Privacy Policy</Link>.
            </p>

            <div className="relative py-3">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-outline-variant/30"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-surface-container-lowest text-on-surface-variant font-label text-[10px] font-bold uppercase tracking-widest">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => toast.success("Google signup coming soon")}
                className="flex items-center justify-center gap-2 w-full py-2.5 px-3 bg-surface-container-low rounded-xl font-semibold text-sm text-on-surface hover:bg-surface-container-high transition-all duration-200 group"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                </svg>
                <span>Google</span>
              </button>
              <button
                type="button"
                onClick={() => toast.success("LinkedIn signup coming soon")}
                className="flex items-center justify-center gap-2 w-full py-2.5 px-3 bg-surface-container-low rounded-xl font-semibold text-sm text-on-surface hover:bg-surface-container-high transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="#0077b5" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
                </svg>
                <span>LinkedIn</span>
              </button>
            </div>
          </form>

          <div className="mt-8 text-center pb-8 lg:pb-0">
            <p className="text-on-surface text-sm font-medium">
              Already have an account?
              <Link className="text-primary font-bold hover:underline ml-1" href="/auth/login">Sign In</Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

