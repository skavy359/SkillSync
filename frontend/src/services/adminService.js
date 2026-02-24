import api from './api';

export const getAdminStats = async () => {
    const { data } = await api.get('/admin/stats');
    return data.data;
};

export const getUsers = async (params = {}) => {
    const { page = 0, size = 10, role = '', search = '' } = params;
    const { data } = await api.get('/admin/users', {
        params: { page, size, role, search },
    });
    return data.data;
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

export const toggleAccountStatus = async (userId, isActive) => {
    const { data } = await api.put(`/admin/users/${userId}/account-status`, { isActive });
    return data;
};

export const resetUserPassword = async (userId, newPassword) => {
    const { data } = await api.put(`/admin/users/${userId}/password-reset`, { userId, newPassword });
    return data;
};

export const getInactiveUsers = async (days = 30) => {
    const { data } = await api.get('/admin/users/inactive', {
        params: { days }
    });
    return data.data;
};

export const getAuditLogs = async (page = 0, size = 100) => {
    const { data } = await api.get('/admin/audit-logs', {
        params: { page, size }
    });
    return data.data;
};

export const getAuditLogsByAction = async (action) => {
    const { data } = await api.get(`/admin/audit-logs/action/${action}`);
    return Array.isArray(data) ? data : data.data || data;
};

export const getAuditLogsByEntityType = async (entityType) => {
    const { data } = await api.get(`/admin/audit-logs/entity/${entityType}`);
    return Array.isArray(data) ? data : data.data || data;
};

export const getSystemSettings = async () => {
    const { data } = await api.get('/admin/settings');
    return data.data;
};

export const updateSystemSettings = async (settings) => {
    const { data } = await api.put('/admin/settings', settings);
    return data.data;
};

export const getEngagementMetrics = async () => {
    const { data } = await api.get('/admin/analytics/engagement');
    return data.data;
};

export const getUserActivityReport = async (userId) => {
    const { data } = await api.get(`/admin/users/${userId}/activity-report`);
    return data.data;
};

export const broadcastNotification = async (payload) => {
    const { data } = await api.post('/admin/notifications/broadcast', payload);
    return data;
};

export const searchUsersByEmail = async (email) => {
    const { data } = await api.get('/admin/users/search/email', {
        params: { email }
    });
    return data.data;
};

export default {
    getAdminStats,
    getUsers,
    getUserSkills,
    updateUserRole,
    deleteUser,
    toggleAccountStatus,
    resetUserPassword,
    getInactiveUsers,
    getAuditLogs,
    getAuditLogsByAction,
    getAuditLogsByEntityType,
    getSystemSettings,
    updateSystemSettings,
    getEngagementMetrics,
    getUserActivityReport,
    broadcastNotification,
    searchUsersByEmail
};