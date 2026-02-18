import api from './api';

export const getMyGoals = async () => {
    const { data } = await api.get('/profile/goals');
    return data.data;
};

export const createGoal = async (goalData) => {
    const { data } = await api.post('/profile/goals', goalData);
    return data.data;
};

export const getGoalAnalytics = async () => {
    const { data } = await api.get('/profile/goals/analytics');
    return data.data;
};