import api from './api';

const mediaService = {
  async getMedia() {
    const response = await api.get('/media');
    return response.data;
  },
  
  async getMediaItem(id) {
    const response = await api.get(`/media/${id}`);
    return response.data;
  },
  
  async createMedia(mediaData) {
    const response = await api.post('/media', mediaData);
    return response.data;
  },
  
  async updateMedia(id, mediaData) {
    const response = await api.put(`/media/${id}`, mediaData);
    return response.data;
  },
  
  async deleteMedia(id) {
    const response = await api.delete(`/media/${id}`);
    return response.data;
  }
};

export default mediaService;
