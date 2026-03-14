import React, { useEffect, useState, useCallback } from 'react';
import { getAdminStats, getUsers } from '../services/adminService';
import {
  Users, Layers, CalendarCheck, Activity, AlertCircle, RefreshCw,
  Clock, ShieldCheck, ArrowUpRight, Sparkles, UserPlus, FileText
} from 'lucide-react';

const formatDate = (iso) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const GradientStatCard = ({ title, value, subtitle, icon: Icon, gradient, shadowColor, delay = 0 }) => (
  <div className="relative group rounded-3xl p-6 transition-all duration-500 hover:-translate-y-2"
    style={{ animationDelay: `${delay}ms` }}>

    <div className={`absolute -inset-1 bg-gradient-to-r ${gradient} rounded-[2rem] blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none`} />
    
    <div className="absolute inset-0 bg-white/60 dark:bg-[#181825]/60 backdrop-blur-xl rounded-3xl border border-white/50 dark:border-white/10 overflow-hidden shadow-xl" style={{ boxShadow: `0 20px 40px -20px ${shadowColor}` }}>
        <div className={`absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-bl ${gradient} rounded-full blur-3xl opacity-20 group-hover:opacity-50 transition-all duration-700 group-hover:scale-150`} />
    </div>

    <div className="relative z-10">
      <div className="flex items-center justify-between mb-6">
        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} p-[1px] shadow-lg`}>
            <div className="w-full h-full bg-white dark:bg-[#181825] rounded-2xl flex items-center justify-center relative overflow-hidden group-hover:bg-transparent transition-colors duration-500">
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                <Icon className="w-6 h-6 text-gray-800 dark:text-white group-hover:text-white transition-colors duration-500 relative z-10" />
            </div>
        </div>
        <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center group-hover:rotate-45 transition-transform duration-500">
            <ArrowUpRight className="w-4 h-4 text-gray-400 dark:text-gray-500 group-hover:text-indigo-500 dark:group-hover:text-white transition-colors" />
        </div>
      </div>
      <div>
        <p className="text-4xl font-black text-gray-900 dark:text-white tracking-tight drop-shadow-sm mb-1">{value}</p>
        <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">{title}</p>
        {subtitle && (
            <div className="mt-3 flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${gradient}`} />
                <p className="text-xs font-semibold text-gray-400 dark:text-gray-500">{subtitle}</p>
            </div>
        )}
      </div>
    </div>
  </div>
);

const SkeletonCard = () => (
  <div className="rounded-3xl bg-white/50 dark:bg-[#181825]/50 border border-gray-200/50 dark:border-white/5 p-6 animate-pulse">
    <div className="flex items-start justify-between">
      <div className="space-y-4 flex-1">
        <div className="h-14 w-14 bg-gray-200 dark:bg-white/10 rounded-2xl" />
        <div className="h-10 bg-gray-200 dark:bg-white/10 rounded-lg w-20" />
        <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-32" />
      </div>
    </div>
  </div>
);

