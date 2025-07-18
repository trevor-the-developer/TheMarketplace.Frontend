import api from './api';

const cardService = {
  async getCards() {
    const response = await api.get('/cards');
    return response.data;
  },
  
  async getCard(id) {
    const response = await api.get(`/cards/${id}`);
    return response.data;
  },
  
  async createCard(cardData) {
    const response = await api.post('/cards', cardData);
    return response.data;
  },
  
  async updateCard(id, cardData) {
    const response = await api.put(`/cards/${id}`, cardData);
    return response.data;
  },
  
  async deleteCard(id) {
    const response = await api.delete(`/cards/${id}`);
    return response.data;
  }
};

export default cardService;
