import { useState, useEffect, useCallback } from 'react';
import {
  Code2, Github, Trophy, Star, GitFork, Settings2, Link2, Check, AlertCircle,
  Loader2, ExternalLink, Award, TrendingUp, Users, BarChart3, X, RefreshCw,
  Flame, Zap, Target, BookOpen, ChevronRight
} from 'lucide-react';
import api from '../services/api';

/* ═══════════════════════════════════════════
   PLATFORM CONFIGS
   ═══════════════════════════════════════════ */
const PLATFORMS = [
  { key: 'leetcodeUsername', label: 'LeetCode', icon: '🟡', color: '#FFA116', bg: 'from-amber-500 to-orange-500', link: (u) => `https://leetcode.com/u/${u}` },
  { key: 'codeforcesUsername', label: 'Codeforces', icon: '🔵', color: '#1890FF', bg: 'from-blue-500 to-cyan-500', link: (u) => `https://codeforces.com/profile/${u}` },
  { key: 'githubUsername', label: 'GitHub', icon: '⚫', color: '#333', bg: 'from-gray-700 to-gray-900', link: (u) => `https://github.com/${u}` },
  { key: 'hackerrankUsername', label: 'HackerRank', icon: '💚', color: '#00EA64', bg: 'from-emerald-500 to-green-400', link: (u) => `https://www.hackerrank.com/profile/${u}` },
];

/* ═══════════════════════════════════════════
   API FETCHERS (Now proxied through backend)
   ═══════════════════════════════════════════ */
const fetchLeetCodeStats = async (username) => {
  if (!username) return null;
  try {
    const response = await api.get(`/coding-profile/stats/leetcode/${username}`);
    if (response.data?.data) {
      console.log('LeetCode stats from backend:', response.data.data);
      return response.data.data;
    }
    return null;
  } catch (e) {
    console.error('Error fetching LeetCode stats from backend:', e.message);
    return null;
  }
};

const fetchCodeforcesStats = async (username) => {
  if (!username) return null;
  try {
    const response = await api.get(`/coding-profile/stats/codeforces/${username}`);
    if (response.data?.data) {
      console.log('Codeforces stats from backend:', response.data.data);
      return response.data.data;
    }
    return null;
  } catch (e) {
    console.error('Error fetching Codeforces stats from backend:', e.message);
    return null;
  }
};

const fetchGitHubStats = async (username) => {
  if (!username) return null;
  try {
    const response = await api.get(`/coding-profile/stats/github/${username}`);
    if (response.data?.data) {
      console.log('GitHub stats from backend:', response.data.data);
      return response.data.data;
    }
    return null;
  } catch (e) {
    console.error('Error fetching GitHub stats from backend:', e.message);
    return null;
  }
};


const fetchHackerRankStats = async (username) => {
  if (!username) return null;
  // HackerRank doesn't have a CORS-friendly public API
  // We return a placeholder with the linked username
  return { platform: 'hackerrank', username, linked: true };
};

/* ═══════════════════════════════════════════
   MINI RING CHART
   ═══════════════════════════════════════════ */
const RingChart = ({ value, max, color, size = 80, label }) => {
  const pct = max > 0 ? (value / max) * 100 : 0;
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" className="text-gray-100 dark:text-[#313244]" strokeWidth="6" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="6" strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={offset} className="transition-all duration-700" />
      </svg>
      <p className="text-xs font-medium text-gray-500 dark:text-[#a6adc8] mt-1">{label}</p>
    </div>
  );
};

/* ═══════════════════════════════════════════
   PROBLEM SOLVED CARD (visually appealing)
   ═══════════════════════════════════════════ */
