import productDetailService from '../../services/productDetailService';

const state = {
  productDetails: [],
  currentProductDetail: null,
  loading: false,
  error: null
};

const getters = {
  allProductDetails: (state) => state.productDetails,
  currentProductDetail: (state) => state.currentProductDetail,
  loading: (state) => state.loading,
  error: (state) => state.error,
  getProductDetailByProduct: (state) => (productId) => {
    return state.productDetails.find(detail => detail.productId === productId);
  }
};

const actions = {
  async fetchProductDetails({ commit }) {
    commit('setLoading', true);
    commit('clearError');
    
    try {
      const response = await productDetailService.getProductDetails();
      const productDetails = response.productDetails || [];
      commit('setProductDetails', productDetails);
      return response;
    } catch (error) {
      commit('setError', error.response?.data?.detail || 'Failed to fetch product details');
      throw error;
    } finally {
      commit('setLoading', false);
    }
  },
  
  async fetchProductDetail({ commit }, id) {
    commit('setLoading', true);
    commit('clearError');
    
    try {
      const response = await productDetailService.getProductDetail(id);
      commit('setCurrentProductDetail', response.productDetail);
      return response;
    } catch (error) {
      commit('setError', error.response?.data?.detail || 'Failed to fetch product detail');
      throw error;
    } finally {
      commit('setLoading', false);
    }
  },
  
  async createProductDetail({ commit }, productDetailData) {
    commit('setLoading', true);
    commit('clearError');
    
    try {
      const response = await productDetailService.createProductDetail(productDetailData);
      commit('addProductDetail', response.productDetail);
      return response;
    } catch (error) {
      commit('setError', error.response?.data?.detail || 'Failed to create product detail');
      throw error;
    } finally {
      commit('setLoading', false);
    }
  },
  
  async updateProductDetail({ commit }, { id, productDetailData }) {
    commit('setLoading', true);
    commit('clearError');
    
    try {
      const response = await productDetailService.updateProductDetail(id, productDetailData);
      commit('updateProductDetail', response.productDetail);
      return response;
    } catch (error) {
      commit('setError', error.response?.data?.detail || 'Failed to update product detail');
      throw error;
    } finally {
      commit('setLoading', false);
    }
  },
  
  async deleteProductDetail({ commit }, id) {
    commit('setLoading', true);
    commit('clearError');
    
    try {
      await productDetailService.deleteProductDetail(id);
      commit('removeProductDetail', id);
    } catch (error) {
      commit('setError', error.response?.data?.detail || 'Failed to delete product detail');
      throw error;
    } finally {
      commit('setLoading', false);
    }
  }
};

const mutations = {
  setProductDetails(state, productDetails) {
    state.productDetails = productDetails;
  },
  
  setCurrentProductDetail(state, productDetail) {
    state.currentProductDetail = productDetail;
  },
  
  addProductDetail(state, productDetail) {
    state.productDetails.push(productDetail);
  },
  
  updateProductDetail(state, updatedProductDetail) {
    const index = state.productDetails.findIndex(pd => pd.id === updatedProductDetail.id);
    if (index !== -1) {
      state.productDetails.splice(index, 1, updatedProductDetail);
    }
    if (state.currentProductDetail && state.currentProductDetail.id === updatedProductDetail.id) {
      state.currentProductDetail = updatedProductDetail;
    }
  },
  
  removeProductDetail(state, productDetailId) {
    state.productDetails = state.productDetails.filter(pd => pd.id !== productDetailId);
    if (state.currentProductDetail && state.currentProductDetail.id === productDetailId) {
      state.currentProductDetail = null;
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
