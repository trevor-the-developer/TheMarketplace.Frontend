<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <div class="container">
      <router-link class="navbar-brand" to="/">The Marketplace</router-link>
      
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span class="navbar-toggler-icon"></span>
      </button>
      
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto">
          <li class="nav-item" v-if="isAuthenticated">
            <router-link class="nav-link" to="/listings">Listings</router-link>
          </li>
        </ul>
        
        <ul class="navbar-nav">
          <li class="nav-item" v-if="!isAuthenticated">
            <router-link class="nav-link" to="/login">Login</router-link>
          </li>
          <li class="nav-item" v-if="!isAuthenticated">
            <router-link class="nav-link" to="/register">Register</router-link>
          </li>
          <li class="nav-item" v-if="isAuthenticated">
            <span class="nav-link">{{ user?.email }}</span>
          </li>
          <li class="nav-item" v-if="isAuthenticated">
            <button class="nav-link btn btn-link" @click="logout">Logout</button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'Navbar',
  
  computed: {
    ...mapGetters({
      isAuthenticated: 'auth/isAuthenticated',
      user: 'auth/user'
    })
  },
  
  methods: {
    ...mapActions({
      logoutAction: 'auth/logout'
    }),
    
    async logout() {
      await this.logoutAction();
      this.$router.push('/login');
    }
  }
}
</script>