const ProblemSolvedCard = ({ total, label, icon, gradient, rings }) => (
  <div className={`relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br ${gradient} text-white shadow-lg`}>
    <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-white/10 -mr-8 -mt-8" />
    <div className="absolute bottom-0 left-0 w-16 h-16 rounded-full bg-white/5 -ml-6 -mb-6" />
    <div className="relative">
      <div className="flex items-center gap-2 mb-2 text-white/80 text-sm font-medium">
        <span className="text-xl">{icon}</span> {label}
      </div>
      <p className="text-4xl font-extrabold mb-1">{total}</p>
      <p className="text-xs text-white/70">Problems Solved</p>
      {rings && (
        <div className="flex gap-3 mt-3">
          {rings.map((r, i) => (
            <div key={i} className="text-center">
              <div className="relative w-11 h-11">
                <svg width="44" height="44" className="-rotate-90">
                  <circle cx="22" cy="22" r="18" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="4" />
                  <circle cx="22" cy="22" r="18" fill="none" stroke={r.color} strokeWidth="4" strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 18} strokeDashoffset={2 * Math.PI * 18 - (r.total > 0 ? (r.solved / r.total) : 0) * 2 * Math.PI * 18} />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold">{r.solved}</span>
              </div>
              <p className="text-[9px] text-white/60 mt-0.5">{r.label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);

/* ═══════════════════════════════════════════
   HEATMAP — LAST 6 MONTHS
   ═══════════════════════════════════════════ */
const ContributionHeatmap = ({ allStats }) => {
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - 182); // ~6 months

  const merged = {};
  allStats.forEach((stat) => {
    if (!stat) return;
    // LeetCode uses unix timestamps
    if (stat.submissionCalendar) {
      Object.entries(stat.submissionCalendar).forEach(([ts, count]) => {
        const d = new Date(parseInt(ts) * 1000).toISOString().split('T')[0];
        merged[d] = (merged[d] || 0) + count;
      });
    }
    // Other platforms use date strings
    if (stat.calendar) {
      Object.entries(stat.calendar).forEach(([d, count]) => {
        merged[d] = (merged[d] || 0) + count;
      });
    }
  });

  const maxCount = Math.max(1, ...Object.values(merged));
  // Build grid
  const days = [];
  let cur = new Date(startDate);
  while (cur <= today) {
    const dateStr = cur.toISOString().split('T')[0];
    days.push({ date: dateStr, count: merged[dateStr] || 0 });
    cur.setDate(cur.getDate() + 1);
  }

  // Group by weeks
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
    if (count === 0) return 'bg-gray-100 dark:bg-[#1e1e2e] border border-gray-200 dark:border-[#313244]';
    const i = count / maxCount;
    if (i <= 0.25) return 'bg-emerald-200 dark:bg-emerald-900/60';
    if (i <= 0.5) return 'bg-emerald-400 dark:bg-emerald-700/80';
    if (i <= 0.75) return 'bg-emerald-500 dark:bg-emerald-500';
    return 'bg-emerald-600 dark:bg-emerald-400';
  };

  const totalContributions = Object.values(merged).reduce((s, c) => s + c, 0);

  // Tooltip state
  const [tooltip, setTooltip] = useState(null);

  // Month labels
  const months = [];
  let lastMonth = -1;
  weeks.forEach((week, i) => {
    const m = new Date(week[3]?.date || week[0].date).getMonth();
    if (m !== lastMonth) {
      months.push({ index: i, label: new Date(week[3]?.date || week[0].date).toLocaleString('default', { month: 'short' }) });
      lastMonth = m;
    }
  });

  // Calculate cell size to fill the container
  const cellSize = Math.max(10, Math.floor((typeof window !== 'undefined' ? Math.min(window.innerWidth - 200, 900) : 700) / (weeks.length + 2)));
  const gap = Math.max(2, Math.floor(cellSize * 0.2));

  return (
    <div className="bg-white dark:bg-[#1e1e2e] rounded-2xl border border-gray-200 dark:border-[#313244] p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-[#cdd6f4]">Contribution Heatmap</h3>
          <p className="text-sm text-gray-500 dark:text-[#a6adc8]">{totalContributions} submissions in the last 6 months</p>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-[#a6adc8]">
          Less
          <div className="w-3 h-3 rounded-sm bg-gray-100 dark:bg-[#1e1e2e] border border-gray-200 dark:border-[#313244]" />
          <div className="w-3 h-3 rounded-sm bg-emerald-200 dark:bg-emerald-900/60" />
          <div className="w-3 h-3 rounded-sm bg-emerald-400 dark:bg-emerald-700/80" />
          <div className="w-3 h-3 rounded-sm bg-emerald-500" />
          <div className="w-3 h-3 rounded-sm bg-emerald-600 dark:bg-emerald-400" />
          More
        </div>
      </div>
      <div className="relative overflow-x-auto">
        {/* Month labels */}
        <div className="flex ml-8" style={{ gap: `${gap}px` }}>
          {weeks.map((_, wi) => {
            const month = months.find(m => m.index === wi);
            return (
              <div key={wi} style={{ width: `${cellSize}px`, minWidth: `${cellSize}px` }} className="text-[10px] text-gray-400 dark:text-[#6c7086]">
                {month ? month.label : ''}
              </div>
            );
          })}
        </div>
        <div className="flex" style={{ gap: `${gap}px` }}>
          <div className="flex flex-col text-[10px] text-gray-400 dark:text-[#6c7086] mr-1" style={{ gap: `${gap}px` }}>
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
                  className={`rounded-[3px] transition-all cursor-pointer hover:ring-2 hover:ring-indigo-400 ${day.before || day.future ? 'bg-transparent' : getColor(day.count)
                    }`}
                  onMouseEnter={() => !day.before && !day.future && setTooltip({ ...day, x: wi, y: di })}
                  onMouseLeave={() => setTooltip(null)}
                />
              ))}
            </div>
          ))}
        </div>
        {tooltip && tooltip.count >= 0 && (
          <div className="absolute z-10 px-3 py-1.5 rounded-lg bg-gray-900 dark:bg-[#313244] text-white text-xs font-medium shadow-lg pointer-events-none"
            style={{ top: tooltip.y * (cellSize + gap) + cellSize + 10, left: Math.min(tooltip.x * (cellSize + gap) + 40, (typeof window !== 'undefined' ? window.innerWidth - 300 : 500)) }}>
            {tooltip.count} submission{tooltip.count !== 1 ? 's' : ''} on {tooltip.date}
          </div>
        )}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════
   DSA TOPIC BAR CHART (LeetCode Tag Stats)
   ═══════════════════════════════════════════ */
