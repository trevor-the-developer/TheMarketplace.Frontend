import api from './api';

const cardService = {
  async getCards() {
    const response = await api.post('/api/get/cards/', { allCards: true });
    return JSON.parse(response.data);
  },
  
  async getCard(id) {
    const response = await api.post(`/api/get/card/${id}`, { cardId: id });
    return JSON.parse(response.data);
  }
};

export default cardService;