import api from './api';

export const loginUser = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data; // Already returns ApiResponse<LoginResponse>
};

export const registerUser = async (name, email, password) => {
    const response = await api.post('/auth/register', { name, email, password });
    return response.data; // Returns ApiResponse<UserResponse>
};