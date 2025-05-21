import authService from '../../services/authService';

const state = {
  token: localStorage.getItem('token') || null,
  refreshToken: localStorage.getItem('refreshToken') || null,
  user: JSON.parse(localStorage.getItem('user')) || null,
  loading: false,
  error: null
};

const getters = {
  isAuthenticated: (state) => !!state.token,
  user: (state) => state.user,
  loading: (state) => state.loading,
  error: (state) => state.error
};

const actions = {
  async login({ commit }, credentials) {
    commit('setLoading', true);
    commit('clearError');
    
    try {
      const response = await authService.login(credentials);
      commit('setToken', response.securityToken);
      commit('setRefreshToken', response.refreshToken);
      commit('setUser', {
        id: response.id,
        email: response.email
      });
      return response;
    } catch (error) {
      commit('setError', error.response?.data || 'Login failed');
      throw error;
    } finally {
      commit('setLoading', false);
    }
  },
  
  async register({ commit }, userData) {
    commit('setLoading', true);
    commit('clearError');
    
    try {
      const response = await authService.register(userData);
      return response;
    } catch (error) {
      commit('setError', error.response?.data || 'Registration failed');
      throw error;
    } finally {
      commit('setLoading', false);
    }
  },
  
  async confirmEmail({ commit }, confirmData) {
    commit('setLoading', true);
    commit('clearError');
    
    try {
      const response = await authService.confirmEmail(confirmData);
      return response;
    } catch (error) {
      commit('setError', error.response?.data || 'Email confirmation failed');
      throw error;
    } finally {
      commit('setLoading', false);
    }
  },
  
  async completeRegistration({ commit }, registrationData) {
    commit('setLoading', true);
    commit('clearError');
    
    try {
      const response = await authService.completeRegistration(registrationData);
      return response;
    } catch (error) {
      commit('setError', error.response?.data || 'Registration completion failed');
      throw error;
    } finally {
      commit('setLoading', false);
    }
  },
  
  async refreshToken({ commit, state }) {
    if (!state.refreshToken) return;
    
    try {
      const response = await authService.refreshToken({ refreshToken: state.refreshToken });
      commit('setToken', response.securityToken);
      commit('setRefreshToken', response.refreshToken);
      return response;
    } catch (error) {
      commit('logout');
      throw error;
    }
  },
  
  async logout({ commit }) {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      commit('logout');
    }
  }
};

const mutations = {
  setToken(state, token) {
    state.token = token;
    localStorage.setItem('token', token);
  },
  
  setRefreshToken(state, refreshToken) {
    state.refreshToken = refreshToken;
    localStorage.setItem('refreshToken', refreshToken);
  },
  
  setUser(state, user) {
    state.user = user;
    localStorage.setItem('user', JSON.stringify(user));
  },
  
  setLoading(state, loading) {
    state.loading = loading;
  },
  
  setError(state, error) {
    state.error = error;
  },
  
  clearError(state) {
    state.error = null;
  },
  
  logout(state) {
    state.token = null;
    state.refreshToken = null;
    state.user = null;
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};