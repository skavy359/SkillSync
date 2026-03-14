import React, { useEffect, useState, useCallback } from 'react';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import {
  getUsers, updateUserRole, deleteUser, getUserSkills,
} from '../services/adminService';
import {
  Search, Trash2, BookOpen, ChevronLeft, ChevronRight, AlertCircle,
  Loader2, RefreshCw, Users, ShieldCheck, Filter, Clock, Layers,
  CalendarDays, Check, Sparkles, UserPlus, MoreVertical
} from 'lucide-react';

const formatDate = (iso) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => { const t = setTimeout(() => setDebounced(value), delay); return () => clearTimeout(t); }, [value, delay]);
  return debounced;
}

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 10;

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const debouncedSearch = useDebounce(search, 400);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [detailModal, setDetailModal] = useState({ open: false, user: null });
  const [userSkills, setUserSkills] = useState([]);
  const [skillsLoading, setSkillsLoading] = useState(false);
  const [skillsError, setSkillsError] = useState(null);

  const [deleteModal, setDeleteModal] = useState({ open: false, user: null });
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const [roleChanging, setRoleChanging] = useState({});
  const [roleError, setRoleError] = useState(null);

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const showSuccess = (message) => {
    setSuccessMessage(message); setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 4000);
  };

  const openUserDetail = useCallback(async (user) => {
    setDetailModal({ open: true, user }); setSkillsLoading(true); setSkillsError(null); setUserSkills([]);
    try { setUserSkills(await getUserSkills(user.id) ?? []); }
    catch (e) { setSkillsError(e?.response?.data?.message ?? 'Failed to load user skills.'); }
    finally { setSkillsLoading(false); }
  }, []);

  const fetchUsers = useCallback(async (opts = {}) => {
    setLoading(true); setError(null);
    try {
      const result = await getUsers({ page: opts.page ?? page, size: PAGE_SIZE, role: opts.roleFilter ?? roleFilter, search: opts.search ?? debouncedSearch });
      const sorted = (result?.content ?? []).sort((a, b) => (a.role === 'ADMIN' ? -1 : b.role === 'ADMIN' ? 1 : 0));
      setUsers(sorted); setTotalElements(result?.totalElements ?? 0); setTotalPages(result?.totalPages ?? 0);
    } catch (e) { setError(e?.response?.data?.message ?? 'Failed to load users.'); }
    finally { setLoading(false); }
  }, [page, roleFilter, debouncedSearch]);

  useEffect(() => { fetchUsers({ page, roleFilter, search: debouncedSearch }); }, [page, roleFilter, debouncedSearch]);
  useEffect(() => { setPage(0); }, [debouncedSearch, roleFilter]);

  const handleRoleChange = async (user, newRole) => {
    if (newRole === user.role) return;
    setRoleChanging(prev => ({ ...prev, [user.id]: true })); setRoleError(null);
    try {
      await updateUserRole(user.id, newRole);
      const updated = users.map(u => u.id === user.id ? { ...u, role: newRole } : u).sort((a, b) => (a.role === 'ADMIN' ? -1 : b.role === 'ADMIN' ? 1 : 0));
      setUsers(updated);
      if (detailModal.user?.id === user.id) {
        setDetailModal(prev => ({ ...prev, user: { ...prev.user, role: newRole } }));
        setSkillsLoading(true);
        try { setUserSkills(await getUserSkills(user.id) ?? []); } catch {} finally { setSkillsLoading(false); }
      }
      showSuccess(`${user.name} role changed to ${newRole}`);
      setTimeout(() => setDetailModal({ open: false, user: null }), 500);
    } catch (e) { setRoleError(e?.response?.data?.message ?? `Failed to update role for ${user.name}.`); }
    finally { setRoleChanging(prev => ({ ...prev, [user.id]: false })); }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.user) return;
    setDeleteLoading(true); setDeleteError(null);
    try {
      await deleteUser(deleteModal.user.id);
      setUsers(prev => prev.filter(u => u.id !== deleteModal.user.id));
      setTotalElements(prev => Math.max(0, prev - 1));
      setDeleteModal({ open: false, user: null }); setDetailModal({ open: false, user: null });
      showSuccess(`${deleteModal.user.name} has been deleted`);
    } catch (e) { setDeleteError(e?.response?.data?.message ?? 'Failed to delete user.'); }
    finally { setDeleteLoading(false); }
  };

  const from = totalElements === 0 ? 0 : page * PAGE_SIZE + 1;
  const to = Math.min((page + 1) * PAGE_SIZE, totalElements);

  return (
    <div className="space-y-8 relative z-10 w-full max-w-[100vw] overflow-x-hidden p-4 sm:p-0">
      {/* Success Toast */}
      {showSuccessMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-4 px-6 py-4 bg-emerald-500/90 backdrop-blur-xl border border-emerald-400/50 rounded-2xl shadow-2xl shadow-emerald-500/20 animate-in slide-in-from-bottom-5">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <Check className="w-5 h-5 text-white" />
          </div>
          <p className="text-sm font-bold text-white">{successMessage}</p>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 relative z-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/60 dark:bg-white/5 border border-gray-200/50 dark:border-white/10 backdrop-blur-md mb-4 shadow-sm">
            <ShieldCheck className="w-4 h-4 text-indigo-500" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-600 dark:text-gray-300">Identity Directory</span>
          </div>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
            User Management <Users className="w-6 h-6 text-indigo-500" />
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">
            {totalElements > 0 ? `${totalElements.toLocaleString()} citizens in the network` : 'Manage platform participants'}
          </p>
        </div>
        <button onClick={() => fetchUsers()} disabled={loading}
          className="group relative flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/80 dark:bg-[#181825]/80 border border-gray-200/50 dark:border-white/10 backdrop-blur-md text-sm font-bold text-gray-700 dark:text-white shadow-sm hover:shadow-indigo-500/20 hover:border-indigo-500/30 transition-all disabled:opacity-50 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <RefreshCw className={`relative z-10 w-4 h-4 ${loading ? 'animate-spin text-indigo-500' : 'group-hover:rotate-180 transition-transform duration-500'}`} /> 
          <span className="relative z-10">Refresh Directory</span>
        </button>
      </div>

      {roleError && (
        <div className="relative overflow-hidden p-6 bg-rose-50/80 dark:bg-rose-500/10 backdrop-blur-md border border-rose-200/50 dark:border-rose-500/20 rounded-3xl flex items-center gap-4 shadow-sm">
          <AlertCircle className="w-6 h-6 text-rose-600 dark:text-rose-400 shrink-0" />
          <p className="text-sm font-bold text-rose-800 dark:text-rose-300 flex-1">{roleError}</p>
          <button onClick={() => setRoleError(null)} className="text-rose-600 hover:text-rose-800 dark:text-rose-400 dark:hover:text-rose-200 text-lg">×</button>
        </div>
      )}

      {/* Global Search + Filter Toolbar */}
      <div className="relative bg-white/60 dark:bg-[#181825]/60 backdrop-blur-2xl rounded-3xl border border-white/50 dark:border-white/10 p-2 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.1)] flex flex-col md:flex-row gap-2 z-20">
        <div className="relative flex-1 group">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          <div className="relative flex items-center bg-white dark:bg-[#1e1e2e] rounded-2xl border border-gray-200/50 dark:border-white/5 focus-within:border-indigo-500/50 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
            <Search className="w-5 h-5 text-gray-400 ml-4 shrink-0" />
            <input type="text" placeholder="Search citizens by identity or comms address…" value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent border-0 py-3.5 pl-3 pr-4 text-sm font-semibold text-gray-900 dark:text-white placeholder-gray-400 outline-none" />
          </div>
        </div>
        <div className="relative md:w-64 group">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-rose-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          <div className="relative flex items-center bg-white dark:bg-[#1e1e2e] rounded-2xl border border-gray-200/50 dark:border-white/5 focus-within:border-purple-500/50 focus-within:ring-2 focus-within:ring-purple-500/20 transition-all overflow-hidden">
            <Filter className="w-5 h-5 text-gray-400 ml-4 shrink-0 pointer-events-none" />
            <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full bg-transparent border-0 py-3.5 pl-3 pr-10 text-sm font-bold text-gray-700 dark:text-gray-200 cursor-pointer outline-none appearance-none">
              <option value="" className="bg-white dark:bg-[#1e1e2e] font-bold">All Access Tiers</option>
              <option value="USER" className="bg-white dark:bg-[#1e1e2e] text-indigo-600 dark:text-indigo-400 font-bold">Standard User</option>
              <option value="ADMIN" className="bg-white dark:bg-[#1e1e2e] text-purple-600 dark:text-purple-400 font-bold">Administrator</option>
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="relative overflow-hidden p-6 bg-rose-50/80 dark:bg-rose-500/10 backdrop-blur-md border border-rose-200/50 dark:border-rose-500/20 rounded-3xl flex items-center gap-4 shadow-sm">
          <AlertCircle className="w-6 h-6 text-rose-500 shrink-0" />
          <p className="text-sm font-bold text-rose-800 dark:text-rose-300 flex-1">{error}</p>
          <button onClick={() => fetchUsers()} className="text-xs font-bold text-rose-600 hover:underline">Retry</button>
        </div>
      )}

      {/* Futuristic Users Table */}
      <div className="bg-white/60 dark:bg-[#181825]/60 backdrop-blur-xl rounded-[2.5rem] border border-white/50 dark:border-white/10 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)]">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[800px] sm:min-w-full">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-white/5 border-b border-gray-200/50 dark:border-white/5">
                {['Identity', 'Initialization Date', 'Skills', 'Sessions', 'Privileges', ''].map((h, i) => (
                  <th key={h} className={`px-6 py-5 text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest ${i === 5 ? 'text-right' : ''}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100/50 dark:divide-white/5">
              {loading && Array.from({ length: PAGE_SIZE }).map((_, i) => (
                <tr key={i} className="animate-pulse bg-white/20 dark:bg-white/5">
                  <td className="px-6 py-5"><div className="flex items-center gap-4"><div className="w-12 h-12 bg-gray-200 dark:bg-white/10 rounded-full" /><div className="space-y-2"><div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-32" /><div className="h-3 bg-gray-200 dark:bg-white/10 rounded w-48" /></div></div></td>
                  {[...Array(4)].map((_, j) => <td key={j} className="px-6 py-5"><div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-20" /></td>)}
                  <td className="px-6 py-5"><div className="flex justify-end"><div className="h-8 w-8 bg-gray-200 dark:bg-white/10 rounded-xl" /></div></td>
                </tr>
              ))}

              {!loading && !error && users.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-24">
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="w-20 h-20 bg-gray-100 dark:bg-white/5 rounded-3xl flex items-center justify-center mb-4 border border-gray-200/50 dark:border-white/10 shadow-inner">
                        <UserPlus className="w-10 h-10 text-gray-400 dark:text-gray-600" />
                      </div>
                      <p className="text-xl font-black text-gray-900 dark:text-white">Void Detected</p>
                      <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mt-2 max-w-sm">No identities match your current temporal parameters.</p>
                    </div>
                  </td>
                </tr>
              )}

              {!loading && users.map(user => (
                <tr key={user.id} onClick={() => openUserDetail(user)} className="group hover:bg-gray-50/80 dark:hover:bg-white/5 transition-all duration-300 cursor-pointer relative overflow-hidden">
                  
                  <td className="px-6 py-5 pl-8 relative">
                    <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${user.role === 'ADMIN' ? 'from-purple-500 to-rose-500' : 'from-indigo-500 to-cyan-500'} opacity-0 group-hover:opacity-100 transition-opacity`} />
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className={`absolute inset-0 bg-gradient-to-br ${user.role === 'ADMIN' ? 'from-purple-500 to-rose-500' : 'from-indigo-400 to-cyan-500'} rounded-full blur-md opacity-0 group-hover:opacity-60 transition-opacity duration-500`} />
                        <div className={`relative w-12 h-12 rounded-full bg-gradient-to-br ${user.role === 'ADMIN' ? 'from-purple-500 to-rose-600' : 'from-indigo-500 to-cyan-600'} flex items-center justify-center text-white text-lg font-black shadow-lg border-2 border-white dark:border-[#181825] z-10 group-hover:scale-110 transition-transform duration-300`}>
                          {user.name?.[0]?.toUpperCase() ?? '?'}
                        </div>
                      </div>
                      <div className="min-w-0">
                        <p className="text-base font-black text-gray-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{user.name}</p>
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                      <div className="flex flex-col">
                          <span className="text-sm font-bold text-gray-900 dark:text-white">{formatDate(user.createdAt)}</span>
                      </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center border border-indigo-100 dark:border-indigo-500/20">
                            <Layers className="w-4 h-4 text-indigo-500" />
                        </div>
                        <span className="text-sm font-black text-gray-900 dark:text-white">{user.totalSkills ?? 0}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center border border-emerald-100 dark:border-emerald-500/20">
                            <Clock className="w-4 h-4 text-emerald-500" />
                        </div>
                        <span className="text-sm font-black text-gray-900 dark:text-white">{user.totalSessions ?? 0}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider ${
                        user.role === 'ADMIN' ? 'bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30 shadow-[0_0_10px_rgba(168,85,247,0.2)]' : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-white/10'
                      }`}>
                        {user.role === 'ADMIN' && <ShieldCheck className="w-3.5 h-3.5" />}
                        {user.role === 'ADMIN' ? 'Admin' : 'Standard'}
                      </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center justify-end">
                      <button onClick={(e) => { e.stopPropagation(); openUserDetail(user); }}
                        className="w-10 h-10 rounded-xl hover:bg-white dark:hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:shadow-sm transition-all border border-transparent hover:border-gray-200 dark:hover:border-white/10 group/btn">
                        <MoreVertical className="w-5 h-5 group-hover/btn:rotate-90 transition-transform duration-300" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Cinematic Pagination */}
        {!loading && !error && totalElements > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-8 py-5 border-t border-white/50 dark:border-white/10 bg-gray-50/50 dark:bg-black/20">
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
              Viewing <span className="text-gray-900 dark:text-white">{from}—{to}</span> of <span className="text-gray-900 dark:text-white">{totalElements.toLocaleString()}</span>
            </p>
            <div className="flex items-center gap-2 bg-white dark:bg-[#1e1e2e] p-1.5 rounded-2xl border border-gray-200/50 dark:border-white/10 shadow-sm">
              <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
                className="w-8 h-8 flex items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white disabled:opacity-30 disabled:hover:bg-transparent transition-all">
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i).filter(i => Math.abs(i - page) <= 1 || i === 0 || i === totalPages - 1).map((i, index, array) => (
                    <React.Fragment key={i}>
                        {index > 0 && i - array[index - 1] > 1 && <span className="text-gray-400 px-1">...</span>}
                        <button onClick={() => setPage(i)}
                        className={`w-8 h-8 rounded-xl text-xs font-black flex items-center justify-center transition-all duration-300 ${
                            i === page ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 scale-110' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'
                        }`}>{i + 1}</button>
                    </React.Fragment>
                  ))}
              </div>

              <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}
                className="w-8 h-8 flex items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white disabled:opacity-30 disabled:hover:bg-transparent transition-all">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Futuristic User Detail Modal */}
      <Modal isOpen={detailModal.open} onClose={() => setDetailModal({ open: false, user: null })}
        title={
          <div className="flex items-center gap-4">
            <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl blur-md opacity-40" />
                <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl font-black border border-white/20 shadow-xl shadow-indigo-500/20">
                    {detailModal.user?.name?.[0]?.toUpperCase() ?? '?'}
                </div>
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">{detailModal.user?.name}</p>
              <div className="flex items-center gap-2 mt-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">{detailModal.user?.email}</p>
              </div>
            </div>
          </div>
        }
        size="lg"
        footer={
          <div className="flex items-center justify-end w-full">
            <Button variant="danger" size="sm" onClick={() => setDeleteModal({ open: true, user: detailModal.user })} disabled={skillsLoading} className="rounded-xl font-bold uppercase tracking-wider shadow-lg shadow-rose-500/20">
              <Trash2 className="w-4 h-4 mr-2" /> Erase Identity
            </Button>
          </div>
        }>
        <div className="space-y-8 p-2">
          {/* Identity Info Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Access Level', value: detailModal.user?.role === 'ADMIN' ? 'Administrator' : 'Standard', icon: <ShieldCheck className="w-5 h-5 text-purple-500" />, grad: 'from-purple-50 items-center', txt: detailModal.user?.role === 'ADMIN' ? 'text-purple-600' : 'text-gray-600' },
              { label: 'Initialized', value: detailModal.user?.createdAt ? formatDate(detailModal.user.createdAt) : '—', icon: <CalendarDays className="w-5 h-5 text-blue-500" /> },
              { label: 'Acquired Skills', value: detailModal.user?.totalSkills ?? 0, icon: <Layers className="w-5 h-5 text-indigo-500" /> },
              { label: 'Logged Sessions', value: detailModal.user?.totalSessions ?? 0, icon: <Clock className="w-5 h-5 text-emerald-500" /> },
            ].map((item, i) => (
              <div key={i} className="p-5 rounded-3xl bg-gray-50/80 dark:bg-white/5 border border-gray-200/50 dark:border-white/10 backdrop-blur-md relative overflow-hidden group hover:shadow-md transition-shadow">
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-white/40 to-transparent dark:from-white/5 rounded-full blur-xl -mr-8 -mt-8" />
                <div className="mb-3 w-10 h-10 rounded-xl bg-white dark:bg-black/20 flex items-center justify-center shadow-sm border border-gray-100 dark:border-white/5">
                    {item.icon}
                </div>
                <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">{item.label}</p>
                <p className={`text-base font-black truncate ${item.txt || 'text-gray-900 dark:text-white'}`}>{item.value}</p>
              </div>
            ))}
          </div>

          {/* Role Modification Console */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-white to-indigo-50/50 dark:from-[#181825] dark:to-indigo-900/10 border border-indigo-100/50 dark:border-indigo-500/20 shadow-lg shadow-indigo-500/5 relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
              <div>
                <h4 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                    Privilege Override <Sparkles className="w-4 h-4 text-indigo-500 animate-pulse" />
                </h4>
                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mt-1">Modify systemic access tier</p>
              </div>
              <div className="flex items-center gap-3 bg-white dark:bg-[#1e1e2e] p-1.5 rounded-2xl border border-gray-200/50 dark:border-white/10 shadow-sm w-full sm:w-auto">
                {roleChanging[detailModal.user?.id] && <Loader2 className="w-5 h-5 text-indigo-500 animate-spin ml-2" />}
                <select value={detailModal.user?.role ?? 'USER'} onChange={(e) => handleRoleChange(detailModal.user, e.target.value)}
                  disabled={roleChanging[detailModal.user?.id]}
                  className="w-full sm:w-48 pl-4 pr-10 py-2.5 text-sm font-black rounded-xl bg-transparent text-gray-900 dark:text-white cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 outline-none appearance-none transition-colors border-0 focus:ring-0">
                  <option value="USER" className="font-bold text-gray-900 dark:text-gray-900">Standard Identity</option>
                  <option value="ADMIN" className="font-bold text-purple-600 dark:text-purple-600">Root Administrator</option>
                </select>
              </div>
            </div>
          </div>

          {/* Skill Matrix Display */}
          <div className="bg-white/40 dark:bg-white/5 rounded-3xl border border-gray-200/50 dark:border-white/10 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                    <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h3 className="text-lg font-black text-gray-900 dark:text-white">Acquired Skill Matrix</h3>
                    <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Total vectors: {userSkills.length}</p>
                </div>
              </div>
            </div>

            {skillsLoading && (
              <div className="flex flex-col items-center justify-center py-12 gap-3">
                <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Accessing matrix data...</p>
              </div>
            )}

            {!skillsLoading && skillsError && (
              <div className="flex items-center gap-4 p-4 bg-rose-50/80 dark:bg-rose-500/10 rounded-2xl border border-rose-200/50 dark:border-rose-500/20">
                <AlertCircle className="w-6 h-6 text-rose-500 shrink-0" />
                <p className="text-sm font-bold text-rose-700 dark:text-rose-400">{skillsError}</p>
              </div>
            )}

            {!skillsLoading && !skillsError && userSkills.length === 0 && (
              <div className="flex flex-col items-center py-12 text-center border-2 border-dashed border-gray-200 dark:border-white/10 rounded-2xl">
                <div className="w-16 h-16 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
                    <Layers className="w-8 h-8 text-gray-300 dark:text-[#45475a]" />
                </div>
                <p className="text-base font-black text-gray-900 dark:text-white">No skill vectors detected</p>
                <p className="text-xs font-semibold text-gray-500 mt-1">This node has not initiated learning protocols.</p>
              </div>
            )}

            {!skillsLoading && !skillsError && userSkills.length > 0 && (
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 no-scrollbar">
                {userSkills.map(skill => (
                  <div key={skill.id} className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-[#1e1e2e] border border-gray-100 dark:border-white/5 hover:border-indigo-300 dark:hover:border-indigo-500/30 hover:shadow-md transition-all">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-white/5 dark:to-white/10 flex items-center justify-center text-lg shadow-inner">
                            {skill.icon || '🚀'}
                        </div>
                        <div>
                          <p className="text-sm font-black text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{skill.name}</p>
                          <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-0.5">{skill.category || 'Uncategorized Vector'}</p>
                        </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-64">
                        <div className="flex-1 max-w-[120px]">
                            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest mb-1.5">
                                <span className={skill.progress === 100 ? 'text-emerald-500' : 'text-indigo-500'}>Proficiency</span>
                                <span className="text-gray-900 dark:text-white">{skill.progress ?? 0}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-gray-100 dark:bg-black/30 rounded-full overflow-hidden">
                                <div className={`h-full rounded-full transition-all duration-1000 ${skill.progress === 100 ? 'bg-emerald-500' : 'bg-gradient-to-r from-indigo-500 to-purple-500'}`} style={{ width: `${skill.progress ?? 0}%` }} />
                            </div>
                        </div>
                      <span className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider ${
                        skill.status === 'completed' ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300' :
                        skill.status === 'active' ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 animate-pulse' :
                        'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400'
                      }`}>{skill.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Modal>

      {/* Cinematic Delete Confirmation Modal */}
      <Modal isOpen={deleteModal.open} onClose={() => { if (!deleteLoading) { setDeleteModal({ open: false, user: null }); setDeleteError(null); } }}
        title={<span className="text-rose-600 dark:text-rose-400 font-black">Erasure Protocol</span>} size="sm"
        footer={
          <div className="flex gap-3 w-full">
            <Button variant="secondary" className="flex-1 rounded-xl font-bold uppercase tracking-wider" onClick={() => { setDeleteModal({ open: false, user: null }); setDeleteError(null); }} disabled={deleteLoading}>Abort</Button>
            <Button variant="danger" className="flex-1 rounded-xl font-bold uppercase tracking-wider bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 border-0 shadow-lg shadow-rose-500/30" onClick={handleDeleteConfirm} disabled={deleteLoading}>
              {deleteLoading ? <span className="flex items-center justify-center gap-2"><Loader2 className="w-4 h-4 animate-spin" />Erasing…</span> : 'Confirm Erasure'}
            </Button>
          </div>
        }>
        <div className="space-y-6 pt-2 pb-4">
          <div className="flex justify-center relative">
            <div className="absolute inset-0 bg-rose-500/20 rounded-full blur-xl animate-pulse" />
            <div className="relative w-20 h-20 bg-gradient-to-br from-rose-400 to-red-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-rose-500/40 rotate-12 hover:rotate-0 transition-transform duration-500">
              <Trash2 className="w-10 h-10 text-white" />
            </div>
          </div>
          <div className="text-center px-4">
            <p className="text-base text-gray-900 dark:text-white">
              Permanent deletion sequence initiated for identity <span className="font-black text-rose-600 dark:text-rose-400">{deleteModal.user?.name}</span>.
            </p>
            <div className="bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 rounded-xl p-3 mt-4">
                <p className="text-xs text-rose-700 dark:text-rose-400 font-bold uppercase tracking-widest">Warning: Irreversible Action</p>
                <p className="text-xs text-rose-600/80 dark:text-rose-400/80 mt-1">All associated telemetry, skills, and parameters will be purged.</p>
            </div>
          </div>
          {deleteError && (
            <div className="flex items-center justify-center gap-2 p-3 bg-red-100 dark:bg-red-500/20 rounded-xl border border-red-300 dark:border-red-500/30 animate-shake">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <p className="text-xs font-bold text-red-800 dark:text-red-300">{deleteError}</p>
            </div>
          )}
        </div>
      </Modal>
      <style>{`
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
          @keyframes animate-shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(5px); } 75% { transform: translateX(-5px); } }
          .animate-shake { animation: animate-shake 0.4s ease-in-out; }
      `}</style>
    </div>
  );
};

export default AdminUsers;