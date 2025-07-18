import listingService from '../../services/listingService';

const state = {
  listings: [],
  currentListing: null,
  loading: false,
  error: null
};

const getters = {
  allListings: (state) => state.listings,
  currentListing: (state) => state.currentListing,
  loading: (state) => state.loading,
  error: (state) => state.error
};

const actions = {
  async fetchListings({ commit }) {
    commit('setLoading', true);
    commit('clearError');
    
    try {
      const response = await listingService.getListings();
      // Handle different response formats
      const listings = Array.isArray(response) ? response : (response.listings || []);
      commit('setListings', listings);
      return response;
    } catch (error) {
      commit('setError', error.response?.data?.detail || 'Failed to fetch listings');
      throw error;
    } finally {
      commit('setLoading', false);
    }
  },
  
  async fetchListing({ commit }, id) {
    commit('setLoading', true);
    commit('clearError');
    
    try {
      const response = await listingService.getListing(id);
      commit('setCurrentListing', response.listing);
      return response;
    } catch (error) {
      commit('setError', error.response?.data?.detail || 'Failed to fetch listing');
      throw error;
    } finally {
      commit('setLoading', false);
    }
  },
  
  async createListing({ commit }, listingData) {
    commit('setLoading', true);
    commit('clearError');
    
    try {
      const response = await listingService.createListing(listingData);
      commit('addListing', response.listing);
      return response;
    } catch (error) {
      commit('setError', error.response?.data?.detail || 'Failed to create listing');
      throw error;
    } finally {
      commit('setLoading', false);
    }
  },
  
  async updateListing({ commit }, { id, listingData }) {
    commit('setLoading', true);
    commit('clearError');
    
    try {
      const response = await listingService.updateListing(id, listingData);
      commit('updateListing', response.listing);
      return response;
    } catch (error) {
      commit('setError', error.response?.data?.detail || 'Failed to update listing');
      throw error;
    } finally {
      commit('setLoading', false);
    }
  },
  
  async deleteListing({ commit }, id) {
    commit('setLoading', true);
    commit('clearError');
    
    try {
      await listingService.deleteListing(id);
      commit('removeListing', id);
    } catch (error) {
      commit('setError', error.response?.data?.detail || 'Failed to delete listing');
      throw error;
    } finally {
      commit('setLoading', false);
    }
  }
};

const mutations = {
  setListings(state, listings) {
    state.listings = listings;
  },
  
  setCurrentListing(state, listing) {
    state.currentListing = listing;
  },
  
  addListing(state, listing) {
    state.listings.push(listing);
  },
  
  updateListing(state, updatedListing) {
    const index = state.listings.findIndex(l => l.id === updatedListing.id);
    if (index !== -1) {
      state.listings.splice(index, 1, updatedListing);
    }
    if (state.currentListing && state.currentListing.id === updatedListing.id) {
      state.currentListing = updatedListing;
    }
  },
  
  removeListing(state, listingId) {
    state.listings = state.listings.filter(l => l.id !== listingId);
    if (state.currentListing && state.currentListing.id === listingId) {
      state.currentListing = null;
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