<template>
  <div class="row justify-content-center">
    <div class="col-md-6">
      <div class="card">
        <div class="card-header bg-primary text-white">
          <h4 class="mb-0">Register</h4>
        </div>
        <div class="card-body">
          <div v-if="error" class="alert alert-danger">{{ error }}</div>
          <div v-if="registrationSuccess" class="alert alert-success">
            Registration step one completed! Please check your email for confirmation instructions.
          </div>
          
          <form v-if="!registrationSuccess" @submit.prevent="handleRegister">
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
            
            <div class="mb-3">
              <label for="confirmPassword" class="form-label">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                v-model="confirmPassword"
                class="form-control"
                required
              />
              <div v-if="passwordMismatch" class="text-danger mt-1">
                Passwords do not match
              </div>
            </div>
            
            <div class="d-grid">
              <button type="submit" class="btn btn-primary" :disabled="loading || passwordMismatch">
                <span v-if="loading" class="spinner-border spinner-border-sm me-1"></span>
                Register
              </button>
            </div>
          </form>
          
          <div class="mt-3 text-center">
            <p>Already have an account? <router-link to="/login">Login</router-link></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'Register',
  
  data() {
    return {
      email: '',
      password: '',
      confirmPassword: '',
      registrationSuccess: false
    };
  },
  
  computed: {
    ...mapGetters({
      loading: 'auth/loading',
      error: 'auth/error'
    }),
    
    passwordMismatch() {
      return this.password && this.confirmPassword && this.password !== this.confirmPassword;
    }
  },
  
  methods: {
    ...mapActions({
      register: 'auth/register'
    }),
    
    async handleRegister() {
      if (this.passwordMismatch) return;
      
      try {
        await this.register({
          email: this.email,
          password: this.password
        });
        this.registrationSuccess = true;
      } catch (error) {
        // Error is handled in the store
      }
    }
  }
}
</script>