import api from './api';

// --- Posts ---

export const createPost = async (data) => {
  const res = await api.post('/forum/posts', data);
  return res.data;
};

export const getPosts = async (params = {}) => {
  const res = await api.get('/forum/posts', { params });
  return res.data;
};

export const getPost = async (id) => {
  const res = await api.get(`/forum/posts/${id}`);
  return res.data;
};

export const deletePost = async (id) => {
  const res = await api.delete(`/forum/posts/${id}`);
  return res.data;
};

// --- Replies ---

export const getReplies = async (postId) => {
  const res = await api.get(`/forum/posts/${postId}/replies`);
  return res.data;
};

export const addReply = async (postId, data) => {
  const res = await api.post(`/forum/posts/${postId}/replies`, data);
  return res.data;
};

export const deleteReply = async (postId, replyId) => {
  const res = await api.delete(`/forum/posts/${postId}/replies/${replyId}`);
  return res.data;
};

// --- Upvotes ---

export const togglePostUpvote = async (postId) => {
  const res = await api.post(`/forum/posts/${postId}/upvote`);
  return res.data;
};

export const toggleReplyUpvote = async (replyId) => {
  const res = await api.post(`/forum/replies/${replyId}/upvote`);
  return res.data;
};

// --- Accept Answer ---

export const acceptAnswer = async (replyId) => {
  const res = await api.put(`/forum/replies/${replyId}/accept`);
  return res.data;
};
