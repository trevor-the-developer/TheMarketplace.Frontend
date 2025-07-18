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
        <div>
          <button class="btn btn-outline-secondary me-2" @click="showEditForm = true">
            <i class="bi bi-pencil"></i> Edit
          </button>
          <router-link to="/listings" class="btn btn-outline-primary">
            <i class="bi bi-arrow-left"></i> Back to Listings
          </router-link>
        </div>
      </div>
      
      <!-- Edit Listing Form -->
      <div v-if="showEditForm" class="mb-4">
        <ListingForm
          :listing="listing"
          :loading="loading"
          @update="handleUpdateListing"
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
          <p class="card-text">{{ listing.description }}</p>
          <div class="text-muted mt-2">
            <small>Created: {{ formatDate(listing.createdDate) }}</small>
          </div>
        </div>
      </div>
      
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h2>Cards</h2>
        <button class="btn btn-primary" @click="showCreateCardForm = true">
          <i class="bi bi-plus"></i> Add Card
        </button>
      </div>
      
      <!-- Create Card Form -->
      <div v-if="showCreateCardForm" class="mb-4">
        <CardForm
          :listing-id="listing.id"
          :loading="cardLoading"
          @create="handleCreateCard"
          @cancel="showCreateCardForm = false"
        />
      </div>
      
      <!-- Edit Card Form -->
      <div v-if="showEditCardForm" class="mb-4">
        <CardForm
          :card="cardToEdit"
          :listing-id="listing.id"
          :loading="cardLoading"
          @update="handleUpdateCard"
          @cancel="cancelEditCard"
        />
      </div>
      
      <div v-if="!listing.cards?.length" class="alert alert-info">
        No cards available for this listing.
      </div>
      
      <CardList 
        v-else 
        :cards="listing.cards" 
        @edit="handleEditCard"
        @delete="confirmDeleteCard"
      />
    </div>
    
    <!-- Delete Card Confirmation Modal -->
    <div v-if="showDeleteCardModal" class="modal d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Confirm Delete</h5>
          </div>
          <div class="modal-body">
            <p>Are you sure you want to delete the card "{{ cardToDelete?.title }}"?</p>
            <p class="text-danger"><small>This action cannot be undone.</small></p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="cancelDeleteCard">
              Cancel
            </button>
            <button type="button" class="btn btn-danger" @click="handleDeleteCard" :disabled="cardLoading">
              <span v-if="cardLoading" class="spinner-border spinner-border-sm me-2"></span>
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
import CardList from '../components/CardList.vue';
import ListingForm from '../components/ListingForm.vue';
import CardForm from '../components/CardForm.vue';

export default {
  name: 'ListingDetail',
  components: {
    CardList,
    ListingForm,
    CardForm
  },
  data() {
    return {
      showEditForm: false,
      showCreateCardForm: false,
      showEditCardForm: false,
      showDeleteCardModal: false,
      cardToEdit: null,
      cardToDelete: null,
      successMessage: null,
      cardLoading: false
    };
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
      fetchListing: 'listings/fetchListing',
      updateListing: 'listings/updateListing',
      createCard: 'cards/createCard',
      updateCard: 'cards/updateCard',
      deleteCard: 'cards/deleteCard'
    }),
    
    async handleUpdateListing(listingData) {
      try {
        await this.updateListing({
          id: this.listing.id,
          listingData
        });
        this.showEditForm = false;
        this.successMessage = 'Listing updated successfully!';
        setTimeout(() => {
          this.successMessage = null;
        }, 3000);
      } catch (error) {
        console.error('Error updating listing:', error);
      }
    },
    
    async handleCreateCard(cardData) {
      this.cardLoading = true;
      try {
        await this.createCard(cardData);
        this.showCreateCardForm = false;
        this.successMessage = 'Card created successfully!';
        // Refresh the listing to get the updated cards
        await this.fetchListing(this.$route.params.id);
        setTimeout(() => {
          this.successMessage = null;
        }, 3000);
      } catch (error) {
        console.error('Error creating card:', error);
      } finally {
        this.cardLoading = false;
      }
    },
    
    handleEditCard(card) {
      this.cardToEdit = card;
      this.showEditCardForm = true;
      this.showCreateCardForm = false;
    },
    
    cancelEditCard() {
      this.showEditCardForm = false;
      this.cardToEdit = null;
    },
    
    async handleUpdateCard(cardData) {
      this.cardLoading = true;
      try {
        await this.updateCard({
          id: this.cardToEdit.id,
          cardData
        });
        this.showEditCardForm = false;
        this.cardToEdit = null;
        this.successMessage = 'Card updated successfully!';
        // Refresh the listing to get the updated cards
        await this.fetchListing(this.$route.params.id);
        setTimeout(() => {
          this.successMessage = null;
        }, 3000);
      } catch (error) {
        console.error('Error updating card:', error);
      } finally {
        this.cardLoading = false;
      }
    },
    
    confirmDeleteCard(card) {
      this.cardToDelete = card;
      this.showDeleteCardModal = true;
    },
    
    cancelDeleteCard() {
      this.showDeleteCardModal = false;
      this.cardToDelete = null;
    },
    
    async handleDeleteCard() {
      if (!this.cardToDelete) return;
      
      this.cardLoading = true;
      try {
        await this.deleteCard(this.cardToDelete.id);
        this.showDeleteCardModal = false;
        this.cardToDelete = null;
        this.successMessage = 'Card deleted successfully!';
        // Refresh the listing to get the updated cards
        await this.fetchListing(this.$route.params.id);
        setTimeout(() => {
          this.successMessage = null;
        }, 3000);
      } catch (error) {
        console.error('Error deleting card:', error);
      } finally {
        this.cardLoading = false;
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
