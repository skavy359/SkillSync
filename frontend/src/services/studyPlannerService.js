import api from './api';

export const createStudyEvent = async (data) => {
  const res = await api.post('/study-planner/events', data);
  return res.data;
};

export const getStudyEvents = async (month, year) => {
  const params = {};
  if (month && year) {
    params.month = month;
    params.year = year;
  }
  const res = await api.get('/study-planner/events', { params });
  return res.data;
};

export const updateStudyEvent = async (id, data) => {
  const res = await api.put(`/study-planner/events/${id}`, data);
  return res.data;
};

export const updateStudyEventStatus = async (id, status) => {
  const res = await api.put(`/study-planner/events/${id}/status`, { status });
  return res.data;
};

export const deleteStudyEvent = async (id) => {
  await api.delete(`/study-planner/events/${id}`);
};