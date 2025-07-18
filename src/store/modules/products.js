import productService from '../../services/productService';

const state = {
  products: [],
  currentProduct: null,
  loading: false,
  error: null
};

const getters = {
  allProducts: (state) => state.products,
  currentProduct: (state) => state.currentProduct,
  loading: (state) => state.loading,
  error: (state) => state.error,
  getProductsByCard: (state) => (cardId) => {
    return state.products.filter(product => product.cardId === cardId);
  }
};

const actions = {
  async fetchProducts({ commit }) {
    commit('setLoading', true);
    commit('clearError');
    
    try {
      const response = await productService.getProducts();
      const products = response.products || [];
      commit('setProducts', products);
      return response;
    } catch (error) {
      commit('setError', error.response?.data?.detail || 'Failed to fetch products');
      throw error;
    } finally {
      commit('setLoading', false);
    }
  },
  
  async fetchProduct({ commit }, id) {
    commit('setLoading', true);
    commit('clearError');
    
    try {
      const response = await productService.getProduct(id);
      commit('setCurrentProduct', response.product);
      return response;
    } catch (error) {
      commit('setError', error.response?.data?.detail || 'Failed to fetch product');
      throw error;
    } finally {
      commit('setLoading', false);
    }
  },
  
  async createProduct({ commit }, productData) {
    commit('setLoading', true);
    commit('clearError');
    
    try {
      const response = await productService.createProduct(productData);
      commit('addProduct', response.product);
      return response;
    } catch (error) {
      commit('setError', error.response?.data?.detail || 'Failed to create product');
      throw error;
    } finally {
      commit('setLoading', false);
    }
  },
  
  async updateProduct({ commit }, { id, productData }) {
    commit('setLoading', true);
    commit('clearError');
    
    try {
      const response = await productService.updateProduct(id, productData);
      commit('updateProduct', response.product);
      return response;
    } catch (error) {
      commit('setError', error.response?.data?.detail || 'Failed to update product');
      throw error;
    } finally {
      commit('setLoading', false);
    }
  },
  
  async deleteProduct({ commit }, id) {
    commit('setLoading', true);
    commit('clearError');
    
    try {
      await productService.deleteProduct(id);
      commit('removeProduct', id);
    } catch (error) {
      commit('setError', error.response?.data?.detail || 'Failed to delete product');
      throw error;
    } finally {
      commit('setLoading', false);
    }
  }
};

const mutations = {
  setProducts(state, products) {
    state.products = products;
  },
  
  setCurrentProduct(state, product) {
    state.currentProduct = product;
  },
  
  addProduct(state, product) {
    state.products.push(product);
  },
  
  updateProduct(state, updatedProduct) {
    const index = state.products.findIndex(p => p.id === updatedProduct.id);
    if (index !== -1) {
      state.products.splice(index, 1, updatedProduct);
    }
    if (state.currentProduct && state.currentProduct.id === updatedProduct.id) {
      state.currentProduct = updatedProduct;
    }
  },
  
  removeProduct(state, productId) {
    state.products = state.products.filter(p => p.id !== productId);
    if (state.currentProduct && state.currentProduct.id === productId) {
      state.currentProduct = null;
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
