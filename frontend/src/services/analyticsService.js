import api from './api';

export const getActivityHeatmap = async () => {
    const { data } = await api.get('/profile/me/activity-heatmap');
    return data.data;
};

export const getRecommendations = async () => {
    const { data } = await api.get('/profile/me/recommendations');
    return data.data;
};

export const getNextRecommendation = async () => {
    const { data } = await api.get('/profile/me/recommendation');
    return data.data;
};

export const getRecommendationHistory = async () => {
    const { data } = await api.get('/profile/me/recommendation-history');
    return data.data;
};

export const getMyAuditLogs = async () => {
    const { data } = await api.get('/profile/me/audit');
    return data.data;
};