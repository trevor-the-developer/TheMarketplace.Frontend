import mediaService from '../../services/mediaService';

const state = {
  media: [],
  currentMedia: null,
  loading: false,
  error: null
};

const getters = {
  allMedia: (state) => state.media,
  currentMedia: (state) => state.currentMedia,
  loading: (state) => state.loading,
  error: (state) => state.error,
  getMediaByProductDetail: (state) => (productDetailId) => {
    return state.media.filter(media => media.productDetailId === productDetailId);
  }
};

const actions = {
  async fetchMedia({ commit }) {
    commit('setLoading', true);
    commit('clearError');
    
    try {
      const response = await mediaService.getMedia();
      const media = response.media || [];
      commit('setMedia', media);
      return response;
    } catch (error) {
      commit('setError', error.response?.data?.detail || 'Failed to fetch media');
      throw error;
    } finally {
      commit('setLoading', false);
    }
  },
  
  async fetchMediaItem({ commit }, id) {
    commit('setLoading', true);
    commit('clearError');
    
    try {
      const response = await mediaService.getMediaItem(id);
      commit('setCurrentMedia', response.media);
      return response;
    } catch (error) {
      commit('setError', error.response?.data?.detail || 'Failed to fetch media item');
      throw error;
    } finally {
      commit('setLoading', false);
    }
  },
  
  async createMedia({ commit }, mediaData) {
    commit('setLoading', true);
    commit('clearError');
    
    try {
      const response = await mediaService.createMedia(mediaData);
      commit('addMedia', response.media);
      return response;
    } catch (error) {
      commit('setError', error.response?.data?.detail || 'Failed to create media');
      throw error;
    } finally {
      commit('setLoading', false);
    }
  },
  
  async updateMedia({ commit }, { id, mediaData }) {
    commit('setLoading', true);
    commit('clearError');
    
    try {
      const response = await mediaService.updateMedia(id, mediaData);
      commit('updateMedia', response.media);
      return response;
    } catch (error) {
      commit('setError', error.response?.data?.detail || 'Failed to update media');
      throw error;
    } finally {
      commit('setLoading', false);
    }
  },
  
  async deleteMedia({ commit }, id) {
    commit('setLoading', true);
    commit('clearError');
    
    try {
      await mediaService.deleteMedia(id);
      commit('removeMedia', id);
    } catch (error) {
      commit('setError', error.response?.data?.detail || 'Failed to delete media');
      throw error;
    } finally {
      commit('setLoading', false);
    }
  }
};

const mutations = {
  setMedia(state, media) {
    state.media = media;
  },
  
  setCurrentMedia(state, media) {
    state.currentMedia = media;
  },
  
  addMedia(state, media) {
    state.media.push(media);
  },
  
  updateMedia(state, updatedMedia) {
    const index = state.media.findIndex(m => m.id === updatedMedia.id);
    if (index !== -1) {
      state.media.splice(index, 1, updatedMedia);
    }
    if (state.currentMedia && state.currentMedia.id === updatedMedia.id) {
      state.currentMedia = updatedMedia;
    }
  },
  
  removeMedia(state, mediaId) {
    state.media = state.media.filter(m => m.id !== mediaId);
    if (state.currentMedia && state.currentMedia.id === mediaId) {
      state.currentMedia = null;
    }
  },
  
  setLoading(state, loading) {
    state.loading = loading;
  },
  
  setError(state, error) {
    state.error = error;
  },
  
  clearError(state) {
    state.error = null;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
