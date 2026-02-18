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

export const getWeeklyStats = async () => {
    const { data } = await api.get('/profile/me/weekly-stats');
    return data.data;
};

export const getMonthlyStats = async () => {
    const { data } = await api.get('/profile/me/monthly-stats');
    return data.data;
};