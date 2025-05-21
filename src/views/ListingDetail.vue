<template>
  <div>
    <div v-if="loading" class="text-center py-4">
      <div class="spinner-border text-primary"></div>
    </div>
    
    <div v-else-if="error" class="alert alert-danger">
      {{ error }}
    </div>
    
    <div v-else-if="!listing" class="alert alert-warning">
      Listing not found.
    </div>
    
    <div v-else>
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1>{{ listing.title }}</h1>
        <router-link to="/listings" class="btn btn-outline-primary">
          <i class="bi bi-arrow-left"></i> Back to Listings
        </router-link>
      </div>
      
      <div class="card mb-4">
        <div class="card-body">
          <p class="card-text">{{ listing.description }}</p>
          <div class="text-muted mt-2">
            <small>Created: {{ formatDate(listing.createdDate) }}</small>
          </div>
        </div>
      </div>
      
      <h2 class="mb-3">Cards</h2>
      
      <div v-if="!listing.cards?.length" class="alert alert-info">
        No cards available for this listing.
      </div>
      
      <CardList v-else :cards="listing.cards" />
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import CardList from '../components/CardList.vue';

export default {
  name: 'ListingDetail',
  components: {
    CardList
  },
  
  computed: {
    ...mapGetters({
      listing: 'listings/currentListing',
      loading: 'listings/loading',
      error: 'listings/error'
    })
  },
  
  created() {
    this.fetchListing(this.$route.params.id);
  },
  
  methods: {
    ...mapActions({
      fetchListing: 'listings/fetchListing'
    }),
    
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString();
    }
  }
}
</script>