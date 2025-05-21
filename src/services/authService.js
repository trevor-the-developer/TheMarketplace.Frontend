import api from './api';

const authService = {
  async login(credentials) {
    const response = await api.post('/api/login/', credentials);
    return JSON.parse(response.data);
  },
  
  async register(userData) {
    const response = await api.post('/api/register/', userData);
    return JSON.parse(response.data);
  },
  
  async confirmEmail(confirmData) {
    const url = `/api/confirm_email/?userId=${confirmData.userId}&code=${confirmData.code}`;
    const response = await api.get(url);
    return JSON.parse(response.data);
  },
  
  async completeRegistration(registrationData) {
    const response = await api.post('/api/register/step-two', registrationData);
    return JSON.parse(response.data);
  },
  
  async refreshToken(refreshData) {
    const response = await api.post('/api/refresh/', refreshData);
    return JSON.parse(response.data);
  },
  
  async logout() {
    const response = await api.post('/api/logout/', {});
    return JSON.parse(response.data);
  }
};

export default authService;