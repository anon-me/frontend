'use client';

import { useState, useEffect } from 'react';
import { adminApi } from '@/services/api';
import toast from 'react-hot-toast';
import { CreditCard } from 'lucide-react';

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try { const res = await adminApi.payments({ status: filter || undefined }); setPayments(res.data.data.data || []); }
      catch { toast.error('Failed'); } finally { setLoading(false); }
    };
    fetch();
  }, [filter]);

  return (
    <div className="pb-10 fade-in animate-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Payment Ledger</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Review transaction history and subscription statuses</p>
        </div>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-3 rounded-2xl border border-slate-200/60 bg-white/50 backdrop-blur-sm text-sm font-medium text-slate-700 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-400 focus:bg-white transition-all shadow-sm hover:border-slate-300">
          <option value="">All Transactions</option>
          <option value="success">Success</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
      </div>
      {loading ? <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600" /></div> : payments.length === 0 ? (
        <div className="text-center py-24 bg-white/50 backdrop-blur-sm rounded-3xl border border-dashed border-slate-300">
          <CreditCard size={48} className="mx-auto text-slate-300 mb-4" strokeWidth={1} />
          <p className="text-slate-500 font-medium">No payments recorded yet</p>
        </div>
      ) : (
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow duration-500 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50/50 border-b border-slate-200/60 text-[11px] uppercase tracking-widest text-slate-500 font-bold">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Plan Subscription</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Transaction Date</th>
                  <th className="px-6 py-4 text-right">Reference ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payments.map((p: any) => (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="font-bold text-slate-800">{p.user?.name}</p>
                      <p className="text-xs font-medium text-slate-500">{p.user?.email}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-700">{p.plan?.name || 'Manual'}</td>
                    <td className="px-6 py-4 whitespace-nowrap font-bold text-emerald-600 bg-emerald-50/30">NPR {p.amount}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-widest ${p.status === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : p.status === 'pending' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${p.status === 'success' ? 'bg-emerald-500' : p.status === 'pending' ? 'bg-amber-500' : 'bg-red-500'}`} />
                        {p.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-500">{new Date(p.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right font-mono text-[11px] font-medium text-slate-400">{p.identifier || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
