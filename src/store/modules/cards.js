import cardService from '../../services/cardService';

const state = {
  cards: [],
  currentCard: null,
  loading: false,
  error: null
};

const getters = {
  allCards: (state) => state.cards,
  currentCard: (state) => state.currentCard,
  loading: (state) => state.loading,
  error: (state) => state.error
};

const actions = {
  async fetchCards({ commit }) {
    commit('setLoading', true);
    commit('clearError');
    
    try {
      const response = await cardService.getCards();
      commit('setCards', response.cards);
      return response;
    } catch (error) {
      commit('setError', error.response?.data || 'Failed to fetch cards');
      throw error;
    } finally {
      commit('setLoading', false);
    }
  },
  
  async fetchCard({ commit }, id) {
    commit('setLoading', true);
    commit('clearError');
    
    try {
      const response = await cardService.getCard(id);
      commit('setCurrentCard', response.card);
      return response;
    } catch (error) {
      commit('setError', error.response?.data || 'Failed to fetch card');
      throw error;
    } finally {
      commit('setLoading', false);
    }
  }
};

const mutations = {
  setCards(state, cards) {
    state.cards = cards;
  },
  
  setCurrentCard(state, card) {
    state.currentCard = card;
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