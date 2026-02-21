import api from './api';

export const getMyProfile = async () => {
    const { data } = await api.get('/profile');
    return data.data;
};

export const updateMyProfile = async (profileData) => {
    const { data } = await api.patch('/profile', profileData);
    return data.data;
};

export const getMyStats = async () => {
    const { data } = await api.get('/profile/stats');
    return data.data;
};

export const getMyLearningStats = async () => {
    const { data } = await api.get('/profile/me/learning-stats');
    return data.data;
};

export const getMyStreak = async () => {
    const { data } = await api.get('/profile/me/streak');
    return data.data;
};

export const getBurnoutRisk = async () => {
    const { data } = await api.get('/profile/me/burnout-risk');
    return data.data;
};

export const getMyNotifications = async () => {
    const { data } = await api.get('/profile/me/notifications');
    return data.data;
};

export const markNotificationRead = async (id) => {
    const { data } = await api.patch(`/profile/me/notifications/${id}/read`);
    return data;
};

export const markAllNotificationsRead = async () => {
    const { data } = await api.patch('/profile/me/notifications/read-all');
    return data;
};

export const getWeeklyStats = async () => {
    const { data } = await api.get('/profile/me/weekly-stats');
    return data.data;
};

export const getActivityHeatmap = async () => {
    const { data } = await api.get('/profile/me/activity-heatmap');
    return data.data;
};

export const getTodayMinutes = async () => {
    try {
        const activities = await getActivityHeatmap();
        if (!Array.isArray(activities)) return 0;
        
        const today = new Date().toISOString().split('T')[0];
        const todayActivity = activities.find(a => a.date === today);
        return todayActivity ? todayActivity.minutes : 0;
    } catch {
        return 0;
    }
};

export const getMonthlyStats = async () => {
    const { data } = await api.get('/profile/me/monthly-stats');
    return data.data;
};

export const getMyAchievements = async () => {
    const { data } = await api.get('/profile/me/achievements');
    return data.data;
};

export const deleteMyAccount = async () => {
    const { data } = await api.post('/profile/delete-account');
    return data.data;
};

export const changePassword = async (oldPassword, newPassword) => {
    const { data } = await api.post('/profile/change-password', {
        oldPassword,
        newPassword
    });
    return data.data;
};