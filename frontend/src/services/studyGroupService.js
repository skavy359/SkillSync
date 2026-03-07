import api from './api';

export const createStudyGroup = async (groupData) => {
    const { data } = await api.post('/study-groups', groupData);
    return data.data;
};

export const getGroup = async (groupId) => {
    const { data } = await api.get(`/study-groups/${groupId}`);
    return data.data;
};

export const listPublicGroups = async (page = 0, size = 10) => {
    const { data } = await api.get('/study-groups', { params: { page, size } });
    return data.data;
};

export const searchGroups = async (query, page = 0, size = 10) => {
    const { data } = await api.get('/study-groups/search', { params: { query, page, size } });
    return data.data;
};

export const listGroupsBySkill = async (skillId, page = 0, size = 10) => {
    const { data } = await api.get(`/study-groups/skill/${skillId}`, { params: { page, size } });
    return data.data;
};

export const getMyGroups = async () => {
    const { data } = await api.get('/study-groups/my-groups');
    return data.data;
};

export const joinGroup = async (groupId) => {
    const { data } = await api.post(`/study-groups/${groupId}/join`);
    return data.data;
};

export const getGroupMembers = async (groupId) => {
    const { data } = await api.get(`/study-groups/${groupId}/members`);
    return data.data;
};

export const addMember = async (groupId, memberId) => {
    const { data } = await api.post(`/study-groups/${groupId}/members/${memberId}`);
    return data.data;
};

export const removeMember = async (groupId, memberId) => {
    const { data } = await api.delete(`/study-groups/${groupId}/members/${memberId}`);
    return data.data;
};

export const inviteUser = async (groupId, userId) => {
    const { data } = await api.post(`/group-invitations/groups/${groupId}`, { userId });
    return data.data;
};

export const inviteUserByEmail = async (groupId, email) => {
    const { data } = await api.post(`/group-invitations/groups/${groupId}/invite-by-email`, { email });
    return data.data;
};

export const acceptInvitation = async (invitationId) => {
    const { data } = await api.post(`/group-invitations/${invitationId}/accept`);
    return data.data;
};

export const rejectInvitation = async (invitationId) => {
    const { data } = await api.post(`/group-invitations/${invitationId}/reject`);
    return data.data;
};

export const getMyInvitations = async () => {
    const { data } = await api.get('/group-invitations/my-invitations');
    return data.data;
};

export const getGroupInvitations = async (groupId) => {
    const { data } = await api.get(`/group-invitations/groups/${groupId}`);
    return data.data;
};

export const updateGroup = async (groupId, updateData) => {
    const { data } = await api.put(`/study-groups/${groupId}`, updateData);
    return data.data;
};
