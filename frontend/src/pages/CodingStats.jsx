import { useState, useEffect, useCallback } from 'react';
import {
  Github, Trophy, Star, GitFork, Settings2, Link2, Check, AlertCircle,
  Loader2, ExternalLink, Award, Users, BarChart3, X, RefreshCw,
  Zap, Target, BookOpen, ChevronRight, Activity
} from 'lucide-react';
import api from '../services/api';

const PLATFORMS = [
  { key: 'leetcodeUsername', label: 'LeetCode', icon: '🟡', color: '#FFA116', bg: 'from-amber-500 to-orange-500', link: (u) => `https://leetcode.com/u/${u}` },
  { key: 'codeforcesUsername', label: 'Codeforces', icon: '🔵', color: '#1890FF', bg: 'from-blue-500 to-cyan-500', link: (u) => `https://codeforces.com/profile/${u}` },
  { key: 'githubUsername', label: 'GitHub', icon: '⚫', color: '#333', bg: 'from-gray-700 to-gray-900', link: (u) => `https://github.com/${u}` },
  { key: 'hackerrankUsername', label: 'HackerRank', icon: '💚', color: '#00EA64', bg: 'from-emerald-500 to-green-400', link: (u) => `https://www.hackerrank.com/profile/${u}` },
];

const fetchLeetCodeStats = async (username) => {
  if (!username) return null;
  try {
    const response = await api.get(`/coding-profile/stats/leetcode/${username}`);
    return response.data?.data || null;
  } catch (e) {
    console.error('LeetCode Error:', e.message);
    return null;
  }
};

const fetchCodeforcesStats = async (username) => {
  if (!username) return null;
  try {
    const response = await api.get(`/coding-profile/stats/codeforces/${username}`);
    return response.data?.data || null;
  } catch (e) {
    console.error('Codeforces Error:', e.message);
    return null;
  }
};

const fetchGitHubStats = async (username) => {
  if (!username) return null;
  try {
    const response = await api.get(`/coding-profile/stats/github/${username}`);
    return response.data?.data || null;
  } catch (e) {
    console.error('GitHub Error:', e.message);
    return null;
  }
};

const fetchHackerRankStats = async (username) => {
  if (!username) return null;
  return { platform: 'hackerrank', username, linked: true };
};

