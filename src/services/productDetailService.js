import api from './api';

const productDetailService = {
  async getProductDetails() {
    const response = await api.get('/product-details');
    return response.data;
  },
  
  async getProductDetail(id) {
    const response = await api.get(`/product-details/${id}`);
    return response.data;
  },
  
  async createProductDetail(productDetailData) {
    const response = await api.post('/product-details', productDetailData);
    return response.data;
  },
  
  async updateProductDetail(id, productDetailData) {
    const response = await api.put(`/product-details/${id}`, productDetailData);
    return response.data;
  },
  
  async deleteProductDetail(id) {
    const response = await api.delete(`/product-details/${id}`);
    return response.data;
  }
};

export default productDetailService;
