import api from './api';

export const getMySkills = async (params = {}) => {
    const { page = 0, size = 10, status = '', level = '', search = '' } = params;
    
    // Build query parameters - only include non-empty values
    const queryParams = { page, size };
    if (status && status.trim()) queryParams.status = status;
    if (level && level.trim()) queryParams.level = level;
    if (search && search.trim()) queryParams.search = search;
    
    const { data } = await api.get('/skills', {
        params: queryParams,
    });
    return data.data; // Page<SkillResponse>
};

export const addSkill = async (skillData) => {
    const { data } = await api.post('/skills', skillData);
    return data.data;
};

export const updateSkill = async (skillId, skillData) => {
    const { data } = await api.put(`/skills/${skillId}`, skillData);
    return data.data;
};

export const updateSkillProgress = async (skillId, progressData) => {
    const { data } = await api.patch(`/skills/${skillId}/progress`, progressData);
    return data.data;
};

export const deleteSkill = async (skillId) => {
    const { data } = await api.delete(`/skills/${skillId}`);
    return data;
};

export const getSessions = async (skillId) => {
    const { data } = await api.get(`/skills/${skillId}/sessions`);
    return data.data;
};

export const addSession = async (skillId, sessionData) => {
    const { data } = await api.post(`/skills/${skillId}/sessions`, sessionData);
    return data.data;
};

export const getSessionStats = async (skillId) => {
    const { data } = await api.get(`/skills/${skillId}/session-stats`);
    return data.data;
};

export const assignCategory = async (skillId, categoryId) => {
    const { data } = await api.put(`/skills/${skillId}/category/${categoryId}`);
    return data.data;
};