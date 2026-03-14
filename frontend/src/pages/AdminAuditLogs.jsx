import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Download, X, FileText, ShieldCheck, Search, Loader2, Sparkles, Activity, Eye, Zap, Database } from 'lucide-react';
import adminService from '../services/adminService';

const ACTION_COLORS = {
  'LOGIN': { bg: 'bg-blue-500/10 dark:bg-blue-500/15', text: 'text-blue-600 dark:text-blue-400', dot: 'bg-blue-500', icon: 'from-blue-400 to-indigo-500', shadow: 'shadow-blue-500/20' },
  'LOGOUT': { bg: 'bg-gray-500/10 dark:bg-white/5', text: 'text-gray-600 dark:text-gray-400', dot: 'bg-gray-400', icon: 'from-gray-400 to-gray-500', shadow: 'shadow-gray-500/10' },
  'USER_CREATED': { bg: 'bg-emerald-500/10 dark:bg-emerald-500/15', text: 'text-emerald-700 dark:text-emerald-400', dot: 'bg-emerald-500', icon: 'from-emerald-400 to-green-500', shadow: 'shadow-emerald-500/20' },
  'USER_DELETED': { bg: 'bg-red-500/10 dark:bg-red-500/15', text: 'text-red-700 dark:text-red-400', dot: 'bg-red-500', icon: 'from-red-400 to-rose-600', shadow: 'shadow-red-500/20' },
  'ROLE_CHANGED': { bg: 'bg-purple-500/10 dark:bg-purple-500/15', text: 'text-purple-700 dark:text-purple-400', dot: 'bg-purple-500', icon: 'from-purple-400 to-fuchsia-500', shadow: 'shadow-purple-500/20' },
  'PASSWORD_RESET': { bg: 'bg-amber-500/10 dark:bg-amber-500/15', text: 'text-amber-700 dark:text-amber-400', dot: 'bg-amber-500', icon: 'from-amber-400 to-orange-500', shadow: 'shadow-amber-500/20' },
  'ACCOUNT_STATUS_CHANGED': { bg: 'bg-yellow-500/10 dark:bg-yellow-500/15', text: 'text-yellow-700 dark:text-yellow-400', dot: 'bg-yellow-500', icon: 'from-yellow-400 to-amber-500', shadow: 'shadow-yellow-500/20' },
  'SKILL_CREATED': { bg: 'bg-cyan-500/10 dark:bg-cyan-500/15', text: 'text-cyan-700 dark:text-cyan-400', dot: 'bg-cyan-500', icon: 'from-cyan-400 to-blue-500', shadow: 'shadow-cyan-500/20' },
  'SKILL_UPDATED': { bg: 'bg-teal-500/10 dark:bg-teal-500/15', text: 'text-teal-700 dark:text-teal-400', dot: 'bg-teal-500', icon: 'from-teal-400 to-emerald-500', shadow: 'shadow-teal-500/20' },
  'SKILL_DELETED': { bg: 'bg-rose-500/10 dark:bg-rose-500/15', text: 'text-rose-700 dark:text-rose-400', dot: 'bg-rose-500', icon: 'from-rose-400 to-pink-600', shadow: 'shadow-rose-500/20' },
};
const DEFAULT_COLOR = { bg: 'bg-indigo-500/10 dark:bg-indigo-500/15', text: 'text-indigo-700 dark:text-indigo-400', dot: 'bg-indigo-500', icon: 'from-indigo-400 to-purple-500', shadow: 'shadow-indigo-500/20' };

