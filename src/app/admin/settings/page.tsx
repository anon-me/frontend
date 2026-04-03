'use client';

import { useState, useEffect } from 'react';
import { adminApi } from '@/services/api';
import { SiteSetting } from '@/types';
import toast from 'react-hot-toast';
import { Save, Mail, Globe, Shield, CreditCard, Send } from 'lucide-react';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [tab, setTab] = useState<'general' | 'smtp' | 'email' | 'legal' | 'payment'>('general');

  useEffect(() => {
    const fetch = async () => {
      try { const res = await adminApi.getSettings(); setSettings(res.data.data || []); }
      catch { toast.error('Failed'); } finally { setLoading(false); }
    };
    fetch();
  }, []);

  const getValue = (key: string) => settings.find((s) => s.key === key)?.value || '';
  const setValue = (key: string, value: string) => {
    setSettings((prev) => prev.map((s) => s.key === key ? { ...s, value } : s));
  };

  const handleSave = async (group: string) => {
    setSaving(true);
    try {
      const groupSettings = settings
        .filter((s) => s.group === group)
        .map((s) => ({ key: s.key, value: s.value || '', type: s.type, group: s.group }));
      await adminApi.updateSettings(groupSettings);
      toast.success('Settings saved!');
    } catch { toast.error('Failed to save'); }
    finally { setSaving(false); }
  };

  const handleTestSmtp = async () => {
    if (!testEmail) return;
    try { await adminApi.testSmtp(testEmail); toast.success('Test email sent!'); }
    catch (err: any) { toast.error(err.response?.data?.message || 'SMTP test failed'); }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-600" /></div>;

  const tabs = [
    { key: 'general' as const, label: 'General', icon: Globe },
    { key: 'smtp' as const, label: 'SMTP', icon: Mail },
    { key: 'email' as const, label: 'Email', icon: Mail },
    { key: 'legal' as const, label: 'Legal Pages', icon: Shield },
    { key: 'payment' as const, label: 'Payment', icon: CreditCard },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Site Settings</h1>

      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6 flex-wrap">
        {tabs.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 py-2 px-4 rounded-lg text-sm font-medium transition ${tab === t.key ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}>
            <t.icon size={16} /> {t.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        {tab === 'general' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Site Name</label>
              <input type="text" value={getValue('site_name')} onChange={(e) => setValue('site_name', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Site Logo URL</label>
              <input type="text" value={getValue('site_logo')} onChange={(e) => setValue('site_logo', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-brand-500"
                placeholder="https://example.com/logo.png" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Site Description</label>
              <input type="text" value={getValue('site_description')} onChange={(e) => setValue('site_description', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
            <button onClick={() => handleSave('general')} disabled={saving}
              className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-medium hover:bg-brand-700 disabled:opacity-50">
              <Save size={16} /> Save General Settings
            </button>
          </div>
        )}

        {tab === 'smtp' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">SMTP Host</label>
                <input type="text" value={getValue('smtp_host')} onChange={(e) => setValue('smtp_host', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none" placeholder="smtp.gmail.com" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">SMTP Port</label>
                <input type="text" value={getValue('smtp_port')} onChange={(e) => setValue('smtp_port', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none" placeholder="587" /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input type="text" value={getValue('smtp_username')} onChange={(e) => setValue('smtp_username', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input type="password" value={getValue('smtp_password')} onChange={(e) => setValue('smtp_password', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none" /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Encryption</label>
                <select value={getValue('smtp_encryption')} onChange={(e) => setValue('smtp_encryption', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none">
                  <option value="tls">TLS</option><option value="ssl">SSL</option><option value="">None</option>
                </select></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">From Address</label>
                <input type="email" value={getValue('smtp_from_address')} onChange={(e) => setValue('smtp_from_address', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none" /></div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => handleSave('smtp')} disabled={saving}
                className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-medium hover:bg-brand-700 disabled:opacity-50">
                <Save size={16} /> Save SMTP
              </button>
              <div className="flex gap-2 ml-auto">
                <input type="email" value={testEmail} onChange={(e) => setTestEmail(e.target.value)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none w-48" placeholder="test@email.com" />
                <button onClick={handleTestSmtp}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800">
                  <Send size={14} /> Test
                </button>
              </div>
            </div>
          </div>
        )}

        {tab === 'email' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4">
              <div>
                <p className="font-medium text-gray-900">Email Verification</p>
                <p className="text-sm text-gray-500">Require users to verify email after registration</p>
              </div>
              <button onClick={() => {
                const current = getValue('email_verification_enabled');
                setValue('email_verification_enabled', current === 'true' ? 'false' : 'true');
              }}
                className={`w-12 h-6 rounded-full transition relative ${getValue('email_verification_enabled') === 'true' ? 'bg-brand-600' : 'bg-gray-300'}`}>
                <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition ${getValue('email_verification_enabled') === 'true' ? 'left-6' : 'left-0.5'}`} />
              </button>
            </div>
            <button onClick={() => handleSave('email')} disabled={saving}
              className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-medium hover:bg-brand-700 disabled:opacity-50">
              <Save size={16} /> Save
            </button>
          </div>
        )}

        {tab === 'legal' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Privacy Policy (HTML)</label>
              <textarea value={getValue('privacy_policy')} onChange={(e) => setValue('privacy_policy', e.target.value)}
                rows={8} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none font-mono text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Terms & Conditions (HTML)</label>
              <textarea value={getValue('terms_conditions')} onChange={(e) => setValue('terms_conditions', e.target.value)}
                rows={8} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none font-mono text-sm" />
            </div>
            <button onClick={() => handleSave('legal')} disabled={saving}
              className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-medium hover:bg-brand-700 disabled:opacity-50">
              <Save size={16} /> Save Legal Pages
            </button>
          </div>
        )}

        {tab === 'payment' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4">
              <div>
                <p className="font-medium text-gray-900">Payment Gateway</p>
                <p className="text-sm text-gray-500">Enable/disable API Nepal payment gateway</p>
              </div>
              <button onClick={() => {
                const current = getValue('payment_gateway_enabled');
                setValue('payment_gateway_enabled', current === 'true' ? 'false' : 'true');
              }}
                className={`w-12 h-6 rounded-full transition relative ${getValue('payment_gateway_enabled') === 'true' ? 'bg-brand-600' : 'bg-gray-300'}`}>
                <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition ${getValue('payment_gateway_enabled') === 'true' ? 'left-6' : 'left-0.5'}`} />
              </button>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">API Nepal Mode</label>
              <select value={getValue('apinepal_mode')} onChange={(e) => setValue('apinepal_mode', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none">
                <option value="test">Test (Sandbox)</option><option value="live">Live (Production)</option>
              </select>
            </div>
            <button onClick={() => handleSave('payment')} disabled={saving}
              className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-medium hover:bg-brand-700 disabled:opacity-50">
              <Save size={16} /> Save Payment Settings
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