const DSATopicChart = ({ tagStats }) => {
  if (!tagStats || tagStats.length === 0) return null;
  const max = Math.max(...tagStats.map(t => t.problemsSolved));
  return (
    <div className="bg-white dark:bg-[#1e1e2e] rounded-2xl border border-gray-200 dark:border-[#313244] p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-[#cdd6f4] mb-1">DSA Topic Analysis</h3>
      <p className="text-sm text-gray-500 dark:text-[#a6adc8] mb-4">LeetCode tag-wise problem breakdown</p>
      <div className="space-y-2.5">
        {tagStats.map((tag, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="text-xs font-medium text-gray-600 dark:text-[#a6adc8] w-28 truncate" title={tag.tagName}>{tag.tagName}</span>
            <div className="flex-1 h-5 bg-gray-100 dark:bg-[#313244] rounded-full overflow-hidden relative">
              <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-700 flex items-center justify-end pr-2"
                style={{ width: `${max > 0 ? Math.max((tag.problemsSolved / max) * 100, 8) : 0}%` }}>
                <span className="text-[10px] font-bold text-white">{tag.problemsSolved}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════
   PLATFORM BREAKDOWN CARDS
   ═══════════════════════════════════════════ */
const LeetCodeCard = ({ data }) => {
  // Debug: Log data status
  console.log('LeetCodeCard rendered with data:', data);
  
  if (!data) {
    console.warn('LeetCode data is null/undefined');
    return null;
  }
  
  if (!data.totalSolved && data.totalSolved !== 0) {
    console.warn('LeetCode data missing totalSolved:', data);
    return null;
  }
  
  console.log('Rendering LeetCodeCard with totalSolved:', data.totalSolved);
  
  return (
    <ProblemSolvedCard total={data.totalSolved} label="LeetCode" icon="🟡" gradient="from-amber-500 to-orange-600"
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
    <div className="relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br from-blue-500 to-cyan-600 text-white shadow-lg">
      <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-white/10 -mr-8 -mt-8" />
      <div className="relative">
        <div className="flex items-center gap-2 mb-2 text-white/80 text-sm font-medium"><span className="text-xl">🔵</span> Codeforces</div>
        <p className="text-4xl font-extrabold mb-1">{data.totalSolved}</p>
        <p className="text-xs text-white/70">Problems Solved</p>
        <div className="grid grid-cols-2 gap-2 mt-3">
          <div className="bg-white/10 rounded-lg p-2 text-center">
            <p className="text-lg font-bold">{data.rating}</p>
            <p className="text-[10px] text-white/60">Rating</p>
          </div>
          <div className="bg-white/10 rounded-lg p-2 text-center">
            <p className="text-lg font-bold">{data.maxRating}</p>
            <p className="text-[10px] text-white/60">Max Rating</p>
          </div>
        </div>
        <p className="text-xs text-white/60 mt-2 capitalize">Rank: {data.rank}</p>
      </div>
    </div>
  );
};

const GitHubCard = ({ data }) => {
  if (!data) return null;
  return (
    <div className="relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br from-gray-800 to-gray-900 text-white shadow-lg">
      <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-white/5 -mr-8 -mt-8" />
      <div className="relative">
        <div className="flex items-center gap-2 mb-2 text-white/80 text-sm font-medium"><Github className="w-5 h-5" /> GitHub</div>
        <p className="text-4xl font-extrabold mb-1">{data.publicRepos}</p>
        <p className="text-xs text-white/70">Public Repos</p>
        <div className="grid grid-cols-3 gap-2 mt-3">
          <div className="bg-white/10 rounded-lg p-2 text-center">
            <p className="text-sm font-bold">{data.totalStars}</p>
            <p className="text-[10px] text-white/50">Stars</p>
          </div>
          <div className="bg-white/10 rounded-lg p-2 text-center">
            <p className="text-sm font-bold">{data.totalForks}</p>
            <p className="text-[10px] text-white/50">Forks</p>
          </div>
          <div className="bg-white/10 rounded-lg p-2 text-center">
            <p className="text-sm font-bold">{data.followers}</p>
            <p className="text-[10px] text-white/50">Followers</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const HackerRankCard = ({ data }) => {
  if (!data) return null;
  return (
    <div className="relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br from-emerald-500 to-green-400 text-white shadow-lg">
      <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-white/10 -mr-8 -mt-8" />
      <div className="relative">
        <div className="flex items-center gap-2 mb-2 text-white/80 text-sm font-medium"><span className="text-xl">💚</span> HackerRank</div>
        <p className="text-lg font-bold mb-1">{data.username}</p>
        <p className="text-xs text-white/70">Profile Linked</p>
        <a href={`https://www.hackerrank.com/profile/${data.username}`} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 rounded-lg bg-white/20 text-white text-xs font-medium hover:bg-white/30 transition-colors">
          View Profile <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════
   TOP REPOS
   ═══════════════════════════════════════════ */
const TopRepos = ({ repos }) => {
  if (!repos || repos.length === 0) return null;
  return (
    <div className="bg-white dark:bg-[#1e1e2e] rounded-2xl border border-gray-200 dark:border-[#313244] p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-[#cdd6f4] mb-4">Top Repositories</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {repos.map((r, i) => (
          <a key={i} href={r.url} target="_blank" rel="noopener noreferrer"
            className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 dark:bg-[#11111b] border border-gray-200 dark:border-[#313244] hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-all group">
            <div className="w-9 h-9 rounded-lg bg-gray-200 dark:bg-[#313244] flex items-center justify-center shrink-0">
              <BookOpen className="w-4 h-4 text-gray-500 dark:text-[#a6adc8]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-[#cdd6f4] truncate group-hover:text-indigo-500 transition-colors">{r.name}</p>
              {r.description && <p className="text-xs text-gray-500 dark:text-[#6c7086] truncate mt-0.5">{r.description}</p>}
              <div className="flex items-center gap-3 mt-1.5">
                {r.language && <span className="text-[11px] text-gray-400 dark:text-[#6c7086]">{r.language}</span>}
                <span className="text-[11px] text-gray-400 dark:text-[#6c7086] flex items-center gap-0.5"><Star className="w-3 h-3" />{r.stars}</span>
                <span className="text-[11px] text-gray-400 dark:text-[#6c7086] flex items-center gap-0.5"><GitFork className="w-3 h-3" />{r.forks}</span>
              </div>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-gray-300 dark:text-[#45475a] group-hover:text-indigo-400 shrink-0 mt-1" />
          </a>
        ))}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════
   CONTEST RATING + STREAK CARDS
   ═══════════════════════════════════════════ */
const StatsOverview = ({ leetcode, codeforces }) => {
  const items = [];
  if (leetcode?.contestRating > 0) items.push({ label: 'LC Contest Rating', value: leetcode.contestRating, icon: <Zap className="w-4 h-4" />, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-500/10' });
  if (leetcode?.contestsAttended > 0) items.push({ label: 'LC Contests', value: leetcode.contestsAttended, icon: <Trophy className="w-4 h-4" />, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-500/10' });
  if (codeforces?.rating > 0) items.push({ label: 'CF Rating', value: codeforces.rating, icon: <Award className="w-4 h-4" />, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10' });

  // Total problems solved across all platforms
  let total = 0;
  [leetcode, codeforces].forEach(s => { if (s?.totalSolved) total += s.totalSolved; });

  if (items.length === 0 && total === 0) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-5 shadow-lg col-span-1">
        <div className="absolute top-0 right-0 w-20 h-20 rounded-full bg-white/10 -mr-6 -mt-6" />
        <div className="relative">
          <Target className="w-5 h-5 text-white/70 mb-2" />
          <p className="text-3xl font-extrabold">{total}</p>
          <p className="text-xs text-white/70">Total Solved</p>
        </div>
      </div>
      {items.map((it, i) => (
        <div key={i} className={`rounded-2xl border border-gray-200 dark:border-[#313244] p-5 bg-white dark:bg-[#1e1e2e]`}>
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2 ${it.bg} ${it.color}`}>{it.icon}</div>
          <p className="text-2xl font-bold text-gray-900 dark:text-[#cdd6f4]">{it.value}</p>
          <p className="text-xs text-gray-500 dark:text-[#a6adc8]">{it.label}</p>
        </div>
      ))}
    </div>
  );
};

/* ═══════════════════════════════════════════
   PLATFORM SETUP MODAL
   ═══════════════════════════════════════════ */
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white dark:bg-[#1e1e2e] rounded-2xl border border-gray-200 dark:border-[#313244] w-full max-w-lg p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-[#cdd6f4]">Link Platforms</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#313244] transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="space-y-3">
          {PLATFORMS.map(({ key, label, icon }) => (
            <div key={key}>
              <label className="text-sm font-medium text-gray-700 dark:text-[#a6adc8] mb-1 flex items-center gap-2">
                <span>{icon}</span> {label}
              </label>
              <input type="text" placeholder={`Enter ${label} username`}
                value={form[key] || ''} onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-[#313244] bg-gray-50 dark:bg-[#11111b] text-gray-900 dark:text-[#cdd6f4] text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all" />
            </div>
          ))}
        </div>
        <button onClick={handleSave} disabled={saving}
          className="w-full mt-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2">
          {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : <><Check className="w-4 h-4" /> Save Platforms</>}
        </button>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════ */
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
    console.log('Fetched all stats:', newStats);
    setStats(newStats);
    setRefreshing(false);
    showToast('Stats refreshed successfully!');
  }, [profile]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const p = await fetchProfile();
      console.log('Fetched profile:', p);
      if (p) {
        const hasAny = PLATFORMS.some(pl => p[pl.key]);
        console.log('Has any platforms linked:', hasAny);
        if (hasAny) await fetchAllStats(p);
      }
      setLoading(false);
    })();
  }, []);

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
        
        // Use backend endpoints instead of directly calling external APIs
        if (entry.leetcodeUsername) {
          try {
            const r = await api.get(`/coding-profile/stats/leetcode/${entry.leetcodeUsername}`);
            if (r.data?.data?.totalSolved) {
              totalSolved += r.data.data.totalSolved;
            }
          } catch (e) {
            console.warn(`Failed to fetch LeetCode for ${entry.leetcodeUsername}:`, e.message);
          }
        }
        
        if (entry.codeforcesUsername) {
          try {
            const r = await api.get(`/coding-profile/stats/codeforces/${entry.codeforcesUsername}`);
            if (r.data?.data?.totalSolved) {
              totalSolved += r.data.data.totalSolved;
            }
          } catch (e) {
            console.warn(`Failed to fetch Codeforces for ${entry.codeforcesUsername}:`, e.message);
          }
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
  }, [tab]);

  const hasAnyPlatform = profile && PLATFORMS.some(p => profile[p.key]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        <p className="text-sm text-gray-500 dark:text-[#a6adc8]">Loading your coding profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-2xl text-sm font-medium flex items-center gap-2 ${toast.type === 'error' ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'
          }`} style={{ animation: 'slideInRight 0.3s ease' }}>
          {toast.type === 'error' ? <AlertCircle className="w-4 h-4" /> : <Check className="w-4 h-4" />}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-[#cdd6f4]">Coding Stats</h1>
          <p className="text-sm text-gray-500 dark:text-[#a6adc8] mt-1">Track your progress across all coding platforms</p>
        </div>
        <div className="flex items-center gap-3">
          {hasAnyPlatform && (
            <button onClick={() => fetchAllStats()} disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 dark:border-[#313244] text-sm font-medium text-gray-700 dark:text-[#a6adc8] hover:bg-gray-50 dark:hover:bg-[#272739] transition-colors disabled:opacity-50">
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} /> Refresh
            </button>
          )}
          <button onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-medium hover:opacity-90 transition-opacity">
            <Settings2 className="w-4 h-4" /> {hasAnyPlatform ? 'Edit Platforms' : 'Link Platforms'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 dark:bg-[#11111b] rounded-xl p-1 w-fit">
        {[
          { id: 'stats', label: 'Stats & Heatmap', icon: BarChart3 },
          { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
        ].map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === id
                ? 'bg-white dark:bg-[#1e1e2e] text-gray-900 dark:text-[#cdd6f4] shadow-sm'
                : 'text-gray-500 dark:text-[#6c7086] hover:text-gray-700 dark:hover:text-[#a6adc8]'
              }`}>
            <Icon className="w-4 h-4" /> {label}
          </button>
        ))}
      </div>

      {tab === 'stats' && (
        <>
          {!hasAnyPlatform ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-[#1e1e2e] rounded-2xl border border-gray-200 dark:border-[#313244]">
              <div className="w-16 h-16 rounded-2xl bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center mb-4">
                <Link2 className="w-8 h-8 text-indigo-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-[#cdd6f4] mb-2">No Platforms Linked</h3>
              <p className="text-sm text-gray-500 dark:text-[#a6adc8] mb-4 max-w-sm text-center">
                Link your coding accounts to see your stats, heatmap, and DSA analysis.
              </p>
              <button onClick={() => setModalOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-medium hover:opacity-90 transition-opacity">
                Link Platforms
              </button>
            </div>
          ) : (
            <>
              {/* Platform Badges */}
              <div className="flex gap-2 flex-wrap">
                {PLATFORMS.filter(p => profile[p.key]).map(p => (
                  <a key={p.key} href={p.link(profile[p.key])} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-[#11111b] border border-gray-200 dark:border-[#313244] text-xs font-medium text-gray-700 dark:text-[#a6adc8] hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-all">
                    <span>{p.icon}</span> <span className="font-semibold">{p.label}:</span> {profile[p.key]} <ExternalLink className="w-3 h-3" />
                  </a>
                ))}
              </div>

              {refreshing && (
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-[#a6adc8]">
                  <Loader2 className="w-4 h-4 animate-spin" /> Fetching latest stats from all platforms...
                </div>
              )}

              {/* Overview: Total Solved + Contest Ratings */}
              <StatsOverview leetcode={stats.leetcode} codeforces={stats.codeforces} />

              {/* Platform Breakdown Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <LeetCodeCard data={stats.leetcode} />
                <CodeforcesCard data={stats.codeforces} />
                <GitHubCard data={stats.github} />
        
                <HackerRankCard data={stats.hackerrank} />
              </div>

              {/* DSA Topic Analysis */}
              <DSATopicChart tagStats={stats.leetcode?.tagStats} />

              {/* Top Repos */}
              <TopRepos repos={stats.github?.topRepos} />

              {/* Heatmap */}
              <ContributionHeatmap allStats={Object.values(stats).filter(Boolean)} />
            </>
          )}
        </>
      )}

      {tab === 'leaderboard' && (
        <div className="bg-white dark:bg-[#1e1e2e] rounded-2xl border border-gray-200 dark:border-[#313244]">
          <div className="p-6 border-b border-gray-200 dark:border-[#313244]">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-[#cdd6f4]">Coding Leaderboard</h3>
            <p className="text-sm text-gray-500 dark:text-[#a6adc8]">Ranked by total problems solved across all platforms</p>
          </div>
          {loadingLeaderboard ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-6 h-6 text-indigo-500 animate-spin mr-2" />
              <span className="text-sm text-gray-500 dark:text-[#a6adc8]">Fetching stats for all users...</span>
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="flex flex-col items-center py-16">
              <Users className="w-10 h-10 text-gray-300 dark:text-[#45475a] mb-3" />
              <p className="text-sm text-gray-500 dark:text-[#a6adc8]">No users have linked coding platforms yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-[#313244]">
              {[...leaderboard]
                .map((entry) => ({ ...entry, totalSolved: leaderboardStats[entry.userId]?.totalSolved || 0 }))
                .sort((a, b) => b.totalSolved - a.totalSolved)
                .map((entry, i) => {
                  const isMe = entry.userId === profile?.userId;
                  return (
                    <div key={entry.userId}
                      className={`flex items-center gap-4 px-6 py-4 ${isMe ? 'bg-indigo-50/50 dark:bg-indigo-500/5' : ''} hover:bg-gray-50 dark:hover:bg-[#272739] transition-colors`}>
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold ${i === 0 ? 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400' :
                          i === 1 ? 'bg-gray-100 dark:bg-gray-500/20 text-gray-600 dark:text-gray-400' :
                            i === 2 ? 'bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400' :
                              'bg-gray-50 dark:bg-[#11111b] text-gray-500 dark:text-[#6c7086]'
                        }`}>
                        {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-gray-900 dark:text-[#cdd6f4] truncate">{entry.name}</p>
                          {isMe && <span className="px-1.5 py-0.5 text-[10px] font-bold bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded">YOU</span>}
                        </div>
                        <div className="flex gap-2 mt-0.5 flex-wrap">
                          {PLATFORMS.filter(p => entry[p.key]).map(p => (
                            <span key={p.key} className="text-[10px] text-gray-400 dark:text-[#6c7086]">{p.icon}{entry[p.key]}</span>
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-gray-900 dark:text-[#cdd6f4]">{entry.totalSolved}</p>
                        <p className="text-[10px] text-gray-400 dark:text-[#6c7086]">problems</p>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      )}

      <PlatformModal open={modalOpen} onClose={() => setModalOpen(false)} profile={profile} onSave={handleSave} />

      <style>{`
        @keyframes slideInRight { from { transform: translateX(100px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
      `}</style>
    </div>
  );
};

export default CodingStats;