const AdminAuditLogs = () => {
  const [auditLogs, setAuditLogs] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [filterAction, setFilterAction] = useState('');
  const [filterEntity, setFilterEntity] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uniqueFilters, setUniqueFilters] = useState({ allActions: [], allEntities: [] });

  const fetchAuditLogs = useCallback(async () => {
    try {
      setLoading(true); setError(null);
      if (filterAction) {
        const r = await adminService.getAuditLogsByAction(filterAction);
        setAuditLogs(Array.isArray(r) ? r : []); setTotalPages(1);
      } else if (filterEntity) {
        const r = await adminService.getAuditLogsByEntityType(filterEntity);
        setAuditLogs(Array.isArray(r) ? r : []); setTotalPages(1);
      } else {
        const r = await adminService.getAuditLogs(page, 100);
        setAuditLogs(r?.content || []); setTotalPages(r?.totalPages || 1);
      }
    } catch (e) { setError(e.response?.data?.message || 'Failed to fetch audit logs'); setAuditLogs([]); }
    finally { setLoading(false); }
  }, [page, filterAction, filterEntity]);

  useEffect(() => { fetchAuditLogs(); }, [fetchAuditLogs]);

  useEffect(() => {
    (async () => {
      try {
        const r = await adminService.getAuditLogs(0, 1000);
        const logs = r?.content || [];
        setUniqueFilters({
          allActions: [...new Set(logs.map(l => l.action))].sort(),
          allEntities: [...new Set(logs.map(l => l.entityType))].sort(),
        });
      } catch {}
    })();
  }, []);

  const handleDownloadCSV = () => {
    if (!auditLogs.length) return;
    const rows = [['ID', 'User', 'Action', 'Entity Type', 'Entity ID', 'Date'],
      ...auditLogs.map(l => [l.id, l.userName, l.action, l.entityType, l.entityId, new Date(l.createdAt).toLocaleString()])];
    const blob = new Blob([rows.map(r => r.join(',')).join('\n')], { type: 'text/csv' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
    a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`; a.click();
  };

  const hasFilters = filterAction || filterEntity;

  return (
    <div className="space-y-8 relative z-10 w-full max-w-[100vw] overflow-x-hidden p-4 sm:p-0">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 relative z-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/60 dark:bg-white/5 border border-gray-200/50 dark:border-white/10 backdrop-blur-md mb-4 shadow-sm">
            <Eye className="w-4 h-4 text-emerald-500" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-600 dark:text-gray-300">Global Overseer Node</span>
          </div>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
            System Telemetry <Activity className="w-6 h-6 text-indigo-500" />
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">
            Immutable ledger of all platform security and state modifications.
          </p>
        </div>
        <button onClick={handleDownloadCSV} disabled={!auditLogs.length}
          className="group relative flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/80 dark:bg-[#181825]/80 border border-gray-200/50 dark:border-white/10 backdrop-blur-md text-sm font-bold text-gray-700 dark:text-white shadow-sm hover:shadow-emerald-500/20 hover:border-emerald-500/30 transition-all disabled:opacity-50 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <Download className="relative z-10 w-4 h-4 text-emerald-500 group-hover:-translate-y-1 transition-transform" /> 
          <span className="relative z-10">Extract Ledger (CSV)</span>
        </button>
      </div>

      {/* Cyber-Filters */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-[2rem] blur-xl opacity-50 group-hover:opacity-100 transition-opacity pointer-events-none" />
        <div className="relative bg-white/60 dark:bg-[#181825]/60 backdrop-blur-xl rounded-[2rem] border border-white/50 dark:border-white/10 p-6 shadow-xl">
            <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                <Search className="w-4 h-4 text-indigo-500" /> Parameter Filtration
            </h3>
            {hasFilters && (
                <button onClick={() => { setFilterAction(''); setFilterEntity(''); setPage(0); }}
                className="flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 hover:text-rose-700 transition-colors uppercase tracking-widest bg-rose-500/10 px-3 py-1.5 rounded-lg border border-rose-500/20">
                <X className="w-3 h-3" /> Clear Parameters
                </button>
            )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative group/select">
                <div className="absolute inset-0 bg-indigo-500/10 rounded-2xl blur opacity-0 group-focus-within/select:opacity-100 transition-opacity pointer-events-none" />
                <div className="relative flex items-center bg-white dark:bg-[#1e1e2e] rounded-2xl border border-gray-200/50 dark:border-white/5 focus-within:border-indigo-500/50 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                    <select value={filterAction} onChange={(e) => { setFilterAction(e.target.value); setPage(0); }}
                    className="w-full px-4 py-3.5 bg-transparent text-sm font-bold text-gray-900 dark:text-white focus:outline-none appearance-none cursor-pointer">
                    <option value="" className="bg-white dark:bg-[#1e1e2e]">All Vector Types</option>
                    {uniqueFilters.allActions.map(a => <option key={a} value={a} className="bg-white dark:bg-[#1e1e2e]">{a.replace(/_/g, ' ')}</option>)}
                    </select>
                </div>
                <div className="absolute -top-3 left-4 bg-[#f8fafc] dark:bg-[#181825] px-2 text-[10px] font-black uppercase tracking-widest text-indigo-500">Vector Action</div>
            </div>
            <div className="relative group/select">
                <div className="absolute inset-0 bg-purple-500/10 rounded-2xl blur opacity-0 group-focus-within/select:opacity-100 transition-opacity pointer-events-none" />
                <div className="relative flex items-center bg-white dark:bg-[#1e1e2e] rounded-2xl border border-gray-200/50 dark:border-white/5 focus-within:border-purple-500/50 focus-within:ring-2 focus-within:ring-purple-500/20 transition-all">
                    <select value={filterEntity} onChange={(e) => { setFilterEntity(e.target.value); setPage(0); }}
                    className="w-full px-4 py-3.5 bg-transparent text-sm font-bold text-gray-900 dark:text-white focus:outline-none appearance-none cursor-pointer">
                    <option value="" className="bg-white dark:bg-[#1e1e2e]">All Object Classes</option>
                    {uniqueFilters.allEntities.map(e => <option key={e} value={e} className="bg-white dark:bg-[#1e1e2e]">{e}</option>)}
                    </select>
                </div>
                <div className="absolute -top-3 left-4 bg-[#f8fafc] dark:bg-[#181825] px-2 text-[10px] font-black uppercase tracking-widest text-purple-500">Target Object</div>
            </div>
            </div>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-5 bg-rose-50/80 dark:bg-rose-500/10 backdrop-blur-md border border-rose-200/50 dark:border-rose-500/20 rounded-[2rem] shadow-sm animate-shake">
          <div className="w-1.5 h-10 bg-rose-500 rounded-full animate-pulse" />
          <p className="text-sm font-black text-rose-800 dark:text-rose-300 uppercase tracking-wider">{error}</p>
        </div>
      )}

      {/* Futuristic Log Entries Table */}
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
                    <p className="text-lg font-black text-gray-900 dark:text-white mb-1">Accessing Ledger</p>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Decrypting audit logs...</p>
                </div>
            </div>
        ) : auditLogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-24">
            <div className="relative w-24 h-24 mb-6">
                <div className="absolute inset-0 bg-gray-500/10 rounded-full blur-xl animate-pulse" />
                <div className="relative w-full h-full bg-white dark:bg-white/5 rounded-3xl flex items-center justify-center border border-gray-200/50 dark:border-white/10 shadow-inner">
                    <Database className="w-12 h-12 text-gray-300 dark:text-gray-500" />
                </div>
            </div>
            <p className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Ledger Empty</p>
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mt-2 max-w-sm">No telemetry records match current temporal parameters.</p>
          </div>
        ) : (
          <>
            <div className="px-6 py-4 flex items-center justify-between border-b border-gray-200/50 dark:border-white/5 bg-gray-50/50 dark:bg-white/5">
                <p className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                    Showing <span className="text-indigo-500 text-xs px-1">{auditLogs.length}</span> {hasFilters ? 'filtered ' : ''}records
                </p>
            </div>

            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse min-w-[800px] sm:min-w-full">
                <thead>
                  <tr className="bg-transparent border-b border-gray-200/50 dark:border-white/5">
                    {['Vector Identity', 'Action Type', 'Target Object', 'Object Hash', 'Timestamp'].map(h => (
                      <th key={h} className="px-6 py-5 text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100/50 dark:divide-white/5">
                  {auditLogs.map(log => {
                    const c = ACTION_COLORS[log.action] || DEFAULT_COLOR;
                    return (
                      <tr key={log.id} className="hover:bg-gray-50/80 dark:hover:bg-white/5 transition-all duration-300 group cursor-default relative overflow-hidden">
                        
                        <td className="px-6 py-4 pl-8 relative">
                            <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${c.icon} opacity-0 group-hover:opacity-100 transition-opacity`} />
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-white/10 flex items-center justify-center text-xs font-black text-gray-600 dark:text-gray-300 shadow-inner">
                                    {log.userName?.[0]?.toUpperCase() ?? '?'}
                                </div>
                                <span className="text-sm font-black text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{log.userName}</span>
                            </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-black/5 dark:border-white/5 text-[10px] font-black uppercase tracking-widest ${c.bg} ${c.text} shadow-sm group-hover:${c.shadow} transition-all`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${c.dot} animate-pulse`} />
                            {log.action.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                            <div className="inline-flex items-center gap-1.5 bg-gray-100 dark:bg-white/5 px-2.5 py-1 rounded-lg border border-transparent group-hover:border-gray-200 dark:group-hover:border-white/10 transition-colors">
                                <Database className="w-3 h-3 text-gray-400" />
                                <span className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">{log.entityType}</span>
                            </div>
                        </td>
                        <td className="px-6 py-4">
                            <span className="text-[11px] font-mono font-bold text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-black/30 px-2 py-0.5 rounded border border-gray-100 dark:border-white/5">
                                #{log.entityId}
                            </span>
                        </td>
                        <td className="px-6 py-4">
                            <div className="flex flex-col">
                                <span className="text-xs font-bold text-gray-900 dark:text-white">{new Date(log.createdAt).toLocaleDateString()}</span>
                                <span className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 tracking-wider">{new Date(log.createdAt).toLocaleTimeString()}</span>
                            </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Cinematic Pagination */}
            {totalPages > 1 && !hasFilters && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-8 py-5 border-t border-white/50 dark:border-white/10 bg-gray-50/50 dark:bg-black/20">
                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                Sector <span className="text-gray-900 dark:text-white">{page + 1}</span> of <span className="text-gray-900 dark:text-white">{totalPages}</span>
                </p>
                <div className="flex items-center gap-2 bg-white dark:bg-[#1e1e2e] p-1.5 rounded-2xl border border-gray-200/50 dark:border-white/10 shadow-sm">
                <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
                    className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white disabled:opacity-30 disabled:hover:bg-transparent transition-all shadow-sm border border-transparent hover:border-gray-200 dark:hover:border-white/10">
                    <ChevronLeft className="w-5 h-5" />
                </button>
                    
                <div className="px-4">
                    <div className="w-8 h-1 rounded-full bg-indigo-500/20 overflow-hidden">
                        <div className="h-full bg-indigo-500 transition-all duration-500" style={{ width: `${((page + 1) / totalPages) * 100}%` }} />
                    </div>
                </div>

                <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}
                    className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white disabled:opacity-30 disabled:hover:bg-transparent transition-all shadow-sm border border-transparent hover:border-gray-200 dark:hover:border-white/10">
                    <ChevronRight className="w-5 h-5" />
                </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      <style>{`
          @keyframes animate-shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(5px); } 75% { transform: translateX(-5px); } }
          .animate-shake { animation: animate-shake 0.4s ease-in-out; }
      `}</style>
    </div>
  );
};

export default AdminAuditLogs;