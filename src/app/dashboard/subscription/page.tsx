'use client';

import { useState, useEffect } from 'react';
import { subscriptionApi } from '@/services/api';
import { useAuthStore } from '@/contexts/authStore';
import { SubscriptionPlan, Payment } from '@/types';
import toast from 'react-hot-toast';
import { Crown, Check, CreditCard, Zap, HardDrive, Share2, Sparkles, CheckCircle2, History } from 'lucide-react';

export default function SubscriptionPage() {
  const { user } = useAuthStore();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState<number | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [plansRes, subRes, payRes] = await Promise.all([
          subscriptionApi.plans(),
          subscriptionApi.mySubscription(),
          subscriptionApi.paymentHistory(),
        ]);
        setPlans(plansRes.data.data || []);
        setSubscription(subRes.data.data);
        setPayments(payRes.data.data?.data || []);
      } catch { toast.error('Failed to load'); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  const handleSubscribe = async (planId: number) => {
    setSubscribing(planId);
    try {
      const res = await subscriptionApi.subscribe(planId);
      if (res.data.redirect_url) {
        window.location.href = res.data.redirect_url;
      } else {
        toast.error('Payment initiation failed');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally {
      setSubscribing(null);
    }
  };

  const isPremium = user?.is_premium;
  const activeSub = subscription?.subscription;

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-10rem)]">

        {/* Left: Current Plan Hero Card */}
        <div className="lg:col-span-1 h-full">
          <div className="bg-gradient-to-br from-primary via-[#4335da] to-primary-container rounded-3xl p-7 text-white relative overflow-hidden shadow-xl shadow-primary/30 group h-full flex flex-col">
            <div className="absolute -top-6 -right-6 opacity-20 transform rotate-12 group-hover:rotate-45 transition-transform duration-500">
              <Sparkles size={160} />
            </div>
            <div className="relative z-10 flex flex-col h-full">
              <span className="inline-flex px-3 py-1 bg-white/20 rounded-full text-[10px] font-bold tracking-widest uppercase backdrop-blur-md border border-white/10 mb-5 self-start">
                {isPremium ? 'Current Plan' : 'Free Plan'}
              </span>

              <h1 className="text-4xl font-headline font-black tracking-tight drop-shadow-sm mb-2">
                {isPremium ? (activeSub?.plan?.name || 'Pro Plan') : 'Free'}
              </h1>
              <p className="text-white/70 text-sm font-medium mb-6 leading-relaxed">
                {isPremium
                  ? `Your premium membership is active until ${new Date(activeSub?.expires_at).toLocaleDateString()}.`
                  : 'Upgrade to unlock unlimited storage, file sharing, and priority support.'}
              </p>

              <ul className="space-y-4 flex-1">
                {[
                  { label: 'Unlimited Cloud Storage', icon: HardDrive },
                  { label: 'File Sharing in Notes', icon: Share2 },
                  { label: 'Priority Support', icon: Zap },
                  { label: 'Team Workspaces', icon: Crown },
                ].map(({ label, icon: Icon }) => (
                  <li key={label} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-secondary-container flex items-center justify-center shrink-0">
                      <CheckCircle2 className="text-on-secondary-container" size={12} />
                    </div>
                    <span className="text-white/90 text-sm font-semibold">{label}</span>
                  </li>
                ))}
              </ul>

              {/* Storage bar */}
              <div className="pt-5 mt-5 border-t border-white/15">
                <div className="flex justify-between text-xs font-semibold text-white/60 mb-2">
                  <span>Storage Used</span>
                  <span>{subscription?.storage_used || 0} / {subscription?.storage_limit || 50} MB</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div
                    className="bg-white rounded-full h-2 transition-all duration-700"
                    style={{ width: `${Math.min(((subscription?.storage_used || 0) / (subscription?.storage_limit || 50)) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Plans + History */}
        <div className="lg:col-span-2 flex flex-col gap-6 h-full">

          {/* Plans */}
          {!isPremium && plans.length > 0 && (
            <div className={`grid gap-5 ${plans.length === 1 ? 'grid-cols-1' : 'sm:grid-cols-2'}`}>
              {plans.map((plan) => (
                <div key={plan.id} className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm hover:border-primary/40 hover:shadow-md transition-all relative group">
                  {plan.duration_days >= 365 && (
                    <span className="absolute -top-3 right-5 bg-green-500 text-white text-[10px] font-black px-3 py-1 rounded-full tracking-wider uppercase shadow-sm">
                      Best Value
                    </span>
                  )}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-11 h-11 rounded-[0.75rem] bg-primary-fixed text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors shrink-0">
                      <Crown size={20} />
                    </div>
                    <div>
                      <h3 className="text-base font-headline font-bold text-on-surface">{plan.name}</h3>
                      <p className="text-xs text-outline">{plan.duration_days === 30 ? 'Monthly billing' : 'Annual billing'}</p>
                    </div>
                  </div>

                  <p className="text-3xl font-headline font-black text-on-surface mb-5">
                    Rs. {plan.price}
                    <span className="text-sm text-outline font-normal ml-1">/{plan.duration_days === 30 ? 'mo' : 'yr'}</span>
                  </p>

                  <div className="space-y-2.5 mb-6 text-sm text-on-surface-variant font-medium">
                    <div className="flex items-center gap-2.5"><Check size={13} className="text-primary shrink-0" /> Premium badge</div>
                    <div className="flex items-center gap-2.5"><HardDrive size={13} className="text-primary shrink-0" /> 5 GB cloud storage</div>
                    <div className="flex items-center gap-2.5"><Share2 size={13} className="text-primary shrink-0" /> File sharing in notes</div>
                    <div className="flex items-center gap-2.5"><Zap size={13} className="text-primary shrink-0" /> Priority support</div>
                  </div>

                  <button
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={subscribing === plan.id}
                    className="w-full py-3 bg-primary text-white rounded-2xl font-bold text-sm shadow-md shadow-primary/20 hover:bg-[#291eb0] transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {subscribing === plan.id
                      ? <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      : <><CreditCard size={15} /> Subscribe Now</>
                    }
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Payment History — flex-1 to fill remaining space */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm flex-1 flex flex-col min-h-0">
            <h2 className="text-base font-headline font-bold text-on-surface mb-5 flex items-center gap-2.5 shrink-0">
              <div className="p-2 bg-surface-container-low rounded-xl"><History size={16} className="text-outline" /></div>
              Payment History
            </h2>
            {payments.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center">
                <History size={36} className="text-outline-variant/40 mb-3" />
                <p className="text-sm font-semibold text-outline">No payments yet</p>
              </div>
            ) : (
              <div className="space-y-3 overflow-y-auto flex-1">
                {payments.map((p) => (
                  <div key={p.id} className="flex items-center justify-between p-4 bg-surface rounded-2xl border border-gray-50 hover:bg-surface-container-low transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-[0.625rem] bg-primary-fixed text-primary flex items-center justify-center shrink-0">
                        <CreditCard size={15} />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-on-surface">{p.plan?.name || 'Payment'}</p>
                        <p className="text-[11px] text-outline font-medium">{new Date(p.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end gap-1">
                      <p className="font-black text-sm text-on-surface">Rs. {p.amount}</p>
                      <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold tracking-wide uppercase ${p.status === 'success' ? 'bg-green-100 text-green-700' :
                        p.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                        {p.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
