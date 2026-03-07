import React, { useEffect, useState } from 'react';
import { Trophy, Flame, Clock, Lightbulb, Medal, Crown, TrendingUp, Filter } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
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
        <div className="w-8 h-8 border-3 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const data = getPodium(getData());
  const top3 = data.slice(0, 3);
  const rest = data.slice(3);
  const podiumOrder = top3.length >= 3 ? [top3[1], top3[0], top3[2]] : top3;

  const podiumColors = [
    { bg: 'from-gray-300 to-gray-400', ring: 'ring-gray-300', text: 'text-gray-600', h: 'h-20' },
    { bg: 'from-yellow-300 to-amber-500', ring: 'ring-yellow-400', text: 'text-yellow-600', h: 'h-28' },
    { bg: 'from-orange-300 to-orange-400', ring: 'ring-orange-300', text: 'text-orange-600', h: 'h-16' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Leaderboards"
        description="Compete and see how you rank compared to other learners"
      />

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-lg flex items-center gap-3">
          <div className="w-1 h-8 bg-red-500 rounded-full" />
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-3">
        {TABS.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg shadow-purple-500/25'
                  : 'bg-white dark:bg-[#1e1e2e] text-gray-600 dark:text-[#a6adc8] border border-gray-200 dark:border-[#313244] hover:border-purple-300 dark:hover:border-purple-500/30'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Podium for top 3 */}
      {top3.length >= 3 && (
        <div className="bg-white dark:bg-[#1e1e2e] rounded-2xl border border-gray-200 dark:border-[#313244] p-8">
          <div className="flex items-end justify-center gap-4 mb-6">
            {podiumOrder.map((entry, i) => {
              const colors = podiumColors[i];
              const isCurrentUser = entry.userId === currentUserId;
              const rank = entry.rank;
              return (
                <div key={entry.userId} className="flex flex-col items-center">
                  <div className={`relative mb-2 ${rank === 1 ? 'scale-110' : ''}`}>
                    {rank === 1 && <Crown className="w-6 h-6 text-yellow-500 absolute -top-5 left-1/2 -translate-x-1/2" />}
                    <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${colors.bg} flex items-center justify-center text-white font-black text-xl ring-4 ${colors.ring} ${isCurrentUser ? 'ring-purple-500' : ''}`}>
                      {entry.userName?.[0]?.toUpperCase() || '?'}
                    </div>
                  </div>
                  <p className={`text-xs font-bold mb-1 ${isCurrentUser ? 'text-purple-600 dark:text-purple-400' : 'text-gray-900 dark:text-[#cdd6f4]'}`}>
                    {entry.userName} {isCurrentUser && '(You)'}
                  </p>
                  <p className="text-lg font-black text-gray-900 dark:text-[#cdd6f4]">{entry.value}</p>
                  <p className="text-[10px] text-gray-400 dark:text-[#585b70]">{entry.metric}</p>
                  {/* Podium bar */}
                  <div className={`${colors.h} w-20 mt-2 rounded-t-xl bg-gradient-to-t ${colors.bg} flex items-end justify-center pb-2`}>
                    <span className="text-white font-black text-lg">#{rank}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Full list */}
      <div className="bg-white dark:bg-[#1e1e2e] rounded-2xl border border-gray-200 dark:border-[#313244] overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-[#313244]">
          <h3 className="text-sm font-bold text-gray-900 dark:text-[#cdd6f4] flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-purple-500" />
            Full Rankings
          </h3>
        </div>
        {data.length === 0 ? (
          <div className="p-8 text-center text-gray-400 dark:text-[#585b70]">No data available</div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-[#313244]">
            {data.map((entry) => {
              const isCurrentUser = entry.userId === currentUserId;
              const isTop3 = entry.rank <= 3;
              return (
                <div
                  key={entry.userId}
                  className={`flex items-center justify-between px-5 py-4 transition-colors ${
                    isCurrentUser
                      ? 'bg-purple-50 dark:bg-purple-500/10'
                      : 'hover:bg-gray-50 dark:hover:bg-[#181825]'
                  }`}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`w-10 text-center ${isTop3 ? 'text-xl' : 'text-sm font-bold text-gray-400 dark:text-[#585b70]'}`}>
                      {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : `#${entry.rank}`}
                    </div>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm ${
                      isCurrentUser ? 'bg-gradient-to-br from-purple-500 to-pink-500' : 'bg-gradient-to-br from-gray-400 to-gray-500 dark:from-[#45475a] dark:to-[#585b70]'
                    }`}>
                      {entry.userName?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div>
                      <p className={`font-semibold text-sm ${isCurrentUser ? 'text-purple-700 dark:text-purple-300' : 'text-gray-900 dark:text-[#cdd6f4]'}`}>
                        {entry.userName}
                        {isCurrentUser && (
                          <span className="ml-2 text-[10px] bg-purple-600 text-white px-1.5 py-0.5 rounded font-bold">YOU</span>
                        )}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-[#585b70]">Rank #{entry.rank}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-xl font-black ${isCurrentUser ? 'text-purple-600 dark:text-purple-400' : 'text-gray-900 dark:text-[#cdd6f4]'}`}>{entry.value}</p>
                    <p className="text-[10px] text-gray-400 dark:text-[#585b70]">{entry.metric}</p>
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