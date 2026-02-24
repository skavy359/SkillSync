import api from './api';

const leaderboardService = {
  getSkillsLeaderboard: async () => {
    const { data } = await api.get('/leaderboard/skills');
    return data.data;
  },

  getSessionsLeaderboard: async () => {
    const { data } = await api.get('/leaderboard/sessions');
    return data.data;
  },

  getUserProfile: async (userId) => {
    const { data } = await api.get(`/leaderboard/profile/${userId}`);
    return data.data;
  },
};

export default leaderboardService;