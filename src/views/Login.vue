<template>
  <div class="row justify-content-center">
    <div class="col-md-6">
      <div class="card">
        <div class="card-header bg-primary text-white">
          <h4 class="mb-0">Login</h4>
        </div>
        <div class="card-body">
          <div v-if="error" class="alert alert-danger">{{ error }}</div>
          
          <form @submit.prevent="handleLogin">
            <div class="mb-3">
              <label for="email" class="form-label">Email</label>
              <input
                type="email"
                id="email"
                v-model="email"
                class="form-control"
                required
              />
            </div>
            
            <div class="mb-3">
              <label for="password" class="form-label">Password</label>
              <input
                type="password"
                id="password"
                v-model="password"
                class="form-control"
                required
              />
            </div>
            
            <div class="d-grid">
              <button type="submit" class="btn btn-primary" :disabled="loading">
                <span v-if="loading" class="spinner-border spinner-border-sm me-1"></span>
                Login
              </button>
            </div>
          </form>
          
          <div class="mt-3 text-center">
            <p>Don't have an account? <router-link to="/register">Register</router-link></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'Login',
  
  data() {
    return {
      email: '',
      password: ''
    };
  },
  
  computed: {
    ...mapGetters({
      loading: 'auth/loading',
      error: 'auth/error'
    })
  },
  
  methods: {
    ...mapActions({
      login: 'auth/login'
    }),
    
    async handleLogin() {
      try {
        await this.login({
          email: this.email,
          password: this.password
        });
        this.$router.push('/listings');
      } catch (error) {
        // Error is handled in the store
      }
    }
  }
}
</script>