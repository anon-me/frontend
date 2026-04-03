'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/contexts/authStore';
import {
  FileText, Users, Share2, FolderOpen, Crown, Settings,
  LogOut, LayoutDashboard, Menu, X
} from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

const userNav = [
  { href: '/dashboard/notes', label: 'My Notes', icon: FileText },
  { href: '/dashboard/shared', label: 'Shared with Me', icon: Share2 },
  { href: '/dashboard/friends', label: 'Friends', icon: Users },
  { href: '/dashboard/files', label: 'My Files', icon: FolderOpen },
  { href: '/dashboard/subscription', label: 'Subscription', icon: Crown },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },

];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/auth/login');
    }
  }, [isLoading, isAuthenticated, router]);

  // Global Streak Tracker
  useEffect(() => {
    if (!isAuthenticated) return;

    const REQUIRED_MINUTES = 10;
    const dateStr = new Date().toDateString();
    const storedDate = localStorage.getItem('notexa_streak_date');
    let sessionTime = parseInt(localStorage.getItem('notexa_session_time') || '0', 10);

    // Reset daily
    if (storedDate !== dateStr) {
      localStorage.setItem('notexa_streak_date', dateStr);
      localStorage.setItem('notexa_session_time', '0');
      localStorage.setItem('notexa_streak_earned', 'false');
      sessionTime = 0;
    }

    const timer = setInterval(() => {
      sessionTime += 1;
      localStorage.setItem('notexa_session_time', sessionTime.toString());

      const earned = localStorage.getItem('notexa_streak_earned') === 'true';
      if (sessionTime >= REQUIRED_MINUTES * 60 && !earned) {
        localStorage.setItem('notexa_streak_earned', 'true');
        toast.success("Awesome! You've studied for 10 minutes today. Streak updated! 🔥", { duration: 5000, id: 'global-streak-toast' });
        window.dispatchEvent(new Event('notexa_streak_updated'));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isAuthenticated]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600" />
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    router.replace('/auth/login');
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-[280px] bg-white border-r border-slate-100/60
        transform transition-transform lg:transform-none shadow-[2px_0_24px_-12px_rgba(0,0,0,0.06)]
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full overflow-hidden">
          {/* Logo */}
          <div className="flex items-center justify-between px-7 py-6 shrink-0">
            <Link href="/dashboard/notes" className="flex items-center gap-3 group">
              <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-md shadow-indigo-600/20 group-hover:scale-105 transition-transform duration-300">
                <FileText size={20} className="text-white" strokeWidth={2.5} />
              </div>
              <span className="text-2xl font-black text-slate-800 tracking-tight group-hover:text-indigo-600 transition-colors">NotExA</span>
            </Link>
            <button className="lg:hidden text-slate-400 hover:bg-slate-50 p-2 rounded-xl transition-colors" onClick={() => setSidebarOpen(false)}>
              <X size={20} />
            </button>
          </div>

          {/* User info */}
          <div className="px-5 pb-5 shrink-0">
            <div className="flex items-center gap-3.5 p-3.5 rounded-[1.25rem] bg-slate-50/50 border border-slate-100/80 shadow-sm hover:shadow-md hover:border-indigo-100/50 transition-all duration-300 cursor-pointer group overflow-hidden">
              <div className="w-11 h-11 bg-indigo-100/80 text-indigo-700 rounded-[0.85rem] flex items-center justify-center font-bold text-base shadow-inner shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-slate-800 truncate group-hover:text-indigo-700 transition-colors flex items-center gap-1.5">
                  {user?.name || 'Scholar'}
                  {user?.is_premium && <Crown size={14} className="text-amber-500 fill-amber-500/20 shrink-0" />}
                </p>
                <p className="text-xs font-bold text-slate-400 truncate uppercase tracking-widest mt-0.5">{user?.email || 'User'}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-2 space-y-1.5 overflow-y-auto overflow-x-hidden custom-scrollbar">
            {userNav.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-extrabold tracking-wide transition-all duration-300 group ${isActive
                    ? 'bg-indigo-50/80 text-indigo-700 shadow-[0_2px_10px_-4px_rgba(79,70,229,0.2)] border border-indigo-100/50'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800 border border-transparent hover:border-slate-100/50'
                    }`}
                >
                  <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} className={`shrink-0 transition-colors duration-300 ${isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-500'}`} />
                  {item.label}
                </Link>
              );
            })}

            {/* Admin link */}
            {user?.role === 'admin' && (
              <>
                <div className="border-t border-slate-100/60 my-4 mx-2" />
                <Link
                  href="/admin/analytics"
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-extrabold tracking-wide transition-all duration-300 group ${pathname.startsWith('/admin')
                    ? 'bg-red-50 text-red-700 border border-red-100'
                    : 'text-slate-500 hover:bg-slate-50 border border-transparent'
                    }`}
                >
                  <LayoutDashboard size={20} strokeWidth={2} className="shrink-0 text-red-500" />
                  Admin Panel
                </Link>
              </>
            )}

            {/* Logout moved explicitly below the nav links aesthetically */}
            <div className="border-t border-slate-100/60 my-4 mx-2" />
            <button
              onClick={handleLogout}
              className="flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-extrabold tracking-wide text-slate-500 hover:bg-red-50 hover:text-red-700 hover:border-red-100 border border-transparent w-full transition-all duration-300 group mb-6"
            >
              <LogOut size={20} strokeWidth={2} className="shrink-0 text-slate-400 group-hover:text-red-500 transition-colors duration-300" />
              Sign Out
            </button>
          </nav>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar for mobile */}
        <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-600">
            <Menu size={24} />
          </button>
          <span className="font-bold text-gray-900">NotExA</span>
          <div className="w-6" />
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto bg-gray-50/50">
          <div className="mx-auto max-w-[1400px] w-full px-4 sm:px-6 lg:px-8 py-8 md:py-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
