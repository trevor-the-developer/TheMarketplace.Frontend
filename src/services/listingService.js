import api from './api';

const listingService = {
  async getListings() {
    const response = await api.post('/api/get/listing/', { allListings: true });
    return JSON.parse(response.data);
  },
  
  async getListing(id) {
    const response = await api.post(`/api/get/listing/${id}`, { listingId: id });
    return JSON.parse(response.data);
  }
};

export default listingService;