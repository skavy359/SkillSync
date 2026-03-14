import React, { useState, useEffect } from 'react';
import {
  TrendingUp, Users, Activity, Award, AlertCircle, Flame, Clock, Crown,
  ShieldCheck, ArrowUpRight, Loader2, BarChart3, Target, BookOpen,
  Sparkles, Zap, Layers
} from 'lucide-react';
import adminService from '../services/adminService';

const MetricCard = ({ title, value, icon: Icon, color, gradient, shadow }) => (
  <div className="relative group overflow-hidden rounded-[2rem] bg-white/60 dark:bg-[#181825]/60 backdrop-blur-xl border border-white/50 dark:border-white/10 p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500">
    <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full ${gradient} opacity-20 group-hover:opacity-40 blur-2xl group-hover:scale-150 transition-all duration-700 pointer-events-none`} />
    <div className="relative z-10 flex flex-col h-full justify-between">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-2xl ${gradient} flex items-center justify-center shadow-lg ${shadow} group-hover:scale-110 transition-transform duration-500`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className="bg-white/50 dark:bg-black/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/50 dark:border-white/5 flex items-center gap-1">
            <TrendingUp className={`w-3 h-3 ${color}`} />
            <span className={`text-[10px] font-bold ${color}`}>Live</span>
        </div>
      </div>
      <div>
        <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">{title}</p>
        <p className={`text-4xl font-black ${color} tracking-tight`}>{value}</p>
      </div>
    </div>
  </div>
);

const RankCard = ({ rank, name, value, label, gradient, shadow }) => (
    <div className="relative group overflow-hidden rounded-[2rem] bg-white/60 dark:bg-[#181825]/60 backdrop-blur-xl border border-white/50 dark:border-white/10 p-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-500 flex items-center gap-4">
      <div className={`absolute inset-0 ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none`} />
      <div className={`relative w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg shrink-0 ${gradient} ${shadow} group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500`}>
        {rank === 1 ? <Crown className="w-6 h-6 text-white" /> : rank === 2 ? '🥈' : rank === 3 ? '🥉' : rank}
        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white dark:bg-[#181825] rounded-full flex items-center justify-center shadow-sm">
            <span className="text-[9px] font-black text-gray-900 dark:text-white">#{rank}</span>
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-base font-black text-gray-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{name}</h4>
        <div className="flex items-center gap-2 mt-0.5">
            <p className={`text-sm font-black ${
                rank === 1 ? 'text-amber-500' : rank === 2 ? 'text-gray-500 dark:text-gray-400' : rank === 3 ? 'text-orange-500' : 'text-indigo-500'
            }`}>{value}</p>
            <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
            <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">{label}</p>
        </div>
      </div>
      <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center shrink-0 border border-gray-100 dark:border-white/5 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-500/10 transition-colors">
          <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-500" />
      </div>
    </div>
  );

const SkillPopularityBar = ({ name, count, maxCount, rank }) => {
  const pct = maxCount > 0 ? (count / maxCount) * 100 : 0;
  const colors = [
      { from: 'from-amber-400 to-orange-500', text: 'text-orange-500', bg: 'bg-orange-500/10' },
      { from: 'from-blue-400 to-indigo-500', text: 'text-indigo-500', bg: 'bg-indigo-500/10' },
      { from: 'from-emerald-400 to-green-500', text: 'text-emerald-500', bg: 'bg-emerald-500/10' },
      { from: 'from-purple-400 to-pink-500', text: 'text-purple-500', bg: 'bg-purple-500/10' },
      { from: 'from-cyan-400 to-teal-500', text: 'text-teal-500', bg: 'bg-teal-500/10' }
  ];
  const c = colors[rank % 5];
  
  return (
    <div className="flex flex-col gap-2 group p-3 rounded-2xl hover:bg-white/50 dark:hover:bg-white/5 transition-colors border border-transparent hover:border-gray-200/50 dark:hover:border-white/10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
            <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${c.from} flex items-center justify-center text-white text-xs font-black shadow-md shrink-0 group-hover:scale-110 transition-transform`}>
                {rank + 1}
            </div>
            <p className="text-sm font-black text-gray-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{name}</p>
        </div>
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${c.bg}`}>
            <Flame className={`w-3.5 h-3.5 ${c.text}`} />
            <span className={`text-[10px] font-black uppercase tracking-wider ${c.text}`}>{count} active</span>
        </div>
      </div>
      <div className="w-full bg-gray-100 dark:bg-black/30 rounded-full h-2.5 overflow-hidden border border-gray-200/50 dark:border-white/5 relative">
        <div className="absolute inset-0 bg-white/20 dark:bg-white/5 rounded-full" />
        <div className={`relative h-full rounded-full bg-gradient-to-r ${c.from} transition-all duration-1000 w-[0%] relative overflow-hidden`}
          style={{ width: `${pct}%` }}>
            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%,transparent_100%)] bg-[length:20px_20px] animate-[slide_1s_linear_infinite]" />
          </div>
      </div>
    </div>
  );
};

