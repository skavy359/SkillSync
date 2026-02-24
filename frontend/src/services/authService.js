import api from './api';

export const loginUser = async (email, password, rememberMe = false) => {
    const response = await api.post('/auth/login', { email, password, rememberMe });
    return response.data;
};

export const registerUser = async (name, email, password) => {
    const response = await api.post('/auth/register', { name, email, password });
    return response.data;
};