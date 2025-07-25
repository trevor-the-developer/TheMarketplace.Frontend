import mediaService from '../../services/mediaService';

const state = {
  media: [],
  currentMedia: null,
  loading: false,
  error: null,
  uploads: [], // Active uploads with progress
  uploadProgress: {}, // Upload progress by file ID
  validationErrors: {}, // File validation errors
  maxFileSize: 10 * 1024 * 1024, // 10MB limit
  allowedTypes: ['image/*', 'video/*', 'application/pdf']
};

const getters = {
  allMedia: (state) => state.media,
  currentMedia: (state) => state.currentMedia,
  loading: (state) => state.loading,
  error: (state) => state.error,
  uploads: (state) => state.uploads,
  uploadProgress: (state) => state.uploadProgress,
  validationErrors: (state) => state.validationErrors,
  maxFileSize: (state) => state.maxFileSize,
  allowedTypes: (state) => state.allowedTypes,
  getMediaByProductDetail: (state) => (productDetailId) => {
    return state.media.filter(media => media.productDetailId === productDetailId);
  },
  isUploading: (state) => state.uploads.length > 0
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
  },

  // Upload actions
  async uploadMedia({ commit, state }, { productDetailId, files }) {
    commit('clearError');
    
    const uploadResults = [];
    
    for (const file of files) {
      const fileId = `${file.name}-${Date.now()}`;
      
      // Validate file
      const validation = mediaService.validateFile(file, state.maxFileSize, state.allowedTypes);
      if (!validation.isValid) {
        commit('setValidationErrors', { [fileId]: validation.errors });
        continue;
      }
      
      // Add to active uploads
      commit('addUpload', { fileId, fileName: file.name, productDetailId });
      
      try {
        const onProgress = (progress) => {
          commit('setUploadProgress', { fileId, progress });
        };
        
        const result = await mediaService.uploadMediaFile(productDetailId, file, onProgress);
        commit('addMedia', result.media);
        uploadResults.push(result);
        
      } catch (error) {
        commit('setValidationErrors', { 
          [fileId]: [error.response?.data?.detail || 'Upload failed'] 
        });
        throw error;
      } finally {
        commit('removeUpload', fileId);
        commit('clearUploadProgress', fileId);
      }
    }
    
    return uploadResults;
  },

  validateFiles({ state }, files) {
    const results = [];
    
    for (const file of files) {
      const validation = mediaService.validateFile(file, state.maxFileSize, state.allowedTypes);
      results.push({
        file,
        isValid: validation.isValid,
        errors: validation.errors
      });
    }
    
    return results;
  },

  clearValidationErrors({ commit }) {
    commit('clearValidationErrors');
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
  },

  // Upload mutations
  addUpload(state, { fileId, fileName, productDetailId }) {
    state.uploads.push({ fileId, fileName, productDetailId });
  },

  removeUpload(state, fileId) {
    state.uploads = state.uploads.filter(upload => upload.fileId !== fileId);
  },

  setUploadProgress(state, { fileId, progress }) {
    state.uploadProgress = { ...state.uploadProgress, [fileId]: progress };
  },

  clearUploadProgress(state, fileId) {
    const { [fileId]: removed, ...remaining } = state.uploadProgress;
    state.uploadProgress = remaining;
  },

  setValidationErrors(state, errors) {
    state.validationErrors = { ...state.validationErrors, ...errors };
  },

  clearValidationErrors(state) {
    state.validationErrors = {};
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