const AdminAnalytics = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try { setLoading(true); const r = await adminService.getEngagementMetrics(); setMetrics(r); setError(null); }
      catch (e) { setError(e.response?.data?.message || 'Failed to load metrics'); }
      finally { setLoading(false); }
    })();
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 relative z-10">
      <div className="relative">
          <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full animate-pulse" />
          <div className="w-20 h-20 bg-white/80 dark:bg-[#181825]/80 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-2xl border border-white/50 dark:border-white/10 relative z-10">
            <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
          </div>
      </div>
      <div className="text-center">
          <p className="text-xl font-black text-gray-900 dark:text-white mb-2">Compiling Telemetry</p>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Gathering platform analytics...</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 relative z-10 w-full max-w-[100vw] overflow-x-hidden p-4 sm:p-0">
      
      {/* Cinematic Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 relative z-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/60 dark:bg-white/5 border border-gray-200/50 dark:border-white/10 backdrop-blur-md mb-4 shadow-sm">
            <Activity className="w-4 h-4 text-emerald-500" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-600 dark:text-gray-300">Global Analytics Hub</span>
          </div>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
            Platform Telemetry <Sparkles className="w-6 h-6 text-indigo-500 animate-pulse" />
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium max-w-2xl">
            Real-time insights across user engagement, learning velocity, and systemic utilization.
          </p>
        </div>
      </div>

      {error && (
        <div className="relative overflow-hidden p-6 bg-rose-50/80 dark:bg-rose-500/10 backdrop-blur-md border border-rose-200/50 dark:border-rose-500/20 rounded-3xl flex items-center gap-4 shadow-sm">
          <AlertCircle className="w-6 h-6 text-rose-500 shrink-0" />
          <p className="text-sm font-bold text-rose-800 dark:text-rose-300 flex-1">{error}</p>
        </div>
      )}

      {metrics && (
        <div className="space-y-8">
          
          {/* Main Hero Metric - Session Duration */}
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-indigo-600 to-purple-800 p-8 sm:p-10 shadow-2xl shadow-indigo-500/20 group">
            <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
            <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-purple-500/30 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-[2rem] bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-xl group-hover:rotate-12 transition-transform duration-500">
                        <Clock className="w-10 h-10 text-white" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Zap className="w-4 h-4 text-amber-300" />
                            <p className="text-xs font-bold text-white/80 uppercase tracking-widest">Global Engagement Vector</p>
                        </div>
                        <p className="text-2xl sm:text-3xl font-black text-white leading-tight">Average Session Duration</p>
                    </div>
                </div>
                <div className="flex items-baseline gap-3 bg-white/10 backdrop-blur-md px-8 py-6 rounded-[2rem] border border-white/20 shadow-inner">
                    <span className="text-6xl font-black text-white tracking-tighter">{metrics.averageSessionDuration?.toFixed(1)}</span>
                    <span className="text-xl font-bold text-white/60 tracking-widest uppercase">minutes</span>
                </div>
            </div>
          </div>

          {/* User Analytics Grid */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Users className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-black text-gray-900 dark:text-white">Identity Matrix</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <MetricCard title="Total Identities" value={metrics.totalUsers} icon={Users} color="text-blue-600 dark:text-blue-400" gradient="bg-gradient-to-br from-blue-500 to-indigo-600" shadow="shadow-blue-500/30" />
              <MetricCard title="Active Nodes (30d)" value={metrics.activeUsers} icon={Activity} color="text-emerald-600 dark:text-emerald-400" gradient="bg-gradient-to-br from-emerald-500 to-green-600" shadow="shadow-emerald-500/30" />
              <MetricCard title="Dormant (30d)" value={metrics.inactiveUsers} icon={AlertCircle} color="text-rose-600 dark:text-rose-400" gradient="bg-gradient-to-br from-rose-500 to-red-600" shadow="shadow-rose-500/30" />
              <MetricCard title="Void States" value={metrics.usersWithoutActivity} icon={Clock} color="text-amber-600 dark:text-amber-400" gradient="bg-gradient-to-br from-amber-500 to-orange-500" shadow="shadow-amber-500/30" />
              <MetricCard title="Retention Index" value={`${metrics.userRetentionRate?.toFixed(1)}%`} icon={TrendingUp} color="text-purple-600 dark:text-purple-400" gradient="bg-gradient-to-br from-purple-500 to-pink-500" shadow="shadow-purple-500/30" />
            </div>
          </div>

          {/* Learning Analytics Grid */}
          <div>
            <div className="flex items-center gap-3 mb-6 mt-12">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-black text-gray-900 dark:text-white">Learning Vectors</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <MetricCard title="Acquired Skills" value={metrics.totalSkillsLearned} icon={Award} color="text-cyan-600 dark:text-cyan-400" gradient="bg-gradient-to-br from-cyan-400 to-blue-500" shadow="shadow-cyan-500/30" />
              <MetricCard title="Completed Sessions" value={metrics.totalSessionsCompleted} icon={Target} color="text-indigo-600 dark:text-indigo-400" gradient="bg-gradient-to-br from-indigo-500 to-blue-600" shadow="shadow-indigo-500/30" />
              <MetricCard title="Skills / Identity" value={metrics.averageSkillsPerUser?.toFixed(1)} icon={BarChart3} color="text-emerald-600 dark:text-emerald-400" gradient="bg-gradient-to-br from-emerald-400 to-teal-500" shadow="shadow-emerald-500/30" />
              <MetricCard title="Sessions / Identity" value={metrics.averageSessionsPerUser?.toFixed(1)} icon={Activity} color="text-violet-600 dark:text-violet-400" gradient="bg-gradient-to-br from-violet-500 to-purple-600" shadow="shadow-violet-500/30" />
              <MetricCard title="Active Categories" value={metrics.totalCategoriesUsed} icon={Layers} color="text-pink-600 dark:text-pink-400" gradient="bg-gradient-to-br from-pink-500 to-rose-500" shadow="shadow-pink-500/30" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
              
              {/* Popular Skills */}
              <div className="lg:col-span-1 bg-white/60 dark:bg-[#181825]/60 backdrop-blur-xl rounded-[2.5rem] border border-white/50 dark:border-white/10 p-6 sm:p-8 shadow-xl">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
                    <Flame className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Trending Vectors</h2>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Highest systemic adoption</p>
                  </div>
                </div>
                
                {metrics.mostPopularSkills && metrics.mostPopularSkills.length > 0 ? (
                  <div className="space-y-2">
                    {metrics.mostPopularSkills.map((skill, i) => (
                      <SkillPopularityBar key={i} name={skill.skillName} count={skill.userCount}
                        maxCount={metrics.mostPopularSkills[0]?.userCount || 1} rank={i} />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center bg-gray-50 dark:bg-white/5 rounded-2xl border border-dashed border-gray-200 dark:border-white/10">
                      <BarChart3 className="w-10 h-10 text-gray-300 dark:text-gray-600 mb-3" />
                      <p className="text-sm font-black text-gray-500 dark:text-gray-400">Insufficient telemetry</p>
                  </div>
                )}
              </div>

              {/* Leaderboards */}
              <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Top Learners */}
                  <div className="bg-white/60 dark:bg-[#181825]/60 backdrop-blur-xl rounded-[2.5rem] border border-white/50 dark:border-white/10 p-6 sm:p-8 shadow-xl flex flex-col">
                      <div className="flex items-center gap-4 mb-8">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                              <Crown className="w-6 h-6 text-white" />
                          </div>
                          <div>
                              <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Top Learners</h2>
                              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">By acquired skills</p>
                          </div>
                      </div>
                      
                      {metrics.topUsers?.length > 0 ? (
                          <div className="space-y-3 flex-1">
                              {metrics.topUsers.map((user, i) => (
                                  <RankCard 
                                      key={i} rank={i+1} name={user.userName} value={user.skillCount} label="Skills verified"
                                      gradient={i === 0 ? 'bg-gradient-to-br from-amber-400 to-yellow-500' : 'bg-gradient-to-br from-gray-700 to-gray-800'}
                                      shadow={i === 0 ? 'shadow-amber-500/40' : 'shadow-gray-500/20'}
                                  />
                              ))}
                          </div>
                      ) : (
                          <div className="flex-1 flex flex-col items-center justify-center py-12 text-center bg-gray-50 dark:bg-white/5 rounded-2xl border border-dashed border-gray-200 dark:border-white/10">
                              <Users className="w-10 h-10 text-gray-300 dark:text-gray-600 mb-3" />
                              <p className="text-sm font-black text-gray-500 dark:text-gray-400">No identities logged</p>
                          </div>
                      )}
                  </div>

                  {/* Most Dedicated */}
                  <div className="bg-white/60 dark:bg-[#181825]/60 backdrop-blur-xl rounded-[2.5rem] border border-white/50 dark:border-white/10 p-6 sm:p-8 shadow-xl flex flex-col">
                      <div className="flex items-center gap-4 mb-8">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                              <Activity className="w-6 h-6 text-white" />
                          </div>
                          <div>
                              <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Most Dedicated</h2>
                              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">By global hours logged</p>
                          </div>
                      </div>
                      
                      {metrics.topUsersBySessionMinutes?.length > 0 ? (
                          <div className="space-y-3 flex-1">
                              {metrics.topUsersBySessionMinutes.map((user, i) => (
                                  <RankCard 
                                      key={i} rank={i+1} name={user.userName} value={user.totalSessionMinutes} label="Minutes logged"
                                      gradient={i === 0 ? 'bg-gradient-to-br from-emerald-400 to-green-500' : 'bg-gradient-to-br from-gray-700 to-gray-800'}
                                      shadow={i === 0 ? 'shadow-emerald-500/40' : 'shadow-gray-500/20'}
                                  />
                              ))}
                          </div>
                      ) : (
                          <div className="flex-1 flex flex-col items-center justify-center py-12 text-center bg-gray-50 dark:bg-white/5 rounded-2xl border border-dashed border-gray-200 dark:border-white/10">
                              <Clock className="w-10 h-10 text-gray-300 dark:text-gray-600 mb-3" />
                              <p className="text-sm font-black text-gray-500 dark:text-gray-400">No session data logged</p>
                          </div>
                      )}
                  </div>

              </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default AdminAnalytics;