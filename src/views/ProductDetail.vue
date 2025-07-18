<template>
  <div>
    <div v-if="loading" class="text-center py-4">
      <div class="spinner-border text-primary"></div>
    </div>
    
    <div v-else-if="error" class="alert alert-danger">
      {{ error }}
    </div>
    
    <div v-else-if="!product" class="alert alert-warning">
      Product not found.
    </div>
    
    <div v-else>
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1>{{ product.title }}</h1>
        <div>
          <button class="btn btn-outline-secondary me-2" @click="showEditForm = true">
            <i class="bi bi-pencil"></i> Edit
          </button>
          <router-link :to="'/card/' + product.cardId" class="btn btn-outline-primary">
            <i class="bi bi-arrow-left"></i> Back to Card
          </router-link>
        </div>
      </div>
      
      <!-- Edit Product Form -->
      <div v-if="showEditForm" class="mb-4">
        <ProductForm
          :product="product"
          :card-id="product.cardId"
          :loading="productLoading"
          @update="handleUpdateProduct"
          @cancel="showEditForm = false"
        />
      </div>
      
      <!-- Success/Error Messages -->
      <div v-if="successMessage" class="alert alert-success alert-dismissible fade show">
        {{ successMessage }}
        <button type="button" class="btn-close" @click="successMessage = null"></button>
      </div>
      
      <div v-if="!showEditForm" class="card mb-4">
        <div class="card-body">
          <p class="card-text">{{ product.description }}</p>
          <div class="d-flex flex-wrap mb-2">
            <span class="badge bg-primary me-2 mb-1">{{ product.productType }}</span>
            <span class="badge bg-secondary me-2 mb-1">{{ product.category }}</span>
            <span class="badge bg-success me-2 mb-1">{{ product.isEnabled ? 'Enabled' : 'Disabled' }}</span>
            <span v-if="product.brand" class="badge bg-info me-2 mb-1">{{ product.brand }}</span>
          </div>
          <div class="text-muted mt-2">
            <small>Created: {{ formatDate(product.createdDate) }}</small>
          </div>
        </div>
      </div>
      
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h2>Product Details</h2>
        <button v-if="!product.productDetail" class="btn btn-primary" @click="showCreateProductDetailForm = true">
          <i class="bi bi-plus"></i> Add Product Details
        </button>
        <button v-else class="btn btn-outline-secondary" @click="showEditProductDetailForm = true">
          <i class="bi bi-pencil"></i> Edit Details
        </button>
      </div>
      
      <!-- Create Product Detail Form -->
      <div v-if="showCreateProductDetailForm" class="mb-4">
        <ProductDetailForm
          :product-id="product.id"
          :loading="productDetailLoading"
          @create="handleCreateProductDetail"
          @cancel="showCreateProductDetailForm = false"
        />
      </div>
      
      <!-- Edit Product Detail Form -->
      <div v-if="showEditProductDetailForm" class="mb-4">
        <ProductDetailForm
          :product-detail="product.productDetail"
          :product-id="product.id"
          :loading="productDetailLoading"
          @update="handleUpdateProductDetail"
          @cancel="cancelEditProductDetail"
        />
      </div>
      
      <div v-if="!product.productDetail" class="alert alert-info">
        No product details available for this product.
      </div>
      
      <div v-else class="card mb-4">
        <div class="card-header">
          <h5 class="mb-0">Product Details</h5>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-md-3">
              <strong>Price:</strong><br>
              <span class="text-success h5">${{ product.productDetail.price }}</span>
              <span v-if="product.productDetail.discountPercentage > 0" class="text-danger ms-2">
                ({{ product.productDetail.discountPercentage }}% off)
              </span>
            </div>
            <div class="col-md-3">
              <strong>Stock:</strong><br>
              <span class="badge" :class="product.productDetail.stock > 0 ? 'bg-success' : 'bg-danger'">
                {{ product.productDetail.stock }} units
              </span>
            </div>
            <div class="col-md-3">
              <strong>SKU:</strong><br>
              {{ product.productDetail.sku || 'N/A' }}
            </div>
            <div class="col-md-3">
              <strong>Weight:</strong><br>
              {{ product.productDetail.weight || 'N/A' }}{{ product.productDetail.weight ? ' kg' : '' }}
            </div>
          </div>
          
          <div class="row mt-3" v-if="product.productDetail.dimensions">
            <div class="col-md-12">
              <strong>Dimensions:</strong><br>
              {{ product.productDetail.dimensions }}
            </div>
          </div>
          
          <div class="row mt-3" v-if="product.productDetail.specifications">
            <div class="col-md-12">
              <strong>Specifications:</strong><br>
              <pre class="text-wrap">{{ product.productDetail.specifications }}</pre>
            </div>
          </div>
          
          <div class="row mt-3" v-if="product.productDetail.warrantyInfo">
            <div class="col-md-12">
              <strong>Warranty:</strong><br>
              {{ product.productDetail.warrantyInfo }}
            </div>
          </div>
        </div>
      </div>
      
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h2>Media</h2>
        <button class="btn btn-primary" @click="showCreateMediaForm = true">
          <i class="bi bi-plus"></i> Add Media
        </button>
      </div>
      
      <div class="alert alert-info">
        <i class="bi bi-info-circle"></i> 
        Media upload functionality is not yet implemented. This is a placeholder for future development.
        You can create media entries with dummy data for testing purposes.
      </div>
      
      <div v-if="!product.productDetail?.media?.length" class="alert alert-secondary">
        No media available for this product.
      </div>
      
      <div v-else class="row">
        <div v-for="media in product.productDetail.media" :key="media.id" class="col-md-4 mb-4">
          <div class="card">
            <div class="card-body">
              <h6 class="card-title">{{ media.fileName }}</h6>
              <p class="card-text">
                <small class="text-muted">Type: {{ media.mediaType }}</small><br>
                <small class="text-muted">Size: {{ media.fileSize }} bytes</small>
              </p>
              <div class="d-flex justify-content-between">
                <span class="badge bg-primary">{{ media.mediaType }}</span>
                <div class="btn-group">
                  <button 
                    class="btn btn-outline-danger btn-sm"
                    @click="confirmDeleteMedia(media)"
                    title="Delete media"
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
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import ProductForm from '../components/ProductForm.vue';
import ProductDetailForm from '../components/ProductDetailForm.vue';

