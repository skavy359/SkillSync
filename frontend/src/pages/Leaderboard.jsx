import React, { useEffect, useState } from 'react';
import { Trophy, Flame, Medal } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import leaderboardService from '../services/leaderboardService';
import { getMyProfile } from '../services/profileService';

const Leaderboard = () => {
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
      
      // Get current user's ID
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
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getMedalColor = (rank) => {
    if (rank === 1) return 'text-yellow-400';
    if (rank === 2) return 'text-gray-400';
    if (rank === 3) return 'text-orange-400';
    return 'text-[#7f849c]';
  };

  const getMedalIcon = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `${rank}`;
  };

  const reorganizeLeaderboard = (data) => {
    if (!currentUserId || !data.length) return data;
    
    const currentUserEntry = data.find(entry => entry.userId === currentUserId);
    
    if (!currentUserEntry) return data;
    
    // Remove current user from list
    const otherEntries = data.filter(entry => entry.userId !== currentUserId);
    
    // Return current user at top, followed by others
    return [currentUserEntry, ...otherEntries];
  };

  const LeaderboardSection = ({ title, data, icon: Icon }) => {
    const displayData = reorganizeLeaderboard(data);
    
    return (
      <div className="bg-[#313244] rounded-lg p-6 border border-[#6c7086]">
        <div className="flex items-center gap-3 mb-6">
          <Icon className="w-6 h-6 text-[#89b4fa]" />
          <h2 className="text-xl font-bold text-[#cdd6f4]">{title}</h2>
        </div>

        {displayData.length === 0 ? (
          <div className="p-8 text-center text-[#7f849c]">No data available</div>
        ) : (
          <div className="space-y-3">
            {displayData.map((entry, idx) => {
              const isCurrentUser = entry.userId === currentUserId;
              
              return (
                <div
                  key={entry.userId}
                  className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
                    isCurrentUser
                      ? 'bg-[#89b4fa]/10 border-[#89b4fa]'
                      : 'bg-[#1f1f2e] border-[#45475a] hover:border-[#89b4fa]'
                  }`}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`text-2xl font-bold ${getMedalColor(entry.rank)} w-12 text-center`}>
                      {getMedalIcon(entry.rank)}
                    </div>
                    <div>
                      <p className="font-semibold text-[#cdd6f4] flex items-center gap-2">
                        {entry.userName}
                        {isCurrentUser && (
                          <span className="text-xs bg-[#89b4fa] text-[#1e1e2e] px-2 py-1 rounded font-bold">
                            YOU
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-[#7f849c]">Rank #{entry.rank}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-[#89b4fa]">{entry.value}</p>
                    <p className="text-xs text-[#7f849c]">{entry.metric}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex-1 overflow-auto bg-[#1e1e2e]">
        <div className="p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#89b4fa] mx-auto mt-20"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto bg-[#1e1e2e]">
      <div className="p-8">
        <PageHeader
          title="Leaderboards"
          description="Compete and see how you rank compared to other learners"
        />

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg mb-6 flex items-center gap-3">
            <div className="w-1 h-8 bg-red-500 rounded-full"></div>
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LeaderboardSection
            title="Top Skills Learned"
            data={skillsLeaderboard}
            icon={Trophy}
          />
          <LeaderboardSection
            title="Most Sessions Completed"
            data={sessionsLeaderboard}
            icon={Flame}
          />
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
