<template>
  <div>
    <h1 class="mb-4">Listings</h1>
    
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
              <router-link :to="'/listing/' + listing.id" class="btn btn-primary">
                View Details
              </router-link>
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
  name: 'ListingList',
  
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
      fetchListings: 'listings/fetchListings'
    })
  }
}
</script>