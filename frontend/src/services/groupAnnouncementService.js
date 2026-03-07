import api from './api';

export const createAnnouncement = async (groupId, title, content, isPinned = false) => {
    const { data } = await api.post(`/group-announcements/groups/${groupId}`, { 
        title, 
        content, 
        isPinned 
    });
    return data.data;
};

export const getAnnouncements = async (groupId, page = 0, size = 20) => {
    const { data } = await api.get(`/group-announcements/groups/${groupId}`, { params: { page, size } });
    return data.data;
};

export const getPinnedAnnouncements = async (groupId) => {
    const { data } = await api.get(`/group-announcements/groups/${groupId}/pinned`);
    return data.data;
};

export const togglePinAnnouncement = async (announcementId) => {
    const { data } = await api.put(`/group-announcements/${announcementId}/toggle-pin`);
    return data.data;
};

export const deleteAnnouncement = async (announcementId) => {
    const { data } = await api.delete(`/group-announcements/${announcementId}`);
    return data.data;
};