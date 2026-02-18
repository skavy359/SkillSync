import api from './api';

export const getAllCategories = async () => {
    const { data } = await api.get('/profile/categories');
    return data.data;
};

export const createCategory = async (categoryData) => {
    const { data } = await api.post('/profile/categories', categoryData);
    return data.data;
};

export const getCategorySkills = async (categoryId) => {
    const { data } = await api.get(`/profile/categories/${categoryId}/skills`);
    return data.data;
};

export const getCategoryAnalytics = async () => {
    const { data } = await api.get('/profile/categories/analytics');
    return data.data;
};

export const getDomainFocus = async () => {
    const { data } = await api.get('/profile/categories/focus');
    return data.data;
};