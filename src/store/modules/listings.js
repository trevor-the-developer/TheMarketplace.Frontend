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
      commit('setError', error.response?.data || 'Failed to fetch listings');
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
      commit('setError', error.response?.data || 'Failed to fetch listing');
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