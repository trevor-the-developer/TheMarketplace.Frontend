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
      
      <h2 class="mb-3">Products</h2>
      
      <div v-if="!card.products?.length" class="alert alert-info">
        No products available for this card.
      </div>
      
      <div v-else class="row">
        <div v-for="product in card.products" :key="product.id" class="col-md-4 mb-4">
          <div class="card h-100">
            <div class="card-body">
              <h5 class="card-title">{{ product.title }}</h5>
              <p class="card-text">{{ product.description }}</p>
              <div class="mt-auto">
                <div class="d-flex mt-2">
                  <span class="badge bg-primary me-2">{{ product.productType }}</span>
                  <span class="badge bg-secondary me-2">{{ product.category }}</span>
                  <span class="badge bg-success me-2">Status: {{ product.isEnabled ? 'Enabled' : 'Disabled' }}</span>
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

export default {
  name: 'CardDetail',
  
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
      fetchCard: 'cards/fetchCard'
    }),
    
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString();
    }
  }
}
</script>