export default {
  name: 'ProductDetail',
  components: {
    ProductForm,
    ProductDetailForm
  },
  data() {
    return {
      showEditForm: false,
      showCreateProductDetailForm: false,
      showEditProductDetailForm: false,
      showCreateMediaForm: false,
      showDeleteMediaModal: false,
      mediaToDelete: null,
      successMessage: null,
      productLoading: false,
      productDetailLoading: false
    };
  },
  computed: {
    ...mapGetters({
      product: 'products/currentProduct',
      loading: 'products/loading',
      error: 'products/error'
    })
  },
  
  created() {
    this.fetchProduct(this.$route.params.id);
  },
  
  methods: {
    ...mapActions({
      fetchProduct: 'products/fetchProduct',
      updateProduct: 'products/updateProduct',
      createProductDetail: 'productDetails/createProductDetail',
      updateProductDetail: 'productDetails/updateProductDetail',
      deleteMedia: 'media/deleteMedia'
    }),
    
    async handleUpdateProduct(productData) {
      this.productLoading = true;
      try {
        await this.updateProduct({
          id: this.product.id,
          productData
        });
        this.showEditForm = false;
        this.successMessage = 'Product updated successfully!';
        setTimeout(() => {
          this.successMessage = null;
        }, 3000);
      } catch (error) {
        console.error('Error updating product:', error);
      } finally {
        this.productLoading = false;
      }
    },
    
    async handleCreateProductDetail(productDetailData) {
      this.productDetailLoading = true;
      try {
        await this.createProductDetail(productDetailData);
        this.showCreateProductDetailForm = false;
        this.successMessage = 'Product detail created successfully!';
        // Refresh the product to get the updated product detail
        await this.fetchProduct(this.$route.params.id);
        setTimeout(() => {
          this.successMessage = null;
        }, 3000);
      } catch (error) {
        console.error('Error creating product detail:', error);
      } finally {
        this.productDetailLoading = false;
      }
    },
    
    cancelEditProductDetail() {
      this.showEditProductDetailForm = false;
    },
    
    async handleUpdateProductDetail(productDetailData) {
      this.productDetailLoading = true;
      try {
        await this.updateProductDetail({
          id: this.product.productDetail.id,
          productDetailData
        });
        this.showEditProductDetailForm = false;
        this.successMessage = 'Product detail updated successfully!';
        // Refresh the product to get the updated product detail
        await this.fetchProduct(this.$route.params.id);
        setTimeout(() => {
          this.successMessage = null;
        }, 3000);
      } catch (error) {
        console.error('Error updating product detail:', error);
      } finally {
        this.productDetailLoading = false;
      }
    },
    
    confirmDeleteMedia(media) {
      this.mediaToDelete = media;
      this.showDeleteMediaModal = true;
    },
    
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString();
    }
  }
}
</script>
