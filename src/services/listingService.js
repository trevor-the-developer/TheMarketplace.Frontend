import api from './api';

const listingService = {
  async getListings() {
    const response = await api.get('/listings');
    return response.data;
  },
  
  async getListing(id) {
    const response = await api.get(`/listings/${id}`);
    return response.data;
  }
};

export default listingService;