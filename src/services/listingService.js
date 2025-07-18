import api from './api';

const listingService = {
  async getListings() {
    const response = await api.get('/listings');
    return response.data;
  },
  
  async getListing(id) {
    const response = await api.get(`/listings/${id}`);
    return response.data;
  },
  
  async createListing(listingData) {
    const response = await api.post('/listings', listingData);
    return response.data;
  },
  
  async updateListing(id, listingData) {
    const response = await api.put(`/listings/${id}`, listingData);
    return response.data;
  },
  
  async deleteListing(id) {
    const response = await api.delete(`/listings/${id}`);
    return response.data;
  }
};

export default listingService;
