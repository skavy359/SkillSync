import api from './api';

export const getMyGoals = async () => {
    const { data } = await api.get('/profile/goals');
    return data.data;
};

export const createGoal = async (goalData) => {
    const { data } = await api.post('/profile/goals', goalData);
    return data.data;
};

export const updateGoal = async (goalId, goalData) => {
    const { data } = await api.put(`/profile/goals/${goalId}`, goalData);
    return data.data;
};

export const deleteGoal = async (goalId) => {
    const { data } = await api.delete(`/profile/goals/${goalId}`);
    return data.data;
};

export const getGoalAnalytics = async () => {
    const { data } = await api.get('/profile/goals/analytics');
    return data.data;
};