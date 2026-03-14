import React, { useEffect, useState } from 'react';
import { Flame, Lightbulb, Crown, TrendingUp, Trophy, Star, Target } from 'lucide-react';
import leaderboardService from '../services/leaderboardService';
import { getMyProfile } from '../services/profileService';

const TABS = [
  { id: 'skills', label: 'Top Skills', icon: Lightbulb, desc: 'Most skills learned' },
  { id: 'sessions', label: 'Most Sessions', icon: Flame, desc: 'Highest session count' },
];

const Leaderboard = () => {
  const [activeTab, setActiveTab] = useState('skills');
  const [skillsLeaderboard, setSkillsLeaderboard] = useState([]);
  const [sessionsLeaderboard, setSessionsLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    fetchLeaderboards();
  }, []);

  const fetchLeaderboards = async () => {
    try {
      setLoading(true);
      setError(null);
      const profile = await getMyProfile();
      setCurrentUserId(profile.id);
      const [skills, sessions] = await Promise.all([
        leaderboardService.getSkillsLeaderboard(),
        leaderboardService.getSessionsLeaderboard(),
      ]);
      setSkillsLeaderboard(skills);
      setSessionsLeaderboard(sessions);
    } catch (err) {
      setError(err.message || 'Failed to load leaderboards');
    } finally {
      setLoading(false);
    }
  };

  const getData = () => activeTab === 'skills' ? skillsLeaderboard : sessionsLeaderboard;

  const getPodium = (data) => {
    if (!currentUserId || !data.length) return data;
    return data;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin shadow-lg" />
      </div>
    );
  }

  const data = getPodium(getData());
  const top3 = data.slice(0, 3);
  const rest = data.slice(3);
  // Reorder for podium: 2nd, 1st, 3rd
  const podiumOrder = top3.length >= 3 ? [top3[1], top3[0], top3[2]] : top3;

  const podiumStyles = [
    { bg: 'from-gray-300 via-gray-400 to-gray-500', ring: 'ring-gray-300', text: 'text-gray-700', h: 'h-32 md:h-40', shadow: 'shadow-gray-400/50', icon: '🥈' },
    { bg: 'from-yellow-300 via-amber-400 to-orange-500', ring: 'ring-yellow-400', text: 'text-amber-700', h: 'h-40 md:h-52', shadow: 'shadow-amber-500/50', icon: '🏆' },
    { bg: 'from-orange-300 via-orange-400 to-red-400', ring: 'ring-orange-300', text: 'text-orange-800', h: 'h-24 md:h-32', shadow: 'shadow-orange-500/50', icon: '🥉' },
  ];

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
      
      {/* --- Hero Section --- */}
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 p-8 md:p-12 shadow-2xl text-white">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        <div className="absolute bottom-0 left-10 w-48 h-48 bg-yellow-400/20 rounded-full blur-3xl -mb-10 pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/20 mb-4 text-sm font-bold shadow-sm">
              <Trophy className="w-4 h-4 text-yellow-200" />
              <span>Global Rankings</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3 drop-shadow-md">
              Leaderboard
            </h1>
            <p className="text-orange-50 text-lg opacity-90 leading-relaxed font-medium">
              See how you stack up against the best. Climb the ranks by mastering skills and maintaining study streaks!
            </p>
          </div>
          <div className="hidden md:flex shrink-0 w-32 h-32 bg-white/10 backdrop-blur-md rounded-full items-center justify-center border-4 border-white/20 shadow-2xl transform rotate-12">
             <Crown className="w-16 h-16 text-yellow-300" />
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 rounded-xl flex items-center gap-3 shadow-sm animate-in fade-in slide-in-from-top-4">
          <div className="w-1.5 h-8 bg-rose-500 rounded-full" />
          <p className="text-sm font-semibold text-rose-600 dark:text-rose-400">{error}</p>
        </div>
      )}

      {/* --- Tab Navigation --- */}
      <div className="flex flex-wrap gap-3 bg-white dark:bg-[#1e1e2e] p-2 rounded-2xl shadow-sm inline-flex">
        {TABS.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-orange-500/30 ring-2 ring-white dark:ring-[#1e1e2e]'
                  : 'text-gray-600 dark:text-[#a6adc8] hover:bg-orange-50 dark:hover:bg-[#313244] hover:text-orange-600 dark:hover:text-orange-400'
              }`}
            >
              <Icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-yellow-200' : ''}`} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* --- Podium Section --- */}
      {top3.length >= 3 && (
        <div className="bg-white dark:bg-[#1e1e2e] rounded-[2rem] border border-gray-100 dark:border-[#313244] p-8 md:p-12 shadow-sm overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-gray-50 dark:to-black/20 pointer-events-none" />
          
          <div className="relative z-10 flex items-end justify-center gap-4 md:gap-8 pt-10">
            {podiumOrder.map((entry, i) => {
              const styles = podiumStyles[i];
              const isCurrentUser = entry.userId === currentUserId;
              const rank = entry.rank;
              const isFirst = rank === 1;

              return (
                <div key={entry.userId} className={`flex flex-col items-center group ${isFirst ? 'z-10' : 'z-0'}`}>
                  
                  {/* User Avatar & Info */}
                  <div className={`relative mb-4 flex flex-col items-center transition-transform duration-500 ${isFirst ? 'scale-110 -translate-y-4 group-hover:-translate-y-6' : 'group-hover:-translate-y-2'}`}>
                    
                    {/* Crown for 1st */}
                    {isFirst && (
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 animate-bounce">
                            <Crown className="w-10 h-10 text-yellow-400 drop-shadow-md" />
                        </div>
                    )}
                    
                    <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br ${styles.bg} flex items-center justify-center text-white font-black text-2xl md:text-3xl shadow-xl ${styles.shadow} ring-4 ring-offset-4 dark:ring-offset-[#1e1e2e] ${styles.ring} ${isCurrentUser ? 'ring-offset-purple-50' : ''}`}>
                      {entry.userName?.[0]?.toUpperCase() || '?'}
                    </div>
                    
                    <div className="mt-4 text-center bg-white/80 dark:bg-[#181825]/80 backdrop-blur-sm px-3 py-1.5 rounded-xl shadow-sm border border-gray-100 dark:border-[#313244]">
                        <p className={`text-sm font-black truncate max-w-[100px] md:max-w-[120px] ${isCurrentUser ? 'text-amber-600 dark:text-amber-400' : 'text-gray-900 dark:text-[#cdd6f4]'}`}>
                        {entry.userName} {isCurrentUser && <span className="text-[10px] uppercase text-amber-500 block">(You)</span>}
                        </p>
                    </div>
                  </div>

                  {/* Podium Pillar */}
                  <div className={`w-24 md:w-32 ${styles.h} rounded-t-2xl bg-gradient-to-t ${styles.bg} shadow-[inset_0_4px_12px_rgba(0,0,0,0.1)] relative flex flex-col items-center justify-start pt-6 overflow-hidden`}>
                     <div className="absolute top-0 w-full h-4 bg-white/20 rounded-t-2xl" />
                     <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/20 to-transparent" />
                     <span className="text-4xl md:text-5xl font-black text-white mix-blend-overlay drop-shadow-sm opacity-90">{rank}</span>
                     <span className="mt-2 text-white font-bold text-sm bg-black/20 px-3 py-1 rounded-full backdrop-blur-sm shadow-inner">{entry.value}</span>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* --- Full Rankings Table --- */}
      <div className="bg-white dark:bg-[#1e1e2e] rounded-[2rem] border border-gray-100 dark:border-[#313244] overflow-hidden shadow-sm">
        <div className="px-6 py-5 border-b border-gray-100 dark:border-[#313244] bg-gray-50/50 dark:bg-transparent flex items-center justify-between">
          <h3 className="text-lg font-black text-gray-900 dark:text-[#cdd6f4] flex items-center gap-2">
            <Target className="w-5 h-5 text-amber-500" />
            Full Rankings
          </h3>
          <span className="text-xs font-bold text-gray-500 bg-gray-100 dark:bg-[#313244] px-3 py-1.5 rounded-lg">{data.length} Participants</span>
        </div>

        {data.length === 0 ? (
          <div className="p-16 text-center">
              <Star className="w-12 h-12 text-gray-300 dark:text-[#45475a] mx-auto mb-4" />
              <p className="text-gray-500 dark:text-[#6c7086] font-medium">No ranking data available yet. Start learning to get on the board!</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-[#313244]">
            {data.map((entry) => {
              const isCurrentUser = entry.userId === currentUserId;
              const isTop3 = entry.rank <= 3;
              
              let rankStyle = "text-sm font-bold text-gray-400 dark:text-[#585b70]";
              let rowStyle = "hover:bg-gray-50 dark:hover:bg-[#181825]";
              
              if (isCurrentUser) {
                  rowStyle = "bg-amber-50/50 dark:bg-amber-500/5 hover:bg-amber-50 dark:hover:bg-amber-500/10";
              }
              
              if (entry.rank === 1) rankStyle = "text-xl drop-shadow-md";
              if (entry.rank === 2) rankStyle = "text-lg drop-shadow-md";
              if (entry.rank === 3) rankStyle = "text-lg drop-shadow-md";

              return (
                <div
                  key={entry.userId}
                  className={`flex items-center justify-between px-6 py-4 transition-all duration-200 group ${rowStyle}`}
                >
                  <div className="flex items-center gap-4 md:gap-6 flex-1">
                    <div className={`w-8 text-center flex justify-center ${rankStyle}`}>
                      {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : `#${entry.rank}`}
                    </div>
                    
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-white text-lg shadow-sm ${
                      isCurrentUser 
                        ? 'bg-gradient-to-br from-amber-400 to-orange-500 shadow-orange-500/20 ring-2 ring-offset-2 ring-orange-400 dark:ring-offset-[#1e1e2e]' 
                        : isTop3 
                            ? 'bg-gradient-to-br from-gray-700 to-gray-900 dark:from-[#313244] dark:to-[#181825]'
                            : 'bg-gradient-to-br from-gray-200 to-gray-400 dark:from-[#45475a] dark:to-[#313244] text-gray-600 dark:text-gray-300'
                    }`}>
                      {entry.userName?.[0]?.toUpperCase() || '?'}
                    </div>
                    
                    <div>
                      <p className={`font-black text-base group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors flex items-center gap-2 ${isCurrentUser ? 'text-amber-600 dark:text-amber-400' : 'text-gray-900 dark:text-[#cdd6f4]'}`}>
                        {entry.userName}
                        {isCurrentUser && (
                          <span className="text-[10px] bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">YOU</span>
                        )}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end">
                    <div className="bg-gray-50 dark:bg-[#181825] px-4 py-2 rounded-xl border border-gray-100 dark:border-[#313244] flex items-baseline gap-1.5 shadow-inner">
                        <span className={`text-xl font-black ${isCurrentUser ? 'text-amber-600 dark:text-amber-400' : 'text-gray-900 dark:text-[#cdd6f4]'}`}>{entry.value}</span>
                        <span className="text-[10px] font-bold text-gray-400 dark:text-[#6c7086] uppercase tracking-wider">{entry.metric}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;