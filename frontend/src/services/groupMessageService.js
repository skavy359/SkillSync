import api from './api';

export const sendMessage = async (groupId, content) => {
    const { data } = await api.post(`/group-messages/groups/${groupId}`, { content });
    return data.data;
};

export const getGroupMessages = async (groupId, page = 0, size = 50) => {
    const { data } = await api.get(`/group-messages/groups/${groupId}`, { params: { page, size } });
    return data.data;
};

export const updateMessage = async (messageId, content) => {
    const { data } = await api.put(`/group-messages/${messageId}`, { content });
    return data.data;
};

export const deleteMessage = async (messageId) => {
    const { data } = await api.delete(`/group-messages/${messageId}`);
    return data.data;
};