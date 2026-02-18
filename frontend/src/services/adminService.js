import api from './api';

export const getAdminStats = async () => {
    const { data } = await api.get('/admin/stats');
    return data.data; // Extract from ApiResponse wrapper
};

export const getUsers = async (params = {}) => {
    const { page = 0, size = 10, role = '', search = '' } = params;
    const { data } = await api.get('/admin/users', {
        params: { page, size, role, search },
    });
    return data.data; // Returns Page object
};

export const getUserSkills = async (userId) => {
    const { data } = await api.get(`/admin/users/${userId}/skills`);
    return data.data;
};

export const updateUserRole = async (userId, role) => {
    const { data } = await api.put(`/admin/users/${userId}/role`, { role });
    return data;
};

export const deleteUser = async (userId) => {
    const { data } = await api.delete(`/admin/users/${userId}`);
    return data;
};