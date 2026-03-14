import React, { useState } from 'react';
import { Bell, Send, Check, AlertCircle, ShieldCheck, Megaphone, Lightbulb, Loader2, MessageSquare, Sparkles, RadioTower, Zap, Eye } from 'lucide-react';
import adminService from '../services/adminService';

const AdminNotifications = () => {
  const [form, setForm] = useState({ title: '', message: '' });
  const [sending, setSending] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState(null);

  const handleChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSend = async () => {
    if (!form.title.trim() || !form.message.trim()) { setError('Message parameters incomplete'); return; }
    try {
      setSending(true);
      await adminService.broadcastNotification({ title: form.title, message: form.message, targetUserIds: null });
      setSuccessMessage('GLOBAL BROADCAST DEPLOYED!');
      setForm({ title: '', message: '' });
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (e) { setError(e.response?.data?.message || 'Broadcast transmission failed'); }
    finally { setSending(false); }
  };

  return (
    <div className="space-y-8 relative z-10 w-full max-w-4xl mx-auto p-4 sm:p-0">
      
      {/* Cinematic Success Toast */}
      {successMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-4 px-6 py-4 bg-emerald-500/90 backdrop-blur-xl border border-emerald-400/50 rounded-2xl shadow-2xl shadow-emerald-500/30 animate-in slide-in-from-bottom-5">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center border border-white/30">
            <RadioTower className="w-5 h-5 text-white animate-pulse" />
          </div>
          <p className="text-sm font-black text-white uppercase tracking-widest">{successMessage}</p>
        </div>
      )}

      {/* Hero Header */}
      <div className="flex flex-col relative z-10 text-center items-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/60 dark:bg-white/5 border border-gray-200/50 dark:border-white/10 backdrop-blur-md mb-6 shadow-sm">
          <RadioTower className="w-4 h-4 text-indigo-500 animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-600 dark:text-gray-300">Global Communication Array</span>
        </div>
        <h1 className="text-5xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-4">
          Broadcast System <Megaphone className="w-10 h-10 text-indigo-500 drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]" />
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-4 font-bold max-w-lg text-lg">
          Transmit critical updates and temporal announcements across the entire identity network.
        </p>
      </div>

      {error && (
        <div className="relative overflow-hidden p-6 bg-rose-50/80 dark:bg-rose-500/10 backdrop-blur-md border border-rose-200/50 dark:border-rose-500/20 rounded-3xl flex items-center gap-4 shadow-sm animate-shake">
          <AlertCircle className="w-6 h-6 text-rose-500 shrink-0" />
          <p className="text-sm font-black text-rose-800 dark:text-rose-300 flex-1 uppercase tracking-wider">{error}</p>
          <button onClick={() => setError(null)} className="text-rose-600 hover:text-rose-800 dark:text-rose-400 dark:hover:text-rose-200 text-lg transition-colors">×</button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          
        {/* Transmission Console */}
        <div className="lg:col-span-3 space-y-6">
            <div className="bg-white/60 dark:bg-[#181825]/60 backdrop-blur-xl rounded-[2.5rem] border border-white/50 dark:border-white/10 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)] relative overflow-hidden group">
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none group-focus-within:bg-indigo-500/20 transition-colors duration-700" />
                
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                        <MessageSquare className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Transmission Payload</h3>
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Define broadcast parameters</p>
                    </div>
                </div>

                <div className="space-y-6 relative z-10">
                    <div>
                        <label className="block text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2 px-1">Broadcast Header</label>
                        <div className="relative group/input">
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-2xl blur opacity-0 group-focus-within/input:opacity-100 transition-opacity pointer-events-none" />
                            <div className="relative flex items-center bg-white dark:bg-[#1e1e2e] rounded-2xl border border-gray-200/50 dark:border-white/5 focus-within:border-indigo-500/50 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all shadow-sm">
                                <input type="text" value={form.title} onChange={(e) => handleChange('title', e.target.value)}
                                placeholder="e.g., Critical System Update" maxLength={100}
                                className="w-full bg-transparent border-0 py-4 px-5 text-sm font-black text-gray-900 dark:text-white placeholder-gray-400 outline-none" />
                            </div>
                        </div>
                        <div className="flex justify-end mt-2 px-2">
                            <span className="text-[10px] font-bold text-gray-400">{form.title.length}/100 max length</span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2 px-1">Message Body</label>
                        <div className="relative group/textarea">
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-rose-500/20 rounded-2xl blur opacity-0 group-focus-within/textarea:opacity-100 transition-opacity pointer-events-none" />
                            <div className="relative flex items-start bg-white dark:bg-[#1e1e2e] rounded-2xl border border-gray-200/50 dark:border-white/5 focus-within:border-purple-500/50 focus-within:ring-2 focus-within:ring-purple-500/20 transition-all shadow-sm">
                                <textarea value={form.message} onChange={(e) => handleChange('message', e.target.value)}
                                placeholder="Input telemetry data for global broadcast..." maxLength={500} rows={6}
                                className="w-full bg-transparent border-0 py-4 px-5 text-sm font-semibold text-gray-900 dark:text-white placeholder-gray-400 outline-none resize-none leading-relaxed" />
                            </div>
                        </div>
                        <div className="flex justify-end mt-2 px-2">
                            <span className="text-[10px] font-bold text-gray-400">{form.message.length}/500 max length</span>
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100 dark:border-white/5 flex justify-end">
                    <button onClick={handleSend} disabled={sending || !form.title.trim() || !form.message.trim()}
                        className="group/btn relative overflow-hidden flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-black uppercase tracking-widest hover:shadow-[0_0_30px_rgba(99,102,241,0.4)] hover:scale-[1.02] transition-all disabled:opacity-50 disabled:pointer-events-none">
                        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                        {sending ? <Loader2 className="w-5 h-5 animate-spin relative z-10" /> : <Zap className="w-5 h-5 relative z-10 group-hover/btn:scale-125 transition-transform" />}
                        <span className="relative z-10">{sending ? 'Transmitting...' : 'Deploy Broadcast'}</span>
                    </button>
                </div>
            </div>
        </div>

        {/* Sidebar panels */}
        <div className="lg:col-span-2 space-y-6">
            
            {/* Live Preview */}
            <div className="bg-gradient-to-br from-indigo-900 via-[#181825] to-purple-900 p-[1px] rounded-[2.5rem] shadow-2xl overflow-hidden relative group h-full max-h-[400px]">
                <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/20 to-transparent opacity-50 pointer-events-none" />
                <div className="bg-[#181825]/90 backdrop-blur-2xl rounded-[2.5rem] p-6 sm:p-8 h-full flex flex-col relative z-10">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30 text-indigo-400">
                            <Eye className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-white tracking-tight">Live Simulation</h3>
                            <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mt-0.5">End-user interface preview</p>
                        </div>
                    </div>

                    <div className="flex-1 flex items-center justify-center">
                        <div className="w-full relative group/preview">
                            <div className="absolute inset-0 bg-indigo-500/20 rounded-2xl blur-xl transition-opacity opacity-50 group-hover/preview:opacity-100" />
                            <div className="relative bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-5 shadow-2xl">
                                <div className="flex items-start gap-4">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-indigo-500 rounded-xl blur animate-pulse" />
                                        <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-inner border border-white/20">
                                            <Bell className="w-6 h-6 text-white" />
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-black text-white text-base leading-tight">
                                            {form.title || 'SYSTEM ALERT'}
                                        </p>
                                        <div className="mt-2 text-sm font-medium text-gray-300 whitespace-pre-wrap leading-relaxed max-h-32 overflow-y-auto no-scrollbar">
                                            {form.message || 'Transmission parameters will manifest here...'}
                                        </div>
                                        <div className="flex items-center gap-2 mt-3">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                            <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Active Transmission</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Protocol Manual */}
            <div className="bg-white/60 dark:bg-[#181825]/60 backdrop-blur-xl rounded-[2.5rem] border border-white/50 dark:border-white/10 p-6 sm:p-8 shadow-xl">
                <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
                    <Lightbulb className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h3 className="text-lg font-black text-gray-900 dark:text-white tracking-tight">Protocol Manual</h3>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">Recommended usages</p>
                </div>
                </div>
                <div className="space-y-3">
                {[
                    'Deploy systemic maintenance warnings',
                    'Announce critical feature integrations',
                    'Broadcast global challenges or events',
                    'Issue temporal security advisories',
                ].map((tip, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/40 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                        <div className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center shrink-0 mt-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                        </div>
                        <p className="text-xs font-bold text-gray-700 dark:text-gray-300 leading-relaxed">{tip}</p>
                    </div>
                ))}
                </div>
            </div>

        </div>

      </div>
      <style>{`
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
          @keyframes animate-shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(5px); } 75% { transform: translateX(-5px); } }
          .animate-shake { animation: animate-shake 0.4s ease-in-out; }
      `}</style>
    </div>
  );
};

export default AdminNotifications;