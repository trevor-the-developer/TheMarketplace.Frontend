import api from './api';

const authService = {
  async login(credentials) {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  
  async register(userData) {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  
  async confirmEmail(confirmData) {
    const url = `/auth/confirm-email?email=${encodeURIComponent(confirmData.email)}&userId=${encodeURIComponent(confirmData.userId)}&token=${encodeURIComponent(confirmData.token)}`;
    const response = await api.get(url);
    return response.data;
  },
  
  
  async refreshToken(refreshData) {
    const response = await api.post('/auth/refresh', refreshData);
    return response.data;
  },
  
  async logout(tokenData) {
    const response = await api.post('/auth/logout', tokenData);
    return response.data;
  }
};

export default authService;