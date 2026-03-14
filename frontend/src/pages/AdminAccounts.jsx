import React, { useState, useEffect } from 'react';
import { Unlock, RotateCw, Search, AlertCircle, Check, ShieldCheck, Loader2, Eye, EyeOff, KeyRound, Lock, Sparkles } from 'lucide-react';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import adminService from '../services/adminService';

const AdminAccounts = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [search, setSearch] = useState('');
  const [resetModal, setResetModal] = useState({ open: false, userId: null, password: '' });
  const [activating, setActivating] = useState(null);
  const [resetting, setResetting] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => { fetchInactiveUsers(); }, []);

  const fetchInactiveUsers = async () => {
    try { setLoading(true); const r = await adminService.getInactiveUsers(30); setUsers(r.data || []); setError(null); }
    catch (e) { setError(e.response?.data?.message || 'Failed to fetch users'); }
    finally { setLoading(false); }
  };

  const handleToggleAccount = async (userId, isActive) => {
    try {
      setActivating(userId); await adminService.toggleAccountStatus(userId, !isActive);
      setSuccessMessage(`Account ${isActive ? 'suspended' : 'restored'} successfully`);
      setTimeout(() => setSuccessMessage(''), 4000); fetchInactiveUsers();
    } catch (e) { setError(e.response?.data?.message || 'Failed to toggle status'); }
    finally { setActivating(null); }
  };

  const handleResetPassword = async () => {
    if (!resetModal.password) { setError('Please enter a password'); return; }
    try {
      setResetting(true); await adminService.resetUserPassword(resetModal.userId, resetModal.password);
      setSuccessMessage('Security key overridden successfully'); setTimeout(() => setSuccessMessage(''), 4000);
      setResetModal({ open: false, userId: null, password: '' }); fetchInactiveUsers();
    } catch (e) { setError(e.response?.data?.message || 'Failed to reset password'); }
    finally { setResetting(false); }
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 relative z-10 w-full max-w-[100vw] overflow-x-hidden p-4 sm:p-0">

      {successMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-4 px-6 py-4 bg-emerald-500/90 backdrop-blur-xl border border-emerald-400/50 rounded-2xl shadow-2xl shadow-emerald-500/20 animate-in slide-in-from-bottom-5">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center border border-white/30">
            <Check className="w-5 h-5 text-white" />
          </div>
          <p className="text-sm font-bold text-white uppercase tracking-wider">{successMessage}</p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 relative z-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/60 dark:bg-white/5 border border-gray-200/50 dark:border-white/10 backdrop-blur-md mb-4 shadow-sm">
            <Lock className="w-4 h-4 text-rose-500" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-600 dark:text-gray-300">Access Control Registry</span>
          </div>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
            Identity Suspension <ShieldCheck className="w-6 h-6 text-indigo-500" />
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium max-w-2xl">
            Monitor and restore access for inactive nodes within the platform.
          </p>
        </div>
      </div>

      {error && (
        <div className="relative overflow-hidden p-6 bg-rose-50/80 dark:bg-rose-500/10 backdrop-blur-md border border-rose-200/50 dark:border-rose-500/20 rounded-3xl flex items-center gap-4 shadow-sm">
          <AlertCircle className="w-6 h-6 text-rose-500 shrink-0" />
          <p className="text-sm font-bold text-rose-800 dark:text-rose-300 flex-1">{error}</p>
          <button onClick={() => setError(null)} className="text-rose-600 hover:text-rose-800 dark:text-rose-400 dark:hover:text-rose-200 text-lg transition-colors">×</button>
        </div>
      )}

      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-rose-500/20 to-indigo-500/20 rounded-3xl blur-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        <div className="relative flex items-center bg-white/60 dark:bg-[#181825]/60 backdrop-blur-xl rounded-3xl border border-gray-200/50 dark:border-white/10 focus-within:border-rose-500/50 focus-within:ring-2 focus-within:ring-rose-500/20 transition-all shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.1)] p-2">
            <div className="flex-1 relative flex items-center bg-white dark:bg-[#1e1e2e] rounded-2xl border border-gray-200/50 dark:border-white/5 transition-all">
                <Search className="w-5 h-5 text-gray-400 ml-4 shrink-0" />
                <input type="text" placeholder="Locate suspended identities by name or comms address…" value={search} onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent border-0 py-4 pl-3 pr-4 text-sm font-semibold text-gray-900 dark:text-white placeholder-gray-400 outline-none" />
            </div>
        </div>
      </div>

      <div className="bg-white/60 dark:bg-[#181825]/60 backdrop-blur-xl rounded-[2.5rem] border border-white/50 dark:border-white/10 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)]">
        {loading ? (
            <div className="flex flex-col items-center justify-center py-24 relative z-10 w-full">
                <div className="relative">
                    <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full animate-pulse" />
                    <div className="w-16 h-16 bg-white/80 dark:bg-[#181825]/80 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-2xl border border-white/50 dark:border-white/10 relative z-10">
                    <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                    </div>
                </div>
                <div className="text-center mt-4">
                    <p className="text-lg font-black text-gray-900 dark:text-white mb-1">Scanning Registry</p>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Compiling dormant nodes...</p>
                </div>
            </div>
        ) : filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-24">
            <div className="relative w-24 h-24 mb-6">
                <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl animate-pulse" />
                <div className="relative w-full h-full bg-white dark:bg-white/5 rounded-3xl flex items-center justify-center border border-gray-200/50 dark:border-white/10 shadow-inner">
                    <ShieldCheck className="w-12 h-12 text-emerald-500" />
                </div>
            </div>
            <p className="text-2xl font-black text-gray-900 dark:text-white">All Clear</p>
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mt-2 max-w-sm">No suspended or dormant identities detected within current parameters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse min-w-[800px] sm:min-w-full">
              <thead>
                <tr className="bg-gray-50/50 dark:bg-white/5 border-b border-gray-200/50 dark:border-white/5">
                  {['Suspended Identity', 'Comms Address', 'Node Status', 'Recovery Protocols'].map((h, i) => (
                    <th key={h} className={`px-6 py-5 text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest ${i === 3 ? 'text-right' : ''}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100/50 dark:divide-white/5">
                {filteredUsers.map(user => (
                  <tr key={user.id} className="group hover:bg-rose-50/30 dark:hover:bg-rose-500/5 transition-all duration-300 relative overflow-hidden">
                    <td colSpan={1} className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-rose-400 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity" />

                    <td className="px-6 py-5 pl-8">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-br from-rose-400 to-red-500 rounded-full blur-md opacity-0 group-hover:opacity-60 transition-opacity duration-500" />
                          <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-[#313244] dark:to-[#45475a] group-hover:from-rose-500 group-hover:to-red-600 flex items-center justify-center text-gray-600 dark:text-gray-300 group-hover:text-white text-lg font-black shadow-inner border-2 border-white dark:border-[#181825] z-10 transition-all duration-500">
                            {user.name?.[0]?.toUpperCase() ?? '?'}
                          </div>
                        </div>
                        <span className="text-base font-black text-gray-900 dark:text-white truncate group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                        <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">{user.email}</span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200/50 dark:border-rose-500/20 shadow-[0_0_10px_rgba(244,63,94,0.1)] group-hover:shadow-[0_0_15px_rgba(244,63,94,0.3)] transition-shadow">
                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" /> 
                        <span className="text-[10px] font-black uppercase tracking-widest text-rose-700 dark:text-rose-400">Suspended</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-end gap-3">
                        <button onClick={() => handleToggleAccount(user.id, false)} disabled={activating === user.id}
                          className="group/btn relative overflow-hidden inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-white/5 border border-emerald-200/50 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-black uppercase tracking-wider hover:border-emerald-400 dark:hover:border-emerald-400 hover:shadow-[0_0_15px_rgba(16,185,129,0.2)] transition-all disabled:opacity-50"
                          title="Restore access privileges">
                          <div className="absolute inset-0 bg-emerald-500/10 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                          {activating === user.id ? <Loader2 className="w-4 h-4 animate-spin relative z-10" /> : <Unlock className="w-4 h-4 relative z-10 group-hover/btn:-translate-y-0.5 transition-transform" />}
                          <span className="relative z-10">Restore</span>
                        </button>
                        
                        <button onClick={() => setResetModal({ open: true, userId: user.id, password: '' })}
                          className="group/btn relative overflow-hidden inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-white/5 border border-indigo-200/50 dark:border-indigo-500/30 text-indigo-700 dark:text-indigo-400 text-xs font-black uppercase tracking-wider hover:border-indigo-400 dark:hover:border-indigo-400 hover:shadow-[0_0_15px_rgba(99,102,241,0.2)] transition-all"
                          title="Override security key">
                          <div className="absolute inset-0 bg-indigo-500/10 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                          <RotateCw className="w-4 h-4 relative z-10 group-hover/btn:rotate-180 transition-transform duration-500" /> 
                          <span className="relative z-10">Override</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal isOpen={resetModal.open} onClose={() => setResetModal({ open: false, userId: null, password: '' })}
        title={
          <div className="flex items-center gap-4">
            <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl blur-md opacity-40" />
                <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center border border-white/20 shadow-xl shadow-indigo-500/20">
                    <KeyRound className="w-6 h-6 text-white" />
                </div>
            </div>
            <div>
              <p className="text-xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2">Security Override <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" /></p>
              <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mt-1">Generate new access parameters</p>
            </div>
          </div>
        }
        size="md"
        footer={
          <div className="flex items-center gap-3 w-full">
            <Button variant="secondary" className="flex-1 rounded-xl font-bold uppercase tracking-wider" onClick={() => setResetModal({ open: false, userId: null, password: '' })}>Abort Sequence</Button>
            <Button variant="primary" className="flex-1 rounded-xl font-bold uppercase tracking-wider bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 border-0 shadow-lg shadow-indigo-500/30" onClick={handleResetPassword} disabled={resetting || !resetModal.password}>
              {resetting ? <span className="flex items-center justify-center gap-2"><Loader2 className="w-4 h-4 animate-spin" />Processing…</span> : 'Deploy Override'}
            </Button>
          </div>
        }>
        <div className="space-y-6 pt-2 pb-4">
            <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-500/10 border border-amber-200/50 dark:border-amber-500/20 backdrop-blur-md flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" />
                <div>
                    <p className="text-sm font-bold text-amber-800 dark:text-amber-300">Force Authorization Key Change</p>
                    <p className="text-xs font-semibold text-amber-700/80 dark:text-amber-400/80 mt-1">This action will immediately invalidate any previous keys belonging to this identity.</p>
                </div>
            </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2 px-1">New Security Parameter</label>
            <div className="relative group">
                <div className="absolute inset-0 bg-indigo-500/20 rounded-2xl blur transition-opacity opacity-0 focus-within:opacity-100" />
                <div className="relative flex items-center bg-white dark:bg-[#1e1e2e] rounded-2xl border border-gray-200/50 dark:border-white/10 focus-within:border-indigo-500/50 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all shadow-sm">
                    <Lock className="w-5 h-5 text-gray-400 ml-4 shrink-0" />
                    <input type={showPassword ? 'text' : 'password'} value={resetModal.password}
                    onChange={(e) => setResetModal(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Enter new 64-bit encryption key..."
                    className="w-full px-3 py-4 text-sm font-black text-gray-900 dark:text-white placeholder-gray-400 bg-transparent border-0 outline-none" />
                    <button onClick={() => setShowPassword(!showPassword)} className="px-4 text-gray-400 hover:text-indigo-500 transition-colors focus:outline-none">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminAccounts;