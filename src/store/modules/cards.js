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
      commit('setError', error.response?.data?.detail || 'Failed to fetch cards');
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
      commit('setError', error.response?.data?.detail || 'Failed to fetch card');
      throw error;
    } finally {
      commit('setLoading', false);
    }
  },
  
  async createCard({ commit }, cardData) {
    commit('setLoading', true);
    commit('clearError');
    
    try {
      const response = await cardService.createCard(cardData);
      commit('addCard', response.card);
      return response;
    } catch (error) {
      commit('setError', error.response?.data?.detail || 'Failed to create card');
      throw error;
    } finally {
      commit('setLoading', false);
    }
  },
  
  async updateCard({ commit }, { id, cardData }) {
    commit('setLoading', true);
    commit('clearError');
    
    try {
      const response = await cardService.updateCard(id, cardData);
      commit('updateCard', response.card);
      return response;
    } catch (error) {
      commit('setError', error.response?.data?.detail || 'Failed to update card');
      throw error;
    } finally {
      commit('setLoading', false);
    }
  },
  
  async deleteCard({ commit }, id) {
    commit('setLoading', true);
    commit('clearError');
    
    try {
      await cardService.deleteCard(id);
      commit('removeCard', id);
    } catch (error) {
      commit('setError', error.response?.data?.detail || 'Failed to delete card');
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
  
  addCard(state, card) {
    state.cards.push(card);
  },
  
  updateCard(state, updatedCard) {
    const index = state.cards.findIndex(c => c.id === updatedCard.id);
    if (index !== -1) {
      state.cards.splice(index, 1, updatedCard);
    }
    if (state.currentCard && state.currentCard.id === updatedCard.id) {
      state.currentCard = updatedCard;
    }
  },
  
  removeCard(state, cardId) {
    state.cards = state.cards.filter(c => c.id !== cardId);
    if (state.currentCard && state.currentCard.id === cardId) {
      state.currentCard = null;
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