const AdminDashboard = ({ onNavigate }) => {
  const [stats, setStats] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [statsLoading, setStatsLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(true);
  const [statsError, setStatsError] = useState(null);
  const [usersError, setUsersError] = useState(null);
  const [lastRefreshed, setLastRefreshed] = useState(null);

  const loadStats = useCallback(async () => {
    setStatsLoading(true); setStatsError(null);
    try { const r = await getAdminStats(); setStats(r); setLastRefreshed(new Date()); }
    catch (e) { setStatsError(e?.response?.data?.message ?? 'Failed to load stats.'); }
    finally { setStatsLoading(false); }
  }, []);

  const loadRecentUsers = useCallback(async () => {
    setUsersLoading(true); setUsersError(null);
    try { const r = await getUsers({ page: 0, size: 5 }); setRecentUsers(r?.content ?? []); }
    catch (e) { setUsersError(e?.response?.data?.message ?? 'Failed to load users.'); }
    finally { setUsersLoading(false); }
  }, []);

  useEffect(() => { loadStats(); loadRecentUsers(); }, [loadStats, loadRecentUsers]);

  const activePercent = stats && stats.totalUsers > 0 ? Math.round((stats.activeUsers / stats.totalUsers) * 100) : 0;
  const avgSkills = stats && stats.totalUsers > 0 ? (stats.totalSkills / stats.totalUsers).toFixed(1) : '—';
  const avgSessions = stats && stats.totalUsers > 0 ? (stats.totalSessions / stats.totalUsers).toFixed(1) : '—';

  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 relative z-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/60 dark:bg-white/5 border border-gray-200/50 dark:border-white/10 backdrop-blur-md mb-4 shadow-sm">
            <span className="flex w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-600 dark:text-gray-300">Live Status: Operational</span>
          </div>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
            Command Dashboard <Sparkles className="w-6 h-6 text-indigo-500 animate-pulse" />
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">Real-time telemetry and platform metrics</p>
        </div>
        <div className="flex items-center gap-4">
          {lastRefreshed && (
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest hidden sm:inline">
              Sync: {lastRefreshed.toLocaleTimeString()}
            </span>
          )}
          <button onClick={() => { loadStats(); loadRecentUsers(); }} disabled={statsLoading || usersLoading}
            className="group relative flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/80 dark:bg-[#181825]/80 border border-gray-200/50 dark:border-white/10 backdrop-blur-md text-sm font-bold text-gray-700 dark:text-white shadow-sm hover:shadow-indigo-500/20 hover:border-indigo-500/30 transition-all disabled:opacity-50 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <RefreshCw className={`relative z-10 w-4 h-4 ${statsLoading ? 'animate-spin text-indigo-500' : 'group-hover:rotate-180 transition-transform duration-500'}`} /> 
            <span className="relative z-10">Refresh Data</span>
          </button>
        </div>
      </div>

      {statsError && (
        <div className="relative overflow-hidden p-6 bg-rose-50/80 dark:bg-rose-500/10 backdrop-blur-md border border-rose-200/50 dark:border-rose-500/20 rounded-3xl flex items-center gap-4 shadow-sm">
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl" />
          <AlertCircle className="w-6 h-6 text-rose-600 dark:text-rose-400 shrink-0" />
          <p className="text-sm font-bold text-rose-800 dark:text-rose-300 flex-1">{statsError}</p>
          <button onClick={loadStats} className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors shadow-sm">Retry Connection</button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {statsLoading ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          <>
            <GradientStatCard title="Total Citizens" value={stats?.totalUsers?.toLocaleString() ?? '—'}
              subtitle="Registered accounts" icon={Users} gradient="from-indigo-400 to-indigo-600" shadowColor="rgba(99,102,241,0.2)" delay={0} />
            <GradientStatCard title="Total Skills" value={stats?.totalSkills?.toLocaleString() ?? '—'}
              subtitle="Skills distributed" icon={Layers} gradient="from-cyan-400 to-blue-500" shadowColor="rgba(6,182,212,0.2)" delay={100} />
            <GradientStatCard title="Total Sessions" value={stats?.totalSessions?.toLocaleString() ?? '—'}
              subtitle="Learning instances" icon={CalendarCheck} gradient="from-emerald-400 to-emerald-600" shadowColor="rgba(16,185,129,0.2)" delay={200} />
            <GradientStatCard title="Active Pulse" value={`${activePercent}%`}
              subtitle={`${stats?.activeUsers ?? 0} online currently`} icon={Activity} gradient="from-fuchsia-400 to-rose-500" shadowColor="rgba(244,63,94,0.2)" delay={300} />
          </>
        )}
      </div>

      {!statsLoading && stats && (
        <div className="relative rounded-[2.5rem] p-8 border border-white/40 dark:border-white/10 bg-white/40 dark:bg-[#181825]/40 backdrop-blur-2xl shadow-xl overflow-hidden group">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-indigo-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <Activity className="w-6 h-6 text-white animate-pulse" />
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">System Telemetry</h3>
                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mt-1">Platform Utilization</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {[
              { label: 'Network Engagement', value: `${activePercent}%`, sub: `${stats.activeUsers} active endpoints`, pct: activePercent, grad: 'from-indigo-400 to-purple-500', shadow: 'shadow-indigo-500/30' },
              { label: 'Skill Density', value: avgSkills, sub: `${stats.totalSkills} nodes tracked`, pct: Math.min(parseFloat(avgSkills) * 10 || 0, 100), grad: 'from-cyan-400 to-blue-500', shadow: 'shadow-cyan-500/30' },
              { label: 'Session Velocity', value: avgSessions, sub: `${stats.totalSessions} instances logged`, pct: Math.min(parseFloat(avgSessions) * 5 || 0, 100), grad: 'from-emerald-400 to-emerald-600', shadow: 'shadow-emerald-500/30' },
            ].map((m, i) => (
              <div key={i} className="flex flex-col">
                <div className="flex items-end justify-between mb-4">
                  <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">{m.label}</span>
                  <span className="text-2xl font-black text-gray-900 dark:text-white">{m.value}</span>
                </div>
                <div className="w-full bg-gray-200/50 dark:bg-black/40 rounded-full h-3 overflow-hidden shadow-inner relative">
                  <div className={`absolute top-0 left-0 h-full rounded-full bg-gradient-to-r ${m.grad} ${m.shadow} shadow-lg transition-all duration-1000 ease-out relative`} style={{ width: `${m.pct}%` }}>
                      <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite] -skew-x-12 translate-x-[-100%]" />
                  </div>
                </div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-3">{m.sub}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6 px-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
              <UserPlus className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Recent Registrations</h3>
              <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mt-0.5">Latest network nodes</p>
            </div>
          </div>
          <button onClick={() => onNavigate && onNavigate('admin/users')}
            className="group flex items-center gap-2 px-4 py-2 bg-white/50 dark:bg-white/5 border border-gray-200/50 dark:border-white/10 rounded-xl text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-white/10 transition-all shadow-sm">
            View Directory <ArrowUpRight className="w-3.5 h-3.5 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {usersError && (
          <div className="flex items-center gap-3 p-4 bg-rose-50/80 dark:bg-rose-500/10 border border-rose-200/50 dark:border-rose-500/20 rounded-2xl mb-4 backdrop-blur-sm">
            <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
            <p className="text-sm font-bold text-rose-800 dark:text-rose-300 flex-1">{usersError}</p>
            <button onClick={loadRecentUsers} className="text-xs font-bold text-rose-600 uppercase hover:underline">Retry Data Fetch</button>
          </div>
        )}

        {usersLoading && !usersError && (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-6 py-5 bg-white/40 dark:bg-[#181825]/40 backdrop-blur-md rounded-2xl border border-white/40 dark:border-white/5 animate-pulse">
                <div className="w-12 h-12 bg-gray-200 dark:bg-white/10 rounded-full shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-48" />
                  <div className="h-3 bg-gray-200 dark:bg-white/10 rounded w-64" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!usersLoading && !usersError && recentUsers.length === 0 && (
          <div className="rounded-[2.5rem] border border-dashed border-gray-300 dark:border-white/20 bg-white/30 dark:bg-black/10 backdrop-blur-sm p-16 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gray-200 dark:border-white/10 shadow-inner">
              <FileText className="w-8 h-8 text-gray-400 dark:text-gray-600" />
            </div>
            <p className="text-lg font-black text-gray-900 dark:text-white">No nodes detected</p>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-2">Awaiting new registrations to populate the directory.</p>
          </div>
        )}

        {!usersLoading && !usersError && recentUsers.length > 0 && (
          <div className="space-y-3">
            {recentUsers.map((user, i) => (
              <div key={user.id} onClick={() => onNavigate && onNavigate('admin/users')}
                className="group relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-5 bg-white/60 dark:bg-[#181825]/60 backdrop-blur-xl border border-white/50 dark:border-white/10 rounded-2xl hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] hover:-translate-y-1 hover:border-indigo-200 dark:hover:border-indigo-500/30 transition-all duration-300 cursor-pointer overflow-hidden" style={{ animationDelay: `${i * 100}ms` }}>
                
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/0 to-indigo-500/5 dark:to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="flex items-center gap-4 relative z-10">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full blur group-hover:blur-md transition-all opacity-40 group-hover:opacity-60" />
                    <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-lg font-black shadow-lg border-2 border-white dark:border-[#181825]">
                        {user.name?.[0]?.toUpperCase() ?? '?'}
                    </div>
                    {user.role === 'ADMIN' && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-rose-500 border-2 border-white dark:border-[#181825] flex items-center justify-center shadow-sm">
                            <ShieldCheck className="w-2.5 h-2.5 text-white" />
                        </div>
                    )}
                  </div>
                  <div>
                    <h4 className="text-base font-black text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{user.name}</h4>
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 truncate max-w-[200px] sm:max-w-none">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 sm:gap-8 relative z-10 ml-16 sm:ml-0">
                  <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center border border-indigo-100 dark:border-indigo-500/20">
                          <Layers className="w-4 h-4 text-indigo-500" />
                      </div>
                      <div>
                          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest hidden sm:block">Skills</p>
                          <p className="text-sm font-black text-gray-900 dark:text-white leading-none mt-0.5">{user.totalSkills ?? 0}</p>
                      </div>
                  </div>
                  <div className="w-px h-8 bg-gray-200 dark:bg-white/10 hidden sm:block" />
                  <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center border border-emerald-100 dark:border-emerald-500/20">
                          <Clock className="w-4 h-4 text-emerald-500" />
                      </div>
                      <div>
                          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest hidden sm:block">Sessions</p>
                          <p className="text-sm font-black text-gray-900 dark:text-white leading-none mt-0.5">{user.totalSessions ?? 0}</p>
                      </div>
                  </div>
                  
                  <div className="hidden md:flex flex-col items-end">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Initialization</span>
                      <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">{formatDate(user.createdAt)}</span>
                  </div>
                  
                  <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center group-hover:bg-indigo-50 dark:group-hover:bg-indigo-500/20 transition-colors hidden sm:flex">
                      <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-500 transition-colors" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <style>{`
          @keyframes fade-in {
              from { opacity: 0; transform: translateY(10px); }
              to { opacity: 1; transform: translateY(0); }
          }
      `}</style>
    </div>
  );
};

export default AdminDashboard;