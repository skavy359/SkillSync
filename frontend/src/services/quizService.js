import api from './api';

export const generateQuiz = async (skillName, difficulty = 'INTERMEDIATE', count = 5) => {
  const res = await api.post('/quiz/generate', { skillName, difficulty, count });
  return res.data;
};

export const submitQuizAttempt = async (data) => {
  const res = await api.post('/quiz/submit', data);
  return res.data;
};

export const getQuizHistory = async (skillId = null) => {
  const params = {};
  if (skillId) params.skillId = skillId;
  const res = await api.get('/quiz/history', { params });
  return res.data;
};
