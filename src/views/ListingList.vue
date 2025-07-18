<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1>Listings</h1>
      <button class="btn btn-primary" @click="showCreateForm = true">
        <i class="bi bi-plus"></i> Create Listing
      </button>
    </div>
    
    <!-- Create Listing Form -->
    <div v-if="showCreateForm" class="mb-4">
      <ListingForm
        :loading="loading"
        @create="handleCreateListing"
        @cancel="showCreateForm = false"
      />
    </div>
    
    <!-- Success/Error Messages -->
    <div v-if="successMessage" class="alert alert-success alert-dismissible fade show">
      {{ successMessage }}
      <button type="button" class="btn-close" @click="successMessage = null"></button>
    </div>
    
    <div v-if="loading" class="text-center py-4">
      <div class="spinner-border text-primary"></div>
    </div>
    
    <div v-else-if="error" class="alert alert-danger">
      {{ error }}
    </div>
    
    <div v-else-if="!listings.length" class="alert alert-info">
      No listings available.
    </div>
    
    <div v-else>
      <div class="row">
        <div v-for="listing in listings" :key="listing.id" class="col-md-6 mb-4">
          <div class="card h-100">
            <div class="card-body">
              <h5 class="card-title">{{ listing.title }}</h5>
              <p class="card-text">{{ listing.description }}</p>
              <p class="card-text">
                <small class="text-muted">
                  Cards: {{ listing.cards?.length || 0 }}
                </small>
              </p>
              <div class="d-flex justify-content-between align-items-center">
                <router-link :to="'/listing/' + listing.id" class="btn btn-primary">
                  View Details
                </router-link>
                <button 
                  class="btn btn-outline-danger btn-sm"
                  @click="confirmDelete(listing)"
                  :disabled="loading"
                >
                  <i class="bi bi-trash"></i> Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Confirm Delete</h5>
          </div>
          <div class="modal-body">
            <p>Are you sure you want to delete the listing "{{ listingToDelete?.title }}"?</p>
            <p class="text-danger"><small>This action cannot be undone.</small></p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="cancelDelete">
              Cancel
            </button>
            <button type="button" class="btn btn-danger" @click="handleDeleteListing" :disabled="loading">
              <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
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
import ListingForm from '../components/ListingForm.vue';

export default {
  name: 'ListingList',
  components: {
    ListingForm
  },
  data() {
    return {
      showCreateForm: false,
      showDeleteModal: false,
      listingToDelete: null,
      successMessage: null
    };
  },
  computed: {
    ...mapGetters({
      listings: 'listings/allListings',
      loading: 'listings/loading',
      error: 'listings/error'
    })
  },
  
  created() {
    this.fetchListings();
  },
  
  methods: {
    ...mapActions({
      fetchListings: 'listings/fetchListings',
      createListing: 'listings/createListing',
      deleteListing: 'listings/deleteListing'
    }),
    
    async handleCreateListing(listingData) {
      try {
        await this.createListing(listingData);
        this.showCreateForm = false;
        this.successMessage = 'Listing created successfully!';
        setTimeout(() => {
          this.successMessage = null;
        }, 3000);
      } catch (error) {
        console.error('Error creating listing:', error);
      }
    },
    
    confirmDelete(listing) {
      this.listingToDelete = listing;
      this.showDeleteModal = true;
    },
    
    cancelDelete() {
      this.showDeleteModal = false;
      this.listingToDelete = null;
    },
    
    async handleDeleteListing() {
      if (!this.listingToDelete) return;
      
      try {
        await this.deleteListing(this.listingToDelete.id);
        this.showDeleteModal = false;
        this.listingToDelete = null;
        this.successMessage = 'Listing deleted successfully!';
        setTimeout(() => {
          this.successMessage = null;
        }, 3000);
      } catch (error) {
        console.error('Error deleting listing:', error);
      }
    }
  }
}
</script>