const ProblemSolvedCard = ({ total, label, icon, bgGradient, shadowColor, rings }) => (
  <div className={`relative overflow-hidden rounded-3xl p-6 bg-gradient-to-br ${bgGradient} text-white shadow-xl hover:-translate-y-1 transition-transform duration-300`} style={{ boxShadow: `0 10px 25px -5px ${shadowColor}` }}>
    <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/10 -mr-12 -mt-12 blur-2xl" />
    <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-black/10 -ml-10 -mb-10 blur-xl" />
    <div className="relative z-10">
      <div className="flex items-center gap-2 mb-3 text-white/90 text-sm font-bold tracking-wide uppercase">
        <span className="text-xl drop-shadow-md">{icon}</span> {label}
      </div>
      <p className="text-5xl font-black mb-1 drop-shadow-lg">{total}</p>
      <p className="text-sm text-white/80 font-medium mb-6">Problems Solved</p>
      
      {rings && (
        <div className="grid grid-cols-3 gap-2">
          {rings.map((r, i) => (
            <div key={i} className="flex flex-col items-center bg-black/10 rounded-2xl p-2.5 backdrop-blur-sm border border-white/5">
              <div className="relative w-12 h-12 mb-1.5">
                <svg width="48" height="48" className="-rotate-90">
                  <circle cx="24" cy="24" r="20" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
                  <circle cx="24" cy="24" r="20" fill="none" stroke={r.color} strokeWidth="4" strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 20} strokeDashoffset={2 * Math.PI * 20 - (r.total > 0 ? (r.solved / r.total) : 0) * 2 * Math.PI * 20} 
                    className="drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">{r.solved}</span>
              </div>
              <p className="text-[10px] font-bold text-white/70 uppercase tracking-wider">{r.label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);

const ContributionHeatmap = ({ allStats }) => {
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - 182); // 6 months

  const merged = {};
  allStats.forEach((stat) => {
    if (!stat) return;
    if (stat.submissionCalendar) {
      Object.entries(stat.submissionCalendar).forEach(([ts, count]) => {
        const d = new Date(parseInt(ts) * 1000).toISOString().split('T')[0];
        merged[d] = (merged[d] || 0) + count;
      });
    }
    if (stat.calendar) {
      Object.entries(stat.calendar).forEach(([d, count]) => {
        merged[d] = (merged[d] || 0) + count;
      });
    }
  });

  const maxCount = Math.max(1, ...Object.values(merged));
  
  const align = new Date(startDate);
  align.setDate(align.getDate() - align.getDay());
  const weeks = [];
  let curW = new Date(align);
  while (curW <= today) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      const dateStr = curW.toISOString().split('T')[0];
      const count = merged[dateStr] || 0;
      week.push({ date: dateStr, count, before: curW < startDate, future: curW > today });
      curW.setDate(curW.getDate() + 1);
    }
    weeks.push(week);
  }

  const getColor = (count) => {
    if (count === 0) return 'bg-gray-100 dark:bg-[#1e1e2e] border border-gray-200/50 dark:border-white/5';
    const i = count / maxCount;
    if (i <= 0.25) return 'bg-emerald-300 dark:bg-emerald-900/60 border border-emerald-400 dark:border-emerald-800 shadow-[0_0_8px_rgba(52,211,153,0.3)] dark:shadow-[0_0_8px_rgba(6,78,59,0.5)]';
    if (i <= 0.5) return 'bg-emerald-400 dark:bg-emerald-700/80 border border-emerald-500 dark:border-emerald-600 shadow-[0_0_10px_rgba(52,211,153,0.4)] dark:shadow-[0_0_10px_rgba(4,120,87,0.5)]';
    if (i <= 0.75) return 'bg-emerald-500 border border-emerald-600 shadow-[0_0_12px_rgba(16,185,129,0.5)]';
    return 'bg-emerald-600 dark:bg-emerald-400 border border-emerald-700 dark:border-emerald-300 shadow-[0_0_15px_rgba(5,150,105,0.6)] dark:shadow-[0_0_15px_rgba(52,211,153,0.6)]';
  };

  const totalContributions = Object.values(merged).reduce((s, c) => s + c, 0);
  const [tooltip, setTooltip] = useState(null);

  const months = [];
  let lastMonth = -1;
  weeks.forEach((week, i) => {
    const m = new Date(week[3]?.date || week[0].date).getMonth();
    if (m !== lastMonth) {
      months.push({ index: i, label: new Date(week[3]?.date || week[0].date).toLocaleString('default', { month: 'short' }) });
      lastMonth = m;
    }
  });

  const cellSize = Math.max(12, Math.floor((typeof window !== 'undefined' ? Math.min(window.innerWidth - 200, 900) : 700) / (weeks.length + 2)));
  const gap = Math.max(3, Math.floor(cellSize * 0.25));

  return (
    <div className="bg-white dark:bg-[#181825] rounded-3xl border border-gray-200/50 dark:border-white/5 p-6 sm:p-8 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Activity className="w-6 h-6" />
            </div>
            <div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white">Activity Matrix</h3>
                <p className="text-sm font-bold text-gray-500 dark:text-gray-400"><span className="text-emerald-600 dark:text-emerald-400">{totalContributions}</span> total actions in 6 months</p>
            </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-[#1e1e2e] px-3 py-2 rounded-xl border border-gray-200/50 dark:border-white/5">
          <span>Less</span>
          <div className="w-3.5 h-3.5 rounded-sm bg-gray-100 dark:bg-[#1e1e2e] border border-gray-200/50 dark:border-white/5" />
          <div className="w-3.5 h-3.5 rounded-sm bg-emerald-300 dark:bg-emerald-900/60" />
          <div className="w-3.5 h-3.5 rounded-sm bg-emerald-400 dark:bg-emerald-700/80" />
          <div className="w-3.5 h-3.5 rounded-sm bg-emerald-500" />
          <div className="w-3.5 h-3.5 rounded-sm bg-emerald-600 dark:bg-emerald-400" />
          <span>More</span>
        </div>
      </div>
      <div className="relative overflow-x-auto pb-4 custom-scrollbar">
        <div className="flex ml-8 mb-2" style={{ gap: `${gap}px` }}>
          {weeks.map((_, wi) => {
            const month = months.find(m => m.index === wi);
            return (
              <div key={wi} style={{ width: `${cellSize}px`, minWidth: `${cellSize}px` }} className="text-[11px] font-bold text-gray-400 dark:text-gray-500">
                {month ? month.label : ''}
              </div>
            );
          })}
        </div>
        <div className="flex" style={{ gap: `${gap}px` }}>
          <div className="flex flex-col text-[11px] font-bold text-gray-400 dark:text-gray-500 mr-2" style={{ gap: `${gap}px` }}>
            <div style={{ height: `${cellSize}px` }} />
            <div style={{ height: `${cellSize}px` }} className="flex items-center">Mon</div>
            <div style={{ height: `${cellSize}px` }} />
            <div style={{ height: `${cellSize}px` }} className="flex items-center">Wed</div>
            <div style={{ height: `${cellSize}px` }} />
            <div style={{ height: `${cellSize}px` }} className="flex items-center">Fri</div>
            <div style={{ height: `${cellSize}px` }} />
          </div>
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col" style={{ gap: `${gap}px` }}>
              {week.map((day, di) => (
                <div
                  key={di}
                  style={{ width: `${cellSize}px`, height: `${cellSize}px` }}
                  className={`rounded-[4px] transition-all duration-300 cursor-pointer hover:scale-125 hover:z-10 ${day.before || day.future ? 'bg-transparent' : getColor(day.count)}`}
                  onMouseEnter={() => !day.before && !day.future && setTooltip({ ...day, x: wi, y: di })}
                  onMouseLeave={() => setTooltip(null)}
                />
              ))}
            </div>
          ))}
        </div>
        {tooltip && tooltip.count >= 0 && (
          <div className="absolute z-50 px-4 py-2 rounded-xl bg-gray-900/95 dark:bg-[#cdd6f4] backdrop-blur-md text-white dark:text-gray-900 text-xs font-bold shadow-2xl pointer-events-none transform -translate-x-1/2 -translate-y-full border border-white/10 dark:border-black/10 transition-opacity"
            style={{ top: tooltip.y * (cellSize + gap) + 16, left: tooltip.x * (cellSize + gap) + 48 }}>
            <span className="text-emerald-400 dark:text-emerald-600">{tooltip.count}</span> action{tooltip.count !== 1 ? 's' : ''} • {tooltip.date}
          </div>
        )}
      </div>
    </div>
  );
};

