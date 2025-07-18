<template>
  <div>
    <div v-if="loading" class="text-center py-4">
      <div class="spinner-border text-primary"></div>
    </div>
    
    <div v-else-if="error" class="alert alert-danger">
      {{ error }}
    </div>
    
    <div v-else-if="!card" class="alert alert-warning">
      Card not found.
    </div>
    
    <div v-else>
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1>{{ card.title }}</h1>
        <router-link :to="'/listing/' + card.listingId" class="btn btn-outline-primary">
          <i class="bi bi-arrow-left"></i> Back to Listing
        </router-link>
      </div>
      
      <div class="card mb-4" :style="{ borderColor: card.colour || '#007bff' }">
        <div class="card-body">
          <p class="card-text">{{ card.description }}</p>
          <div class="mt-2">
            <span class="badge bg-secondary me-2">Status: {{ card.isEnabled ? 'Enabled' : 'Disabled' }}</span>
          </div>
          <div class="text-muted mt-2">
            <small>Created: {{ formatDate(card.createdDate) }}</small>
          </div>
        </div>
      </div>
      
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h2>Products</h2>
        <button class="btn btn-primary" @click="showCreateProductForm = true">
          <i class="bi bi-plus"></i> Add Product
        </button>
      </div>
      
      <!-- Success/Error Messages -->
      <div v-if="successMessage" class="alert alert-success alert-dismissible fade show">
        {{ successMessage }}
        <button type="button" class="btn-close" @click="successMessage = null"></button>
      </div>
      
      <!-- Create Product Form -->
      <div v-if="showCreateProductForm" class="mb-4">
        <ProductForm
          :card-id="card.id"
          :loading="productLoading"
          @create="handleCreateProduct"
          @cancel="showCreateProductForm = false"
        />
      </div>
      
      <!-- Edit Product Form -->
      <div v-if="showEditProductForm" class="mb-4">
        <ProductForm
          :product="productToEdit"
          :card-id="card.id"
          :loading="productLoading"
          @update="handleUpdateProduct"
          @cancel="cancelEditProduct"
        />
      </div>
      
      <div v-if="!card.products?.length" class="alert alert-info">
        No products available for this card.
      </div>
      
      <div v-else class="row">
        <div v-for="product in card.products" :key="product.id" class="col-md-4 mb-4">
          <div class="card h-100">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">{{ product.title }}</h5>
              <p class="card-text">{{ product.description }}</p>
              <div class="mt-auto">
                <div class="d-flex flex-wrap mb-2">
                  <span class="badge bg-primary me-2 mb-1">{{ product.productType }}</span>
                  <span class="badge bg-secondary me-2 mb-1">{{ product.category }}</span>
                  <span class="badge bg-success me-2 mb-1">{{ product.isEnabled ? 'Enabled' : 'Disabled' }}</span>
                  <span v-if="product.brand" class="badge bg-info me-2 mb-1">{{ product.brand }}</span>
                </div>
                <div class="d-flex justify-content-between align-items-center">
                  <router-link :to="'/product/' + product.id" class="btn btn-sm btn-primary">
                    View Details
                  </router-link>
                  <div class="btn-group">
                    <button 
                      class="btn btn-outline-secondary btn-sm"
                      @click="handleEditProduct(product)"
                      title="Edit product"
                    >
                      <i class="bi bi-pencil"></i>
                    </button>
                    <button 
                      class="btn btn-outline-danger btn-sm"
                      @click="confirmDeleteProduct(product)"
                      title="Delete product"
                    >
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Delete Product Confirmation Modal -->
    <div v-if="showDeleteProductModal" class="modal d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Confirm Delete</h5>
          </div>
          <div class="modal-body">
            <p>Are you sure you want to delete the product "{{ productToDelete?.title }}"?</p>
            <p class="text-danger"><small>This action cannot be undone.</small></p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="cancelDeleteProduct">
              Cancel
            </button>
            <button type="button" class="btn btn-danger" @click="handleDeleteProduct" :disabled="productLoading">
              <span v-if="productLoading" class="spinner-border spinner-border-sm me-2"></span>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import ProductForm from '../components/ProductForm.vue';

export default {
  name: 'CardDetail',
  components: {
    ProductForm
  },
  data() {
    return {
      showCreateProductForm: false,
      showEditProductForm: false,
      showDeleteProductModal: false,
      productToEdit: null,
      productToDelete: null,
      successMessage: null,
      productLoading: false
    };
  },
  computed: {
    ...mapGetters({
      card: 'cards/currentCard',
      loading: 'cards/loading',
      error: 'cards/error'
    })
  },
  
  created() {
    this.fetchCard(this.$route.params.id);
  },
  
  methods: {
    ...mapActions({
      fetchCard: 'cards/fetchCard',
      createProduct: 'products/createProduct',
      updateProduct: 'products/updateProduct',
      deleteProduct: 'products/deleteProduct'
    }),
    
    async handleCreateProduct(productData) {
      this.productLoading = true;
      try {
        await this.createProduct(productData);
        this.showCreateProductForm = false;
        this.successMessage = 'Product created successfully!';
        // Refresh the card to get the updated products
        await this.fetchCard(this.$route.params.id);
        setTimeout(() => {
          this.successMessage = null;
        }, 3000);
      } catch (error) {
        console.error('Error creating product:', error);
      } finally {
        this.productLoading = false;
      }
    },
    
    handleEditProduct(product) {
      this.productToEdit = product;
      this.showEditProductForm = true;
      this.showCreateProductForm = false;
    },
    
    cancelEditProduct() {
      this.showEditProductForm = false;
      this.productToEdit = null;
    },
    
    async handleUpdateProduct(productData) {
      this.productLoading = true;
      try {
        await this.updateProduct({
          id: this.productToEdit.id,
          productData
        });
        this.showEditProductForm = false;
        this.productToEdit = null;
        this.successMessage = 'Product updated successfully!';
        // Refresh the card to get the updated products
        await this.fetchCard(this.$route.params.id);
        setTimeout(() => {
          this.successMessage = null;
        }, 3000);
      } catch (error) {
        console.error('Error updating product:', error);
      } finally {
        this.productLoading = false;
      }
    },
    
    confirmDeleteProduct(product) {
      this.productToDelete = product;
      this.showDeleteProductModal = true;
    },
    
    cancelDeleteProduct() {
      this.showDeleteProductModal = false;
      this.productToDelete = null;
    },
    
    async handleDeleteProduct() {
      if (!this.productToDelete) return;
      
      this.productLoading = true;
      try {
        await this.deleteProduct(this.productToDelete.id);
        this.showDeleteProductModal = false;
        this.productToDelete = null;
        this.successMessage = 'Product deleted successfully!';
        // Refresh the card to get the updated products
        await this.fetchCard(this.$route.params.id);
        setTimeout(() => {
          this.successMessage = null;
        }, 3000);
      } catch (error) {
        console.error('Error deleting product:', error);
      } finally {
        this.productLoading = false;
      }
    },
    
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString();
    }
  }
}
</script>
