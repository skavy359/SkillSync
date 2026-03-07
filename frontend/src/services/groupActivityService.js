import api from './api';

export const getGroupActivity = async (groupId, page = 0, size = 20) => {
    const { data } = await api.get(`/group-activities/groups/${groupId}`, { params: { page, size } });
    return data.data;
};