const DSATopicChart = ({ tagStats }) => {
  if (!tagStats || tagStats.length === 0) return null;
  const max = Math.max(...tagStats.map(t => t.problemsSolved));
  return (
    <div className="bg-white dark:bg-[#181825] rounded-3xl border border-gray-200/50 dark:border-white/5 p-6 sm:p-8 shadow-sm">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
            <BarChart3 className="w-6 h-6" />
        </div>
        <div>
            <h3 className="text-xl font-black text-gray-900 dark:text-white">Pattern Analysis</h3>
            <p className="text-sm font-bold text-gray-500 dark:text-gray-400">DSA breakdown by frequency</p>
        </div>
      </div>
      <div className="space-y-4">
        {tagStats.map((tag, i) => (
          <div key={i} className="flex items-center gap-4 group">
            <span className="text-sm font-bold text-gray-700 dark:text-gray-300 w-32 truncate group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors" title={tag.tagName}>{tag.tagName}</span>
            <div className="flex-1 h-6 bg-gray-100 dark:bg-[#1e1e2e] rounded-full overflow-hidden relative shadow-inner">
              <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-1000 flex items-center justify-end pr-3 relative shadow-[0_0_10px_rgba(139,92,246,0.3)]"
                style={{ width: `${max > 0 ? Math.max((tag.problemsSolved / max) * 100, 10) : 0}%` }}>
                <div className="absolute inset-0 bg-white/20 w-full animate-pulse blur-sm" />
                <span className="text-[11px] font-black text-white relative z-10">{tag.problemsSolved}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const LeetCodeCard = ({ data }) => {
  if (!data || (!data.totalSolved && data.totalSolved !== 0)) return null;
  return (
    <ProblemSolvedCard total={data.totalSolved} label="LeetCode" icon="🟡" bgGradient="from-amber-500 to-orange-600" shadowColor="rgba(245,158,11,0.4)"
      rings={[
        { label: 'Easy', solved: data.easySolved, total: data.totalEasy, color: '#34d399' },
        { label: 'Med', solved: data.mediumSolved, total: data.totalMedium, color: '#fbbf24' },
        { label: 'Hard', solved: data.hardSolved, total: data.totalHard, color: '#f87171' },
      ]}
    />
  );
};

const CodeforcesCard = ({ data }) => {
  if (!data) return null;
  return (
    <div className="relative overflow-hidden rounded-3xl p-6 bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-xl hover:-translate-y-1 transition-transform duration-300" style={{ boxShadow: '0 10px 25px -5px rgba(59,130,246,0.4)' }}>
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/10 -mr-12 -mt-12 blur-2xl" />
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-3 text-white/90 text-sm font-bold tracking-wide uppercase"><span className="text-xl drop-shadow-md">🔵</span> Codeforces</div>
        <p className="text-5xl font-black mb-1 drop-shadow-lg">{data.totalSolved}</p>
        <p className="text-sm text-white/80 font-medium mb-6">Problems Solved</p>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-black/10 rounded-2xl p-3 text-center backdrop-blur-sm border border-white/5">
            <p className="text-xl font-bold">{data.rating}</p>
            <p className="text-[10px] font-bold text-white/70 uppercase tracking-widest mt-1">Rating</p>
          </div>
          <div className="bg-black/10 rounded-2xl p-3 text-center backdrop-blur-sm border border-white/5">
            <p className="text-xl font-bold">{data.maxRating}</p>
            <p className="text-[10px] font-bold text-white/70 uppercase tracking-widest mt-1">Max Rating</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const GitHubCard = ({ data }) => {
  if (!data) return null;
  return (
    <div className="relative overflow-hidden rounded-3xl p-6 bg-gradient-to-br from-gray-800 to-black text-white shadow-xl hover:-translate-y-1 transition-transform duration-300" style={{ boxShadow: '0 10px 25px -5px rgba(0,0,0,0.4)' }}>
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/5 -mr-12 -mt-12 blur-2xl" />
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-3 text-white/90 text-sm font-bold tracking-wide uppercase"><Github className="w-5 h-5 drop-shadow-md" /> GitHub</div>
        <p className="text-5xl font-black mb-1 drop-shadow-lg">{data.publicRepos}</p>
        <p className="text-sm text-white/80 font-medium mb-6">Public Repos</p>
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-white/10 rounded-xl p-2.5 text-center backdrop-blur-sm border border-white/5">
            <Star className="w-4 h-4 mx-auto mb-1 text-amber-400" />
            <p className="text-sm font-bold">{data.totalStars}</p>
          </div>
          <div className="bg-white/10 rounded-xl p-2.5 text-center backdrop-blur-sm border border-white/5">
            <GitFork className="w-4 h-4 mx-auto mb-1 text-blue-400" />
            <p className="text-sm font-bold">{data.totalForks}</p>
          </div>
          <div className="bg-white/10 rounded-xl p-2.5 text-center backdrop-blur-sm border border-white/5">
            <Users className="w-4 h-4 mx-auto mb-1 text-emerald-400" />
            <p className="text-sm font-bold">{data.followers}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const HackerRankCard = ({ data }) => {
  if (!data) return null;
  return (
    <div className="relative overflow-hidden rounded-3xl p-6 bg-gradient-to-br from-emerald-500 to-green-500 text-white shadow-xl hover:-translate-y-1 transition-transform duration-300" style={{ boxShadow: '0 10px 25px -5px rgba(16,185,129,0.4)' }}>
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/10 -mr-12 -mt-12 blur-2xl" />
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center gap-2 mb-3 text-white/90 text-sm font-bold tracking-wide uppercase"><span className="text-xl drop-shadow-md">💚</span> HackerRank</div>
        <div className="flex-1 flex flex-col justify-center py-4">
            <p className="text-2xl font-black mb-1 drop-shadow-sm truncate">{data.username}</p>
            <p className="text-sm text-white/80 font-medium">Profile Linked Active</p>
        </div>
        <a href={`https://www.hackerrank.com/profile/${data.username}`} target="_blank" rel="noopener noreferrer"
          className="mt-auto flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-black/10 hover:bg-black/20 text-white text-sm font-bold transition-colors backdrop-blur-sm border border-white/10">
          View Profile <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
};

const TopRepos = ({ repos }) => {
  if (!repos || repos.length === 0) return null;
  return (
    <div className="bg-white dark:bg-[#181825] rounded-3xl border border-gray-200/50 dark:border-white/5 p-6 sm:p-8 shadow-sm">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-xl bg-gray-900 text-white flex items-center justify-center shrink-0 shadow-lg">
            <Github className="w-6 h-6" />
        </div>
        <div>
            <h3 className="text-xl font-black text-gray-900 dark:text-white">Star Repositories</h3>
            <p className="text-sm font-bold text-gray-500 dark:text-gray-400">Your most impactful open-source work</p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {repos.map((r, i) => (
          <a key={i} href={r.url} target="_blank" rel="noopener noreferrer"
            className="flex flex-col p-5 rounded-2xl bg-gray-50 dark:bg-[#1e1e2e] border border-gray-200/50 dark:border-white/5 hover:border-gray-900 dark:hover:border-white/20 hover:shadow-lg transition-all group">
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3 min-w-0">
                    <BookOpen className="w-5 h-5 text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors shrink-0" />
                    <p className="text-base font-bold text-gray-900 dark:text-white truncate">{r.name}</p>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-indigo-500 shrink-0" />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4 flex-1 font-medium">{r.description || 'No description provided.'}</p>
            <div className="flex items-center gap-4 mt-auto">
              {r.language && <span className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />{r.language}</span>}
              <span className="text-xs font-bold text-gray-500 flex items-center gap-1.5"><Star className="w-3.5 h-3.5" />{r.stars}</span>
              <span className="text-xs font-bold text-gray-500 flex items-center gap-1.5"><GitFork className="w-3.5 h-3.5" />{r.forks}</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

const StatsOverview = ({ leetcode, codeforces }) => {
  const items = [];
  if (leetcode?.contestRating > 0) items.push({ label: 'LC Contest Rating', value: leetcode.contestRating, icon: <Zap className="w-5 h-5" />, color: 'text-amber-500', bg: 'bg-amber-100 dark:bg-amber-500/20' });
  if (leetcode?.contestsAttended > 0) items.push({ label: 'LC Contests', value: leetcode.contestsAttended, icon: <Trophy className="w-5 h-5" />, color: 'text-orange-500', bg: 'bg-orange-100 dark:bg-orange-500/20' });
  if (codeforces?.rating > 0) items.push({ label: 'CF Rating', value: codeforces.rating, icon: <Award className="w-5 h-5" />, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-500/20' });

  let total = 0;
  [leetcode, codeforces].forEach(s => { if (s?.totalSolved) total += s.totalSolved; });

  if (items.length === 0 && total === 0) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-6 shadow-xl col-span-2 sm:col-span-1 border border-indigo-400/30">
        <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/10 blur-xl" />
        <div className="relative z-10 flex flex-col h-full justify-between">
          <Target className="w-6 h-6 text-white/80 mb-4" />
          <div>
              <p className="text-4xl font-black">{total}</p>
              <p className="text-sm font-bold text-white/80 uppercase tracking-widest mt-1">Total Solved</p>
          </div>
        </div>
      </div>
      {items.map((it, i) => (
        <div key={i} className={`rounded-3xl border border-gray-200/50 dark:border-white/5 p-6 bg-white dark:bg-[#181825] shadow-sm flex flex-col justify-between hover:border-indigo-200 dark:hover:border-indigo-500/30 transition-colors`}>
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${it.bg} ${it.color}`}>{it.icon}</div>
          <div>
              <p className="text-3xl font-black text-gray-900 dark:text-white">{it.value}</p>
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mt-1">{it.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

const PlatformModal = ({ open, onClose, profile, onSave }) => {
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      const f = {};
      PLATFORMS.forEach(p => { f[p.key] = profile[p.key] || ''; });
      setForm(f);
    }
  }, [profile]);

  const handleSave = async () => {
    setSaving(true);
    try { await onSave(form); onClose(); }
    finally { setSaving(false); }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-[#1e1e2e] rounded-3xl border border-gray-200 dark:border-white/10 w-full max-w-md p-6 sm:p-8 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black text-gray-900 dark:text-white">Link Platforms</h2>
          <button onClick={onClose} className="p-2 rounded-xl bg-gray-50 dark:bg-[#181825] hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="space-y-4">
          {PLATFORMS.map(({ key, label, icon }) => (
            <div key={key}>
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <span>{icon}</span> {label}
              </label>
              <input type="text" placeholder={`Enter ${label} username`}
                value={form[key] || ''} onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#181825] text-gray-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" />
            </div>
          ))}
        </div>
        <div className="mt-8 flex gap-3">
            <button onClick={onClose} disabled={saving} className="flex-1 py-3 rounded-xl bg-gray-50 dark:bg-[#181825] font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
                Cancel
            </button>
            <button onClick={handleSave} disabled={saving}
            className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50 flex items-center justify-center gap-2">
            {saving ? <><Loader2 className="w-5 h-5 animate-spin" /> Saving...</> : <><Check className="w-5 h-5" /> Save Links</>}
            </button>
        </div>
      </div>
    </div>
  );
};

const CodingStats = () => {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [tab, setTab] = useState('stats');
  const [leaderboard, setLeaderboard] = useState([]);
  const [leaderboardStats, setLeaderboardStats] = useState({});
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchProfile = useCallback(async () => {
    try {
      const res = await api.get('/coding-profile');
      setProfile(res.data.data);
      return res.data.data;
    } catch { return null; }
  }, []);

  const fetchAllStats = useCallback(async (p) => {
    const prof = p || profile;
    if (!prof) return;
    setRefreshing(true);
    const fetchers = {
      leetcode: fetchLeetCodeStats(prof.leetcodeUsername),
      codeforces: fetchCodeforcesStats(prof.codeforcesUsername),
      github: fetchGitHubStats(prof.githubUsername),
      hackerrank: fetchHackerRankStats(prof.hackerrankUsername),
    };
    const results = await Promise.all(Object.values(fetchers));
    const keys = Object.keys(fetchers);
    const newStats = {};
    keys.forEach((k, i) => { newStats[k] = results[i]; });
    setStats(newStats);
    setRefreshing(false);
    showToast('Stats refreshed successfully!');
  }, [profile]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const p = await fetchProfile();
      if (p) {
        const hasAny = PLATFORMS.some(pl => p[pl.key]);
        if (hasAny) await fetchAllStats(p);
      }
      setLoading(false);
    })();
  }, [fetchProfile, fetchAllStats]);

  const handleSave = async (form) => {
    try {
      const res = await api.put('/coding-profile', form);
      setProfile(res.data.data);
      showToast('Platforms linked successfully! 🎉');
      await fetchAllStats(res.data.data);
    } catch { showToast('Failed to save platforms', 'error'); }
  };

  const fetchLeaderboard = useCallback(async () => {
    setLoadingLeaderboard(true);
    try {
      const res = await api.get('/coding-profile/leaderboard');
      const entries = res.data.data || [];
      setLeaderboard(entries);
      const statsMap = {};
      const promises = entries.slice(0, 20).map(async (entry) => {
        let totalSolved = 0;

        if (entry.leetcodeUsername) {
          try {
            const r = await api.get(`/coding-profile/stats/leetcode/${entry.leetcodeUsername}`);
            if (r.data?.data?.totalSolved) {
              totalSolved += r.data.data.totalSolved;
            }
          } catch (e) { }
        }
        
        if (entry.codeforcesUsername) {
          try {
            const r = await api.get(`/coding-profile/stats/codeforces/${entry.codeforcesUsername}`);
            if (r.data?.data?.totalSolved) {
              totalSolved += r.data.data.totalSolved;
            }
          } catch (e) { }
        }

        statsMap[entry.userId] = { totalSolved };
      });
      await Promise.all(promises);
      setLeaderboardStats(statsMap);
      showToast('Leaderboard loaded!');
    } catch { showToast('Failed to load leaderboard', 'error'); }
    setLoadingLeaderboard(false);
  }, []);

  useEffect(() => {
    if (tab === 'leaderboard' && leaderboard.length === 0) fetchLeaderboard();
  }, [tab, leaderboard.length, fetchLeaderboard]);

  const hasAnyPlatform = profile && PLATFORMS.some(p => profile[p.key]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
        <p className="text-lg font-bold text-gray-500 dark:text-gray-400">Syncing Coding Profiles...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-24 right-8 z-50 px-6 py-4 rounded-2xl shadow-xl font-bold flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300 ${toast.type === 'error' ? 'bg-rose-500 text-white' : 'bg-emerald-500 text-white'}`}>
          {toast.type === 'error' ? <AlertCircle className="w-5 h-5" /> : <Check className="w-5 h-5" />}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white mb-2">Coding Stats</h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">Centralize your competitive programming & open source journey.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {hasAnyPlatform && (
            <button onClick={() => fetchAllStats()} disabled={refreshing}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-[#181825] border border-gray-200/50 dark:border-white/5 font-bold text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-200 dark:hover:border-indigo-500/30 transition-all shadow-sm disabled:opacity-50">
              <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin text-indigo-500' : ''}`} /> Sync Data
            </button>
          )}
          <button onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all shadow-lg shadow-indigo-500/30">
            <Settings2 className="w-5 h-5" /> {hasAnyPlatform ? 'Manage Accounts' : 'Link Accounts'}
          </button>
        </div>
      </div>

      {/* Modern Tabs */}
      <div className="flex p-1 bg-gray-100/80 dark:bg-white/5 rounded-2xl w-fit backdrop-blur-sm border border-gray-200/50 dark:border-white/5">
        {[
          { id: 'stats', label: 'Overview & Matrix', icon: BarChart3 },
          { id: 'leaderboard', label: 'Global Ranking', icon: Trophy },
        ].map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setTab(id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${tab === id
                ? 'bg-white dark:bg-[#1e1e2e] text-indigo-600 dark:text-indigo-400 shadow-sm border border-gray-200/50 dark:border-white/5'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}>
            <Icon className="w-5 h-5" /> {label}
          </button>
        ))}
      </div>

      {tab === 'stats' && (
        <div className="space-y-8">
          {!hasAnyPlatform ? (
            <div className="flex flex-col items-center justify-center py-24 bg-white dark:bg-[#181825] rounded-3xl border border-gray-200/50 dark:border-white/5 shadow-sm text-center px-4">
              <div className="w-24 h-24 rounded-full bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center mb-6 relative">
                  <div className="absolute inset-0 border-4 border-indigo-100 dark:border-indigo-500/20 rounded-full rounded-tr-transparent animate-spin-slow" />
                  <Link2 className="w-10 h-10 text-indigo-600 dark:text-indigo-400 relative z-10" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-3">No Platforms Linked Yet</h3>
              <p className="text-gray-500 dark:text-gray-400 font-medium text-lg max-w-md mx-auto mb-8">
                Connect your LeetCode, GitHub, HackerRank, or Codeforces accounts to see your unified activity matrix.
              </p>
              <button onClick={() => setModalOpen(true)}
                className="px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all shadow-lg shadow-indigo-500/30 flex items-center gap-2">
                Get Started <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in duration-500">
              
              {/* Linked Accounts Pills */}
              <div className="flex flex-wrap items-center gap-3">
                {PLATFORMS.filter(p => profile[p.key]).map(p => (
                  <a key={p.key} href={p.link(profile[p.key])} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-[#1e1e2e] border border-gray-200/50 dark:border-white/5 font-bold text-gray-700 dark:text-gray-300 hover:border-indigo-300 dark:hover:border-indigo-500/50 hover:shadow-md transition-all group">
                    <span className="text-lg">{p.icon}</span> 
                    <span>{p.label} <span className="opacity-50 mx-1">/</span> <span className="text-indigo-600 dark:text-indigo-400">{profile[p.key]}</span></span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all text-indigo-500" />
                  </a>
                ))}
              </div>

              {refreshing && (
                <div className="flex items-center gap-3 p-4 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 rounded-2xl text-indigo-700 dark:text-indigo-400 font-bold">
                  <div className="w-5 h-5 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" /> Fetching live data...
                </div>
              )}

              <StatsOverview leetcode={stats.leetcode} codeforces={stats.codeforces} />

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <LeetCodeCard data={stats.leetcode} />
                <CodeforcesCard data={stats.codeforces} />
                <GitHubCard data={stats.github} />
                <HackerRankCard data={stats.hackerrank} />
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                  <div className="xl:col-span-2">
                    <ContributionHeatmap allStats={Object.values(stats).filter(Boolean)} />
                  </div>
                  <div className="xl:col-span-1 border border-transparent">
                      <DSATopicChart tagStats={stats.leetcode?.tagStats} />
                  </div>
              </div>

              <TopRepos repos={stats.github?.topRepos} />
            </div>
          )}
        </div>
      )}

      {tab === 'leaderboard' && (
        <div className="bg-white dark:bg-[#181825] rounded-3xl border border-gray-200/50 dark:border-white/5 shadow-sm overflow-hidden animate-in fade-in duration-500">
          <div className="p-8 border-b border-gray-200/50 dark:border-white/5 flex items-center justify-between bg-gray-50 dark:bg-[#1e1e2e]/50">
            <div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3"><Trophy className="w-8 h-8 text-amber-500" /> Global Rankings</h3>
                <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">Based on total problems solved across LeetCode and Codeforces</p>
            </div>
          </div>
          
          {loadingLeaderboard ? (
            <div className="flex flex-col items-center py-24 gap-4">
              <div className="w-12 h-12 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
              <p className="text-lg font-bold text-gray-500 dark:text-gray-400">Compiling Leaderboard...</p>
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="flex flex-col items-center py-24 text-center px-4">
              <div className="w-20 h-20 bg-gray-100 dark:bg-[#1e1e2e] rounded-full flex items-center justify-center mb-6">
                  <Users className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Contenders Yet</p>
              <p className="text-gray-500 dark:text-gray-400 font-medium">Be the first to link your profiles and claim the #1 spot!</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-white/5">
              {[...leaderboard]
                .map((entry) => ({ ...entry, totalSolved: leaderboardStats[entry.userId]?.totalSolved || 0 }))
                .sort((a, b) => b.totalSolved - a.totalSolved)
                .map((entry, i) => {
                  const isMe = entry.userId === profile?.userId;
                  return (
                    <div key={entry.userId}
                      className={`flex flex-col sm:flex-row sm:items-center gap-6 p-6 transition-colors ${isMe ? 'bg-indigo-50/50 dark:bg-indigo-500/5 border-l-4 border-l-indigo-500' : 'hover:bg-gray-50 dark:hover:bg-[#1e1e2e]/50 border-l-4 border-l-transparent'}`}>
                      
                      <div className="flex items-center gap-6">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl shadow-sm ${
                            i === 0 ? 'bg-gradient-to-br from-yellow-300 to-amber-500 text-white shadow-amber-500/30' : 
                            i === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-white shadow-gray-500/30' : 
                            i === 2 ? 'bg-gradient-to-br from-orange-300 to-orange-600 text-white shadow-orange-500/30' : 
                            'bg-gray-100 dark:bg-[#1e1e2e] text-gray-500 dark:text-gray-400 font-black'
                        }`}>
                            {i === 0 ? <Trophy className="w-6 h-6" /> : i === 1 ? '2' : i === 2 ? '3' : i + 1}
                        </div>
                        
                        <div>
                            <div className="flex items-center gap-3 mb-1.5">
                                <p className={`text-lg font-black truncate ${isMe ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-900 dark:text-white'}`}>{entry.name}</p>
                                {isMe && <span className="px-2 py-0.5 text-[10px] font-black tracking-widest uppercase bg-indigo-600 text-white rounded-md shadow-sm">You</span>}
                            </div>
                            <div className="flex gap-2 flex-wrap">
                                {PLATFORMS.filter(p => entry[p.key]).map(p => (
                                    <span key={p.key} className="text-xs font-bold text-gray-500 dark:text-gray-400 flex items-center gap-1.5 bg-gray-100 dark:bg-white/5 px-2 py-0.5 rounded-md border border-gray-200/50 dark:border-white/5">{p.icon} {entry[p.key]}</span>
                                ))}
                            </div>
                        </div>
                      </div>

                      <div className="sm:ml-auto flex items-center gap-4 pl-[4.5rem] sm:pl-0">
                        <div className="text-right">
                            <p className="text-3xl font-black text-gray-900 dark:text-white leading-none mb-1">{entry.totalSolved}</p>
                            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Problems</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      )}

      <PlatformModal open={modalOpen} onClose={() => setModalOpen(false)} profile={profile} onSave={handleSave} />

    </div>
  );
};

export default CodingStats;